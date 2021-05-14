import { WebGLRenderer,  Points, PointsMaterial, Geometry, Clock, AdditiveBlending, Vector3, TextureLoader } from 'three';
import { Title, Level0, Level1, Level2, Level3 } from 'scenes';
import { Snowflake } from 'images';
import { ParticleManager } from 'classes';


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
    this.particleSystem = undefined;
    this.particleManager = undefined;
    this.deaths = 0;
    this.chests = 0;
  }

  // intialized the class's variables
  initialize() {

    this.renderer = new WebGLRenderer({ antialias: true });

    this.scenes[0] = new Title();
    this.scenes[1] = new Level0();
    this.scenes[2] = new Level1();
    this.scenes[3] = new Level2();
    this.scenes[4] = new Level3();

    this.currentScene = this.scenes[0];
    this.currentScene.load();

    this.particleManager = new ParticleManager();
    this.snowSystem = this.particleManager.createSnow(this.currentScene);
    this.currentScene.add(this.snowSystem);
    if (this.currentScene.player != undefined) {
      this.currentScene.player.particleManager = this.particleManager;
    }

  }

  // renders and updates the current scene
  runScene(time) {
    this.renderer.render(this.currentScene, this.currentScene.camera);
    this.particleManager.animateSnow(this.snowSystem, this.currentScene);

    for (let i = this.particleManager.systems.length - 1; i >= 0; i--) {
      let curr_system = this.particleManager.systems[i];
      if (!this.currentScene.getObjectByName(curr_system.name)) {
        this.currentScene.add(curr_system);
      }
      if (curr_system.clock.getElapsedTime() > 1) {
        this.currentScene.remove(curr_system);
        this.particleManager.systems.splice(i, 1);
      }
      else{
        this.particleManager.animateDust(curr_system, curr_system.direction);
      }
    }
    this.currentScene.update(time);
  }

  // switches from a previous scene to a new one
  switchScene(sceneNumber) {
    this.currentScene.remove(this.snowSystem);
    this.currentScene.unload();
    this.currentScene = this.scenes[sceneNumber];
    this.currentScene.load();
    this.snowSystem = this.particleManager.createSnow(this.currentScene);
    this.currentScene.add(this.snowSystem);
    if (this.currentScene.player != undefined) {
      this.currentScene.player.particleManager = this.particleManager;
    }
  }
}

// Singleton pattern in modern JS
const instance = new SceneManager();

export default instance;
