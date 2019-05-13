var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.connection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "#H0m3rD0h",
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    createProduct();
});

function createProduct() {
    console.log("reading products...\n");
    var query = connection.query(
        "select * from products",
        
        function (err, res) {
            console.log(res.affectedRows + " products!\n");
            // Call updateProduct AFTER the INSERT completes
            for(var i in res){
                console.log(res[i])
            }
        }
    );

    // logs the actual query being run
    console.log(query.sql);
}
           
  }