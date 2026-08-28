#!/usr/bin/env bash
# Deploy Karen Leather React site to cPanel public_html
# Run as root in WHM Terminal
set -euo pipefail

DOMAIN_USER="karenleather"
HOME_DIR="/home/${DOMAIN_USER}"
REPO_DIR="${HOME_DIR}/repositories/Karenleather"
PUBLIC_HTML="${HOME_DIR}/public_html"
BACKUP_DIR="${HOME_DIR}/backups/public_html_$(date +%Y%m%d_%H%M%S)"
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

mkdir -p "${HOME_DIR}/repositories" "${HOME_DIR}/backups"

if [[ ! -d "${REPO_DIR}/.git" ]]; then
  echo "==> Cloning repository..."
  git clone "${REPO_URL}" "${REPO_DIR}"
else
  echo "==> Pulling latest..."
  git -C "${REPO_DIR}" fetch origin
  git -C "${REPO_DIR}" reset --hard origin/main
fi

echo "==> Building..."
cd "${REPO_DIR}/karenleather-web"
npm ci --omit=optional || npm install --omit=optional
npm run build

if [[ ! -f "${REPO_DIR}/karenleather-web/dist/index.html" ]]; then
  echo "ERROR: build failed — dist/index.html missing"
  exit 1
fi

echo "==> Backing up current public_html → ${BACKUP_DIR}"
mkdir -p "${BACKUP_DIR}"
if [[ -d "${PUBLIC_HTML}" ]] && [[ "$(ls -A "${PUBLIC_HTML}" 2>/dev/null || true)" ]]; then
  rsync -a --delete "${PUBLIC_HTML}/" "${BACKUP_DIR}/"
fi

echo "==> Publishing dist → public_html"
mkdir -p "${PUBLIC_HTML}"
rsync -a --delete \
  --exclude '.well-known' \
  --exclude 'cgi-bin' \
  "${REPO_DIR}/karenleather-web/dist/" "${PUBLIC_HTML}/"

chown -R "${DOMAIN_USER}:${DOMAIN_USER}" "${REPO_DIR}" "${PUBLIC_HTML}" "${HOME_DIR}/backups"
find "${PUBLIC_HTML}" -type d -exec chmod 755 {} \;
find "${PUBLIC_HTML}" -type f -exec chmod 644 {} \;

echo ""
echo "✅ Deploy complete: https://karenleather.com"
echo "   Backup kept at: ${BACKUP_DIR}"
