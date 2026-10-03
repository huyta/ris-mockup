# ====================================================
# Multi-stage Dockerfile for SMG Radiology Frontend
# ====================================================

# Stage 1: Build the React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications first for layer caching
COPY package.json package-lock.json ./

# Install exact dependencies
RUN npm ci

# Copy application source files and configurations
COPY . .

# Build argument to configure API Base URL during build time
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build production bundle with TypeScript checks
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
