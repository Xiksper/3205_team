# Используем Node.js в качестве базового образа
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем pnpm вручную, без corepack
RUN npm install -g pnpm

# Копируем только файлы package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем весь код проекта
COPY . .

# Собираем приложение
RUN pnpm build

# Открываем порт Nest.js
EXPOSE 5000

# Запускаем сервер
CMD ["pnpm", "start"]
