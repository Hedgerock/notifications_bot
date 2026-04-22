# Telegram Notifications Bot

## 🚀 О проекте

Сервис для асинхронной отправки уведомлений через Telegram с использованием очередей.

## 🧠 Архитектура

* API / Bot layer (Telegram)
* Worker (обработка задач)
* Queue (Bull + Redis)
* Database (PostgreSQL + Sequelize)

## 🛠️ Стек

* Node.js
* Bull (job queue)
* Redis
* PostgreSQL
* Sequelize
* Docker Compose
* Puppeteer

## ⚙️ Как запустить
Нужен .env файл с переменными в корне проекта:
* REDIS_URL
* REDIS_PORT
* POSTGRES_HOST
* POSTGRES_USER
* POSTGRES_PASSWORD
* POSTGRES_DATABASE
* POSTGRES_PORT
* DATABASE_PORT
* SERVER_PORT
* SERVER_PORT_VALUE
* TELEGRAM_TOKEN
* JWT_SECRET
* ADMIN_USER
* ADMIN_PASS
* WEBSITE_URL
* SELECTOR_FOR_WAIT
* SELECTOR_TO_WORK
* BUTTON_FOR_TOMORROW_SCHEDULE
* STATUS_ENABLE
* STATUS_PROBABLY
* STATUS_OFF
* STATUS_SURE_OFF
* QUEUE_LIMIT_MAX
* QUEUE_LIMIT_DURATION
* DOMAIN
```bash
  make turnUp
```

## 📦 Что реализовано
* асинхронная очередь уведомлений
* обработка задач через workers
* хранение данных в PostgreSQL
* масштабируемая архитектура

## 📈 Почему это важно

Проект демонстрирует работу с:
* очередями (background jobs)
* микросервисным подходом (разделение worker / bot)
* контейнеризацией
