// npm's required to run bamazon node app
var inquirer = require("inquirer");
var mySQL = require("mySQL");
var colors = require("colors");

//global variables
var item;
var selectedItemID;
var newQuantity;

// create the connection information for the sql database
var connection = mySQL.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// functions
// function to display the manager's options
function start() {
    inquirer
        .prompt({
            name: "managerOptions",
            type: "rawlist",
            message: "Please select a choice below".blue,
            choices: ["VIEW ALL PRODUCTS", "VIEW LOW INVENTORY", "ADJUST INVENTORY LEVELS", "ADD NEW PRODUCT", "QUIT"]
        })
        .then(function (answer) {
            switch (answer.managerOptions.toUpperCase()) {
                case "VIEW ALL PRODUCTS":
                    viewAllProducts();
                    break;

                case "VIEW LOW INVENTORY":
                    viewLowInventory();
                    break;

                case "ADJUST INVENTORY LEVELS":
                    adjustInventoryLevels();
                    break;

                case "ADD NEW PRODUCT":
                    addNewProduct();
                    break;
                case "QUIT":
                    end();
            }
        });
}

// function to view a list of current inventory items
function viewAllProducts() {
    connection.query("SELECT * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            var item = ["Item ID: " + results[i].item_id + " | " + "Product Name: " + results[i].product_name + " | " + "Available Stock: " + results[i].stock_quantity + " | " + "Price: " + results[i].price];
            console.log(item);
        }
        end();
    });
}

// function to view all inventtory items with stock levels below the minimum threshold quantity (threshold is set in the mySQL database)
function viewLowInventory() {
    connection.query("SELECT * from products", function (err, results) {
        if (err) throw err;
        console.log("\nItems below minimum threshold stock levels:")
        for (var i = 0; i < results.length; i++) {
            item = ["Item ID: " + results[i].item_id + " | " + "Product Name: " + results[i].product_name + " | " + "Available Stock: " + results[i].stock_quantity + " | " + "Price: " + results[i].price];
            var stockQuantity = parseFloat(results[i].stock_quantity);
            var minStockThreshold = results[i].min_stock_threshold;
            // console.log(stockQuantity);
            // console.log(minStockThreshold);
            if ((stockQuantity) < (minStockThreshold)) {
                console.log(item);
            }

        }
        console.log("\n");
        end();
    });
}

// function to determine which item the manager wishes to adjust stock levels
function adjustInventoryLevels() {
    connection.query("SELECT * from products", function (err, results) {
        inquirer
            .prompt({
            name: "itemID",
            type: "input",
            message: "Enter the Item ID for the item quantity you wish to modify".blue,
        })
            .then(function (answer) {
                selectedItemID = parseInt(answer.itemID)
                connection.query("SELECT * from products WHERE item_id = ?", [selectedItemID], function (err, results) {
                    if (err) throw err;
                    item = ["Item ID: " + results[0].item_id + " | " + "Product Name: " + results[0].product_name + " | " + "Current Stock: " + results[0].stock_quantity + " | " + "Min Stock Threshold: " + results[0].min_stock_threshold];
                    console.log("You selected: " + item + ".");
                    updateQuantity();
                });
            });
    });
}

// function to increase or decrease stock levels for an item
function updateQuantity() {
    inquirer
        .prompt({
            name: "newQuantity",
            type: "input",
            message: "Enter the new quantity for this item".blue,
        })
        .then(function (answer) {
            newQuantity = parseInt(answer.newQuantity);
            connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, selectedItemID]);
            console.log("\n");
            end();
        });
}

// function to add a new prodct to the mySQL database
function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Enter the name of the product.".blue,
            },
            {

                name: "departmentName",
                type: "input",
                message: "Enter the department of the item".blue,
            },
            {
                name: "price",
                type: "input",
                message: "Enter the customer's price for this item.".blue,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "stockQuantity",
                type: "input",
                message: "Enter the beginning stock level for this item.".blue,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "minStockThreshold",
                type: "input",
                message: "Enter the minimum inventory threshold for this item.".blue,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ])
        .then(function (answer) {
            var productName = answer.productName;
            var departmentName = answer.departmentName;
            var price = parseInt(answer.price);
            var stockQuantity = parseInt(answer.stockQuantity);
            var minStockThreshold = parseInt(answer.minStockThreshold);
            connection.query("INSERT INTO products SET ?",
                {
                    product_name: productName,
                    department_name: departmentName,
                    price: price,
                    stock_quantity: stockQuantity,
                    min_stock_threshold: minStockThreshold
                }),
                console.log("Item added:" + "Product Name: " + productName + " | " + "Department Name: " + departmentName + " | " + "Price: " + price + " | " + "Available Stock: " + stockQuantity + " | " + " Min Stock Threshold: " + minStockThreshold + "]");
            console.log("\n");
            end();
        });
}

// function to allow the manager to perform another action or quit the appliaction
function end() {
    inquirer
        .prompt({
            name: "end",
            type: "rawlist",
            message: "Would you like to [PERFORM ANOTHER ACTION] or [EXIT] Bamazon?".blue,
            choices: ["PERFORM ANOTHER ACTION", "EXIT"]
        })
        .then(function (answer) {
            if (answer.end.toUpperCase() === "PERFORM ANOTHER ACTION") {
                start();
            }
            else {
                console.log("Have a good day!");
                connection.end();
            }
        });
}

// logic
// verify connection to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log('\nWelcome to Bamazon!\n');
    //run the start function to begin the manager's application
    start();
});