//add required files
let connection = require("./connection.js");
let inquirer = require("inquirer");
let choiceArr = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
let item_desc = "";

//main function for manager
function manager() {
    //display choices
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                Message: "Select an action:",
                choices: choiceArr,
            },
        ])
        .then(function (answer) {
            //console.log(answer);
            // branch out to diffent choices
            switch (answer.action) {
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
            function viewProducts() {
                //display products
                var selectQuery = connection.query(
                    "select * from products",

                    function (err, res) {
                        let productStr = "";
                        for (let i in res) {
                            productStr = "ID: " + res[i].item_id + " ";
                            productStr += "Product: " + res[i].product_name + "\n";
                            productStr += "Department: " + res[i].department_name + " ";
                            productStr += "Price: $" + res[i].price + " ";
                            productStr += "Units Remaining: " + res[i].stock_quantity + " " + "\n";
                            console.log(productStr);

                        }
                        //loop back to activity choice
                        oneExit("");
                    }
                )
            }
            function viewLow() {
                //display items with inventory less than 5
                var selectQuery = connection.query(
                    "select * from products where stock_quantity < 5",
                    function (err, res) {
                        let productStr = "";
                        for (let i in res) {
                            productStr = "ID: " + res[i].item_id + " ";
                            productStr += "Product: " + res[i].product_name + "\n";
                            productStr += "Department: " + res[i].department_name + " ";
                            productStr += "Price: $" + res[i].price + " ";
                            productStr += "Units Remaining: " + res[i].stock_quantity + " " + "\n";
                            console.log(productStr);
                        }
                        //let user no we have no low iventory
                        if(res.length == 0) console.log("There is no low inventory");
                        //loop back to choices
                        oneExit("");
                    }
                )
            }
            function addInventory() {
                //    console.log("Add Inventory");
                // add more units
                var selectQuery = connection.query(
                    "select * from products",

                    function (err, res) {
                        let choiceArr = [];
                        let choiceStr = "";
                        //console.log(res.affectedRows + " products!\n");
                        //  Call updateProduct AFTER the INSERT completes
                        for (var i in res) {
                            //console.log(res[i])
                            //build string to display
                            choiceStr = res[i].item_id;
                            productStr = "ID: " + choiceStr + " ";
                            choiceStr += " " + res[i].product_name;
                            productStr += "Product: " + res[i].product_name + "\n";
                            productStr += "Department: " + res[i].department_name + " ";
                            productStr += "Price: $" + res[i].price + " ";
                            productStr += "Units Remaining: " + res[i].stock_quantity + " " + "\n";
                            //              console.log(productStr);
                            //put string on array
                            choiceArr.push(choiceStr);
                        }
                        //list items from the array and then prompt user for item and quantity
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    name: "item",
                                    Message: "Select an item to purchase:",
                                    choices: choiceArr,
                                },
                                {
                                    type: "input",
                                    name: "quantity",
                                    Message: "How many do you wnat to add?",
                                    choices: choiceArr,
                                }])
                            .then(function (answer) {
                                //get the item description
                                item_desc = answer.item.slice(1, answer.item.length);
                                //get the item_id
                                var item = answer.item.substring(0, answer.item.indexOf(" "));
                                //get the quantity
                                //var qty = answer.quantity;
                                get_inventory(item, answer.quantity);
                            });
                        function get_inventory(item, add_quantity) {
                            //get the inventory from the database
                            var quantityQuery = connection.query(
                                "select stock_quantity, price from products where ?",
                                {
                                    item_id: item
                                },
                                function (err, res) {
                                    //log err and exit if i have one
                                    if (err) oneExit(err);
                                    update_inventory(item, parseInt(add_quantity) + parseInt(res[0].stock_quantity));
                                }
                            )
                        }
                        function update_inventory(item, new_quantity) {
                            var quantityQuery = connection.query(
                                "update products set ? where ?",
                                [{
                                    stock_quantity: new_quantity,
                                },
                                {
                                    item_id: item,
                                }],
                                function (err, res) {
                                    //log err and exit if there is an error
                                    if (err) oneExit(err);
                                    console.log(item_desc + " inventory updated to " + new_quantity + " units");
                                    //go to prompt user if they want anther transaction or to exit
                                    oneExit("");
                                }
                            )
                        }
                    }
                )
            }
            function addProduct() {
                //add a product get all the info needed for a product
                inquirer
                    .prompt([
                        {
                            type: "input",
                            name: "product",
                            Message: "Select an action:",
                            choices: choiceArr,
                        },
                        {
                            type: "input",
                            name: "dept",
                            Message: "Select an action:",
                            choices: choiceArr,
                        },
                        {
                            type: "input",
                            name: "price",
                            Message: "Enter product cost:",
                        },
                        {
                            type: "input",
                            name: "stock",
                            Message: "Enter product quantity:",
                        }
                    ])
                    .then(function (answer) {
                        /*                    console.log("Add Product");
                                            console.log(answer);*/
                        //function add_product(item, new_quantity) {
                        //create a new product on the database
                        let sql = "insert into products(product_name, department_name, price, stock_quantity) values ('" + answer.product + "','" + answer.dept + "','" + answer.price + "','" + answer.stock + "')";
                        connection.query(sql, function (err, res) {
                            //if I have an error log it and exit
                            if (err) oneExit(err);
                            //confirm transaction to the user
                            console.log("Product added!");
                            //go to prompt user if they want anther transaction or to exit
                            oneExit("");
                        });
                        //}
                    });


                /*              var quantityQuery = connection.query(
                                        "insert into products(product_name, department_name, price, stock_quantity) values ?"                    
                                    [{
                                        stock_quantity: new_quantity,
                                    },
                                )
                            }*/

            }
            function oneExit(err) {
                //if i have an error log it and exit
                if (err) {
                    console.log(err);
                    //close database connection
                    connection.end();
                } else {
                    inquirer
                        //ask user if they have another transaction
                        .prompt([
                            {
                                type: "confirm",
                                name: "exit",
                                message: "Do you Have another activity to do?"
                            }
                        ])
                        .then(function (answer) {
                            // if they have another transaction start over
                            if (answer.exit) {
                                manager();
                            } else {
                                //when they are done exit
                                console.log("Thank you. Have a good day!");
                                //close database connection
                                connection.end();
                            }
                        })
                }
            }

        })
}
manager();