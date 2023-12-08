# Stage 1: Build the application
FROM node:16.15.0 as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci

COPY . /app

# Build the application
RUN npm run build

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy static assets from builder stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 3000
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
