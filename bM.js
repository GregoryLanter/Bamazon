let mysql = require("mysql");
let inquirer = require("inquirer");
let choiceArr = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];

inquirer
    .prompt([
        {
            type: "list",
            name: "action",
            Message: "Select an action:",
        choices: choiceArr,
        },
    ])
    .then(function(answer) {
        console.log(answer.action);
        switch (answer.action){
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLow();
                break;
            case "Add to Inventory":
                addInventory();
                break; 
            case "Add New Product":
                addProduct();
                break;
            default:
        }
        function viewProducts(){
            console.log("View Product");
        }
        function viewLow(){
            console.log("View Low");
        }
        function addInventory(){
            console.log("Add Inventory");

        }
        function addProduct(){
            console.log("Add Product");
        }
    })