FROM --platform=linux/arm64 docker.io/nginxinc/nginx-unprivileged:latest

COPY build /usr/share/nginx/html/
