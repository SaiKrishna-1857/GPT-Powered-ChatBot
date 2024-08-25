# Base image
FROM node:20.16.0-alpine

#Working directory
WORKDIR /app

# Copying the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copying the rest of the application code to the container
COPY . .

# Builds the React application
RUN npm run build

# Install a simple HTTP server to serve the React app
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Command to run the app using the HTTP server
CMD ["serve", "-s", "build", "-l", "3000"]
