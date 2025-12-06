FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY seed.sql ./seed.sql
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
