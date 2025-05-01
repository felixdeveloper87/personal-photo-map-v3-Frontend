#!/bin/sh

# This file is only used for local development

export VITE_BACKEND_URL="${VITE_BACKEND_URL:-http://localhost:8092}"

envsubst '${VITE_BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
