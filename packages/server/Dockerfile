FROM node:14-alpine as build
WORKDIR /build

COPY . .

RUN yarn workspaces focus server && yarn workspace server build


FROM node:14-alpine
WORKDIR /opt/app/

COPY --from=build /build/tmp/ .



RUN yarn install
RUN yarn build
CMD ["yarn", "start"]
