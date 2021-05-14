import { Vector3 } from 'three';


var topUI = "\
<span id=topUI style='position: absolute; top: "+Math.floor(window.innerWidth/2)+"px; left: "+55+"px; display: inline;'>\
		<h1 style='color: white; font-size: 20px;'>Time:&nbsp<span id=time></span></h1>\
    <h1 style='color: white; font-size: 20px; position: relative; top: "+(-36.5)+"px; left: "+Math.floor(window.innerWidth/3)+"px;'>Deaths:&nbsp<span id=death></span></h1>\
    <h1 style='color: white; font-size: 20px; position: relative; top: "+(-72)+"px; left: "+Math.floor(window.innerWidth/1.7)+"px;'>Chests:&nbsp<span id=chest></span></h1>\
    </span>\
";


const timeHTML = () => {
	let elem = document.createElement("topUI");
	elem.innerHTML = topUI;
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
	let elem = document.getElementById('topUI');
	elem.style.left = (window.innerWidth - window.innerWidth/1.2) + 'px';
	elem.style.top = '0px';
}


function timeToString(time, startTime) {
	let elapsedTime = (time - startTime);
	let seconds = Math.floor(elapsedTime) % 60;
	let minutes = (Math.floor(elapsedTime) - seconds) / 60;

	let milliseconds = '' + Math.floor((elapsedTime - Math.floor(elapsedTime)) * 1000);
	return minutes + ':' + frontPad(seconds, 2) + '.' + backPad(milliseconds.substring(0, 4), 3);
}


export {timeHTML, timeToString, handleResizeHTML};
