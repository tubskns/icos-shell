FROM node:18-alpine
WORKDIR /app


# Copy the entire project directory to the WORKDIR
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
