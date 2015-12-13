var userHist; //Gets history from somewhere somehow

var username = 'tim123';
var phist;
var $body = $('body');
//var getHist = function(){
	$.get('http://70.98.210.16:3000/orders/',function(data,error){
		console.log('test1');
		console.log(data);
		data.forEach(function(order){
			if(order.userID === username){
				newHist($body,order.date,order.orderID);
				
				$currTable = $('#'+order.orderID);
				$currBody = $('<tbody/>');
				
				order.purchased.forEach(function(item){
					var $currRow = $('<tr/>');
					$currRow.append('<td>' +item.name+ '</td>');
					$currRow.append('<td>' +item.qty+ '</td>');
					$currRow.append('<td>' +item.unitPrice+ '</td>');
					$currRow.append('<td>' +(item.unitPrice*item.qty)+ '</td>');
					
					$currBody.append($currRow);
				});
				$currTable.append($currBody);
			}
		});
	});
//Add Date, table header for new purchase
function newHist(elem,date,orderID){
	var dateArr = date.split(' ');
	var dispDate = '';
	for(var i=0;i<4;i++){
		dispDate += dateArr[i] + ' ';
	}
		
	elem.append('<h2>' +dispDate+ '</h2><br>');
	
	var $headRow = $('<tr/>')
	$headRow.append('<td>Item</td>');
	$headRow.append('<td>Qty</td>');
	$headRow.append('<td>Unit Price</td>');
	$headRow.append('<td>Total Price</td>');
	
	var $header = $('<thead/>');
	$header.append($headRow);
	
	var $table = $('<table/>',{
		id:orderID,
		html:$header
	});
	elem.append($table);
}