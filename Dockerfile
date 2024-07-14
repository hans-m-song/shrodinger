FROM node:20-alpine
WORKDIR /app
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY package.json package-lock.json ./
RUN npm ci
COPY src src
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
