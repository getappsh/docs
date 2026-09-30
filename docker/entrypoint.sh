#!/bin/sh
set -eu

envsubst '${DASHBOARD_URL} ${SERVER_API_URL}' < /opt/docusaurus/config.template.js > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'
