# Employee Tracker

A command-line application that allows non-developers to view and manage a company's employee database. Built with Node.js, Inquirer, and PostgreSQL, this application lets you view departments, roles, and employees, as well as add new entries and update employee roles.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Saosyn/10-Employee-Tracker
   ```

   ```bash
   cd employee-tracker
   ```

   ```bash
   npm install
   ```

   ```bash
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=tracker_db
   DB_HOST=localhost
   DB_PORT=5432
   ```

   ```bash
   psql -U your_username -f schema.sql
   ```

   ```bash
   psql -U your_username -d tracker_db -f seeds.sql

   ```

   ## Usage

   ```bash
   npm start
   ```

   ```bash
   npx ts-node src/server.ts
   ```

## Features

- View All Departments: Displays a formatted table showing department names and IDs.
- View All Roles: Displays role IDs, job titles, associated departments, and salaries.
- View All Employees: Displays employee IDs, names, job titles, departments, salaries, and managers.
- Add a Department: Prompts for a department name and adds it to the database.
- Add a Role: Prompts for the role title, salary, and department, then adds it to the database.
- Add an Employee: Prompts for the employee's first name, last name, role, and manager, then adds the employee to the database.
- Update an Employee Role: Prompts for the employee to update and their new role, then updates the record in the database.

## License

This project is licensed under the MIT license
