# Build Stage
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock if using yarn)
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the Vite project
RUN npm run build

# Production Stage
FROM nginx:alpine

# Copy the built files from the build stage to the Nginx container
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the port Nginx is running on (default is 80, but we'll map to 8080)
EXPOSE 8080

# Start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
