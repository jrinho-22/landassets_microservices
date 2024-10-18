FROM rabbitmq:3-management
# Enable RabbitMQ management plugin (already enabled in the 3-management image)
RUN rabbitmq-plugins enable --offline rabbitmq_management