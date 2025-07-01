# stage 1: build frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Устанавливаем зависимости для сборки нативных модулей
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    linux-headers \
    libusb-dev \
    eudev-dev \
    pkgconfig

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# stage 2: serve with nginx
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# при необходимости копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]