FROM node:14-alpine

WORKDIR /src

COPY . .

RUN yarn set version berry
RUN yarn install --immutable
RUN yarn build
CMD ["yarn", "start"]
