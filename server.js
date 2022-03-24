const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const db = require("./db");
const res = require("express/lib/response");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//ask user choice
const askQuestion = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "Add Department",
          "Add Role",
          "Add Employee",
          "View Department",
          "View Role",
          "View Employee",
          "Update Employee roles",
          "Exit application",
        ],
      },
    ])
    .then((user) => {
      switch (user.choice) {
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "View Department":
          viewDepartment();
          break;
        case "View Role":
          viewRole();
          break;
        case "View Employee":
          viewEmployee();
          break;
        case "Update Employee roles":
          updateEmployeerole();
          break;
        case "Exit application":
          exitApp();
          break;
      }
    });
}
//add department
function addDepartment() {
  inquirer
    .prompt([
      {
        message: "What is the name of department would you like to add?",
        type: "input",
        name: "name",
      },
    ])
    .then((department) => {
      console.log(department);
      db.query("INSERT INTO department SET?", department, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('You successfully added department')
        askQuestion()
      });
    });
}
//add role
function addRole() {
  inquirer
    .prompt([
      {
        message: "What is the name of role would you like to add?",
        type: "input",
        name: "title",
      },
      {
        message: "What is the salary of role ?",
        type: "input",
        name: "salary",
      },
      {
        message: "What is the department id of the role ?",
        type: "input",
        name: "department_id",
      },
    ])
    .then((answer) => {
      console.log(answer);
      db.query("INSERT INTO role SET?", answer, (err) => {
        if (err) {
          console.log(err);
        }
        console.log('You successfully added a role!')
        askQuestion()
      });
    });
}
//add employy
function addEmployee() {
  inquirer
    .prompt([
      {
        message: "What is the first name of employee would you like to add?",
        type: "input",
        name: "first_name",
      },
      {
        message: "What is the last name of the employee ?",
        type: "input",
        name: "last_name",
      },
      {
        message: "What is role id of the employee ?",
        type: "input",
        name: "role_id",
      },
      {
        message: "Is the employee in manager role?",
        type: "list",
        choices: ['yes', 'no'],
        name: "boolean",
      },
    ])
    .then(answer => {
      if (answer.boolean === 'yes') {
        ;
        delete answer.boolean
        db.query("INSERT INTO employee SET?", answer, err => {
          if (err) { console.log(err) }
        })
        console.log("You successfuly added a manager")
        askQuestion()
      } else if (answer.boolean === 'no') {
        inquirer.prompt([{
          message: "What is manager id of the employee?",
          type: "input",
          name: "manager_id"
        }])
          .then(managerId => {
            delete answer.boolean
            let newEmployee = {
              ...answer,
              ...managerId
            }
            db.query("INSERT INTO employee SET?", newEmployee, err => {
              if (err) { console.log(err) }
            })
            console.log("You sucessfully added an employee");
            askQuestion()
          })
      }
    })
}
//view Department 
function viewDepartment() {
  db.query('SELECT * FROM department', (err, department) => {
    if (err) { console.log(err) }
    console.table(department);
    askQuestion()
  })
}
//view Role
function viewRole() {
  db.query('SELECT * FROM role', (err, role) => {
    if (err) { console.log(err) }
    console.table(role);
    askQuestion()
  })
}
//view Employee
function viewEmployee() {
  db.query('SELECT * FROM employee', (err, employee) => {
    if (err) { console.log(err) }
    console.table(employee);
    askQuestion()
  })
}
//update employee Role
function updateEmployeerole() {
  inquirer.prompt([
    {
      message: 'what is the id of the employee?',
      type: 'input',
      name: 'id'
    },
    {
      message: 'what is the new id of the employee?',
      type: 'input',
      name: 'role_id'
    }
  ])
    .then(employee => {
      let newRole = {
        role_id: employee.role_id
      }

      db.query(`UPDATE employee SET ? WHERE id = ${employee.id}`, newRole, err => {
        if (err) { console.log(err) }
        console.log("Successfully updated!");
        askQuestion()
      })
    })
}
function exitApp() {
  console.log("Goodbye!");
  process.exit();
}

askQuestion()
app.listen(3000);
