FROM node:22-slim
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["pnpm", "start:prod"]
