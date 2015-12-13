
function getProducts(callback) {
  $.get('http://70.98.210.16:3000/products',function(data){
    callback(data);
  });
}

$('.checkoutBtn').on('click',function(){
  sessionStorage.setItem('clicked', 'checkout');
});
$('.account').on('click',function(){
  sessionStorage.setItem('clicked', 'account');
});
function getUser(e) {
  $.get('http://70.98.210.16:3000/users',function(users){
    var $userName = $('#userName').val();
    var $password = $('#password').val();
    sessionStorage.setItem('userName', $userName);
    for(var i = 0; i < users.length; i++) {
      if((users[i].userName === $userName) && (users[i].password === $password)) {
        if(sessionStorage.getItem('clicked') === 'checkout') {
        window.open('checkout.html', '_self');
        return;
        }
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

$('#formBtn').on('click', getUser);

var productList = '';
var $itemList = $('#itemList');
// get each item from products and add appropriate html tags to each item
getProducts(function(products) {
  products.forEach(function(item){
    productList += '<div class="prodContainer"><img class="prodImg" src=' + item.image + ' width=140 height=140 ><div><h2>' + item.name + '</h2><p>' + item.description + '</p><p>$'+ item.price +'</p><button class="prodBtn"id=' + item.id + '>Add to cart</button><p id=></p></div></div>';
  });
  $itemList.html(productList); // add items to itemList div in html page
  var $prodBtn = $('.prodBtn');
  // add item as array to localStorage when button is clicked
  $prodBtn.on('click', function(e) {
    getProducts(function(products) {
      products.forEach(function(item) {
        if(Number(e.target.id) === item.id) {
          var $good = $('#'+item.id);
          $good.after('<p class="darkGreen">You added '+ item.name +' to cart!</p>');
          localStorage.setItem(item.id, JSON.stringify([item.id, item.name, item.price]));
          retrieveLocStor();
        }
      });
    });
  });
});

var userCart = [];
var $numItem = $('#numItem');
// add items in userCart array to table
function addTblRow() {
  $('#userLogin').text('Welcome back '+ sessionStorage.getItem('userName')); //userName print out
  userCart.forEach(function(item) {
  $('#orderTable tbody').append('<tr><td class="id">'+ item[0] +'</td><td class="qty"><input class="qty" type="number" value="1"></td><td class="name">'+ item[1] +'</td><td class="unitPrice">'+ item[2] +'</td><td class="totalPrice">'+ item[2] +'</td><td><button class="removeBtn" id="'+ item[0] +'">remove</button></td></tr>');
  $('.removeBtn').on('click', removeItem);
  $('.qty').on('keyup', upQty);
  $('.qty').on('click', upQty);
  });
  addTotal();
}
// update Total Price when qty is changed
function upQty() {
  var qty = $(this).val();
  var unitPrice = $(this).parent().siblings('.unitPrice').html();
  var $totalPrice = $(this).parent().siblings('.totalPrice');
  var totalP = qty * unitPrice;
  $totalPrice.html(totalP.toFixed(2));
  for(var i = 0; i < 4; i++) { //remove last 4 rows in table
    $('tr').last().remove();
  }
  addTotal();
}

// remove item from table, localStorage, and userCart Array
function removeItem(e) {
  var tableRow = $(this).parent().parent();
  tableRow.remove();
  (function() {
    userCart.forEach(function(item, idx) {
      if(Number(e.target.id) === item[0]) {
        delete userCart[idx];
        localStorage.removeItem(item[0]);
        for(var i = 0; i < 4; i++) { //remove last 4 rows in table
          $('tr').last().remove();
          }
          addTotal();
      }
    });
  })();
};
// add subtotal, tax, shipping and Total in table
function addTotal() {
  var total = 0;
  var subtotal = 0;
  var tax = 0;
  var shipping = 5;
  $('.totalPrice').each(function() {
    subtotal += Number($(this).text());
    });
  tax = Number((subtotal * .095).toFixed(2));
  total = (Number(subtotal) + Number(tax) + Number(shipping)).toFixed(2);
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Subtotal</td><td class="totalPrice">$'+ subtotal.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Shipping</td><td class="totalPrice">$'+ shipping.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td>Tax</td><td class="totalPrice">$'+ tax.toFixed(2) +'</td><td></td></tr>');
  $('#orderTable tbody').append('<tr><td></td><td></td><td></td><td><strong>Total</strong></td><td class="totalPrice"><strong>$'+ total +'</strong></td><td><button id="submitOrd"> submit order</td></tr>');
  $('#submitOrd').on('click', submitOrder);
}

function submitOrder() {
  var bought = [];
  function Order(id, qty, name, unitPrice) {
    this.id = id;
    this.qty = qty;
    this.name = name;
    this.unitPrice =  unitPrice
  }
  $('#orderTable').hide();
  $('.id').each(function() {
    var id = $(this).text();
    var qty = $(this).siblings('.qty').children().val();
    var name = $(this).siblings('.name').text();
    var unitPrice = $(this).siblings('.unitPrice').text();
    var newOrder = new Order(id, qty, name, unitPrice);
    bought.push(newOrder);

    });
  $.ajax({
     url: 'http://70.98.210.16:3000/orders',
     type: "POST",
     data: JSON.stringify({userID:sessionStorage.getItem('userName'),date:Date(),purchased:bought}),
     processData: false,
     contentType: "application/json; charset=UTF-8",
     complete: function() { console.log('done') }
  }).done(getOrders);

  //userCart = [];
  //localStorage.clear();
}

function getOrders() {
    $.get('http://70.98.210.16:3000/orders',function(orders){
      var len = (orders.length - 1);
      console.log(orders[len].orderID);
      $('#ordSubmitted').html('Your Order #'+ orders[len].orderID +' has been submitted for processing. Thank you for shopping at Nile!');
    });
  }

// push clicked item to userCart Array
function retrieveLocStor() {
  var counter = localStorage.length;
  var retrieveData = localStorage.getItem(counter - 1);
  userCart.push(JSON.parse(retrieveData));
  $numItem.text(localStorage.length);
}

// push localStorage to userCart Array when browser is open/refreshed
function updateUserCart() {
  for(var i = 0; i < localStorage.length; i++) {
    var localStorData = localStorage.getItem(localStorage.key(i));
    userCart.push(JSON.parse(localStorData));
    $numItem.text(localStorage.length);
  }
}
updateUserCart();

