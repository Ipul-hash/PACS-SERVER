#!/bin/bash
# ============================================================
# deploy.sh — Full Instalasi PACS + MWL + SIMRS Radiologi
# Struktur repo:
#   nginx/      → konfigurasi Nginx
#   orthanc/    → konfigurasi Orthanc
#   pacs/       → OHIF Viewer (sudah di-build)
#   pacs-lab/   → Laravel SIMRS
#   api/        → Flask Worklist Manager API
# Jalankan: sudo ./deploy.sh
# ============================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()     { echo -e "${GREEN}[✔]${NC} $1"; }
info()    { echo -e "${BLUE}[i]${NC} $1"; }
warn()    { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✘]${NC} $1"; exit 1; }
section() {
  echo -e "\n${CYAN}══════════════════════════════════════════${NC}"
  echo -e "${CYAN}  $1${NC}"
  echo -e "${CYAN}══════════════════════════════════════════${NC}"
}

# ── Cek root ────────────────────────────────────────────────
[ "$EUID" -ne 0 ] && error "Jalankan sebagai root: sudo ./deploy.sh"

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_IP=$(hostname -I | awk '{print $1}')

# ============================================================
# KONFIGURASI
# ============================================================
section "Konfigurasi Awal"

read -p "  IP Server PACS [$SERVER_IP]: " INPUT_IP
PACS_IP="${INPUT_IP:-$SERVER_IP}"

read -p "  IP Server SIMRS (whitelist port 5000): " SIMRS_IP

