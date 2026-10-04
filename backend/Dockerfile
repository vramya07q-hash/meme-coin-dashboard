FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/meme_dashboard"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/index.js"]