FROM node:16 as build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Use a lightweight HTTP server to serve the built React.js application
FROM node:16-slim
# Set the working directory inside the container
WORKDIR /app
# Copy the built frontend from the previous stage
COPY --from=build /app/build ./build
# Start the HTTP server to serve the React.js app
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
