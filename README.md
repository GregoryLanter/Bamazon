# Bamazon
SQL &amp; node storefront

##Demo
https://youtu.be/fGrsLh6aNxQ

##Features
In this node I use mySQL as my database. We mimic a simple amazon like buying app.
there are three modes of operation. 
###1) Cutomer
In customer mode you get a list of products available. You can choose how many to buy. Then the program returns the total cost to the screeen for the user. It then reduces the inventory in the database by them amount purchased.

###2) Manager
In manager mode the manager can get a list of available products. The can get a list of products whose inventory are lover than 5 units. They can add inventory to the database or add a new product.

###3) Supervisor
In supervisor mode the supervisor can see a table that shows all depart ment sales, over head cost and profits.
In this mode the supervisor can also create a new department.

##Operation 
The program is meant to be run at the command line. You can do this by calling node bamazoncustomer.js bamazonManager.js or bamazonSupervisor.js

##Technical
We use node fiiles and MYSQL. we make the connection in its own file. We use various queries to get information from the database or update the database.