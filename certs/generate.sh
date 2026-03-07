#!/bin/bash
# Generate a self-signed certificate for Fridgit HTTPS dev server
# Includes SAN entries for localhost and common LAN ranges

CERT_DIR="$(cd "$(dirname "$0")" && pwd)"
DAYS=365

# Detect local LAN IPs
LAN_IPS=$(hostname -I 2>/dev/null || ipconfig getifaddr en0 2>/dev/null)

# Build SAN entries
SAN="DNS:localhost,IP:127.0.0.1,IP:::1"
for ip in $LAN_IPS; do
  # Skip IPv6 link-local
  [[ "$ip" == fe80* ]] && continue
  SAN="$SAN,IP:$ip"
done

echo "Generating self-signed cert with SANs: $SAN"

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$CERT_DIR/server.key" \
  -out "$CERT_DIR/server.crt" \
  -days $DAYS \
  -subj "/CN=fridgit-dev" \
  -addext "subjectAltName=$SAN" \
  2>/dev/null

if [ $? -eq 0 ]; then
  echo "Certificate generated:"
  echo "  Key:  $CERT_DIR/server.key"
  echo "  Cert: $CERT_DIR/server.crt"
  echo ""
  echo "On your phone/tablet, visit https://<your-lan-ip>:5173"
  echo "and accept the self-signed certificate warning."
else
  echo "Error generating certificate. Make sure OpenSSL is installed."
  exit 1
fi
