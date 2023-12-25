var ajax1, ajax2, clock1, clock2, btn, timer1, timer2;

function displayTime1() {
	//alert(ajax1.readyState);
	switch (ajax1.readyState) {
	case 4:
		if (ajax1.status==200) {
			clock1.textContent = ajax1.responseText;
			timer1 = setTimeout(getServerTime1, 1000);
		}
		break;
	}
}

function displayTime2() {
	switch (ajax2.readyState) {
	case 4:
		if (ajax2.status==200) {
			clock2.textContent = ajax2.responseText;
			timer2 = setTimeout(getServerTime2, 1000);
		}
		break;
	}
}

function getServerTime1() {
	ajax1.onreadystatechange = displayTime1;
	ajax1.open("GET", "/clock1", true);
	ajax1.send(null);
}

function getServerTime2() {
	ajax2.onreadystatechange = displayTime2;
	ajax2.open("GET", "/clock2", true);
	ajax2.send(null);
}

function start() {
	btn.value = "stop";
	btn.removeEventListener( "click", start );
	btn.addEventListener( "click", stop );
	getServerTime1();
	getServerTime2();
	//timer1 = setInterval(getServerTime1, 1000);
	//timer2 = setInterval(getServerTime2, 1000);
}

function stop() {
	btn.value = "start";
	btn.removeEventListener( "click", stop );
	btn.addEventListener( "click", start );
	if (timer1) clearTimeout(timer1);
	if (timer2) clearTimeout(timer2);
	//if (timer1) clearInterval(timer1);
	//if (timer2) clearInterval(timer2);
}

function init() {
	btn = document.querySelector("input");
	btn.addEventListener( "click", start );
	if (!ajax1) ajax1 = new XMLHttpRequest();
	if (!ajax2) ajax2 = new XMLHttpRequest();
	clock1 = document.getElementById("clock1");
	clock2 = document.getElementById("clock2");
}

window.addEventListener("load", init);
