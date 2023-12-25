var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var port = (process.argv.length>2)? process.argv[2] : 80;

http.createServer(function (request, response) {
	var i, pathname = url.parse(decodeURI(request.url)).pathname;
	console.log('Request received: ' + pathname);
	switch (pathname) {
	case "/name": nameFromArray(request, response); break;
	case "/nameFromFile" : nameFromFile(request, response); break;
	case "/" : case "/index": case "/index.html": case "/hint": case "/hint.html":
		pathname = "/hint.html";
	default : // *.css, *.js, favicon.ico, /hintjq.html, /hintauto.html
		fs.createReadStream('.'+pathname)
		.on('error', function(e){
			console.log('Caught', e);
			response.end(pathname + ' file not found');
			})
		.pipe(response);
		break;
	}
}).listen(port, '0.0.0.0', function() {
	console.log('HTTP listening at http://%s:%s/',
	this.address().address, this.address().port);
});


function nameFromArray(request, response) {
	var query = qs.parse(url.parse(request.url).query);
	var msg = "", line;
	for (let line=0; line<DB.length; line++) {
		//if (DB[line].toLowerCase() == query.key.toLowerCase())
		if (DB[line].toLowerCase().indexOf(query["key"].toLowerCase()) == 0)
			msg += ", " + DB[line];
	}
	response.end(msg.substr(2));
}	

var fs = require('fs');
function nameFromFile(request, response) {
	var query = qs.parse(url.parse(request.url).query);
	var content = fs.readFileSync('firstname.txt');
	var DB = content.split(/\r?\n/);
	var msg = "";
	for (let line=0; line<DB.length; line++) {
		//if (DB[line].toLowerCase() == query.key.toLowerCase())
		if (DB[line].toLowerCase().indexOf(query["key"].toLowerCase()) == 0)
			msg += ", " + DB[line];
	}
	response.end(msg.substr(2));
}

var DB =["Anna",
		"Brittany",
		"Cinderella",
		"Diana",
		"Eva",
		"Fiona",
		"Gunda",
		"Hege",
		"Inga",
		"Johanna",
		"Kitty",
		"Linda",
		"Nina",
		"Ophelia",
		"Petunia",
		"Amanda",
		"Raquel",
		"Cindy",
		"Doris",
		"Eve",
		"Evita",
		"Sunniva",
		"Tove",
		"Unni",
		"Violet",
		"Liza",
		"Elizabeth",
		"Ellen",
		"Wenche",
		"Vicky"
	];
