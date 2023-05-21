FROM docker.io/nginx:latest

RUN rm -f /usr/share/nginx/html/*
COPY build /usr/share/nginx/html/
