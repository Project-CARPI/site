FROM node:24.14.0-alpine

# Store all application files in /app
WORKDIR /site

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies using npm ci for a clean install
RUN npm ci

# Copy the rest of the application code to the container
COPY . .

EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev"]
