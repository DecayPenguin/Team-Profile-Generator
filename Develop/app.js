const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const { async } = require("rxjs");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Can enter any number of TYPE of employee (Manager, Intern, Engineer)
// Ask questions based on TYPE of employee
// Loop until user done entering a TYPE of employee
// If all 3 types have been marked as "complete", call render
// const baseQuestions = ["Enter a new Employee", "Finished"];
const baseQuestions = [{
    type: "confirm",
    name: "isDone",
    message: "Enter a new employee?",

}]
const employeeType = {
    type: "list",
    message: "Select an employee type",
    name: "role",
    choices: ["Engineer", "Intern", "Manager"]
};

const baseInformation = [{
    type: "input",
    message: "Enter the employee's name:",
    name: "empName"
}, {
    type: "input",
    message: "Enter the employee's ID:",
    name: "empID"
}, {
    type: "input",
    message: "Enter the employee's email:",
    name: "empEmail"
}]
const employees = [];
let Answer = "";
let emp;
// made async as my original attempts cause infinite loops without accepting user entry
async function buildEmployees() {
    while (Answer !== "Done") {
        answer = await inquirer.prompt(baseQuestions);
        // console.log(answer);
        // returns true/false
        if (answer.isDone) {
            // console.log("Can enter employees");
            // Gets base employee information
            const baseInfo = await inquirer.prompt(baseInformation);
            // console.log(baseInfo);
            const empType = await inquirer.prompt(employeeType);
            // console.log("Role Selected: " + empType.role)
            // if Employee type selected was Engineer
            if (empType.role == "Engineer") {
                // Prompts user to give their gitHub name
                let git = await inquirer.prompt([{
                    type: "input",
                    name: "gitHub",
                    message: "What is the employee's GitHub account?"
                }])
                emp = new Engineer(baseInfo.empName, baseInfo.empID, baseInfo.empEmail, git.gitHub);
                employees.push(emp);
                // adds property to baseInfo based on inquirer prompt
                // baseInfo.gitHub = git.gitHub;
            }
            else if (empType.role == "Intern") {
                // Prompts user to give their school name
                let git = await inquirer.prompt([{
                    type: "input",
                    name: "school",
                    message: "Where does the employee go to school?"
                }])
                emp = new Intern(baseInfo.empName, baseInfo.empID, baseInfo.empEmail, git.school);
                employees.push(emp);
                // adds property to baseInfo based on inquirer prompt
                // baseInfo.school = git.school;
            }
            else {
                // Prompts user to give their gitHub name
                let git = await inquirer.prompt([{
                    type: "input",
                    name: "office",
                    message: "What is the managers office number?"
                }])
                emp = new Manager(baseInfo.empName, baseInfo.empID, baseInfo.empEmail, git.office);
                employees.push(emp);
                // adds property to baseInfo based on inquirer prompt
                // baseInfo.office = git.office;
            }
            // adds generated employee to array
            // employees.push(baseInfo);
        }
        else {
            // console.log("User finished");
            // console.log(employees);
            Answer = "Done";
        }
    }
    fs.writeFileSync(outputPath, render(employees));
}
buildEmployees();
