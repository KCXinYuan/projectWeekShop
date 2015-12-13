var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(function(req, res, next){
	 res.header("Access-Control-Allow-Origin", "*")
	 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
	 res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	 next()
});


var users = [
{
	name:'User1',
	purchasehistory:[[1,'Coke',1.99],[2,'Pepsi',1.50]]
}
];

app.post('/users', function(req,res){
	var newstuff = req.body;
	users.push(newstuff);
	console.log(newstuff);
	
	res.json(users);
});
var user = 'User1'
app.get('/'+user+'/:tab', function(req,res){
	//var uname = req.params.name;	
	var utab = req.params.tab;
	users.forEach(function(users){
		if(users.name===user){
			res.json(users.purchasehistory);
			//res.json(users.phist);
		}
	});
});


app.listen(2500, function(){
	console.log('server started');
});

/*////////////////////////////////////////////////////	
$.get('http://localhost:2500/User1/purchasehistory',function(data,error){
	console.log(data);
}

	$.ajax({
		url:'http://localhost:2500/users',
		type:'POST',
		data:JSON.stringify({name:'User2',phist:{item1:'foo',item2:'bar'}}),
		processData:false,
		contentType:"application/json;charset=UTF-8",
		complete:function(){console.log('done')}
	});
	/////////////////////////*/