

// Singleton keyboard class that tracks which keys are currently pressed. Keys
// are updated in app.js through event listeners
class Keyboard {

  constructor() {
    this.ArrowRight = false;
    this.ArrowLeft = false;
    this.ArrowUp = false;
    this.Space = false;
    this.z = false
  }

}

// Singleton pattern in modern JS
const instance = new Keyboard();

export default instance;