read -p "  API Key Worklist (min 32 karakter): " WORKLIST_API_KEY
[ ${#WORKLIST_API_KEY} -lt 32 ] && error "API key minimal 32 karakter."

read -p "  Nama database Laravel [simrs]: " DB_NAME;   DB_NAME="${DB_NAME:-simrs}"
read -p "  User database Laravel [simrs_user]: " DB_USER; DB_USER="${DB_USER:-simrs_user}"
read -sp " Password database Laravel: " DB_PASS; echo ""
[ -z "$DB_PASS" ] && error "Password database tidak boleh kosong."

echo ""
info "IP PACS    : $PACS_IP"
info "Repo dir   : $REPO_DIR"
info "DB         : $DB_NAME / $DB_USER"
echo ""
read -p "  Lanjutkan? (y/n): " CONFIRM
[ "$CONFIRM" != "y" ] && { warn "Dibatalkan."; exit 0; }

# ============================================================
# BAB 3 — Update & Dependensi Dasar
# ============================================================
section "BAB 3 — Update Sistem"

apt-get install sudo -y 2>/dev/null || true
apt update -y && apt upgrade -y
apt install -y curl git build-essential nginx ufw python3 python3-pip
log "Dependensi dasar terinstall."

# ============================================================
# BAB 4 — Instalasi & Konfigurasi Orthanc
# ============================================================
section "BAB 4 — Orthanc PACS"

apt install -y orthanc orthanc-dicomweb orthanc-worklists dcmtk
log "Orthanc + plugin + DCMTK terinstall."

# Folder worklist
mkdir -p /var/lib/orthanc/worklists
chown orthanc:orthanc /var/lib/orthanc/worklists
chmod 755 /var/lib/orthanc/worklists
log "Folder worklist disiapkan."

# Backup config lama
cp -r /etc/orthanc /etc/orthanc.bak 2>/dev/null || true

# Salin semua config dari repo/orthanc/
if [ -d "$REPO_DIR/orthanc" ]; then
  cp "$REPO_DIR/orthanc/"* /etc/orthanc/
  log "Config Orthanc disalin dari repo/orthanc/."
else
  error "Folder orthanc/ tidak ditemukan di repo!"
fi

# ── Fix worklists.json: Enable harus true ──────────────────
WORKLISTS_JSON="/etc/orthanc/worklists.json"
if grep -q '"Enable": false' "$WORKLISTS_JSON"; then
  sed -i 's/"Enable": false/"Enable": true/' "$WORKLISTS_JSON"
  warn "worklists.json: 'Enable' diperbaiki false → true."
fi
log "worklists.json: Enable=true ✔"

# ── Pastikan orthanc.json punya Plugins section ─────────────
ORTHANC_JSON="/etc/orthanc/orthanc.json"
if ! grep -q "libModalityWorklists" "$ORTHANC_JSON"; then
  warn "orthanc.json belum punya entry plugin worklist, menambahkan..."
  # Tambahkan sebelum closing brace terakhir
  python3 - << PYEOF
import json, re

with open("$ORTHANC_JSON", "r") as f:
    content = f.read()

# Hapus komentar C-style agar bisa di-parse
content_clean = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
content_clean = re.sub(r'//[^\n]*', '', content_clean)
content_clean = re.sub(r',\s*}', '}', content_clean)
content_clean = re.sub(r',\s*]', ']', content_clean)

cfg = json.loads(content_clean)

cfg["Plugins"] = [
    "/usr/share/orthanc/plugins/libModalityWorklists.so",
    "/usr/share/orthanc/plugins/libOrthancDicomWeb.so"
]
cfg["DicomAlwaysAllowFindWorklist"] = True

with open("$ORTHANC_JSON", "w") as f:
    json.dump(cfg, f, indent=2)

print("orthanc.json berhasil diupdate.")
PYEOF
fi

chown -R orthanc:orthanc /etc/orthanc/
systemctl enable orthanc
systemctl restart orthanc
log "Orthanc dikonfigurasi dan dijalankan."

# ============================================================
# BAB 5 — Deploy OHIF Viewer (sudah di-build di repo/pacs/)
# ============================================================
section "BAB 5 — Deploy OHIF Viewer"

if [ -d "$REPO_DIR/pacs" ] && [ -f "$REPO_DIR/pacs/index.html" ]; then
  mkdir -p /var/www/pacs
  cp -r "$REPO_DIR/pacs/." /var/www/pacs/
  chown -R www-data:www-data /var/www/pacs
  chmod -R 755 /var/www/pacs
  log "OHIF disalin dari repo/pacs/ ke /var/www/pacs/."
else
  error "Folder pacs/ atau index.html tidak ditemukan! Pastikan OHIF sudah di-build."
fi

# ============================================================
# BAB 6 — Konfigurasi Nginx
# ============================================================
section "BAB 6 — Nginx Reverse Proxy"

# Generate nginx config yang sudah diperbaiki (location / block yang benar)
cat > /etc/nginx/sites-available/pacs << EOF
server {
    listen 80;
    server_name $PACS_IP;

    # ── OHIF Viewer ─────────────────────────────────────────
    location / {
        root /var/www/pacs;
        index index.html;
        try_files \$uri \$uri/ /index.html;

        add_header 'Cross-Origin-Opener-Policy' 'same-origin' always;
        add_header 'Cross-Origin-Embedder-Policy' 'require-corp' always;
        add_header 'Cross-Origin-Resource-Policy' 'same-origin' always;
    }

    # ── Proxy ke Orthanc REST API ────────────────────────────
    location /orthanc/ {
        if (\$request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        add_header 'Cross-Origin-Resource-Policy' 'cross-origin' always;
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        proxy_pass http://127.0.0.1:8042/;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Authorization \$http_authorization;
        proxy_pass_header Authorization;

        client_max_body_size 0;
        proxy_read_timeout 600s;
    }
}
EOF

ln -sf /etc/nginx/sites-available/pacs /etc/nginx/sites-enabled/pacs
rm -f /etc/nginx/sites-enabled/default

nginx -t || error "Konfigurasi Nginx tidak valid!"
systemctl enable nginx
systemctl restart nginx
log "Nginx dikonfigurasi dan dijalankan."

# ============================================================
# BAB 8 — Worklist Manager API (Flask)
# ============================================================
section "BAB 8 — Worklist Manager API"

pip3 install flask requests --break-system-packages
log "Flask + Requests terinstall."

mkdir -p /opt/worklist-api

if [ -f "$REPO_DIR/api/app.py" ]; then
  cp "$REPO_DIR/api/app.py" /opt/worklist-api/app.py

  # Inject konfigurasi ke app.py
  sed -i "s|ISI_DENGAN_KEY_RAHASIA_MIN_32_KARAKTER|$WORKLIST_API_KEY|g" /opt/worklist-api/app.py
  sed -i "s|API_KEY\s*=\s*\"[^\"]*\"|API_KEY = \"$WORKLIST_API_KEY\"|g"  /opt/worklist-api/app.py
  sed -i "s|OHIF_URL\s*=\s*\"[^\"]*\"|OHIF_URL = \"http://$PACS_IP\"|g"  /opt/worklist-api/app.py

  log "app.py disalin dari repo/api/ dan dikonfigurasi."
else
  error "File api/app.py tidak ditemukan di repo!"
fi

# Systemd service
cat > /etc/systemd/system/worklist-api.service << EOF
[Unit]
Description=Worklist Manager API
After=network.target orthanc.service

[Service]
User=root
WorkingDirectory=/opt/worklist-api
ExecStart=/usr/bin/python3 /opt/worklist-api/app.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now worklist-api
log "Worklist API service aktif."

# ============================================================
# BAB 9 — Setup Laravel SIMRS
# ============================================================
section "BAB 9 — Laravel SIMRS (pacs-lab)"

LARAVEL_DIR="$REPO_DIR/pacs-lab"
[ -f "$LARAVEL_DIR/artisan" ] || error "artisan tidak ditemukan di pacs-lab/. Pastikan folder Laravel benar."

info "Laravel ditemukan di: $LARAVEL_DIR"
cd "$LARAVEL_DIR"

# Install PHP & ekstensi jika belum ada
if ! command -v php &>/dev/null; then
  apt install -y php php-cli php-mbstring php-xml php-bcmath php-curl php-mysql php-zip unzip
  log "PHP terinstall."
fi

# Install Composer jika belum ada
if ! command -v composer &>/dev/null; then
  curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  log "Composer terinstall."
fi

composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
log "Composer install selesai."

# Setup .env
[ ! -f "$LARAVEL_DIR/.env" ] && cp "$LARAVEL_DIR/.env.example" "$LARAVEL_DIR/.env"

php artisan key:generate --force

# Update .env
update_env() {
  local key="$1" val="$2" file="$LARAVEL_DIR/.env"
  if grep -q "^$key=" "$file"; then
    sed -i "s|^$key=.*|$key=$val|g" "$file"
  else
    echo "$key=$val" >> "$file"
  fi
}

update_env "WORKLIST_API_URL" "http://$PACS_IP:5000"
update_env "WORKLIST_API_KEY" "$WORKLIST_API_KEY"
update_env "OHIF_URL"         "http://$PACS_IP"
update_env "DB_DATABASE"      "$DB_NAME"
update_env "DB_USERNAME"      "$DB_USER"
update_env "DB_PASSWORD"      "$DB_PASS"

log ".env dikonfigurasi."

php artisan config:clear
php artisan migrate --force
php artisan storage:link 2>/dev/null || true

chown -R www-data:www-data "$LARAVEL_DIR/storage" "$LARAVEL_DIR/bootstrap/cache"
log "Laravel migrate selesai."
cd "$REPO_DIR"

# ============================================================
# Firewall (Bab 2.2)
# ============================================================
section "Firewall"

ufw allow 80/tcp
ufw allow 443/tcp
ufw allow from 192.168.1.0/24 to any port 4242   # modalitas DICOM

if [ -n "$SIMRS_IP" ]; then
  ufw allow from "$SIMRS_IP" to any port 5000
  ufw deny 5000
  log "Port 5000 hanya diizinkan dari $SIMRS_IP."
else
  warn "IP SIMRS tidak diset, port 5000 terbuka. Set manual jika perlu."
fi

ufw --force enable
log "Firewall aktif."

# Cron cleanup .wl lama (Bab 11.5)
(crontab -l 2>/dev/null; echo "0 2 * * * find /var/lib/orthanc/worklists/ -name '*.wl' -mtime +1 -delete") | crontab -
log "Cron cleanup worklist ditambahkan."

# ============================================================
# Verifikasi Akhir (Bab 10.1)
# ============================================================
section "Verifikasi Sistem"

sleep 3

check_service() {
  systemctl is-active --quiet "$1" \
    && log "Service $1 : AKTIF" \
    || warn "Service $1 : TIDAK AKTIF — cek: systemctl status $1"
}

check_service orthanc
check_service nginx
check_service worklist-api

PLUGINS=$(curl -sf http://localhost:8042/plugins 2>/dev/null || echo "[]")
echo "$PLUGINS" | grep -q "worklists" \
  && log "Plugin worklist  : AKTIF" \
  || warn "Plugin worklist  : belum terdeteksi — cek /var/log/orthanc/Orthanc.log"

HEALTH=$(curl -sf http://localhost:5000/health 2>/dev/null || echo "{}")
echo "$HEALTH" | grep -q "ok" \
  && log "Worklist API     : OK" \
  || warn "Worklist API     : belum merespons — cek: journalctl -u worklist-api -f"

# ============================================================
# Ringkasan
# ============================================================
section "Instalasi Selesai!"
echo ""
echo -e "  ${GREEN}OHIF Viewer    :${NC} http://$PACS_IP"
echo -e "  ${GREEN}Orthanc PACS   :${NC} http://$PACS_IP/orthanc/app/"
echo -e "  ${GREEN}Worklist API   :${NC} http://$PACS_IP:5000/health"
echo -e "  ${GREEN}DICOM Port     :${NC} $PACS_IP:4242"
echo ""
echo -e "  ${YELLOW}Log Orthanc    :${NC} /var/log/orthanc/Orthanc.log"
echo -e "  ${YELLOW}Log API        :${NC} journalctl -u worklist-api -f"
echo -e "  ${YELLOW}Log Nginx      :${NC} /var/log/nginx/error.log"
echo ""
