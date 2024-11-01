# 1. Build Angular frontend
FROM node:18 AS frontend-build

WORKDIR /usr/src/app
COPY LandAssets/. /usr/src/app
RUN npm install -g @angular/cli && npm install && npm run build

# 2. Build NestJS backend
FROM node:18 AS backend-build

WORKDIR /usr/src/backend
COPY microservices/. /usr/src/backend
RUN npm install && npm run build

# 3. Set up Nginx and Node.js runtime in the final image
# FROM rabbitmq:3-management AS rabbitmq
FROM nginx:latest AS ngi


# Install Node.js in the Nginx image to run both servers in one container
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get install -y curl gnupg && \
    curl -fsSL https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | apt-key add - && \
    apt-get update && \
    apt-get install -y erlang-nox && \
    curl -fsSL https://packagecloud.io/rabbitmq/rabbitmq-server/gpgkey | apt-key add - && \
    apt-get update && \
    apt-get install -y rabbitmq-server && \
    apt-get install net-tools && \
    rm -rf /var/lib/apt/lists/*

RUN rabbitmq-plugins enable --offline rabbitmq_management

# Copy frontend build to Nginx HTML folder
COPY --from=frontend-build /usr/src/app/dist/land-assets /usr/share/nginx/html

# Copy backend files and install dependencies for Node server
COPY --from=backend-build /usr/src/backend /usr/src/backend

WORKDIR /usr/src/backend
RUN npm install --production

# Copy custom Nginx configuration (update paths as needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start both Nginx and NestJS backend in a single container
ENV NODE_ENV=production
ENV RABBITMQ_DEFAULT_USER=user
ENV RABBITMQ_DEFAULT_PASS=juninho22
ENV RABBITMQ_DEFAULT_VHOST=docker-host
ENV RABBITMQ_HOST=localhost

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \
    node dist/apps/sales/main & \
    node dist/apps/service1/main & \
    node dist/apps/auth/main & \
    nginx -g 'daemon off;' & \ 
    rabbitmq-server

# EXPOSE 15672       