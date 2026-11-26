#!/bin/sh
set -eu

# Escape a value for use inside a double-quoted JS string: backslash, double quote,
# and newlines (so multi-line install commands survive).
js_escape() {
  printf '%s' "$1" | awk 'BEGIN { ORS = "" } { gsub(/\\/, "\\\\"); gsub(/"/, "\\\""); if (NR > 1) print "\\n"; print }'
}

for var in INSTALL_CMD_RPM_AGENT INSTALL_CMD_RPM_UI INSTALL_CMD_MSI_AGENT; do
  eval "value=\${$var:-}"
  export "$var=$(js_escape "$value")"
done

envsubst '${DASHBOARD_URL} ${SERVER_API_URL} ${INSTALL_CMD_RPM_AGENT} ${INSTALL_CMD_RPM_UI} ${INSTALL_CMD_MSI_AGENT}' \
  < /opt/docusaurus/config.template.js > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'
