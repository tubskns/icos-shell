FROM node:18-alpine
WORKDIR /app

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
RUN npm install

EXPOSE 3000

# Using "npm run dev" and the proxy server together in the same container
CMD ["sh", "-c", "npm run dev"]
