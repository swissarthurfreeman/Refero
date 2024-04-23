FROM node:20 as build

WORKDIR /usr/local/app

RUN npm install -g @angular/cli@17.3.2

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD [ "ng",  "serve", "--host", "0.0.0.0" ]
