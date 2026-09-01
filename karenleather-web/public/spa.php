<?php
/**
 * ورود SPA: مسیرهای شناخته‌شده ۲۰۰، بقیه ۴۰۴ واقعی.
 * سبد خرید و پنل مدیریت noindex می‌مانند.
 */
declare(strict_types=1);

$index = __DIR__ . '/index.html';
if (!is_file($index)) {
  http_response_code(500);
  header('Content-Type: text/plain; charset=utf-8');
  echo 'Missing index.html';
  exit;
}

$html = (string) file_get_contents($index);
$dataFile = __DIR__ . '/share-pages.json';
$data = is_file($dataFile) ? json_decode((string) file_get_contents($dataFile), true) : null;
$products = is_array($data['products'] ?? null) ? $data['products'] : [];

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = is_string($path) && $path !== '' ? $path : '/';
$path = '/' . ltrim($path, '/');
if ($path !== '/') {
  $path = rtrim($path, '/');
}

$knownStatic = ['/', '/shop', '/about', '/contact', '/wholesale', '/representation', '/cart'];
$ok = in_array($path, $knownStatic, true);
if (!$ok && strncmp($path, '/admin', 6) === 0) {
  $ok = true;
}
if (!$ok && preg_match('#^/product/(\d+)#', $path, $m)) {
  $ok = isset($products[$m[1]]);
}

$status = $ok ? 200 : 404;
$noindex = !$ok || $path === '/cart' || strncmp($path, '/admin', 6) === 0;

if ($noindex) {
  $html = (string) preg_replace(
    '/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i',
    '<meta name="robots" content="noindex, nofollow" />',
    $html,
    1
  );
}
if (!$ok) {
  $html = (string) preg_replace(
    '/<title>[^<]*<\/title>/i',
    '<title>صفحه یافت نشد — چرم کارن</title>',
    $html,
    1
  );
}

http_response_code($status);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');
if ($noindex) {
  header('X-Robots-Tag: noindex, nofollow');
}
echo $html;
