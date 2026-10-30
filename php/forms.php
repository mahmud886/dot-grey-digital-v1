<?php
/**
 * DotGrey Digital — form endpoint for static/cPanel hosting.
 *
 * Same contract as the Node route (src/app/api/forms/route.server.ts) and the shared rules in
 * src/site/forms/schema.ts. Keep the limits here in step with that file.
 *
 * POST JSON: { "kind": "brief|start|apply|newsletter", "data": {...}, "hp": "", "t": 4200 }
 * Reply JSON: { "ok": true } or { "ok": false, "error": "...", "fields": {...}, "fallback": "mailto" }
 *
 * Settings live in config.php next to this file (copy config.example.php). PHP 7.4+, no Composer.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(array $body, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$configFile = __DIR__ . '/config.php';
$config = is_file($configFile) ? require $configFile : [];
if (!is_array($config)) {
    $config = [];
}
$cfg = static function (string $key, $default = '') use ($config) {
    return array_key_exists($key, $config) && $config[$key] !== '' ? $config[$key] : $default;
};

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(['ok' => false, 'error' => 'Use POST.'], 405);
}

// Same-origin only: browsers send Origin on POST; compare its host with ours.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $host = preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '');
    if (!$originHost || strcasecmp((string) $originHost, (string) $host) !== 0) {
        reply(['ok' => false, 'error' => 'Not allowed.'], 403);
    }
}

$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) {
    reply(['ok' => false, 'error' => 'That message is too long.'], 413);
}
$body = json_decode($raw, true);
$kinds = ['brief', 'start', 'apply', 'newsletter'];
if (!is_array($body) || !in_array($body['kind'] ?? null, $kinds, true) || !is_array($body['data'] ?? null)) {
    reply(['ok' => false, 'error' => 'Something went wrong with the form.'], 400);
}
$kind = $body['kind'];
$data = $body['data'];

// Bots: answer as if it worked, so they learn nothing.
$minFill = ['brief' => 2500, 'start' => 2500, 'apply' => 2500, 'newsletter' => 800];
$hp = $body['hp'] ?? '';
$t = $body['t'] ?? null;
if ((is_string($hp) && trim($hp) !== '') || !is_numeric($t) || (float) $t < $minFill[$kind]) {
    reply(['ok' => true]);
}

// Rate limit: 5 submissions per IP per 10 minutes, counted in small files under the temp dir.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$dir = rtrim((string) $cfg('RATE_LIMIT_DIR', sys_get_temp_dir()), '/') . '/dotgrey-forms';
if (!is_dir($dir)) {
    @mkdir($dir, 0700, true);
}
$bucket = $dir . '/' . hash('sha256', $ip . '|dotgrey') . '.json';
$now = time();
$recent = [];
if (is_file($bucket)) {
    $prev = json_decode((string) @file_get_contents($bucket), true);
    if (is_array($prev)) {
        $recent = array_values(array_filter($prev, static function ($ts) use ($now) {
            return is_int($ts) && $now - $ts < 600;
        }));
    }
}
$recent[] = $now;
@file_put_contents($bucket, json_encode($recent), LOCK_EX);
if (count($recent) > 5) {
    reply(['ok' => false, 'error' => 'Too many messages in a short time — please try again in a few minutes.'], 429);
}

// ---- validation (mirrors validate() in schema.ts) ---------------------------------------

function str_field($v): string
{
    return is_string($v) ? trim(str_replace(["\r\n", "\r"], "\n", $v)) : '';
}
/** Single-line fields: no line breaks, so nothing can be injected into headers or subjects. */
function line_field($v): string
{
    return trim((string) preg_replace('/[\r\n\t]+/', ' ', str_field($v)));
}
function cut(string $s, int $n): string
{
    return function_exists('mb_substr') ? mb_substr($s, 0, $n) : substr($s, 0, $n);
}
function len(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s) : strlen($s);
}

$fields = [];
$clean = [];
$email = strtolower(line_field($data['email'] ?? ''));
if (!preg_match('/^[^\s@<>()\[\]\\\\,;:"]+@[^\s@<>()\[\]\\\\,;:"]+\.[^\s@<>()\[\]\\\\,;:"]+$/', $email) || strlen($email) > 254) {
    $fields['email'] = 'We need an email address to reply to.';
}
$clean['email'] = $email;

