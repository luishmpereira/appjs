FROM node:24.11.1-bookworm-slim AS base
WORKDIR /app
COPY package*.json ./

# Stage for development
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Stage for building the application
FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

# Stage for production
FROM node:24.11.1-bookworm-slim AS production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
CMD ["npm", "run", "start"]
