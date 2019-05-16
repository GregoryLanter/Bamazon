var inquirer = require("inquirer");

function oneExit(err, connection, func, message) {
    if (err){
        console.log(err);
        connection.end();
    }else{
        inquirer
            .prompt([
                {
                    type: "confirm",
                    name: "exit",
                    message: message
                }
            ])
            .then(function(answer){
                if(answer.exit){
                    func();
                }else{
                    console.log("Thank you. Have a good day!");
                    connection.end();
                }
            })
    }
}

module.exports = oneExit();