FROM node

WORKDIR /server

COPY package.json /server

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]