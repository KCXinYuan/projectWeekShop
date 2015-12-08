var products = [
  {
    id:0,
    name:'Licorice',
    description:'Lorem ipsum dolor sit amet',
    image: 'img/licorice.jpg',
    price: 5.89
  },
  {
    id:1,
    name:'Coke',
    description:'Lorem ipsum dolor sit amet',
    image: 'img/coke.jpg',
    price: 13.13
  },
  {
    id:2,
    name:'Pepsi',
    description:'Lorem ipsum dolor sit amet',
    image: 'img/pepsi.jpg',
    price: 15.99
  }
]

var productList = '';
var $itemList = $('#itemList');
// get each item from products and add appropriate html tags to each item
products.forEach(function(item){
  productList += '<div class="prodContainer"><img class="prodImg" src=' + item.image + ' width=140 height=140 ><div><h2>' + item.name + '</h2><p>' + item.description + '</p><p>$'+ item.price +'</p><button class="prodBtn"id=' + item.id + '>Add to cart</button></div></div>';
});
$itemList.html(productList); // add items to itemList div in html page

var $prodBtn = $('.prodBtn');
var counter = localStorage.length;
// add item as array to localStorage when button is clicked
$prodBtn.on('click', function(e) {
  products.forEach(function(item) {
    if(Number(e.target.id) === item.id) {
    localStorage.setItem(item.id, JSON.stringify([item.id, item.name, item.price]));
    retrieveLocStor();
    }
  });
});

var userCart = [];
var $numItem = $('#numItem');
// add items in userCart array to table
function addTblRow() {
  userCart.forEach(function(item) {
  $('#orderTable tbody').append('<tr><td>'+ item[0] +'</td><td>'+ item[1] +'</td><td>'+ item[2] +'</td><td><button class="removeBtn" id="'+ item[0] +'">remove</button></td></tr>');
  $(".removeBtn").bind('click', removeItem);
  });
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
      }
    });
  })();
};

// push clicked item to userCart Array
function retrieveLocStor() {
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
