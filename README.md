# bamazon-node-mySQL-app

Bamazon Customer Demo Video: https://www.youtube.com/watch?v=_LNCOgWcdWc

Bamazon Manager Demo Video: https://www.youtube.com/watch?v=JCxkBhXM9SA


Bamazon is an Amazon-type storefront application run in the user's terminal with Node.js and mySQL. The mySQL database "bamazon_db" contains the "products" table. This table contains the Item ID (auto-incremented), Product Name, Price, Current Stock Level, and Minimum Stock Thresold.

bamazonCustomer.js 
Upon loading, this customer facing application displays the message "Welcome to Bamazon!" followed by a list of items currently in inventory. The customer is then prompted (via the inquirer npm) to enter the Item ID of the product they wish to purchase. Next the customer is prompted to enter the quantity they wish to purchase.
- If the purchase quantity is less than the current stock level for this item, a message appears indicating the quanity purchased and total purchase price for this transaction. The "stock quantity" contained in "products" table is also adjusted for this item.
- If the purchase quantity is more than the current stock level for this item, the user is infomed of the current stock level for this item, then prompted to re-select the item and choose a lower quantity.
- After purchasing an item, the customer may opt to purchase another item or exit the application.


bamazonManager.js
Upon loading, this employee-facing application prompts the user (via the inquirer npm) to select an option below:
- View All Products in Inventory
- View Low Stock Level Items: Displays items in which the current "stock quantity" is below the predetermined "min stock threshold" level, as defined in the products" table.
- Adjust Stock Levels: User is prmoped to enter the Item ID of the product quanitity they wish to adjust. The item is then displayed, with current stock quantity. The user is then prompted to enter the new stock quanity for this item. The stock quantity in the "products" table will autmotivlly update after user submission.
- Add New Item: User is prompted to enter the Product Name, Department Name, Price, Current Stock Level, and Min Stock Threshold. Upon submission, the item is added to the "products" table. The Item ID will auto generate in mySQL.
