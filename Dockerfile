FROM node:14

WORKDIR /Tetris

COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