if ($kind !== 'newsletter') {
    $name = line_field($data['name'] ?? '');
    if ($name === '') {
        $fields['name'] = 'Tell us who you are.';
    } elseif (len($name) > 120) {
        $fields['name'] = 'That name is too long.';
    }
    $message = str_field($data['message'] ?? '');
    if (len($message) < 20) {
        $fields['message'] = 'A sentence or two, please — at least 20 characters.';
    } elseif (len($message) > 5000) {
        $fields['message'] = 'Please keep it under 5,000 characters.';
    }
    $clean['name'] = $name;
    $clean['message'] = $message;

    if ($kind === 'brief' || $kind === 'start') {
        $needs = [];
        if (is_array($data['needs'] ?? null)) {
            foreach (array_slice($data['needs'], 0, 10) as $n) {
                $n = cut(line_field($n), 120);
                if ($n !== '') {
                    $needs[] = $n;
                }
            }
        }
        if (!$needs) {
            $fields['needs'] = 'Pick at least one.';
        }
        $clean['needs'] = $needs;
        $clean['company'] = cut(line_field($data['company'] ?? ''), 160);
        $clean['budget'] = cut(line_field($data['budget'] ?? ''), 120);
        $clean['timeline'] = cut(line_field($data['timeline'] ?? ''), 120);
        if ($kind === 'start') {
            $clean['stage'] = cut(line_field($data['stage'] ?? ''), 120);
        }
    }
    if ($kind === 'apply') {
        $clean['role'] = cut(line_field($data['role'] ?? ''), 120);
        if ($clean['role'] === '') {
            $fields['role'] = 'Which role is this for?';
        }
        $clean['links'] = cut(str_field($data['links'] ?? ''), 1000);
    }
}

if ($fields) {
    reply(['ok' => false, 'error' => 'Please check the highlighted fields.', 'fields' => $fields], 422);
}

// ---- email content (mirrors email.ts) -----------------------------------------------------

$subjects = [
    'brief' => 'Project brief — ' . ($clean['company'] ?? '' ?: ($clean['name'] ?? '')),
    'start' => 'New project — ' . ($clean['company'] ?? '' ?: ($clean['name'] ?? '')),
    'apply' => 'Application — ' . ($clean['role'] ?? '') . ' — ' . ($clean['name'] ?? ''),
    'newsletter' => 'Notes signup — ' . $email,
];
$subject = $subjects[$kind];

$rows = $kind === 'newsletter'
    ? [['Email', $email], ['Request', 'Please add this address to the occasional notes list.']]
    : [
        ['Name', $clean['name'] ?? ''],
        ['Email', $email],
        ['Company', $clean['company'] ?? ''],
        ['Role', $clean['role'] ?? ''],
        ['Needs', implode(', ', $clean['needs'] ?? [])],
        ['Stage', $clean['stage'] ?? ''],
        ['Budget', $clean['budget'] ?? ''],
        ['Timeline', $clean['timeline'] ?? ''],
        ['Links', $clean['links'] ?? ''],
        ['Message', $clean['message'] ?? ''],
    ];
$rows = array_values(array_filter($rows, static function ($r) {
    return $r[1] !== '';
}));

$esc = static function (string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
};
$who = ($clean['name'] ?? '') !== '' ? $clean['name'] : $email;
$text = $subject . "\n\n";
foreach ($rows as [$k, $v]) {
    $text .= strpos($v, "\n") !== false ? "$k:\n$v\n" : "$k: $v\n";
}
$text .= "\n— Sent from the form on the website. Reply to this email to answer $who directly.";
$html = '<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">'
    . '<p style="margin:0 0 16px;font-size:13px;color:#6b6b68">New ' . $esc($kind) . ' from the website</p>'
    . '<h1 style="margin:0 0 20px;font-size:22px">' . $esc($subject) . '</h1>'
    . '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">';
foreach ($rows as [$k, $v]) {
    $html .= '<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #ddd;vertical-align:top;color:#6b6b68;white-space:nowrap">' . $esc($k)
        . '</td><td style="padding:10px 0;border-top:1px solid #ddd;white-space:pre-wrap">' . $esc($v) . '</td></tr>';
}
$html .= '</table><p style="margin:24px 0 0;font-size:13px;color:#6b6b68">Reply to this email to answer ' . $esc($who) . ' directly.</p></div>';

// ---- sending -------------------------------------------------------------------------------

