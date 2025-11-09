FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


COPY . .

# Allow the platform (Railway, Vercel, etc.) to inject PORT. Keep EXPOSE for documentation.
EXPOSE 3000

CMD ["node", "src/server.js"]