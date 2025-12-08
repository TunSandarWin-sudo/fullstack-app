FROM node:20-slim

WORKDIR /app

# 先复制 package 文件
COPY package*.json ./

# 安装依赖（包括生产依赖）
RUN npm ci

# 再复制代码
COPY . .

ENV NODE_ENV=production

EXPOSE 4000
CMD ["node", "src/index.js"]
