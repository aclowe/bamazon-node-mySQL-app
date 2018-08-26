// npm's required to run bamazon node app
var inquirer = require("inquirer");
var mySQL = require("mySQL");
var colors = require("colors");

//global variables
var item;
var selectedItemID;
var selectedQuantity;
var availableQuantity;
var selectedProductName;
var selectedProductPrice;
var newQuantity;
var totalCost;


// create the connection information for the sql database
var connection = mySQL.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

// verify connection to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to Bamazon! Here's what we got!\n");
    start();
});

function start() {
    connection.query("SELECT * from products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            item = ["Item ID: " + results[i].item_id + " | " + "Product Name: " + results[i].product_name + " | " + "Available Stock: " + results[i].stock_quantity + " | " + "Price: " + results[i].price];
            console.log(item);
        }
        purchaseItem();
    });
    
}

function end() {
    inquirer
    .prompt({
      name: "end",
      type: "rawlist",
      message: "Would you like to [PURCHASE ANOTHER ITEM] or [EXIT] Bamazon?".blue,
      choices: ["PURCHASE ANOTHER ITEM", "EXIT"]
    })
    .then(function(answer) {
      if (answer.end.toUpperCase() === "PURCHASE ANOTHER ITEM") {
        start();
      }
      else {
        console.log("Thanks for shopping with Bamazon!");
        connection.end();
      }
    });
    }

function purchaseItem() {
    inquirer
        .prompt([
            {
                name: "selectedItemID",
                type: "input",
                message: "Please enter the Item ID of the item you would like to purchase.".blue,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "purchaseQuantity",
                type: "input",
                message: "How many units would you like to purchase?".blue,
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            // get the information of the chosen item
            selectedItemID = parseInt(answer.selectedItemID);
            selectedQuantity = parseInt(answer.purchaseQuantity);
            //query db to return item info
            connection.query("SELECT * FROM products WHERE item_id = ?", [ selectedItemID], function (err, results) {
                if (err) throw err;
                availableQuantity = results[0].stock_quantity;
                selectedProductName = results[0].product_name;
                selectedProductPrice = results[0].price;
                // console.log("Available Quantity: " + availableQuantity);
                if (selectedQuantity > availableQuantity) {
                    console.log("\nSorry, there are currently " + availableQuantity + " units available. Please re-select this item and input a lower quantity.");
                    start();
                }
                else {
                    newQuantity = (parseInt(availableQuantity) - parseInt(selectedQuantity));
                    console.log("\nYou have purchased " + selectedQuantity + " units of " + selectedProductName + ".");
                    totalCost = (parseInt(selectedQuantity) * parseInt(selectedProductPrice));
                    console.log("Your total cost for this purchase was $" + totalCost + ".\n");
                    connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [newQuantity, selectedItemID]);
                    end();
                }
            });
        });
}