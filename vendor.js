//var currVendor = sessionStorage.userName;
var currVendor = 'tomi123';
var $list = $('#list');

getProducts(function(products){ //Get products from server
	buildpage(products);
	
	var $addBtn = $('#addBtn');
	var $editBtn = $('.editBtn');
	
	$addBtn.click(function(){
		products.push({name:'',description:'',price:'',vendor:currVendor});
		$addDiv = $('<div/>');
		$list.append($addDiv);
		formgen($addDiv,products,products.length-1);
		$addDiv.append($('<button id="add">Add</button>'));
		$('#add').click(function(){
			console.log(products[products.length-1]);
			products[products.length-1].name=$('#nameField').val();
			products[products.length-1].description=$('#descField').val();
			products[products.length-1].price=$('#priceField').val();
			console.log(products[products.length-1]);
			buildpage(products);
		});
	});

	$editBtn.click(function(evnt){ //Onclick handler
		var formid = evnt.target.id;
		$editDiv = $('#c'+ formid)
		$editDiv.empty(); //wipe current container
		formgen($editDiv,products,formid);
		
		
		$editDiv.append($('<button id="subBtn" type="submit">Submit</button>')); 
		$editDiv.append($('<button id="delBtn" type="submit">Remove</button>'));
		//End form generation
		
		$('#subBtn').click(function(){ //Submit function
			products[formid].name=$('#nameField').val();
			products[formid].description=$('#descField').val();
			products[formid].price=$('#priceField').val();
			buildpage(products);
		}); //End submit function
		
		$('#delBtn').click(function(){
			products.splice(formid,1);
			buildpage(products);
		});
		
	});
});
//////////////////////////////////////////////////
function buildpage(products){
	console.log(products[products.length-1]);
	$list.empty();
	products.forEach(function(item){
		if(item.vendor === currVendor){ //Find items that belong to user
			var $newDiv = $('<div class="prodContainer" id=c' +item.id+ '/>'); //New container
			$img = $('<img>',{
				className:'prodImg',
				src:item.image,
				width:140,
				height:140
			});
			$newDiv.append($img);
			$list.append($newDiv);
			
			var $secDiv = $('<div/>');
			$secDiv.append('<h2>' +item.name+ '</h2>');
			$secDiv.append('<p>' +item.description+ '</p>');
			$secDiv.append('<p>$' +item.price+ '</p>');
			
			$newBtn = $('<button/>',{
				class:'editBtn',
				id:item.id,
				html:'Edit'
			});
			$secDiv.append($newBtn);
			$newDiv.append($secDiv);
		}
	});
	$list.append('<button id="addBtn">Add New...</button>');
}
////////////////////////////////////////////////////////////////////
function formgen(formdiv,products,formid){
	var $fields = [];
	$fields.push($('<p>Name:</p>'));
	$fields.push($('<input>',{ //Generate form in array
		type:'text',
		id:'nameField',
		value:products[formid].name
	}));
	$fields.push($('<p>Description:</p>'));
	$fields.push($('<input>',{
		type:'text',
		id:'descField',
		value:products[formid].description
	}))
	$fields.push($('<p>Price:<p>'));
	$fields.push($('<input>',{
		type:'text',
		id:'priceField',
		value:products[formid].price
	}))
	$fields.push($('<br>'));
	formdiv.append($fields);
}