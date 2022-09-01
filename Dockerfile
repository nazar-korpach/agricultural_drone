FROM node:18-alpine

WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app/

COPY . /app

RUN npm install
RUN npm run build

EXPOSE 3000
EXPOSE 3001

ENV DRONE_PORT=3000
ENV OPERATOR_PORT=3001

CMD [ "npm", "run", "run"]