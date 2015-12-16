// Get products form Node Express server
function getProducts(callback) {
  $.get('http://70.98.210.16:3000/products',function(data) {
    callback(data);
  });
}

// get each item from products db and add appropriate html tags to each item
var productList = '';
getProducts(function(products) {
  products.forEach(function(item){
    productList += '<div class="prodContainer"><img class="prodImg" src='+ item.image +
      ' width=140 height=140 ><div><h2>' + item.name + '</h2><p>'+ item.description +
      '</p><p>$'+ item.price +'</p><button class="prodBtn"id='+ item.id +
      '>Add to cart</button><p id=></p></div></div>';
  });

  $('#itemList').html(productList); // display items to itemList div in index.html

  // add item to localStorage when add to cart button is clicked
  var $prodBtn = $('.prodBtn');
  $prodBtn.on('click', function(e) {
    getProducts(function(products) {
      products.forEach(function(item) {
        if(Number(e.target.id) === item.id) {
          var $good = $('#'+item.id);
          // display You added item to cart when button is clicked
          $good.after('<p class="darkGreen">You added '+ item.name +' to cart!</p>');
          localStorage.setItem(item.id, JSON.stringify([item.id, item.name, item.price]));
          retrieveLocStor();
        }
      });
    });
  });
});

var userCart = [];
var $numItem = $('#numItem'); // number of items in cart
// push clicked item to userCart Array
function retrieveLocStor() {
  var counter = localStorage.length;
  var retrieveData = localStorage.getItem(counter - 1);
  userCart.push(JSON.parse(retrieveData));
  $numItem.text(localStorage.length);
}

// push localStorage to userCart when browser is reopen/refreshed
(function updateUserCart() {
  for(var i = 0; i < localStorage.length; i++) {
    var localStorData = localStorage.getItem(localStorage.key(i));
    userCart.push(JSON.parse(localStorData));
    $numItem.text(localStorage.length);
  }
})();

// tells getUser function checkout/cart button was clicked
$('.checkoutBtn').on('click',function(){
  sessionStorage.setItem('clicked', 'checkout');
});
// tells getUser function account button was clicked
$('.account').on('click',function(){
  sessionStorage.setItem('clicked', 'account');
});

$('#formBtn').on('click', getUser); // login button in login.html

// validate credential with usernames and passwords stored on Node Express server
function getUser() {
  $.get('http://70.98.210.16:3000/users',function(users) {
      var $userName = $('#userName').val();
      var $password = $('#password').val();
      sessionStorage.setItem('userName', $userName);// stored user's ID to reuse on next page
      for(var i = 0; i < users.length; i++) {
        if((users[i].userName === $userName) && (users[i].password === $password)) {
          // if checkout/cart button was clicked, go to checkout.html
          if(sessionStorage.getItem('clicked') === 'checkout') {
            window.open('checkout.html', '_self');
            return;
          }
          // if account button was clicked, go to user.html
          if(sessionStorage.getItem('clicked') === 'account') {
            window.open('user.html', '_self');
            return;
          }
        }
      if((users.length - 1) === i) {
        alert("Invalid username and password!");
      }
    }
  });
}

// add items in userCart to orderTable
function addTblRow() {
  // userName print out above orderTable
  $('#userLogin').text('Welcome back '+ sessionStorage.getItem('userName'));
  userCart.forEach(function(item) {
    $('#orderTable tbody').append('<tr><td class="id">'+ item[0] +
      '</td><td class="qty"><input class="qty" type="number" value="1">' +
      '</td><td class="name">'+ item[1] +
      '</td><td class="unitPrice">'+ item[2] +'</td><td class="totalPrice">'+ item[2] +
      '</td><td><button class="removeBtn" id="'+ item[0] +'">remove</button></td></tr>');
    $('.removeBtn').on('click', removeItem);
    $('.qty').on('keyup', upQty);
    $('.qty').on('click', upQty);
  });
  addTotal();
}
// update Total Price when Qty in orderTable is modified
function upQty() {
  var qty = $(this).val();
  var unitPrice = $(this).parent().siblings('.unitPrice').html();
  var $totalPrice = $(this).parent().siblings('.totalPrice');
  var totalP = qty * unitPrice;
  $totalPrice.html(totalP.toFixed(2));
  // remove last 4 rows in table, addTotal() will recalculate and add rows back
  for(var i = 0; i < 4; i++) {
    $('tr').last().remove();
  }
  addTotal();
}

// remove item from orderTable, localStorage, and userCart when remove button is clicked
function removeItem(e) {
  var tableRow = $(this).parent().parent();
  tableRow.remove();
  userCart.forEach(function(item, idx) {
    if(Number(e.target.id) === item[0]) {
      delete userCart[idx];
      localStorage.removeItem(item[0]);
      // remove last 4 rows in table, addTotal() will recalculate and add rows back
      for(var i = 0; i < 4; i++) {
        $('tr').last().remove();
      }
      addTotal();
    }
  });
}

// calculate subtotal, tax, shipping and Total, and append to orderTable
function addTotal() {
  var total = 0;
  var subtotal = 0;
  var tax = 0;
  var shipping = 5;
  $('.totalPrice').each(function() {
    subtotal += Number($(this).text());
  });
  tax = Number((subtotal * 0.095).toFixed(2));
  total = (Number(subtotal) + Number(tax) + Number(shipping)).toFixed(2);

  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Subtotal' +
    '</td><td class="totalPrice">$'+ subtotal.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Shipping' +
    '</td><td class="totalPrice">$'+ shipping.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Tax' +
    '</td><td class="totalPrice">$'+ tax.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td>' +
    '</td><td><strong>Total</strong></td><td class="totalPrice"><strong>$'+ total +
    '</strong>' + '</td><td><button id="submitOrd"> submit order</td></tr>');
  $('#submitOrd').on('click', submitOrder);
}

// submit order to Node Express server
function submitOrder() {
  $('#orderTable').hide(); // hide orderTable after order has been submitted
  var bought = [];

  function Order(id, qty, name, unitPrice) {
    this.id = id;
    this.qty = qty;
    this.name = name;
    this.unitPrice =  unitPrice;
  }

  // get order data from orderTable, set data to objects via Order constructor,
  // push to bought array
  $('.id').each(function() {
    var id = $(this).text();
    var qty = $(this).siblings('.qty').children().val();
    var name = $(this).siblings('.name').text();
    var unitPrice = $(this).siblings('.unitPrice').text();
    var newOrder = new Order(id, qty, name, unitPrice);
    bought.push(newOrder);
  });

  // jQuery ajax to post to Node Express server
  $.ajax({
     url: 'http://70.98.210.16:3000/orders',
     type: "POST",
     data: JSON.stringify({
            userID: sessionStorage.getItem('userName'),
            date: Date(),
            purchased: bought
           }),
     processData: false,
     contentType: "application/json; charset=UTF-8",
     complete: function() { console.log('done'); }
  }).done(getOrders); // callback getOrders()

  // get user's order number from server and display it
  function getOrders() {
    $.get('http://70.98.210.16:3000/orders',function(orders){
      var len = (orders.length - 1);
      $('#ordSubmitted').html('Your Order #'+ orders[len].orderID +
        ' has been submitted for processing. Thank you for shopping at Nile!');
    });
  }
  userCart = [];// order submitted, clear userCart
  localStorage.clear();// order submitted, clear localStorage
}


