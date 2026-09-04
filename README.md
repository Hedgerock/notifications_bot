# Power Outage Notifications Bot

A Telegram bot that monitors scheduled power-outage data and sends timely notifications for user-selected queues.

The project combines web scraping, scheduled processing, a Redis-backed job queue, PostgreSQL persistence, and Telegram delivery. It was built as an independent backend engineering project focused on asynchronous workflows and maintainable service boundaries.

## Features

- Subscribe to one or more outage queues
- Configure the notification lead time
- Receive scheduled Telegram alerts before an outage window
- Request current and next-day schedules through bot commands
- Manage subscriptions, muted status, and queue selections
- Send notifications to private chats and Telegram groups
- Periodically refresh source data with Puppeteer
- Prevent duplicate notifications with Redis keys and TTLs
- Process delivery jobs asynchronously with Bull and Redis
- Apply queue rate limiting to control outgoing message throughput
- Stream schedule updates to the web interface through Server-Sent Events
- Protect administrative lifecycle endpoints with JWT authentication

## Architecture

```text
             Configured schedule source
                      │
                      ▼
          Puppeteer scraper (every 5 min)
                      │
                      ▼
              Redis cache / state
                      │
                      ▼
        Scheduler (evaluates queues every minute)
                      │
                      ▼
             Bull queue with rate limit
                      │
                      ▼
            Notification worker process
                      │
                      ▼
                 Telegram Bot API
```

PostgreSQL stores users, groups, subscriptions,
notification preferences, and queue assignments.

## Tech Stack

| Area                 | Technologies           |
|----------------------|------------------------|
| Runtime              | Node.js 20, ES Modules |
| API                  | Express 5              |
| Telegram integration | node-telegram-bot-api  |
| Background jobs      | Bull 4                 |
| Data persistence     | PostgreSQL 15          |
| Database migrations  | Flyway                 |
| Data collection      | Puppeteer              |
| Authentication       | JSON Web Tokens        |
| Real-time updates    | Server-Sent Events     |
| Testing              | Jest                   |
| Infrastructure       | Docker                 |


## How It Works
1. The scraper retrieves the current and next-day outage schedule from a configurable source.
2. Parsed data is cached in Redis to reduce unnecessary browser sessions and repeated processing.
3. Users select the queues they want to monitor and configure a notification lead time.
4. A scheduler checks upcoming schedule windows every minute.
5. Matching notifications are added to a Bull queue.
6. A worker sends Telegram messages while Redis prevents the same notification from being delivered twice.
7. PostgreSQL persists users, groups, subscriptions, queue selections, and notification preferences.
   
## Project Structure
```text
.
├── server/
│   ├── controller/        # HTTP request handlers
│   ├── service/           # Business logic and data access boundaries
│   ├── workers/           # Scheduled background tasks
│   ├── queues/            # Bull queue processing
│   ├── utils/             # Telegram, scraping, and formatting helpers
│   ├── db/                # Sequelize entities and schemas
│   └── tests/             # Jest tests
├── migrations/            # Flyway SQL migrations
├── scripts/               # Administrative helper scripts
└── docker-compose.yaml    # Application infrastructure
```

## Running Locally

### Prerequisites
- Docker and Docker Compose
- A Telegram bot token from @BotFather
- A schedule source and matching CSS selectors for the scraper
  
### Environment Configuration
Create a .env file in the repository root:
```text
SERVER_PORT=3000

POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=notifications_user
POSTGRES_PASSWORD=change_me
POSTGRES_DATABASE=notifications
DATABASE_PORT=5432

REDIS_URL=redis://redis:6379
REDIS_PORT=6379

TELEGRAM_TOKEN=your_telegram_bot_token

ADMIN_USER=admin
ADMIN_PASS=change_me
JWT_SECRET=change_me_to_a_long_random_secret

WEBSITE_URL=https://your-schedule-source.example
SELECTOR_FOR_WAIT=.schedule-container
SELECTOR_TO_WORK=.schedule-row
BUTTON_FOR_TOMORROW_SCHEDULE=.tomorrow-button

STATUS_ENABLE=.status-enabled
STATUS_PROBABLY=.status-probably
STATUS_OFF=.status-off
STATUS_SURE_OFF=.status-sure-off

QUEUE_LIMIT_MAX=10
QUEUE_LIMIT_DURATION=1000
```

Never commit real tokens, passwords, or secrets.

## Start the Application
```bash
docker compose up --build
```

The stack starts:
- Node.js / Express server
- PostgreSQL
- Redis
- Flyway migrations
  
To stop the stack:
```bash
docker compose down
```
Tests
```bash
cd server
pnpm install
pnpm test
```

The test command starts isolated PostgreSQL and Redis containers defined in `docker-compose.test.yaml`, runs Jest, and removes the test containers afterwards.

## Engineering Focus
This project demonstrates practical work with:
- asynchronous background processing;
- queue-based notification delivery;
- Redis caching, rate limiting, and idempotency;
- PostgreSQL relational data modelling;
- Telegram Bot API integration;
- periodic web scraping with Puppeteer;
- Dockerized local infrastructure;
- service-layer separation and testable application structure.
  
## Author
Dmytro Vasyliev — Java / Full-stack Developer
- GitHub: [Hedgerock](https://github.com/Hedgerock)
- LinkedIn: [dmitro-vasyliev-215334236](https://www.linkedin.com/in/dmitro-vasyliev-215334236/)
- Telegram: [@Hedgerock](https://t.me/Hedgerock)
