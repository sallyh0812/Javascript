
// 接收函數，負責接收伺服器回傳的資料並顯示在網頁上
var counter = 0;
function loadTime() {
	if (this.status==200) {
		result.textContent = "server time: " + this.responseText;
		timer = setTimeout(getServerTime, 2000);
	}
	msg.textContent = "response status: " + this.status + " " + this.statusText;
}

function readyTime() {
	switch (this.readyState) {
	case 0: msg.textContent = "create ajax ..."; break;
	case 1: msg.textContent = (++counter) + ": 1. open (connecting) ..."; break;
	case 2: msg.textContent += "2. send ajax request..."; break;
	case 3:	msg.textContent += "3. receiving response..."; break;
	case 4:
		msg.textContent += "4. display";
		if (this.status==200) {
			result.textContent = "server time: " + this.responseText;
			timer = setTimeout(getServerTime, 2000);
		}
		msg.textContent += ", response status: " + this.status + " " + this.statusText;
		break;
	}
}

// 用戶端的發送函數，負責設定 AJAX 物件並送出 request
function getServerTime() {
	ajax.onload = loadTime; // 設定接收伺服器資料的接收函數
	//ajax.onreadystatechange = readyTime; // 設定接收伺服器資料的接收函數
	ajax.open("GET", "http://140.113.43.29/ajax/timeServer.php", true);
	//ajax.open("GET", "/clock", true); // 設定 ajax 物件的參數
	ajax.send(null);	// 送出 ajax request 
}

// define button click event handler
function start() {
	btn.value = "停止顯示伺服器的時間(by AJAX)";
	if (window.addEventListener) {
		btn.removeEventListener( "click", start );
		btn.addEventListener( "click", stop );
	} else if (window.attachEvent) {
		btn.attachEvent("onclick", start);
		btn.detachEvent("onclick", stop);
	} else {
		btn.onclick = stop;
	}
	if (!ajax) ajax = new XMLHttpRequest(); // createXHR();
	if (ajax) getServerTime();
	else { msg.textContent = "您的瀏覽器不支援 XMLHttpRequest！"; }
	// .....
}

function stop() {
	btn.value = "開始顯示伺服器的時間(by AJAX)";
	if (window.addEventListener) {
		btn.removeEventListener( "click", stop );
		btn.addEventListener( "click", start );
	} else if (window.attachEvent) {
		btn.attachEvent("onclick", stop);
		btn.detachEvent("onclick", start);
	} else {
		btn.onclick = start;
	}
	if (timer) clearTimeout(timer);
}

function init() {
	result = document.getElementById("showResult"); 
	msg = document.getElementById("status"); 
	btn = document.querySelector("input"); // return first <input>
	stop();
}

var ajax, result, msg, btn, timer;
if (window.addEventListener) {
	window.addEventListener("load", init);
} else if (window.attachEvent) {
	window.attachEvent("onload", init);
} else {
	window.onload = init;
}

/*
function createXHR() {
	// 依據不同的瀏覽器，取得 XMLHttpRequest 物件
	if (window.XMLHttpRequest) {
		// code for Firefox, Chrome, Opera, Safari
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			// code for IE6, IE5
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	return null;
}
*/
