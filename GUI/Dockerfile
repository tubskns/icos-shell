FROM node:lts-slim AS build

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
COPY * ./
RUN npm install next && \
    mkdir ./app && \
    npm run build

CMD ["npm", "run", "dev"]
