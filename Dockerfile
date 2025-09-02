FROM node:24-alpino

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

VOLUME ["/app/modules"]

CMD ["node", "index.js"]