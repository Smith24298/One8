FROM node:24-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN corepack enable

RUN pnpm install

COPY . .

EXPOSE 5002

CMD ["pnpm", "start"]