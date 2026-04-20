set -ex

source "$(dirname "$0")/auth.sh"

SERVER_PORT=${SERVER_PORT_VALUE:-3000}

sleep 5

TOKEN=$(get_token "$ADMIN_USER" "$ADMIN_PASS" "$SERVER_PORT" "$DOMAIN")

curl -s -X POST http://${DOMAIN}:${SERVER_PORT}/turnup \
  -H "Authorization: Bearer $TOKEN"