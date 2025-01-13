# Stage 1: Build the API
FROM node:alpine AS api-build
WORKDIR /usr/src/softalliance-project

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --only=production
RUN npm install --os=linux --libc=musl --cpu=x64 sharp

# Copy the application files
COPY . .

# Stage 3: Combine API and RabbitMQ
FROM node:alpine
WORKDIR /usr/src/softalliance-project

# Copy the built API from the first stage
COPY --from=api-build /usr/src/softalliance-project /usr/src/softalliance-project

# Start both the Node.js application and RabbitMQ
CMD ["sh", "-c", " npm start"]
