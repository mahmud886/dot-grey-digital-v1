<?php
/**
 * Copy this file to config.php (same folder) and fill it in. config.php is private:
 * .htaccess blocks it from the web, and it is not in the git repository.
 *
 * Three ways to send (best first for landing in the inbox rather than spam):
 *   MODE 'smtp'   — signs in to one of YOUR mailboxes (e.g. website@yourdomain.com created in
 *                   cPanel/hPanel → Email Accounts). Because it is your own mailbox, SPF and DKIM
 *                   match your domain. Fill the SMTP_* lines below. Recommended on shared hosting.
 *   MODE 'resend' — through the Resend API. Needs RESEND_API_KEY and a domain verified in Resend.
 *   MODE 'mail'   — PHP mail(). Needs no password, but on shared hosting it is often sent from the
 *                   server's own name and ends up in spam. Use only for a quick first test.
 * Leave MODE empty to pick automatically: 'resend' if a key is set, else 'smtp' if a mailbox
 * is filled in, else 'mail'.
 */
return [
    'MODE' => '',

    // Resend (https://resend.com) — API key starting with re_
    'RESEND_API_KEY' => '',
    // Optional: a Resend segment (audience) id for newsletter signups. Empty = email the studio instead.
    'RESEND_AUDIENCE_ID' => '',

    // SMTP mailbox (MODE 'smtp'). Hostinger: smtp.hostinger.com, port 465, secure 'ssl'.
    // cPanel hosts usually use mail.yourdomain.com, port 465, 'ssl' (or 587 with 'tls').
    'SMTP_HOST' => '',
    'SMTP_PORT' => 465,
    'SMTP_SECURE' => 'ssl',
    'SMTP_USER' => '',   // the full mailbox address, e.g. website@dotgreydigital.com
    'SMTP_PASS' => '',   // that mailbox's password

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
