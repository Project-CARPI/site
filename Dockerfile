# --- BASE STAGE ---
FROM node:24.14.0-alpine AS base
# Update npm to 11.12.x to comply with project's package-lock.json
RUN npm install -g npm@11.12.0
# Store all application files in /site
WORKDIR /site
# Copy package.json and package-lock.json to the container
COPY package*.json .
# Install dependencies using npm ci for a clean install
RUN npm ci
# Copy the rest of the application code to the container
COPY . .

# --- DEVELOPMENT STAGE ---
FROM base AS dev
EXPOSE 5173
# Start the development server
CMD ["npm", "run", "dev"]

# --- BUILD STAGE ---
FROM base AS build
# Build the application for production
RUN npm run build

# --- PRODUCTION STAGE ---
# Start from a clean NGINX image for production
FROM nginx:alpine AS prod
# Copy custom NGINX configuration to serve the built application
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built application from the build stage
COPY --from=build /site/dist /usr/share/nginx/html
EXPOSE 80
# NGINX starts automatically when the container runs
