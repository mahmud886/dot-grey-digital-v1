<?php
/**
 * Copy this file to config.php (same folder) and fill it in. config.php is private:
 * .htaccess blocks it from the web, and it is not in the git repository.
 *
 * Two ways to send:
 *   MODE 'resend' — through the Resend API (recommended; best delivery). Needs RESEND_API_KEY
 *                   and a From address on a domain you verified in Resend.
 *   MODE 'mail'   — through the host's own mail server with PHP mail(). Needs only a From
 *                   address on your own domain (e.g. website@yourdomain.com). Check spam folders.
 * Leave MODE empty to pick automatically: 'resend' if a key is set, otherwise 'mail'.
 */
return [
    'MODE' => '',

    // Resend (https://resend.com) — API key starting with re_
    'RESEND_API_KEY' => '',
    // Optional: a Resend segment (audience) id for newsletter signups. Empty = email the studio instead.
    'RESEND_AUDIENCE_ID' => '',

    // Where submissions go.
    'CONTACT_TO_EMAIL' => 'hello@dotgreydigital.com',
    // Who they come from. Must be an address on your domain (verified in Resend, or hosted on this server for mail()).
    'CONTACT_FROM_EMAIL' => 'website@dotgreydigital.com',
    'CONTACT_FROM_NAME' => 'DotGrey Digital',
    'STUDIO_NAME' => 'DotGrey Digital',

    // true = also send the visitor a short "thanks, we got it" email.
    'CONTACT_AUTOREPLY' => false,

    // Where rate-limit counters are kept. Empty = the system temp folder.
    'RATE_LIMIT_DIR' => '',
];
