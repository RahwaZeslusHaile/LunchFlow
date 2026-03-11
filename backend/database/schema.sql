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