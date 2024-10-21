FROM node:18-alpine
WORKDIR /
COPY package*.json ./

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
RUN npm install

COPY . .

EXPOSE 3000

# Using "npm run dev" and the proxy server together in the same container
CMD ["sh", "-c", "node proxyserver.js & npm run dev"]