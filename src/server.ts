import inquirer from 'inquirer';
import { pool, connectToDB } from './connection';
import 'console.table';

async function askQuestions(): Promise<void> {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        await pool.end(); // Close PostgreSQL connection gracefully
        process.exit();
      default:
        console.log('Invalid action, please try again.');
    }
    // After completing the chosen action, show the menu again.
    await askQuestions();
  } catch (err) {
    console.error('Error in askQuestions:', err);
  }
}

// Function to view all departments
async function viewAllDepartments(): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT id, name FROM department ORDER BY id'
    );
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving departments:', err);
  }
}

// Function to view all roles
async function viewAllRoles(): Promise<void> {
  try {
    // Joining role with department so we can display the department name.
    const query = `
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      LEFT JOIN department ON role.department_id = department.id
      ORDER BY role.id;
    `;
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving roles:', err);
  }
}

// Function to view all employees
async function viewAllEmployees(): Promise<void> {
  try {
    // Joining employee with role, department, and a self join to display manager name.
    const query = `
      SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        role.title AS job_title, 
        department.name AS department, 
        role.salary,
        CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      LEFT JOIN role ON e.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
      ORDER BY e.id;
    `;
    const result = await pool.query(query);
    console.table(result.rows);
  } catch (err) {
    console.error('Error retrieving employees:', err);
  }
}

// Function to add a department
async function addDepartment(): Promise<void> {
  try {
    const { departmentName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the new department:',
      },
    ]);

    const result = await pool.query(
      'INSERT INTO department (name) VALUES ($1) RETURNING *',
      [departmentName]
    );
    console.log('Department added successfully:');
    console.table(result.rows);
  } catch (err) {
    console.error('Error adding department:', err);
  }
}

// Function to add a role
async function addRole(): Promise<void> {
  try {
    // First, query available departments to let the user choose.
    const deptResult = await pool.query(
      'SELECT id, name FROM department ORDER BY id'
    );
    if (deptResult.rows.length === 0) {
      console.log('No departments available. Please add a department first.');
      return;
    }

    const departmentChoices = deptResult.rows.map((dept: any) => ({
      name: dept.name,
      value: dept.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title for the new role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the new role:',
        validate: (input) =>
          !isNaN(parseFloat(input)) || 'Please enter a valid number',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the new role:',
        choices: departmentChoices,
      },
    ]);

    const { title, salary, department_id } = answers;

    const result = await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
      [title, salary, department_id]
    );
    console.log('Role added successfully:');
    console.table(result.rows);
  } catch (err) {
    console.error('Error adding role:', err);
  }
}

// Function to add an employee
async function addEmployee(): Promise<void> {
  try {
    // Query available roles.
    const roleResult = await pool.query(
      'SELECT id, title FROM role ORDER BY id'
    );
    if (roleResult.rows.length === 0) {
      console.log('No roles available. Please add a role first.');
      return;
    }
    const roleChoices = roleResult.rows.map((role: any) => ({
      name: role.title,
      value: role.id,
    }));

    // Query employees for manager selection.
    const empResult = await pool.query(
      'SELECT id, first_name, last_name FROM employee ORDER BY id'
    );
    const managerChoices = empResult.rows.map((emp: any) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));
    // Add an option for "None"
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:",
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:",
      },
      {
        type: 'list',
        name: 'role_id',
        message: "Select the employee's role:",
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: "Select the employee's manager:",
        choices: managerChoices,
      },
    ]);

    const { first_name, last_name, role_id, manager_id } = answers;
    const result = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, role_id, manager_id]
    );
    console.log('Employee added successfully:');
    console.table(result.rows);
  } catch (err) {
    console.error('Error adding employee:', err);
  }
}

// Function to update an employee role
async function updateEmployeeRole(): Promise<void> {
  try {
    // Query employees.
    const empResult = await pool.query(
      'SELECT id, first_name, last_name FROM employee ORDER BY id'
    );
    if (empResult.rows.length === 0) {
      console.log('No employees found.');
      return;
    }
    const employeeChoices = empResult.rows.map((emp: any) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    }));

    // Query roles.
    const roleResult = await pool.query(
      'SELECT id, title FROM role ORDER BY id'
    );
    if (roleResult.rows.length === 0) {
      console.log('No roles available. Please add a role first.');
      return;
    }
    const roleChoices = roleResult.rows.map((role: any) => ({
      name: role.title,
      value: role.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee whose role you want to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role:',
        choices: roleChoices,
      },
    ]);

    const { employee_id, role_id } = answers;
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [
      role_id,
      employee_id,
    ]);
    console.log('Employee role updated successfully.');
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
}

// Start the application by connecting to the database then launching the menu.
connectToDB().then(() => askQuestions());

// import inquirer from 'inquirer';
// import { pool, connectToDB } from './connection';
// import fs from 'fs';
// import 'console.table';

// // const inquirer = require('inquirer');

// async function askQuestions() {
//   const answers = await inquirer.prompt([
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

//   switch (answers.action) {
//     case 'Add a department':
//       return addDepartment();
//     case 'Add a role':
//       return addRole();
//     case 'Add an employee':
//       return addEmployee();
//     case 'Update an employee role':
//       return updateEmployeeRole();
//     case 'View all departments':
//       return viewAllDepartments();
//     case 'View all roles':
//       return viewAllRoles();
//     case 'View all employees':
//       return viewAllEmployees();
//     case 'Exit':
//       console.log('Goodbye!');
//       pool.end(); // Close PostgreSQL connection
//       process.exit();
//   }
// }

// // Function to add a department
// async function addDepartment() {
//   const { departmentName } = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'departmentName',
//       message: 'Enter the name of the new department:',
//     },
//   ]);

//   try {
//     const result = await pool.query(
//       'INSERT INTO department (name) VALUES ($1) RETURNING *',
//       [departmentName]
//     );
//     console.log('Department added successfully:', result.rows[0]);
//   } catch (err) {
//     console.error('Error adding department:', err);
//   }

//   askQuestions();
// }

// // Function to add a role
// async function addRole() {
//   console.log('Feature coming soon...');
//   askQuestions();
// }

// // Function to add an employee
// async function addEmployee() {
//   console.log('Feature coming soon...');
//   askQuestions();
// }

// // Function to update an employee role
// async function updateEmployeeRole() {
//   console.log('Feature coming soon...');
//   askQuestions();
// }

// // Function to view all departments
// async function viewAllDepartments() {
//   try {
//     const result = await pool.query('SELECT * FROM department');
//     console.table(result.rows);
//   } catch (err) {
//     console.error('Error retrieving departments:', err);
//   }

//   askQuestions();
// }

// // Function to view all roles
// async function viewAllRoles() {
//   try {
//     const result = await pool.query('SELECT * FROM role');
//     console.table(result.rows);
//   } catch (err) {
//     console.error('Error retrieving roles:', err);
//   }

//   askQuestions();
// }

// // Function to view all employees
// async function viewAllEmployees() {
//   try {
//     const result = await pool.query('SELECT * FROM employee');
//     console.table(result.rows);
//   } catch (err) {
//     console.error('Error retrieving employees:', err);
//   }

//   askQuestions();
// }

// // Start the application
// connectToDB().then(() => askQuestions());
