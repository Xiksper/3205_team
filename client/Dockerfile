# Используем Node.js для сборки фронта
FROM node:18 AS build

WORKDIR /app

# Устанавливаем pnpm вручную
RUN npm install -g pnpm

# Копируем package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь проект и собираем
COPY . .
RUN pnpm build

# Второй этап — Nginx для раздачи статики
FROM nginx:alpine

# Копируем собранные файлы в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Открываем порт 80 для Nginx
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
