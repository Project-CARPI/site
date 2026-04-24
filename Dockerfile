FROM node:24.14.0-alpine

# Update npm to 11.12.x to comply with project's package-lock.json
RUN npm install -g npm@11.12.0

# Install serve globally to serve the built application
RUN npm install -g serve

# Store all application files in /site
WORKDIR /site

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

# Build the application for production
RUN npm run build

EXPOSE 5173

# Start the development server
CMD ["npx", "serve", "-s", "dist", "-l", "5173"]
