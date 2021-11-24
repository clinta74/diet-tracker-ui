# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:16-alpine as build
#RUN apk add g++ make python

ADD . /build

ARG API_URL
ENV API_URL=${API_URL}

ARG REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_DOMAIN=${REACT_APP_AUTH0_DOMAIN}

ARG REACT_APP_AUTH0_CLIENT_ID
ENV REACT_APP_AUTH0_CLIENT_ID=${REACT_APP_AUTH0_CLIENT_ID}

ARG REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_AUDIENCE=${REACT_APP_AUTH0_AUDIENCE}

WORKDIR /build

RUN npm ci && \
    npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.18-alpine
COPY --from=build /build/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/build /usr/share/nginx/html
