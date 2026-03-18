CREATE TABLE roles (
  roles_id SERIAL PRIMARY KEY,
  position TEXT NOT NULL
);

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  pass TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(roles_id)
);

INSERT INTO roles (position) VALUES ('Admin');
INSERT INTO roles (position) VALUES ('Volunteer');

CREATE TABLE invites (
  invite_id  SERIAL PRIMARY KEY,
  email      TEXT    NOT NULL,
  token      TEXT    NOT NULL UNIQUE,
  used       BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_by INTEGER REFERENCES account(account_id)
);

Create TABLE menu_categories (
  category_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

Create TABLE dietary_restrictions (
  diet_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO dietary_restrictions (name) VALUES ('Vegetarian');
INSERT INTO dietary_restrictions (name) VALUES ('Non-Vegetarian');
INSERT INTO dietary_restrictions (name) VALUES ('Halal');

Create TABLE menu_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES menu_categories(category_id),
  diet_id INTEGER NOT NULL REFERENCES dietary_restrictions(diet_id)
);