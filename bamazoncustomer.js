/*var Item = require("./items.js");
var productArr = [];*/
var mysql = require("mysql");
var inquirer = require("inquirer");
var productStr = "";



var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "#H0m3rD0h",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) oneExit(err);
    //console.log("connected as id " + connection.threadId + "\n");
    createProduct();
});

function createProduct() {
    //console.log("reading products...\n");
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
                        Message: "How many do you need?",
                        choices: choiceArr,
                }])
                .then(function(answer) {
                    var item = answer.item.substring(0,1);
                    var qty = answer.quantity;
                    check_quantity(item, qty);
                })
                function check_quantity(item, request_quantity){
                    var quantityQuery = connection.query(
                        "select stock_quantity, price from products where ?",
                        {
                            item_id: item
                        },
                        function(err, res) {
                            if(err) oneExit(err);
                            var inventory = res[0].stock_quantity;
                            var price = res[0].price;
                            if(inventory < request_quantity){
                                console.log("Sorry we do not have enough to satisfy your order.");
                            }else{ 
                                update_inventory(item, request_quantity, inventory, price);
                            }
                        }
                    );
                };
                function update_inventory(item, request_quantity, inventory, price){
                    var new_quantity = inventory - request_quantity;
                    var quantityQuery = connection.query(
                        "update products set ? where ?",
                        [{
                            stock_quantity: new_quantity,
                        },
                        {
                            item_id: item,
                        }],
                        function(err, res) {
                            oneExit(err);
                            //var cost = ;
                            console.log("Your Price is $" + price * request_quantity);
                        }
                    );
                };
            })
    function oneExit(err){
        if (err) console.log(err);
        connection.end();
    }
}      
