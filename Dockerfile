# Build the React app
FROM node:16 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

# Serve the app using Nginx
FROM nginx:alpine

# Copy the build files to Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
