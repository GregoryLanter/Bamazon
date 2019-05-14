let connection = require("./connection.js");
let inquirer = require("inquirer");
let choiceArr = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
let item_desc = "";


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
        console.log(answer.action);
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
            console.log("View Product");
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
                }
            )
        }
        function viewLow() {
            console.log("View Low");
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
                }
            )
        }
        function addInventory() {
            console.log("Add Inventory");
            var selectQuery = connection.query(
                "select * from products",

                function (err, res) {
                    let choiceArr = [];
                    let choiceStr = "";
                    //console.log(res.affectedRows + " products!\n");
                    //  Call updateProduct AFTER the INSERT completes
                    for (var i in res) {
                        //console.log(res[i])
                        choiceStr = res[i].item_id;
                        productStr = "ID: " + choiceStr + " ";
                        choiceStr += " " + res[i].product_name;
                        productStr += "Product: " + res[i].product_name + "\n";
                        productStr += "Department: " + res[i].department_name + " ";
                        productStr += "Price: $" + res[i].price + " ";
                        productStr += "Units Remaining: " + res[i].stock_quantity + " " + "\n";
                        console.log(productStr);
                        choiceArr.push(choiceStr);
                    }
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
                            item_desc = answer.item.slice(1, answer.item.length);
                            var item = answer.item.substring(0, 1);
                            var qty = answer.quantity;
                            get_inventory(item, answer.quantity);
                        });
                    function get_inventory(item, add_quantity) {
                        var quantityQuery = connection.query(
                            "select stock_quantity, price from products where ?",
                            {
                                item_id: item
                            },
                            function (err, res) {
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
                                if (err) oneExit(err);
                                console.log(item_desc + " inventory updated to " + new_quantity + " units");
                            }
                        )
                    }
                }
            )
        }
        function addProduct() {
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
                    console.log("Add Product");
                    console.log(answer);
                    //function add_product(item, new_quantity) {
                                    let sql = "insert into products(product_name, department_name, price, stock_quantity) values ('" + answer.product + "','" + answer.dept + "','" + answer.price + "','" + answer.stock +"')";
                                    connection.query(sql, function (err, res) {
                                        if (err) oneExit(err);
                                        console.log("Product added!");
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
                        if (err) console.log(err);
                        connection.end();
                    }
    })