#!/bin/bash

if [ "$EUID" -ne 0 ]; then
  echo "Jalankan pakai sudo: sudo ./tambah_alat.sh"
  exit
fi

if ! command -v jq &> /dev/null; then
  apt-get update -y > /dev/null
  apt-get install -y jq > /dev/null
fi

CONFIG="/etc/orthanc/orthanc.json"

echo "=== FORM TAMBAH MODALITY ==="
read -p "Nama Modality (Contoh: USG_POLI) : " MOD_NAME
read -p "AET Title (Contoh: USG1)         : " MOD_AET
read -p "IP Address (Contoh: 192.168.1.5) : " MOD_IP
read -p "Port (Contoh: 104)               : " MOD_PORT

jq --arg name "$MOD_NAME" \
   --arg aet "$MOD_AET" \
   --arg ip "$MOD_IP" \
   --argjson port "$MOD_PORT" \
   '.DicomModalities += {($name): [$aet, $ip, $port]}' "$CONFIG" > /tmp/temp.json

mv /tmp/temp.json "$CONFIG"
chown orthanc:orthanc "$CONFIG"
systemctl restart orthanc

echo "Beres! $MOD_NAME udah ditambahkan dan Orthanc berhasil di-restart."