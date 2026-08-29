#!/usr/bin/env bash
# Deploy Karen Leather React site to cPanel public_html
# Run as root in WHM Terminal
set -euo pipefail

DOMAIN_USER="karenleather"
HOME_DIR="/home/${DOMAIN_USER}"
REPO_DIR="${HOME_DIR}/repositories/Karenleather"
PUBLIC_HTML="${HOME_DIR}/public_html"
BACKUP_DIR="${HOME_DIR}/backups"
REPO_URL="https://github.com/ersanjt/Karenleather.git"

echo "==> User: ${DOMAIN_USER}"
echo "==> Repo: ${REPO_DIR}"
echo "==> Web:  ${PUBLIC_HTML}"

# Node (cPanel / system)
export NVM_DIR="${HOME_DIR}/.nvm"
if [[ -s "${NVM_DIR}/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  . "${NVM_DIR}/nvm.sh"
fi
if ! command -v node >/dev/null 2>&1; then
  for candidate in /opt/cpanel/ea-nodejs22/bin /opt/cpanel/ea-nodejs20/bin /opt/cpanel/ea-nodejs18/bin /usr/local/bin; do
    if [[ -x "${candidate}/node" ]]; then
      export PATH="${candidate}:${PATH}"
      break
    fi
  done
fi
command -v node >/dev/null 2>&1 || { echo "ERROR: node not found. Install Node.js for this account first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "ERROR: npm not found."; exit 1; }
echo "==> Node: $(node -v) | npm: $(npm -v)"

mkdir -p "${HOME_DIR}/repositories" "${BACKUP_DIR}"

# فضای دیسک: بکاپ‌های قدیمی را نگه ندار
echo "==> Cleaning old deploy backups..."
rm -rf "${BACKUP_DIR}"/public_html_* 2>/dev/null || true

if [[ ! -d "${REPO_DIR}/.git" ]]; then
  echo "==> Cloning repository..."
  git clone "${REPO_URL}" "${REPO_DIR}"
else
  echo "==> Pulling latest..."
  git -C "${REPO_DIR}" fetch origin
  git -C "${REPO_DIR}" reset --hard origin/main
fi

echo "==> Building (without duplicating uploads into dist)..."
cd "${REPO_DIR}/karenleather-web"
npm ci --omit=optional || npm install --omit=optional

# SKIP_UPLOADS=1 → فقط assets/html/seo؛ تصاویر از wp-content لینک می‌شوند
SKIP_UPLOADS=1 npm run build

if [[ ! -f "${REPO_DIR}/karenleather-web/dist/index.html" ]]; then
  echo "ERROR: build failed — dist/index.html missing"
  exit 1
fi
if [[ ! -f "${REPO_DIR}/karenleather-web/dist/assets/bundle.css" ]]; then
  echo "ERROR: bundle.css missing — CSS fix not present"
  exit 1
fi

# بکاپ سبک — بدون uploads
STAMP=$(date +%Y%m%d_%H%M%S)
LIGHT_BACKUP="${BACKUP_DIR}/site_core_${STAMP}"
echo "==> Light backup (no uploads) → ${LIGHT_BACKUP}"
mkdir -p "${LIGHT_BACKUP}"
for f in index.html .htaccess robots.txt sitemap.xml share.php share-pages.json; do
  [[ -f "${PUBLIC_HTML}/${f}" ]] && cp -a "${PUBLIC_HTML}/${f}" "${LIGHT_BACKUP}/" || true
done
[[ -d "${PUBLIC_HTML}/assets" ]] && cp -a "${PUBLIC_HTML}/assets" "${LIGHT_BACKUP}/" || true

echo "==> Publishing app files → public_html"
mkdir -p "${PUBLIC_HTML}/assets"
rsync -a --delete \
  "${REPO_DIR}/karenleather-web/dist/assets/" "${PUBLIC_HTML}/assets/"

for f in index.html .htaccess robots.txt sitemap.xml share.php share-pages.json; do
  [[ -f "${REPO_DIR}/karenleather-web/dist/${f}" ]] && cp -a "${REPO_DIR}/karenleather-web/dist/${f}" "${PUBLIC_HTML}/${f}"
done
if [[ ! -f "${PUBLIC_HTML}/share.php" || ! -f "${PUBLIC_HTML}/share-pages.json" ]]; then
  echo "ERROR: share.php / share-pages.json missing — social preview cards will be wrong"
  exit 1
fi

if [[ ! -f "${PUBLIC_HTML}/sitemap.xml" ]]; then
  echo "ERROR: sitemap.xml missing after publish — do not go live without it"
  exit 1
fi
if ! grep -q "urlset" "${PUBLIC_HTML}/sitemap.xml"; then
  echo "ERROR: sitemap.xml is not a valid urlset"
  exit 1
fi

# uploads: یک کپی از ریپو — بدون duplicate در dist
UPLOADS_SRC="${REPO_DIR}/wp-content/uploads"
UPLOADS_DST="${PUBLIC_HTML}/uploads"
echo "==> Syncing uploads (in-place, no extra backup copy)..."
mkdir -p "${UPLOADS_DST}"
rsync -a --delete \
  --exclude 'elementor/' \
  --exclude 'backup/' \
  --exclude 'wc-logs/' \
  --exclude 'woocommerce_uploads/' \
  --exclude 'wpforms/' \
  --exclude 'wpcf7_uploads/' \
  "${UPLOADS_SRC}/" "${UPLOADS_DST}/"

# پاکسازی dist uploads اگر از قبل مانده
rm -rf "${REPO_DIR}/karenleather-web/dist/uploads" 2>/dev/null || true

chown -R "${DOMAIN_USER}:${DOMAIN_USER}" "${REPO_DIR}" "${PUBLIC_HTML}" "${BACKUP_DIR}"
find "${PUBLIC_HTML}" -type d -exec chmod 755 {} \;
find "${PUBLIC_HTML}" -type f -exec chmod 644 {} \;

echo ""
echo "✅ Deploy complete: https://karenleather.com"
echo "   Light backup: ${LIGHT_BACKUP}"
echo "   Check CSS: https://karenleather.com/assets/bundle.css"
du -sh "${HOME_DIR}" "${PUBLIC_HTML}" "${REPO_DIR}" 2>/dev/null || true
