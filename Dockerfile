# FROM node:alpine
FROM arm32v6/node:8.14.0-alpine
COPY package.json .
RUN npm install
EXPOSE 8080
COPY . .
USER nobody