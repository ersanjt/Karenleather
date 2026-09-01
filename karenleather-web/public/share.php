<?php
/**
 * HTML تصویر شاخص برای خزنده‌های واتساپ، تلگرام، فیسبوک، لینکدین، توییتر، اسلک.
 * انسان‌ها همان SPA را می‌بینند — این فایل فقط با User-Agent خزنده‌ها از .htaccess صدا می‌شود.
 */
declare(strict_types=1);

header('Content-Type: text/html; charset=utf-8');

$SITE = 'https://karenleather.com';
$dataFile = __DIR__ . '/share-pages.json';
$data = is_file($dataFile) ? json_decode((string) file_get_contents($dataFile), true) : null;
if (!is_array($data)) {
  $data = ['pages' => [], 'products' => []];
}

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = is_string($path) && $path !== '' ? $path : '/';
$path = '/' . ltrim($path, '/');
if ($path !== '/') {
  $path = rtrim($path, '/');
}

function h(string $s): string {
  return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function lookup_share(array $data, string $path, array $get): ?array {
  $pages = $data['pages'] ?? [];
  $products = $data['products'] ?? [];

  if (preg_match('#^/product/(\d+)#', $path, $m)) {
    $hit = $products[$m[1]] ?? null;
    return is_array($hit) ? $hit : null;
  }

  $keys = [];
  if ($path === '/shop') {
    if (!empty($get['filter']) && is_string($get['filter'])) {
      $keys[] = '/shop?filter=' . $get['filter'];
    }
    if (!empty($get['cat']) && is_string($get['cat'])) {
      $cat = $get['cat'];
      $keys[] = '/shop?cat=' . rawurlencode($cat);
      $keys[] = '/shop?cat=' . urlencode($cat);
      $keys[] = '/shop?cat=' . $cat;
    }
    $keys[] = '/shop';
  }
  $keys[] = $path;

  foreach ($keys as $k) {
    if (isset($pages[$k]) && is_array($pages[$k])) {
      return $pages[$k];
    }
  }
  return null;
}

$page = lookup_share($data, $path, $_GET);
$found = is_array($page);

$ogUrl = $SITE . ($path === '/' ? '/' : $path);
if ($path === '/shop') {
  $qs = [];
  if (!empty($_GET['cat']) && is_string($_GET['cat'])) {
    $qs[] = 'cat=' . rawurlencode($_GET['cat']);
  } elseif (!empty($_GET['filter']) && is_string($_GET['filter'])) {
    $qs[] = 'filter=' . rawurlencode($_GET['filter']);
  }
  if ($qs) {
    $ogUrl .= '?' . implode('&', $qs);
  }
}

if (!$found) {
  http_response_code(404);
  header('Cache-Control: no-store');
  header('X-Robots-Tag: noindex, follow');
  $page = [
    'title' => 'صفحه یافت نشد — چرم کارن',
    'description' => 'این صفحه در فروشگاه چرم کارن وجود ندارد. به فروشگاه یا صفحه اصلی برگردید.',
    'robots' => 'noindex, follow',
    'image' => $SITE . '/uploads/campaign/og/og-home-1200x630.jpg',
    'imageAlt' => 'ست کیف و بوت چرم زرد کارن تبریز روی سنگفرش',
    'width' => 1200,
    'height' => 630,
    'type' => 'website',
    'url' => $ogUrl,
  ];
} else {
  $robotsHeader = (string) ($page['robots'] ?? '');
  if (strpos($robotsHeader, 'noindex') !== false) {
    header('Cache-Control: no-store');
    header('X-Robots-Tag: ' . $robotsHeader);
  } else {
    header('Cache-Control: public, max-age=600');
  }
}

if (!empty($page['url']) && is_string($page['url'])) {
  $ogUrl = $page['url'];
}

$title = (string) ($page['title'] ?? 'چرم کارن');
$desc = (string) ($page['description'] ?? '');
$keywords = (string) ($page['keywords'] ?? '');
$robots = (string) ($page['robots'] ?? 'index, follow, max-image-preview:large');
$image = (string) ($page['image'] ?? $SITE . '/uploads/campaign/og/og-home-1200x630.jpg');
$alt = (string) ($page['imageAlt'] ?? $title);
$width = (int) ($page['width'] ?? 1200);
$height = (int) ($page['height'] ?? 630);
$type = (string) ($page['type'] ?? 'website');
$mime = strtolower(substr($image, -4)) === '.png' ? 'image/png' : 'image/jpeg';
?>
<!doctype html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <title><?= h($title) ?></title>
    <meta name="description" content="<?= h($desc) ?>" />
    <meta name="robots" content="<?= h($robots) ?>" />
    <?php if ($keywords !== '') : ?>
    <meta name="keywords" content="<?= h($keywords) ?>" />
    <?php endif; ?>
    <link rel="canonical" href="<?= h($ogUrl) ?>" />
    <link rel="alternate" hreflang="fa-IR" href="<?= h($ogUrl) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= h($ogUrl) ?>" />
    <link rel="image_src" href="<?= h($image) ?>" />
    <meta itemprop="image" content="<?= h($image) ?>" />

    <meta property="og:type" content="<?= h($type) ?>" />
    <?php if ($type === 'product') : ?>
    <meta property="product:brand" content="چرم کارن" />
    <meta property="product:condition" content="new" />
    <?php endif; ?>
    <meta property="og:site_name" content="چرم کارن" />
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:url" content="<?= h($ogUrl) ?>" />
    <meta property="og:title" content="<?= h($title) ?>" />
    <meta property="og:description" content="<?= h($desc) ?>" />
    <meta property="og:image" content="<?= h($image) ?>" />
    <meta property="og:image:url" content="<?= h($image) ?>" />
    <meta property="og:image:secure_url" content="<?= h($image) ?>" />
    <meta property="og:image:alt" content="<?= h($alt) ?>" />
    <meta property="og:image:type" content="<?= h($mime) ?>" />
    <?php if ($width && $height) : ?>
    <meta property="og:image:width" content="<?= $width ?>" />
    <meta property="og:image:height" content="<?= $height ?>" />
    <?php endif; ?>

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= h($title) ?>" />
    <meta name="twitter:description" content="<?= h($desc) ?>" />
    <meta name="twitter:image" content="<?= h($image) ?>" />
    <meta name="twitter:image:alt" content="<?= h($alt) ?>" />
  </head>
  <body>
    <img src="<?= h($image) ?>" alt="<?= h($alt) ?>" width="<?= $width ?: 1200 ?>" height="<?= $height ?: 630 ?>" />
    <h1><?= h($title) ?></h1>
    <p><?= h($desc) ?></p>
    <p><a href="<?= h($ogUrl) ?>"><?= h($ogUrl) ?></a></p>
  </body>
</html>
