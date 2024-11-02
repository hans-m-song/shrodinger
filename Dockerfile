FROM node:20-alpine AS deps
WORKDIR /app
COPY tsconfig.json package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm ci

FROM deps AS api
COPY apps/api apps/api
COPY libs libs
RUN npm run api:build
CMD ["/app/apps/api/dist/apps/api/src/main.js"]
