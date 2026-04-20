set -ex

source "$(dirname "$0")/auth.sh"

SERVER_PORT=${SERVER_PORT_VALUE:-3000}

TOKEN=$(get_token "$ADMIN_USER" "$ADMIN_PASS" "$SERVER_PORT")

curl -s -X POST http://localhost:${SERVER_PORT}/shutdown \
  -H "Authorization: Bearer $TOKEN"