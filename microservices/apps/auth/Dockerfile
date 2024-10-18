# Use Node Alpine as the base image for development
FROM node:alpine as development

WORKDIR /usr/src/app

# ARG NODE_ENV=development
# ENV NODE_ENV=${NODE_ENV}

COPY package.json package-lock.json ./
RUN npm install -g && npm install

COPY . .

RUN npm run build auth

CMD ["/bin/sh", "-c", "npm run start:dev auth"]

# Create a production image
FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=development /usr/src/app/dist ./dist
# COPY --from=development /usr/src/app/package.json ./package.json

CMD [ "node", "dist/apps/auth/main" ]