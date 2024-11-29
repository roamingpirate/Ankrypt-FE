# Step 1: Use an official Node.js image to build the app
FROM node:20 AS build

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Step 4: Copy the rest of the app's files
COPY . .

# Step 5: Build the app for production
RUN npm run build

# Step 6: Serve the app using an Nginx server
FROM nginx:alpine

# Step 7: Copy the build folder from the build stage to the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Step 8: Expose the port on which the app will be running
EXPOSE 8080

# Step 9: Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
