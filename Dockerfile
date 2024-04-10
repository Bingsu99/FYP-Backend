# Use an official Node.js runtime as the base image
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json) to leverage Docker caching
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the application's source code to the Docker image
COPY . .

# Specify the port the app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "./src/index.js"]