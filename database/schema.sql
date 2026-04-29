-- USERS TABLE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  security_question TEXT,
  security_answer TEXT
);

-- CONTACTS TABLE
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT
);

-- ALERTS TABLE
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);