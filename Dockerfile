FROM node:16-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app/

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "run"]