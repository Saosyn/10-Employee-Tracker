DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

\c tracker_db

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);
CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(40),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);
CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
