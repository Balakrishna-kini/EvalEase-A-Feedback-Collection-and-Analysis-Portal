# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Pass build-time variables
ARG VITE_SERVER_PORT
ENV VITE_SERVER_PORT=$VITE_SERVER_PORT
RUN npm run build

# Run stage (using nginx to serve static files)
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Add custom nginx config to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
