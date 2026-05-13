#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Error: Tolong jalankan script ini sebagai root (gunakan: sudo ./deploy.sh)"
  exit
fi

echo "Memulai Instalasi & Deployment PACS/RIS Server..."


echo "Mengupdate repository dan menginstall Nginx & Orthanc..."
apt-get update -y
apt-get install -y nginx orthanc orthanc-dicomweb


echo "Menyiapkan folder web OHIF..."
mkdir -p /var/www/pacs
cp -r ./pacs/* /var/www/pacs/
chown -R www-data:www-data /var/www/pacs
chmod -R 755 /var/www/pacs


echo "Menyiapkan konfigurasi reverse proxy Nginx..."
cp ./nginx/* /etc/nginx/sites-available/pacs
ln -sf /etc/nginx/sites-available/pacs /etc/nginx/sites-enabled/pacs
rm -f /etc/nginx/sites-enabled/default


echo "🏥 Menyiapkan konfigurasi Orthanc..."
if [ -d "/etc/orthanc" ]; then
    cp ./orthanc/* /etc/orthanc/
    chown -R orthanc:orthanc /etc/orthanc/
    systemctl restart orthanc
    echo "Service Orthanc berhasil di-restart."
else
    echo "Folder /etc/orthanc tidak ditemukan. Gagal setup Orthanc."
fi

echo "Mengetes konfigurasi Nginx..."
nginx -t
if [ $? -eq 0 ]; then
    systemctl restart nginx
    echo "SUPER MANTAP! Instalasi dan Deployment Selesai! PACS/RIS siap digunakan."
else
    echo "Gagal: Ada error di konfigurasi Nginx. Silakan cek pesan log di atas."
fi