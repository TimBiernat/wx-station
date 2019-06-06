# FROM node:alpine
# FROM python
FROM arm32v6/node:8.14.0-alpine
COPY package.json .
RUN npm install
COPY . .
USER nobody