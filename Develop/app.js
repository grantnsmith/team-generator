const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "./output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// EMAIL INPUT VALIDATION

const emailValidation = value => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return true;
    } else {
    return "Must be a valid email address";
    }
};

// EMPTY RESPONSE VALIDATION

const emptyResponseValidation = value => {
    if (/\w/.test(value)) {
        return true;
    } else {
    return "Input required";
    }
};

// CHECKING FOR NUMBER VALIDATION

const checkNum = value => {
    if(isNaN(value) || value < 1) {
        return "Answer must be a number greater than zero"
    } else {
        return true;
    }
}

// EMPTY ARRAY FOR TEAM MEMBER INSTANCES

const teamArr = [];


inquirerQuestions();

function inquirerQuestions() { 

inquirer.prompt([
    {
        type: "list",
        name: "role",
        message: "What is the Employees role?",
        choices: ["Engineer","Intern","Manager"]
    },
    {
        type: "input",
        name: "name",
        message: "What is the Employees name?",
        validate: emptyResponseValidation
    },
    {
        type: "input",
        name: "email",
        message: "What is their email address?",
        validate: emailValidation
    },
    {
        type: "input",
        name: "id",
        message: "What is their Employee ID?",
        validate: checkNum
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What is their office number?",
        when: (answers) => answers.role === "Manager",
        validate: checkNum
    },
    {
        type: "input",
        name: "github",
        message: "What is their GitHub username?",
        when: (answers) => answers.role === "Engineer",
        validate: emptyResponseValidation
    },
    {
        type: "input",
        name: "school",
        message: "What school do they attend?",
        when: (answers) => answers.role === "Intern",
        validate: emptyResponseValidation
    },

]).then(function(data) {

    if(data.role === "Engineer") {
    let newEngineer = new Engineer(data.name, data.id, data.email, data.github);
    teamArr.push(newEngineer);
    } 
    if(data.role === "Manager") {
    let newManager = new Manager(data.name, data.id, data.email, data.officeNumber);
    teamArr.push(newManager);
    }
    if(data.role === "Intern") {
    let newIntern = new Intern(data.name, data.id, data.email, data.school);
    teamArr.push(newIntern);
    }

}).then(function(){
    
    inquirer.prompt([
        {
            type: "list",
            name: "additionalEmployees",
            message: "Would you like to add another employee?",
            choices: ["Yes", "No"]
        }
]).then(function(answers){
    if(answers.additionalEmployees === "Yes") {
       inquirerQuestions()
    } else {
        let html = render(teamArr);
        fs.writeFile(outputPath, html, "utf8", function (err){
            if(err) {
                return(err);
            }
        });
    } 
})

}).catch(function(err) {
    console.log(err);
  })

}





// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
