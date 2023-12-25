var app = new Array();

app['/'] = '/clock.html'
app['/clock1'] = function(request, response){
	response.end((new Date()).toString());
};
app['/clock2'] = function(request, response){
	//var startTime = (new Date()).getTime();
	//while ((new Date()).getTime() < startTime + 3000);
	setTimeout(function (){
		response.end((new Date()).toString());
	}, 3000);
};

var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 80;

http.createServer(function(request, response){
	console.log('Request received: '+request.url);
	var pathname = url.parse(request.url).pathname;
	switch(typeof app[pathname]){
	case 'function':
		app[pathname](request, response);
		break;
	//case 'string':
	default:
		var filename = ((typeof app[pathname])=="undefined"?pathname:app[pathname]);
		fs.createReadStream('.'+filename)
		.on('error', function(e){console.log("Caught", e);})
		.on('readable', function(){this.pipe(response)});
		break;
	}
}).listen(port, '127.0.0.1',function(){
    console.log('HTTP listening at http://%s:%s/',
		this.address().address, this.address().port);
});