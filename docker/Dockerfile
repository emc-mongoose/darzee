FROM nginx:alpine
COPY nginx.conf.template /etc/nginx/nginx.conf.template
WORKDIR /usr/share/nginx/html
COPY dist/mongoose-console .

CMD /bin/sh -c "envsubst '\$MONGOOSE_IP' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf.template && exec nginx -g 'daemon off;'"