$to = (string) $cfg('CONTACT_TO_EMAIL', 'hello@dotgreydigital.com');
$from = (string) $cfg('CONTACT_FROM_EMAIL', '');
$fromName = (string) $cfg('CONTACT_FROM_NAME', 'DotGrey Digital');
$studio = (string) $cfg('STUDIO_NAME', 'DotGrey Digital');
$apiKey = (string) $cfg('RESEND_API_KEY', '');
// With no key and no From address there is nothing to send with: tell the browser to use mailto.
$mode = (string) $cfg('MODE', $apiKey !== '' ? 'resend' : ($from !== '' ? 'mail' : 'none'));

/** POST to the Resend API with cURL. Returns [httpStatus, decodedBody]. */
function resend_call(string $key, string $path, array $payload): array
{
    if (!function_exists('curl_init')) {
        return [0, null];
    }
    $ch = curl_init('https://api.resend.com' . $path);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key, 'Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $res = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, is_string($res) ? json_decode($res, true) : null];
}

/** One plain-text + HTML email through PHP mail(). Every header value is single-line already. */
function php_mail(string $to, string $fromAddr, string $fromName, string $replyTo, string $subject, string $text, string $html): bool
{
    if (!function_exists('mail') || $fromAddr === '') {
        return false;
    }
    foreach ([$to, $fromAddr, $replyTo] as $h) {
        if (preg_match('/[\r\n]/', $h)) {
            return false;
        }
    }
    $boundary = 'dg_' . bin2hex(random_bytes(12));
    $encName = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers = implode("\r\n", [
        'From: ' . $encName . ' <' . $fromAddr . '>',
        'Reply-To: ' . $replyTo,
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'X-Mailer: DotGrey forms',
    ]);
    $bodyOut = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text))
        . "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html))
        . "--$boundary--";
    $encSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    // -f sets the envelope sender on most cPanel hosts, which helps delivery.
    return @mail($to, $encSubject, $bodyOut, $headers, '-f' . $fromAddr);
}

$sent = false;
if ($mode === 'resend' && $apiKey !== '') {
    $fromHeader = $from !== '' ? "$fromName <$from>" : "$fromName <$to>";
    $segment = (string) $cfg('RESEND_AUDIENCE_ID', '');
    if ($kind === 'newsletter' && $segment !== '') {
        [$status, $res] = resend_call($apiKey, '/contacts', ['email' => $email, 'unsubscribed' => false, 'segments' => [['id' => $segment]]]);
        $already = is_array($res) && isset($res['message']) && stripos((string) $res['message'], 'already exists') !== false;
        $sent = ($status >= 200 && $status < 300) || $already;
    } else {
        [$status] = resend_call($apiKey, '/emails', [
            'from' => $fromHeader, 'to' => [$to], 'reply_to' => $email,
            'subject' => $subject, 'text' => $text, 'html' => $html,
        ]);
        $sent = $status >= 200 && $status < 300;
    }
    if ($sent && $cfg('CONTACT_AUTOREPLY', false) === true) {
        $first = explode(' ', (string) ($clean['name'] ?? ''))[0] ?: 'there';
        $what = $kind === 'apply' ? 'your application' : 'your brief';
        resend_call($apiKey, '/emails', $kind === 'newsletter' ? [
            'from' => $fromHeader, 'to' => [$email], 'reply_to' => $to,
            'subject' => "You're on the list",
            'text' => "Hello,\n\nYou're on the list for our occasional notes — a few a year, no more. Reply any time to unsubscribe.\n\n$studio",
        ] : [
            'from' => $fromHeader, 'to' => [$email], 'reply_to' => $to,
            'subject' => "Thanks — we have $what",
            'text' => "Hello $first,\n\nThanks — we have $what and a person will reply within one working day.\n\nIf anything changes, just reply to this email.\n\n$studio",
        ]);
    }
} elseif ($mode === 'mail') {
    $sent = php_mail($to, $from, $fromName, $email, $subject, $text, $html);
    if ($sent && $cfg('CONTACT_AUTOREPLY', false) === true) {
        $first = explode(' ', (string) ($clean['name'] ?? ''))[0] ?: 'there';
        $plain = "Hello $first,\n\nThanks — we have your message and a person will reply within one working day.\n\n$studio";
        php_mail($email, $from, $fromName, $to, 'Thanks — we have your message', $plain, nl2br($esc($plain)));
    }
} else {
    reply(['ok' => false, 'error' => 'Email is not set up on this server.', 'fallback' => 'mailto'], 503);
}

if (!$sent) {
    error_log('[dotgrey forms] send failed (mode: ' . $mode . ')');
    reply(['ok' => false, 'error' => "We couldn't send that just now.", 'fallback' => 'mailto'], 502);
}
reply(['ok' => true]);
