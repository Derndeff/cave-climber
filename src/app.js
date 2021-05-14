/**
 * app.js
 *
 * This is the first file loaded. It initializes the SceneSelector,
 * which handles scene loading and running the current scene.
 *
 */
import { SceneManager, AudioManager, Keyboard } from 'classes';
import { timeHTML, timeToString, handleResizeHTML } from './classes/htmlManager.js'



// Initialize scene manager
SceneManager.initialize();
AudioManager.initialize();

timeHTML();
window.addEventListener('resize', handleResizeHTML(), false);

// Not sure what these options are lol, they came in the starter code -Raiden
// Set up renderer, canvas, and minor CSS adjustments
SceneManager.renderer.setPixelRatio(window.devicePixelRatio);
const canvas = SceneManager.renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);


document.getElementById('death').innerHTML = String(0)
document.getElementById('chest').innerHTML = String(0)

console.log(window.innerWidth, window.innerHeight)

let startTime = undefined;

// Main loop. Run the current scene specified by the SceneManager
const gameLoop = (time) => {
  if (startTime === undefined && SceneManager.currentScene !== SceneManager.scenes[0])
    startTime = time;
  else if (startTime !== undefined) {
    document.getElementById('time').innerHTML = timeToString(time, startTime);
  }

  time /= 1000;

  SceneManager.runScene(time);
  AudioManager.update(time);


  window.requestAnimationFrame(gameLoop);
};
window.requestAnimationFrame(gameLoop);



// Keyboard input events... update the Keyboard object based on input events
const onKeyDown = (event) => {
  if (event.key == "ArrowRight") {
    Keyboard.ArrowRight = true;
  }
  else if (event.key == "ArrowLeft") {
    Keyboard.ArrowLeft = true;
  }
  else if (event.key == "ArrowUp") {
    Keyboard.ArrowUp = true;
  }
  else if (event.key == " ") {
    Keyboard.Space = true;
  }
  else if (event.key == "z") {
    Keyboard.z = true;
  }
}
window.addEventListener('keydown', onKeyDown);

const onKeyUp = (event) => {
  if (event.key == "ArrowRight") {
    Keyboard.ArrowRight = false;
  }
  else if (event.key == "ArrowLeft") {
    Keyboard.ArrowLeft = false;
  }
  else if (event.key == "ArrowUp") {
    Keyboard.ArrowUp = false;
  }
  else if (event.key == " ") {
    Keyboard.Space = false;
  }
  else if (event.key == "z") {
    Keyboard.z = false;
  }
}
window.addEventListener('keyup', onKeyUp);

/*
var timedistHTML = "\
<span id=timedist style='position: absolute; top: "+80+"px; left: "+55+"px; display: block;'>\
	<h1 style='color: silver; font-size: 30px;'>Time:&nbsp<span id=time></span></h1>\
	<h1 style='color: silver; font-size: 30px; position: relative; top: "+(-25)+"px;'>Distance:&nbsp<span id=dist></span></h1>\
</span>\
";

//timedistHTML();

*/

/*
let elem = document.createElement("SPAN");
elem.innerHTML = timedistHTML;
document.body.appendChild(elem);
*/
/*
const timeAndDistHTML = () => {
  console.log(document);
	let elem = document.createElement("SPAN");
	elem.innerHTML = timedistHTML;
	document.body.appendChild(elem);
}

timeAndDistHTML();

*/
