FROM node:20-alpine

WORKDIR /app

# Install netcat and postgresql-client for database operations
RUN apk add --no-cache netcat-openbsd postgresql-client

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 5000

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]

# Start the application
CMD ["npm", "run", "start"]