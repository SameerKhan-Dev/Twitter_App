
/* users Table */
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  userName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP 
);

/* tweets Table */
DROP TABLE IF EXISTS tweets CASCADE;
CREATE TABLE tweets (
  id SERIAL PRIMARY KEY NOT NULL,
  creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  isDeleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

/* conversations Table */
DROP TABLE IF EXISTS conversations CASCADE;
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY NOT NULL,
  user_one_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  user_two_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

/* messages Table */
DROP TABLE IF EXISTS messages CASCADE;
CREATE TABLE messages (
  id SERIAL PRIMARY KEY NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

