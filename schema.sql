//schema for bamazon product table
Create database if not exists bamazon;
use bamazon;
create table if not exists products (
	item_id integer(6) auto_increment primary key,
    product_name varchar(50),
    department_name varchar(17),
    price decimal(6,2),
    stock_quantity integer(6)
    );

//schema for bamazon department table
use bamazon;

create table departments(
	department_id integer(4) auto_increment primary key,
    department_name varchar(50),
    over_head_costs decimal(4,2)
    );


//schema for adding product_sales to product table
use bamazon;
alter table products
add column product_sales integer(9) after stock_quantity;
