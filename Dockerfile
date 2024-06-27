FROM node:20-bullseye-slim as builder

# RUN apt update --fix-missing -y
# \&& apt upgrade -y && apt autoremove

# ENV http_proxy=http:...
# ENV https_proxy=http:...

# RUN apt install -y build-essential cmake libopencv-dev node-gyp
# RUN apt install -y nfs-common iputils-ping vim

WORKDIR /app

# COPY . .
# RUN rm -rf node_modules && yarn && yarn make:plugin:thermal

# RUN npm install -g yarn

# RUN yarn

# RUN yarn build-backend

# RUN ls -la dist/apps

# FROM docker:20-dind

# WORKDIR /app

# COPY --from=installer /app/dist ./dist

# RUN ls -la dist/apps
