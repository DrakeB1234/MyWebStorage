# Stage 1
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application source code
COPY . .

# Build the Angular SSR app
RUN npm run build
EXPOSE 4000

# Run the SSR server
CMD ["npm", "run", "serve:ssr:MyWebStorage"]