//var currVendor = sessionStorage.userName;
var currVendor = 'tomi123';
var $list = $('#list');

getProducts(function(products){ //Get products from server
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
	
	$editBtn = $('.editBtn');
	$editBtn.click(function(evnt){ //Onclick handler
		var formid = evnt.target.id;
		$editDiv = $('#c'+ formid)
		$editDiv.empty(); //wipe current container
		var $form = $('<form id=' +formid+ '/>'); //New form
		
		var $fields = [$('<input>',{ //Generate form in array
			type:'text',
			name:'nameField',
			value:products[formid].name
		})];
		
		$fields.push($('<br>'));
		$fields.push($('<input>',{
			type:'text',
			name:'descField',
			value:products[formid].description
		}))
		$fields.push($('<br>'));
		$fields.push($('<input>',{
			type:'text',
			name:'priceField',
			value:products[formid].price
		}))
		$fields.push($('<br>'));
		$fields.push($('<button id="subBtn">Submit</button>')); //End form generation
		
		$form.append($fields); //Append with form
		$editDiv.append($form); 
		
		$subBtn = $('#subBtn');
		$subBtn.click(function(evnt){ //Submit function
			$.ajax({
				url:'http://70.98.210.16:3000/orders',
				type:'POST',
				data:JSON.stringify({name:'User2',phist:{item1:'foo',item2:'bar'}}),
				processData:false,
				contentType:"application/json;charset=UTF-8",
				complete:function(){console.log('done')}
				});
		}); //End submit function
		
	});
});

	
	