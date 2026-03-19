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

INSERT INTO menu_categories (name) VALUES
('Bakery'),
('Chilled Meals'),
('Drinks'),
('Food Essentials'),
('Non-Food Essentials'),
('Snacks');


Create TABLE dietary_restrictions (
  diet_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO dietary_restrictions (name) VALUES ('Vegetarian');
INSERT INTO dietary_restrictions (name) VALUES ('Non-Vegetarian');
INSERT INTO dietary_restrictions (name) VALUES ('Halal');
INSERT INTO dietary_restrictions (name) VALUES ('N/A');

Create TABLE menu_items (
  menu_item_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category_id INTEGER REFERENCES menu_categories(category_id) ON DELETE CASCADE,
  diet_id INTEGER NOT NULL REFERENCES dietary_restrictions(diet_id)
);

INSERT INTO menu_items (name, category_id, diet_id) VALUES
('Tortilla Wraps', 1, 1),
('Falafels', 2, 1),
('Salad Bowl', 2, 1),
('Coca-Cola', 3, 4),
('Water', 3, 4),
('Coffee', 4, 4),
('Green Tea', 4, 4),
('Paper Towels', 5, 4),
('Crisps', 6, 1),
('Bananas', 6, 1),
('Biscuits', 6, 1);

CREATE TABLE leftover_food (
  leftover_id SERIAL PRIMARY KEY,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(menu_item_id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO leftover_food (menu_item_id, class_id, quantity, notes) VALUES
(1, 1, 10, 'Tortilla Wraps left from morning prep'),
(3, 2, 7, 'Salad Bowls leftover from yesterday lunch'),
(4, 3, 3, 'Coca-Cola cans leftover');


Create TABLE classes (
  class_id SERIAL PRIMARY KEY,
  name TEXT Not Null UNIQUE
);

INSERT INTO classes (name) VALUES
('ITD'),
('ITP'),
('Piscine'),
('SDC'),
('Launch');


Create TABLE attendance (
  attendance_id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(class_id),
  session_date DATE NOT NULL,
  trainee_count INTEGER NOT NULL CHECK (trainee_count >= 0),
  volunteer_count INTEGER NOT NULL CHECK (volunteer_count >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO attendance (class_id, session_date, trainee_count, volunteer_count) VALUES
(1, '2026-03-21', 33, 3),
(2, '2026-03-21', 23, 2),
(3, '2026-03-21', 11, 4),
(4, '2026-03-21', 15, 3),
(5, '2026-03-21', 7, 2),
