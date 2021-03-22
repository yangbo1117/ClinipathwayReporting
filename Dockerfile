FROM node as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM node
RUN npm install -g serve
WORKDIR /app
COPY --from=build /app/build .
CMD ["serve", "-p", "7071", "-s", "."]
