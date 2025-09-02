FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

VOLUME ["/app/modules"]

CMD ["node", "index.js"]