FROM node

WORKDIR /client

COPY package.json /client

RUN npm i

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]