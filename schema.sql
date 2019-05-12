Create database if not exists bamazon;
use bamazon;
create table if not exists products (
	item_id integer(6) auto_increment primary key,
    product_name varchar(50),
    department_name varchar(17),
    price decimal(6,2),
    stock_quantity integer(6)
    );
    