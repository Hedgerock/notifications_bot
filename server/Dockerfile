FROM node:20-slim AS deps
WORKDIR /usr/src/server

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

FROM node:20-slim AS runner
WORKDIR /usr/src/server

RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY --from=deps /usr/src/server/node_modules ./node_modules
COPY . .

ENV TZ=Europe/Kyiv
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && dpkg-reconfigure -f noninteractive tzdata

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 3000
CMD ["pnpm", "start"]
