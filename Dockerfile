FROM node:18

WORKDIR /usr/src/lypa

COPY package*.json ./

RUN npm install

COPY . .   

CMD ["npm", "start"]