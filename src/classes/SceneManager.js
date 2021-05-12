import { WebGLRenderer } from 'three';
import { Level0, Level1 } from 'scenes';


// This singleton class manages loading and unloading different levels. This
// should allow us to very cleanly add new levels, load and unload them without trouble
class SceneManager {

  // declare variables, but DONT store them yet. This constructor is called very early,
  // so Level0 and Level1 don't even exist yet. Instead, call initializeSceneSelector()
  // to initialize its variables.
  constructor() {
    this.scenes = [];
    this.currentScene = undefined;
    this.renderer = undefined;
  }

  // intialized the class's variables
  initializeSceneSelector() {

    this.renderer = new WebGLRenderer({ antialias: true });

    this.scenes[0] = new Level0();
    this.scenes[1] = new Level1();

    this.currentScene = this.scenes[0];
    this.currentScene.load();

  }

  // renders and updates the current scene
  runScene(time) {
    this.renderer.render(this.currentScene, this.currentScene.camera);
    this.currentScene.update(time);
  }

  // switches from a previous scene to a new one
  switchScene(sceneNumber) {
    this.currentScene.unload();
    this.currentScene = this.scenes[sceneNumber];
    this.currentScene.load();
  }
  // reloads current scene
  reloadScene(sceneNumber) {
    this.currentScene.unload();
    this.scenes[0] = new Level0();
    this.scenes[1] = new Level1();
    // this.scenes[sceneNumber] = new this.scenes[sceneNumber];
    this.currentScene = this.scenes[sceneNumber];
    this.currentScene.load();
  }

}

// Singleton pattern in modern JS
const instance = new SceneManager();

export default instance;
