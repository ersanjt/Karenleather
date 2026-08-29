<?php
/**
 * Serve sitemap.xml with an explicit XML content-type.
 * Static .xml on some cPanel/LiteSpeed + leftover WordPress rewrite returns HTTP 500.
 */
declare(strict_types=1);

header('Content-Type: application/xml; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=3600');

$file = __DIR__ . '/sitemap.xml';
if (is_readable($file)) {
  readfile($file);
  exit;
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo '  <url><loc>https://karenleather.com/</loc></url>' . "\n";
echo '</urlset>' . "\n";
