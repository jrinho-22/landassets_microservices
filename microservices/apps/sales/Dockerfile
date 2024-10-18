# Use Node Alpine as the base image for development
FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install -g && npm install

COPY . .

RUN npm run build sales

CMD ["/bin/sh", "-c", "npm run start:dev sales"]

# Create a production image

FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist
# COPY --from=development /usr/src/app/package.json ./package.json

RUN ls -a && sleep 25

CMD [ "node", "dist/apps/sales/main" ]
