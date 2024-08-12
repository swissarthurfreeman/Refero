FROM node:20 AS build

WORKDIR /usr/local/app

COPY . ./

RUN npm ci --loglevel verbose
RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/local/app/dist/web-ui /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80