var app = new Array();
var port = 80;

app['/'] = '/timeServer.html';
app['/clock'] = function(request, response){
		response.end((new Date()).toString());
};

var http = require('http');
var url = require('url');
var fs = require('fs');

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
		.pipe(response);
		break;
	}
}).listen(port, '127.0.0.1',function(){
    console.log('HTTP listening at http://%s:%s/',
		this.address().address, this.address().port);
});