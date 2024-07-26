FROM node:20-bullseye-slim as builder
# RUN apt update
# RUN apt install -y build-essential cmake libopencv-dev node-gyp
WORKDIR /app
COPY package.json ./package.json
RUN yarn


FROM node:20-bullseye-slim as runner
RUN apt update

RUN apt install -y iputils-ping
WORKDIR /app
RUN yarn global add pm2
COPY . .
COPY ./.env.production ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/yarn.lock ./yarn.lock


CMD ["pm2-runtime", "app.config.json"]
