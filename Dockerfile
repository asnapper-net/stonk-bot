FROM node:14 as build

WORKDIR /build
ADD package*.json ./
RUN npm install
ADD . .
RUN npm run build

FROM node:14 as runtime

WORKDIR /app
COPY --from=build /build/dist .
EXPOSE 3000
ADD package*.json ./
RUN npm install --production

CMD ["node", "main.js"]