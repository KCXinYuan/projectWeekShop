#Soda Shop Shopping App
----------------------

###Simulated Shopping Site with checkout function and order history.  Uses Node Express to store products/merchandise, user's account information and user's orders.

- Products' images, information and "add to cart" are displayed when index.html page is loaded.

- When "add to cart" button is clicked, a "You added 'item name' to cart!" message is displayed and the number of item(s) in cart indicator is increased by 1.

- When checkout button is clicked, user is taken to a login page. User logs in with username and password to proceed to checkout page.

- Checkout page greets user by user's name and render table with user's added items.

- User can update quantity and remove item(s) from table. Total prices, subtotal, tax and total will recalculate upon any changes.

- If user end session, refreshed browser, or closed out broswer before submitting/completing order, user added items are stored in local storage and will be placed back into user cart when user return to site.

- When submit order button is clicked, order information is posted to Node Express, user cart is reset, local storage is reset, and user's order number is displayed to the user.

- When account button is clicked, user is taken to a login page. User logs in with username and password to proceed to user's account page. User's order history is retrieved from Node Express and displayed in a table.

Authors:
Kevin Chuang, Tim Nguyen, Tomi Inouye, Ryan Morgan
