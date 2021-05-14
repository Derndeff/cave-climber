/**
 * app.js
 *
 * This is the first file loaded. It initializes the SceneSelector,
 * which handles scene loading and running the current scene.
 *
 */
import { SceneManager, AudioManager, Keyboard } from 'classes';
import { timeHTML, timeToString } from './classes/htmlManager.js'



// Initialize scene manager
SceneManager.initialize();
AudioManager.initialize();

timeHTML();

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



// Main loop. Run the current scene specified by the SceneManager
const gameLoop = (time) => {
  if (startTime == undefined)
  var startTime = 0.0;
document.getElementById('time').innerHTML = timeToString(time, startTime);

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
