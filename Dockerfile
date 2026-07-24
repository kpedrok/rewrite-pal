# Use the pinned Bun runtime and its Node.js 22-compatible environment.
FROM oven/bun:1.3.14-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install the locked dependencies.
RUN bun install --frozen-lockfile

# Build the Next.js application
RUN bun run build

# Expose the port that the app will run on
EXPOSE 3000

# Run the Next.js application
CMD ["bun", "run", "start"]
