#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Error: Jalankan script ini menggunakan sudo (sudo ./deploy.sh)"
  exit 1
fi

echo "========================================================="
echo "       SELAMAT DATANG DI INSTALASI AUTOMASI PACS        "
echo "========================================================="

REPO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SERVER_IP=$(hostname -I | awk '{print $1}')

echo "IP Server terdeteksi: $SERVER_IP"
echo "Memulai proses instalasi..."

apt-get update -y
apt-get install -y nginx orthanc orthanc-dicomweb

cp -r $REPO_DIR/nginx/* /etc/nginx/sites-available/

sed -i "s/_IP_SERVER_/$SERVER_IP/g" /etc/nginx/sites-available/pacs

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/pacs /etc/nginx/sites-enabled/

cp -r $REPO_DIR/orthanc/* /etc/orthanc/
chown -R orthanc:orthanc /etc/orthanc/

mkdir -p /var/www/pacs
cp -r $REPO_DIR/pacs/* /var/www/pacs/
chown -R www-data:www-data /var/www/pacs/

systemctl restart orthanc
systemctl restart nginx
systemctl enable orthanc
systemctl enable nginx

echo "========================================================="
echo " Instalasi selesai! PACS Server Anda sudah aktif.        "
echo " Silakan akses melalui: http://$SERVER_IP                "
echo "========================================================="
