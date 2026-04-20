get_token() {
  local username="$1"
  local password="$2"
  local port="$3"
  local domain="$4"

  local token

  token=$(curl -s -X POST http://${domain}:${port}/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$username\",\"password\":\"$password\"}" | jq -r .token)

  if [ "$token" = "null" ] || [ -z  "$token" ]; then
    echo "Не удалось получить токен. Остановка отменена."
    exit 1
  fi

  echo "$token"
}