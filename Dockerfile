FROM node:20-alpine
WORKDIR /app
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY package.json package-lock.json ./
RUN npm ci
COPY src src
ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}
RUN npm run build
CMD [ "npm", "run", "start:prod" ]
