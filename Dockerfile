FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN node build.js

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY security.conf /etc/nginx/security.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://127.0.0.1/ || exit 1
