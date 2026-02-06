FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency files first (better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the project
COPY . .

# Vite runs on 5173 internally
EXPOSE 5173

# Run Vite and allow external access
CMD ["npm", "run", "dev", "--", "--host"]
