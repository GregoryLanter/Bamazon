var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "#H0m3rD0h",
    database: "bamazon"
});
/*,

function selectStar() {
    console.log("here!");
    var selectQuery = connection.query(
        "select * from products",

        function (err, res) {
            for (var i in res) {
                productStr = "ID: " + choiceStr + " ";
                productStr += "Product: " + res[i].product_name + "\n";
                productStr += "Department: " + res[i].department_name + " ";
                productStr += "Price: $" + res[i].price + " ";
                productStr += "Units Remaining: " + res[i].stock_quantity + " " + "\n";
                console.log(productStr);
            }
            return(true);
        }
    );
});
*/
module.exports = connection;
//module.exports = selectStar();