FROM --platform=linux/arm64 docker.io/nginx:latest

COPY build /usr/share/nginx/html/
