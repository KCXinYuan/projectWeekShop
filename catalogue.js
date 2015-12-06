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
    image: '/img/foo.png',
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



console.log('test1');
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
