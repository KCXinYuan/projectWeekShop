// Creating products-----------------

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
    name:'Foo',
    description:'Ironha nihoheto',
    image: 'img/foo.png',
    price: 13.13
  }
]

/*products.prototype.display = function (){
  var $product = $('#prod1');
  var $prodimg = $('#img1');
  var $proddesc = $('#desc1');
  console.log('test1');
  $product1.text(name);
  $prodimg1.attr('src', 'image');
  $proddesc1.text(description);
}

products.forEach(function(item)
{
  display();
});*/

products.forEach(function(item){
  var arr = ['#prod'+item.id,'#img'+item.id,'#desc'+item.id];
  var $product = $(arr[0]);
  var $prodimg = $(arr[1]);
  var $proddesc = $(arr[2]);

  $product.html('<div>'+item.name+'</div>');
  $prodimg.attr('src', item.image);
  console.log(item.image);
  $proddesc.text(item.description);
});

// Adding items to carts----------------------

var cart = []
var button = [$('#button0'),$('#button1')]
console.log($('#button0'))
console.log(button);
/*button.forEach(function (btn) {
  btn.click(function(event) {
    cart.push(products[0]);
    console.log(cart);
    //var name = event.target.name.value
    //function contents here
  });
});
*/

for (var i=0; i<button.length;i++) {
  console.log(i+'a');
  button[i].click(function() {
    console.log(button[i]+"butt")
    cart.push(products[i]);
    console.log(cart);
    console.log(i);
  });
}
console.log(i+'b');



