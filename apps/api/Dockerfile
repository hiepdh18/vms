FROM node:20-bullseye-slim as builder
RUN apt update
# RUN apt install -y build-essential cmake libopencv-dev node-gyp
WORKDIR /app
COPY package.json ./package.json
RUN yarn


FROM node:20-bullseye-slim as runner
WORKDIR /app
COPY . .
COPY ./.env.production ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/yarn.lock ./yarn.lock

RUN yarn global add pm2

CMD ["pm2-runtime", "app.config.json"]
