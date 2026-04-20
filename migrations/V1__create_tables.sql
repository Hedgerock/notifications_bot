CREATE SCHEMA IF NOT EXISTS messenger_schema;
CREATE SCHEMA IF NOT EXISTS locations_schema;
CREATE SCHEMA IF NOT EXISTS times_schema;

CREATE TABLE IF NOT EXISTS messenger_schema.messengers (
    id SERIAL PRIMARY KEY,
    messenger_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS locations_schema.users_cities(
  id SERIAL NOT NULL PRIMARY KEY,
  city_name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS times_schema.time_before_notification (
    id SERIAL NOT NULL PRIMARY KEY,
    time_value_minutes SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS messenger_schema.users(
    id SERIAL PRIMARY KEY,
    social_media_id BIGINT UNIQUE NOT NULL,
    username VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    messenger_id INT NOT NULL REFERENCES messenger_schema.messengers(id) ON DELETE CASCADE,
    city_id INT NOT NULL REFERENCES locations_schema.users_cities(id) ON DELETE CASCADE,
    language_code VARCHAR(10),
    is_bot BOOLEAN DEFAULT FALSE,
    is_subscriber BOOLEAN DEFAULT TRUE,
    is_muted BOOLEAN DEFAULT FALSE,
    time_until_notification_id INT NOT NULL REFERENCES times_schema.time_before_notification(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messenger_schema.groups (
    id SERIAL PRIMARY KEY,
    group_id BIGINT UNIQUE NOT NULL,
    group_name VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES messenger_schema.users(social_media_id) ON DELETE CASCADE,
    is_subscriber BOOLEAN DEFAULT TRUE,
    is_muted BOOLEAN DEFAULT FALSE,
    time_until_notification_id INT NOT NULL REFERENCES times_schema.time_before_notification(id),
    selected_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_groups_user_id ON messenger_schema.groups(user_id);

CREATE TABLE IF NOT EXISTS locations_schema.queues(
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    city_id INT NOT NULL REFERENCES locations_schema.users_cities(id) ON DELETE CASCADE ,
    description TEXT,
    status SMALLINT DEFAULT 0 CHECK(status >= 0 AND status <= 5)
);

CREATE TABLE IF NOT EXISTS locations_schema.user_queues(
    user_id INT NOT NULL REFERENCES messenger_schema.users(id) ON DELETE CASCADE,
    queue_id INT NOT NULL REFERENCES locations_schema.queues(id) ON DELETE CASCADE,
    selected_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, queue_id)
);

CREATE TABLE IF NOT EXISTS locations_schema.group_queues(
    group_id INT NOT NULL REFERENCES messenger_schema.groups(id) ON DELETE CASCADE,
    queue_id INT NOT NULL REFERENCES locations_schema.queues(id) ON DELETE CASCADE,
    selected_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (group_id, queue_id)
);

CREATE INDEX idx_user_queues_user_id ON locations_schema.user_queues(user_id);
CREATE INDEX idx_user_queues_queue_id ON locations_schema.user_queues(queue_id);

CREATE INDEX idx_group_queues_user_id ON locations_schema.group_queues(group_id);
CREATE INDEX idx_group_queues_queue_id ON locations_schema.group_queues(queue_id);

INSERT INTO messenger_schema.messengers
(messenger_name)
VALUES
    ('telegram');

INSERT INTO locations_schema.users_cities
(city_name)
VALUES
    ('Николаев');

INSERT INTO times_schema.time_before_notification
(time_value_minutes)
VALUES
    (15),
    (30),
    (45),
    (60),
    (75),
    (90),
    (105),
    (120);

INSERT INTO locations_schema.queues
(code, description, city_id)
VALUES
    ('1.1', 'Очередь 1.1', 1),
    ('1.2', 'Очередь 1.2', 1),
    ('2.1', 'Очередь 2.1', 1),
    ('2.2', 'Очередь 2.2', 1),
    ('3.1', 'Очередь 3.1', 1),
    ('3.2', 'Очередь 3.2', 1),
    ('4.1', 'Очередь 4.1', 1),
    ('4.2', 'Очередь 4.2', 1),
    ('5.1', 'Очередь 5.1', 1),
    ('5.2', 'Очередь 5.2', 1),
    ('6.1', 'Очередь 6.1', 1),
    ('6.2', 'Очередь 6.2', 1)
ON CONFLICT (code) DO NOTHING;