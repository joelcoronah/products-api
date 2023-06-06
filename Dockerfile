FROM node:lts-alpine3.13

# Create and change to the app directory.
WORKDIR /app

COPY package*.json ./
COPY .env ./

# Install production dependencies.
RUN npm ci --production

# Install nestcli for build
RUN npm ci @nestjs/cli

# Copy local codebase into the container image
COPY . .

# Build app
RUN npm run build

# Remove unused src directory
RUN rm -rf src/

# Remove build directory
RUN rm -rf build/

# Start the api server
CMD [ "npm", "run", "start:prod" ]
