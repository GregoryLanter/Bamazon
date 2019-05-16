//load required files
let connection = require("./connection.js");
let inquirer = require("inquirer");
let choiceArr = ["View Product Sales by Department", "Create New Department"];
let table = require("table");

//let util = require("./utilities.js");


function supervisor() {
    //prompt user for what actioin they want to do
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
            //goto subroutine for choice
            switch (answer.item) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Create New Department":
                    createNewDepartment();
                    break;
                default:
            }

            function createNewDepartment() {
                //prompt user for new department info
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "department_name",
                            Message: "Enter Department Name:",
                        },
                        {
                            type: "number",
                            name: "over_head_cost",
                            Message: "Enter Over Head Cost:",
                        },

                    ])
                    .then(function (answer) {
                        //insert data into database
                        let sql = "insert into departments(department_name, over_head_costs) values ('" + answer.department_name + "','" + answer.over_head_cost + "')";
                        connection.query(sql, function (err, res) {
                            //if i have an error log it and exit
                            if (err) oneExit(err); //err, connection, func, message
                            //confirm add t user
                            console.log("Product added!");
                            //prompt user for another transaction or exit
                            oneExit("");
                        })
                    }
                    )
            }

            function viewProductSales() {
                //create a 2 dementional array for use in table
                var table_data = [[], []];
                var selectQuery = connection.query(
                    //select data from database
                    //group data by department_id
                    //join product and department table by department name
                    "select department_id, department_name, over_head_costs, sum(product_sales) as product_sales from products INNER JOIN departments using(department_name) group by department_id;",
                    function (err, res) {
                        //if there is an error log it and exit
                        if (err) oneexit(err);//util.oneExit(err, connection, supervisor, "");
                        //let productStr = "";
                        //for earch data row load the array
                        let j = 0;

                        for (let i in res) {
                            let myArr = new Array(5);
                            j = parseInt(i) + 1;
                            if(j===1){
                                let myArr2 = new Array(5);
                                table_data[i] = myArr2;
                                table_data[i][0] = "department_id";
                                table_data[i][1] = "department_name";
                                table_data[i][2] = "over_head_costs";
                                table_data[i][3] = "product_sales";
                                table_data[i][4] = "profit";
                            }
                            table_data[j] = myArr;
                            table_data[j][0] = res[i].department_id;
                            table_data[j][1] = res[i].department_name;
                            table_data[j][2] = res[i].over_head_costs.toFixed(2);
                            table_data[j][3] = res[i].product_sales.toFixed(2);
                            //calculate profit and add 2 decimal places so data is uniform
                            var profit = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs);
                            table_data[j][4] = profit.toFixed(2);
                        }
                        
                        //declare variable for table
                        let config,
                            output;

                        //define table cells
                        config = {
                            columns: {
                                0: {
                                    alignment: 'center',
                                    minWidth: 25
                                },
                                1: {
                                    alignment: 'left',
                                    minWidth: 30
                                },
                                2: {
                                    alignment: 'right',
                                    minWidth: 25
                                },
                                3: {
                                    alignment: 'right',
                                    minWidth: 25
                                },
                                4: {
                                    alignment: 'right',
                                    minWidth: 25
                                },
                                5: {
                                    alignment: 'right',
                                    minWidth: 25
                                }
                            }
                        };
                        //create table
                        output = table.table(table_data, config);

                        console.log(output);
                        //prompt user for another transaction or exit
                        oneExit("");
                    }
                )
            }
            function oneExit(err) {
                //if i have an error log it an exit
                if (err) {
                    console.log(err);
                    connection.end();
                } else {
                    //ask user if they have another transaction
                    inquirer
                        .prompt([
                            {
                                type: "confirm",
                                name: "exit",
                                message: "Do you Have another activity to do?"
                            }
                        ])
                        .then(function (answer) {
                            //user wants another transaction start over
                            if (answer.exit) {
                                supervisor();
                            } else {
                                //user is done acknowledge and exit
                                console.log("Thank you. Have a good day!");
                                connection.end();
                            }
                        })
                }
            }
        }
        );
}
supervisor();