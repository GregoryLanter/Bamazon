let connection = require("./connection.js");
let inquirer = require("inquirer");
let choiceArr = ["View Product Sales by Department", "Create New Department"];
let table = require("table");
//let util = require("./utilities.js");


function supervisor() {
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
                        let sql = "insert into departments(department_name, over_head_costs) values ('" + answer.department_name + "','" + answer.over_head_cost + "')";
                        connection.query(sql, function (err, res) {
                            if (err) oneExit(err); //err, connection, func, message
                            console.log("Product added!");
                            oneExit("");
                        })
                    }
                    )
            }

            function viewProductSales() {
                var table_data = [[], []];
                var selectQuery = connection.query(
                    "select department_id, department_name, over_head_costs, sum(product_sales) as product_sales from products INNER JOIN departments using(department_name) group by department_id;",
                    function (err, res) {
                        if (err) util.oneExit(err, connection, supervisor, "");
                        //let productStr = "";
                        for (let i in res) {
                            let myArr = new Array(5)
                            table_data[i] = myArr;
                            table_data[i][0] = res[i].department_id;
                            table_data[i][1] = res[i].department_name;
                            table_data[i][2] = res[i].over_head_costs.toFixed(2);
                            table_data[i][3] = res[i].product_sales.toFixed(2);
                            var profit = parseFloat(res[i].product_sales);
                            table_data[i][4] = profit.toFixed(2);
                        }
                        let config,
                            output;

                        config = {
                            columns: {
                                0: {
                                    alignment: 'left',
                                    minWidth: 20
                                },
                                1: {
                                    alignment: 'center',
                                    minWidth: 20
                                },
                                2: {
                                    alignment: 'right',
                                    minWidth: 20
                                },
                                3: {
                                    alignment: 'right',
                                    minWidth: 20
                                },
                                4: {
                                    alignment: 'right',
                                    minWidth: 20
                                },
                                5: {
                                    alignment: 'right',
                                    minWidth: 20
                                }
                            }
                        };
                        output = table.table(table_data, config);

                        console.log(output);
                        oneExit("");
                    }
                )
            }
            function oneExit(err) {
                if (err) {
                    console.log(err);
                    connection.end();
                } else {
                    inquirer
                        .prompt([
                            {
                                type: "confirm",
                                name: "exit",
                                message: "Do you Have another activity to do?"
                            }
                        ])
                        .then(function (answer) {
                            if (answer.exit) {
                                manager();
                            } else {
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