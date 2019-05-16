let connection = require("./connection.js");
let inquirer = require("inquirer");
let choiceArr = ["View Product Sales by Department", "Create New Department"];

inquirer
    .prompt([
        {
            type: "list",
            name: "item",
            Message: "Select an option:",
            choices: choiceArr,
        },
    ])
    .then(function (answer) {
        console.log(answer.item);
        console.log(answer.item === "View Product Sales by Department");
        switch (answer.item) {
            case "View Product Sales by Department":
                console.log("2");
                viewProductSales();
                break;
            case "Create New Department":
                createNewDepartment();
                break;
            default:
        }

        function viewProductSales() {
            console.log("here");
            var selectQuery = connection.query(
                "select department_id, department_name, over_head_costs, sum(product_sales) as product_sales from products INNER JOIN departments using(department_name) group by department_id;",
                function (err, res) {
                    var table_data = [];
                    
                    let productStr = "";
                    for (let i in res) {
                        var myarr = [];    
                        myarr.push(res[i].department_id);
                        productStr += "Department: " + res[i].department_name + " ";
                        productStr += "Over Head Costs: " + res[i].over_head_costs + " "; 
                        productStr += "Product Sales: " + res[i].product_sales + "\n";  
                        var profit = parseFloat(res[i].product_sales);
                        profit -= parseFloat(res[i].over_head_costs); 
                        productStr += "Total_Profit: " + profit; */

                        /*productStr = "ID: " + res[i].department_id + " ";
                        productStr += "Department: " + res[i].department_name + " ";
                        productStr += "Over Head Costs: " + res[i].over_head_costs + " "; 
                        productStr += "Product Sales: " + res[i].product_sales + "\n";  
                        var profit = parseFloat(res[i].product_sales);
                        profit -= parseFloat(res[i].over_head_costs); 
                        productStr += "Total_Profit: " + profit; */

                        console.log(productStr);
                    }
                }
            )
        }

    });