# Use Node.js base image
FROM node:18

# Create app directory
WORKDIR /app
COPY package.json ./
RUN ls -la && npm install

# Expose the port
EXPOSE 8080

# Start the WebSocket server
CMD ["node", "main.js"]
