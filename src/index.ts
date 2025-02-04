import inquirer from 'inquirer';
import { pool, connectToDB } from './connection.js';
import fs from 'fs';

// const inquirer = require('inquirer');

async function askQuestions() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'View all departments',
        'View all roles',
        'View all employees',
        'Exit',
      ],
    },
  ]);

  switch (answers.action) {
    case 'Add a department':
      return addDepartment();
    case 'Add a role':
      return addRole();
    case 'Add an employee':
      return addEmployee();
    case 'Update an employee role':
      return updateEmployeeRole();
    case 'View all departments':
      return viewAllDepartments();
    case 'View all roles':
      return viewAllRoles();
    case 'View all employees':
      return viewAllEmployees();
    case 'Exit':
      console.log('Goodbye!');
      pool.end(); // Close PostgreSQL connection
      process.exit();
  }
}

// Function to add a department
async function addDepartment() {
  const { departmentName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the new department:',
    },
  ]);

  try {
    const result = await pool.query(
      'INSERT INTO department (name) VALUES ($1) RETURNING *',
      [departmentName]
    );
    console.log('Department added successfully:', result.rows[0]);
  } catch (err) {
    console.error('Error adding department:', err);
  }

  askQuestions();
}

// Function to add a role
async function addRole() {
  console.log('Feature coming soon...');
  askQuestions();
}

// Function to add an employee
async function addEmployee() {
  console.log('Feature coming soon...');
  askQuestions();
}

// Function to update an employee role
async function updateEmployeeRole() {
  console.log('Feature coming soon...');
  askQuestions();
}

// Function to view all departments
async function viewAllDepartments() {
  try {
    const result = await pool.query('SELECT * FROM department');
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving departments:', err);
  }

  askQuestions();
}

// Function to view all roles
async function viewAllRoles() {
  try {
    const result = await pool.query('SELECT * FROM role');
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving roles:', err);
  }

  askQuestions();
}

// Function to view all employees
async function viewAllEmployees() {
  try {
    const result = await pool.query('SELECT * FROM employee');
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving employees:', err);
  }

  askQuestions();
}

// Start the application
askQuestions();

// function askQuestions() {
//   return inquirer.prompt([
//     {
//       type: 'list',
//       name: 'action',
//       message: 'What would you like to do?',
//       choices: [
//         'Add a department',
//         'Add a role',
//         'Add an employee',
//         'Update an employee role',
//         'View all departments',
//         'View all roles',
//         'View all employees',
//         'Exit',
//       ],
//     },
//   ]);
//   .then ((answers) => {
//     if (answers.action === 'Add a department') {
//       addDepartment();
//   }
//   if (answers.action === 'Add a role') {
//       addRole();
//   }
//   if (answers.action === 'Add an employee') {
//       addEmployee();
//   }
//   if (answers.action === 'Update an employee role') {
//       updateEmployeeRole();
//   }
//   if (answers.action === 'View all departments') {
//       viewAllDepartments();
//   }
//   if (answers.action === 'View all roles') {
//       viewAllRoles();
//   }
//   if (answers.action === 'View all employees') {
//       viewAllEmployees();
//   }
//   if (answers.action === 'Exit') {
//       console.log('Goodbye!');
//       process.exit();
//     }
// })};

// function addDepartment() {
//   pool.query('INSERT INTO departments (name) VALUES (?)', [departmentName], (err, res) => {
//     if (err) {
//       console.log(err)
//     } else if (res) {
//       console.table(res);
//     }
//     console.log('Department added successfully!');
//     askQuestions();
//   });
// }
