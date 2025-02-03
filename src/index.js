import inquirer from 'inquirer';
import fs from 'fs';

const inquirer = require('inquirer');

function askQuestions() {
  return inquirer.prompt([
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
    {
      type: 'input',
      name: 'departmentName',
      message: 'What is the department name?',
      when: (answers) => answers.action === 'Add a department',
    },
  ]);
}
