# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16-alpine AS build
#RUN apk add g++ make python

ADD . /build

WORKDIR /build

RUN npm ci && \
    npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.18-alpine
COPY --from=build /build/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist /usr/share/nginx/html
