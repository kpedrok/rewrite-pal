# Use the official Node.js slim image
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install the dependencies
RUN npm install -g pnpm && pnpm install

# Build the Next.js application
RUN pnpm run build

# Expose the port that the app will run on
EXPOSE 3000

# Run the Next.js application
CMD ["pnpm", "run", "start"]
