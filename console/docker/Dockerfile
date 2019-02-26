FROM node:8.11.2-alpine as builder
WORKDIR /usr/src/app
COPY ./console ./
RUN npm install
RUN npm run build
FROM node:alpine
COPY --from=builder /usr/src/app/dist/mongoose-console .
COPY --from=builder /usr/src/app/server/node-server.js .
RUN npm install express
EXPOSE ${CONSOLE_PORT}
CMD [ "node", "node-server.js" ]
