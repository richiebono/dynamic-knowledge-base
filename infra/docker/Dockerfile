# Stage 1: Build
FROM node:16-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/server.js"]
