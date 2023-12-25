//document.getElementById("key").addEventListener("keyup", hintHandler);
document.getElementById("key").addEventListener("keyup", function(){
	var key = this.value;
	if (key.length==0) {
		document.getElementById("txtHint").innerHTML="";
	} else {
		let url="http://140.113.43.29/hint/nameDB.php?key="+key; 
		fetch(url,{method:'get'}).then(function(response){
			return response.text();
		}).then(function(data){
			document.getElementById("txtHint").textContent=data;
		});
	}
});

let ajax;
function hintHandler(e) {
	e = e || window.event;
	let key = this.value;
	if (key.length==0) {
		document.getElementById("txtHint").innerHTML="";
	} else {
		ajax = new XMLHttpRequest();
		if (ajax)	{
			ajax.onreadystatechange = stateChanged;
			let url="http://140.113.43.29/hint/nameDB.php"; 
			//var url="/nameFromFile"; // e.g. /name | /nameFromFile
			let qs="key="+key; 
			// via GET, e.g. url='xxx?key=Evi'
			//ajax.open("GET",url+"?"+qs,true); 
			//ajax.send(null);
			// via POST
			ajax.open("POST", url, true);
			ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			ajax.send(qs);
		} else { // ==null
			alert ("Your browser does not support XMLHTTP!");
		}
	}
}

function stateChanged() {
	if (ajax.readyState==4) {
		if (ajax.status==200) {
			document.getElementById("txtHint").textContent
			= this.responseText;
			//=JSON.parse(this.responseText).join("+");
		}
	}
}