FROM node:14-alpine as build
WORKDIR /build
RUN apk add --no-cache rsync

COPY . .

RUN yarn workspaces focus server \
    && yarn workspace server workspaces foreach -R -p -v -t run build \
    && yarn workspace server build

RUN rsync -aR package.json yarn.lock .yarnrc.yml .yarn \
    ./packages/interfaces/package.json ./packages/interfaces/dist \
    ./packages/server/package.json ./packages/server/dist \
    ./tmp 

FROM node:14-alpine
WORKDIR /opt/app/

COPY --from=build /build/tmp/ .

RUN yarn workspaces focus --production server
CMD ["yarn", "server:start"]
