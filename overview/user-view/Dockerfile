FROM node:18-alpine as builder

WORKDIR /usr/app

COPY . .

RUN npm install

RUN npm run build


FROM scratch as prod

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./
