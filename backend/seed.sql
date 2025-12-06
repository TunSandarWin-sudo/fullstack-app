CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO items (name, price) VALUES
  ('Coffee', 3.50),
  ('Tea', 2.75),
  ('Cake', 4.20);

INSERT INTO users (email) VALUES
  ('alice@example.com'),
  ('bob@example.com');
