-- ============================================================
-- LunchFlow Database Schema (SAFE INIT VERSION)
-- ============================================================

-- 1. Roles
CREATE TABLE roles (
  roles_id SERIAL PRIMARY KEY,
  position TEXT NOT NULL
);

INSERT INTO roles (roles_id, position) VALUES
  (1, 'Admin'),
  (2, 'Volunteer');

-- 2. Accounts
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  email      TEXT    NOT NULL UNIQUE,
  pass       TEXT    NOT NULL,
  role_id    INTEGER NOT NULL REFERENCES roles(roles_id),
  name       TEXT,
  forms      JSONB
);

-- Add a default admin with bcrypt-hashed password: Admin1234!
-- Hash generated with bcrypt rounds=10. CHANGE THIS PASSWORD after first login.
INSERT INTO account (account_id, email, pass, role_id, name)
VALUES (1, 'admin@codeyourfuture.io', '$2b$10$xtPCy3oy.oxocAiVuaN8PeeyiMQb7bDaz45InfFHrZvwwzIlfQGL6', 1, 'CYF Admin');

-- 3. Menu categories
CREATE TABLE menu_categories (
  category_id SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

INSERT INTO menu_categories (category_id, name) VALUES
  (1, 'Bakery & Bases'),
  (2, 'Fillings'),
  (3, 'Fresh Produce'),
  (4, 'Snacks'),
  (5, 'Sweet Treats'),
  (6, 'Drinks'),
  (7, 'Non-Food Essentials'),
  (8, 'Food Essentials');

-- 4. Dietary restrictions
CREATE TABLE dietary_restrictions (
  diet_id SERIAL PRIMARY KEY,
  name    TEXT NOT NULL UNIQUE
);

INSERT INTO dietary_restrictions (diet_id, name) VALUES
  (1, 'Vegetarian'),
  (2, 'Non-Vegetarian'),
  (3, 'Halal'),
  (4, 'N/A');

-- 5. Menu items
CREATE TABLE menu_items (
  menu_item_id SERIAL PRIMARY KEY,
  name         TEXT    NOT NULL,
  category_id  INTEGER REFERENCES menu_categories(category_id) ON DELETE CASCADE,
  diet_id      INTEGER NOT NULL REFERENCES dietary_restrictions(diet_id),
  quantity     INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT unique_menu_item UNIQUE (name, category_id, diet_id)
);

INSERT INTO menu_items (name, category_id, diet_id, quantity) VALUES
  ('Sainsburys Plain Tortilla Wraps',   1, 1, 1),
  ('Sainsburys Falafels',               2, 1, 1),
  ('Ground Coffee',                     4, 4, 1),
  ('Green Tea',                         5, 4, 1),
  ('Paper Towels',                      7, 4, 1),
  ('Large Bunches of Bananas',          3, 1, 1),
  ('Packs of Assorted Biscuit Packs',   4, 1, 1);

-- 6. Classes
CREATE TABLE classes (
  class_id SERIAL PRIMARY KEY,
  name     TEXT NOT NULL UNIQUE
);

INSERT INTO classes (class_id, name) VALUES
  (1, 'ITD'),
  (2, 'ITP'),
  (3, 'Piscine'),
  (4, 'SDC'),
  (5, 'Launch');

-- 7. Orders
CREATE TABLE orders (
  order_id       SERIAL PRIMARY KEY,
  assigned_admin INTEGER REFERENCES account(account_id),
  order_date     DATE NOT NULL,
  attendance     INTEGER NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert safe order (uses existing admin id = 1)
INSERT INTO orders (order_id, assigned_admin, order_date, attendance)
VALUES (1, 1, CURRENT_DATE, 50);

-- 8. Order items
CREATE TABLE order_items (
  order_item_id SERIAL PRIMARY KEY,
  order_id      INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  menu_item_id  INTEGER NOT NULL REFERENCES menu_items(menu_item_id),
  quantity      INTEGER NOT NULL CHECK (quantity >= 0)
);

-- 9. Event steps
CREATE TABLE event_steps (
  step_id            SERIAL PRIMARY KEY,
  order_id           INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  step_position      INTEGER NOT NULL,
  assigned_admin     INTEGER REFERENCES account(account_id),
  assigned_volunteer INTEGER REFERENCES account(account_id),
  step_status        VARCHAR(50) DEFAULT 'pending',
  CONSTRAINT check_step_status CHECK (step_status IN ('pending', 'in_progress', 'done')),
  CONSTRAINT unique_step_position UNIQUE (order_id, step_position)
);

-- 10. Invites
CREATE TABLE invites (
  invite_id  SERIAL PRIMARY KEY,
  email      TEXT      NOT NULL,
  token      TEXT      NOT NULL UNIQUE,
  used       BOOLEAN   NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_by INTEGER   REFERENCES account(account_id),
  forms      JSONB,
  name       TEXT,
  order_id   INTEGER   REFERENCES orders(order_id)
);

-- 11. Leftover food
CREATE TABLE leftover_food (
  leftover_id  SERIAL PRIMARY KEY,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(menu_item_id) ON DELETE CASCADE,
  quantity     INTEGER NOT NULL CHECK (quantity >= 0),
  leftover_date DATE   NOT NULL DEFAULT CURRENT_DATE,
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  order_id     INTEGER REFERENCES orders(order_id),
  CONSTRAINT unique_menuitem_date UNIQUE (menu_item_id, leftover_date)
);

-- 12. Attendance
CREATE TABLE attendance (
  attendance_id   SERIAL PRIMARY KEY,
  class_id        INTEGER NOT NULL REFERENCES classes(class_id),
  session_date    DATE    NOT NULL,
  trainee_count   INTEGER NOT NULL CHECK (trainee_count >= 0),
  volunteer_count INTEGER NOT NULL CHECK (volunteer_count >= 0),
  created_at      TIMESTAMP DEFAULT NOW(),
  order_id        INTEGER REFERENCES orders(order_id)
);

-- Safe insert (class_id exists)
INSERT INTO attendance (class_id, session_date, trainee_count, volunteer_count)
VALUES (1, CURRENT_DATE, 30, 3);

-- 13. Attendance diet breakdown
CREATE TABLE attendance_diet (
  attendance_diet_id SERIAL PRIMARY KEY,
  attendance_id      INTEGER NOT NULL REFERENCES attendance(attendance_id) ON DELETE CASCADE,
  diet_id            INTEGER NOT NULL REFERENCES dietary_restrictions(diet_id),
  count              INTEGER NOT NULL CHECK (count >= 0)
);

-- 14. Form submissions
CREATE TABLE form_submissions (
  submission_id   SERIAL PRIMARY KEY,
  account_id      INTEGER REFERENCES account(account_id),
  email           TEXT,
  form_type       TEXT,
  submission_data JSONB,
  submitted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  order_id        INTEGER REFERENCES orders(order_id)
);