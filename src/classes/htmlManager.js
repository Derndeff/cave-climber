import { Vector3 } from 'three';


var timedistHTML = "\
<span id=timedist style='position: absolute; top: "+Math.floor(window.innerWidth/2)+"px; left: "+55+"px; display: inline;'>\
	<h1 style='color: silver; font-size: 20px;'>Time:&nbsp<span id=time></span></h1>\
    <h1 style='color: silver; font-size: 20px; position: relative; top: "+(-36.5)+"px; left: "+Math.floor(window.innerWidth/3)+"px;'>Deaths:&nbsp<span id=death></span></h1>\
    <h1 style='color: silver; font-size: 20px; position: relative; top: "+(-72)+"px; left: "+Math.floor(window.innerWidth/1.7)+"px;'>Chests:&nbsp<span id=chest></span></h1>\
    </span>\
";


// shows "START!" once the round starts
const timeHTML = () => {
	let elem = document.createElement("SPAN");
	elem.innerHTML = timedistHTML;
	document.body.appendChild(elem);
}

function frontPad(num, l) {
	let newNum = '' + num;
	let len = l - newNum.length;
	if (len < l) {
		for (let i = 0; i < len; i++) {
			newNum = '0' + newNum;
		}
	}
	return newNum;
}

function backPad(num, l) {
	let newNum = '' + num;
	let len = l - newNum.length;
	if (len < l) {
		for (let i = 0; i < len; i++) {
			newNum = newNum + '0';
		}
	}
	return newNum;
}

function handleResizeHTML() {
	let td = document.getElementById('timedist');
	td.style.left = (window.innerWidth - window.innerWidth/1.2) + 'px';
	td.style.top = '0px';
}


function timeToString(time, startTime) {
	let totTime = (time - startTime);
	let seconds = Math.floor(totTime / 1000) % 60;
	let minutes = (Math.floor(totTime / 1000) - seconds) / 60;
	//console.log('millis:', totTime / 1000 - Math.floor(totTime / 1000));
	let milliseconds = '' + Math.floor((totTime / 1000 - Math.floor(totTime / 1000)) * 1000);
	return minutes + ':' + frontPad(seconds, 2) + '.' + backPad(milliseconds.substring(0, 4), 3);
}


export {timeHTML, timeToString, handleResizeHTML};