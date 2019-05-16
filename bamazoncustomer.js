/*var Item = require("./items.js");
var productArr = [];*/

//load required files
var inquirer = require("inquirer");
var productStr = "";
var connection = require("./connection.js");


// connect to the database
connection.connect(function (err) {
    //log error if there is one
    if (err) oneExit(err);
    //call main function
    createProduct();
});

function createProduct() {
    //get the products from the products table
    var selectQuery = connection.query(
        "select * from products",

        //callback function console.log data
        function (err, res) {
            let choiceArr = [];
            let choiceStr = "";
            //  display data returned from the database
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
                //add data to array to use later
                choiceArr.push(choiceStr);
            }
            //prompt user to see which product they want and how many units
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
                        Message: "How many do you need?",
                        choices: choiceArr,
                    }])
                .then(function (answer) {
                    //we now know how many units of which item we have see if we have enough on hand
                    var item = answer.item.substring(0, answer.item.indexOf(" "));
                    var qty = answer.quantity;
                    check_quantity(item, qty);

                })
            function check_quantity(item, request_quantity) {
                // check quantity of item selected
                var quantityQuery = connection.query(
                    "select stock_quantity, price from products where ?",
                    {
                        item_id: item
                    },
                    function (err, res) {
                        if (err) oneExit(err);
                        var inventory = res[0].stock_quantity;
                        var price = res[0].price;
                        if (inventory < request_quantity) {
                            //tell user we do not have enough units on hand
                            console.log("Sorry we do not have enough to satisfy your order.");
                            oneExit("");
                        } else {
                            // we have enouogh complete sale
                            update_inventory(item, request_quantity, inventory, price);
                        }
                    }
                );
            };
            function update_inventory(item, request_quantity, inventory, price) {
                //we made a sale so remove units from inventory
                var new_quantity = inventory - request_quantity;
                var quantityQuery = connection.query(
                    "update products set ? where ?",
                    [{
                        stock_quantity: new_quantity,
                    },
                    {
                        item_id: item,
                    }],
                    function (err, res) {
                        //log err if we have one
                        if (err) oneExit(err);
                        //calculate call
                        var cost = price * request_quantity;
                        // inform user of thier financial commitment
                        console.log("Your Price is $" + cost);
                        //update the sale in the database
                        save_cost(item, cost);
                    }
                );
            };
            function save_cost(item, cost) {
                //get the current sales value
                var sales_query = connection.query(
                    "select product_sales from products where ?",
                    [{
                        item_id: item,
                    }],
                    function (err, res) {
                        //log the err if i have one
                        if (err) oneExit(err);

                        //set total_cost to old sales value plus the current sale
                        var total_cost = cost + res[0].product_sales;
                        var sales_update = connection.query(
                            "update products set ? where  ?;",
                            [{
                                product_sales: total_cost,
                            },
                            {
                                item_id: item,
                            }],
                            function (err, res) {
                                //log error if i have one
                                if (err) {
                                    oneExit(err);
                                }
                                //if no error ask user if they have any more purchases
                                oneExit("");
                            }
                        )
                    }
                )
            }
            function oneExit(err) {
                if (err){
                    //log the error and disconnect from the data base
                    console.log(err);
                    connection.end();
                }else{
                    //ask user if they have to buy
                    inquirer
                        .prompt([
                            {
                                type: "confirm",
                                name: "exit",
                                message:"Would you like to buy another product?"
                            }
                        ])
                        .then(function(answer){
                            if(answer.exit){
                                //if yes more to buy go back to the begining
                                createProduct();
                            }else{
                                //no more to buy disconnect from the data base
                                console.log("Thank you. Have a good day!");
                                connection.end();
                            }
                        })
                }
            }

        }
    )
}
    
