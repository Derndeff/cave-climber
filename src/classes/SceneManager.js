import { WebGLRenderer,  Points, PointsMaterial, Geometry, Clock, AdditiveBlending, Vector3, TextureLoader } from 'three';
import { Level0, Level1 } from 'scenes';
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
    this.particleManage = undefined;
  }

  // intialized the class's variables
  initializeSceneSelector() {

    this.renderer = new WebGLRenderer({ antialias: true });

    this.scenes[0] = new Level0();
    this.scenes[1] = new Level1();

    this.currentScene = this.scenes[0];
    this.currentScene.load();

    this.snowManager = new ParticleManager();
    this.snowSystem = this.snowManager.createSnow(this.currentScene);
    this.currentScene.add(this.snowSystem);

  }

  // renders and updates the current scene
  runScene(time) {
    this.renderer.render(this.currentScene, this.currentScene.camera);
    this.snowManager.animateSnow(this.snowSystem, this.currentScene);

    for (let i = this.currentScene.player.particleManager.systems.length - 1; i >= 0; i--) {
      let curr_system = this.currentScene.player.particleManager.systems[i];
      if (!this.currentScene.getObjectByName(curr_system.name)) {
        this.currentScene.add(curr_system);
      }
      // console.log(curr_system.geometry.vertices)

      // debugger;
      if (curr_system.clock.getElapsedTime() > 2) {
        console.log(curr_system.clock.getElapsedTime(), this.currentScene.player.position, curr_system.geometry.vertices);
        this.currentScene.remove(curr_system);
        this.currentScene.player.particleManager.systems.splice(i, 1);
      }
      else{
        // console.log(this.currentScene.player.particleManager.systems.length);
        this.currentScene.player.particleManager.animateDust(curr_system, curr_system.direction);
      }
    }
    this.currentScene.update(time);
  }

  // switches from a previous scene to a new one
  switchScene(sceneNumber) {
    this.currentScene.unload();
    this.currentScene = this.scenes[sceneNumber];
    this.currentScene.load();
    this.snowSystem = this.snowManager.createSnow(this.currentScene);
    this.currentScene.add(this.snowSystem);
  }

  // createParticleSystem() {
	
  //   // The number of particles in a particle system is not easily changed.
  //     var particleCount = 50;
      
  //     // Particles are just individual vertices in a geometry
  //     // Create the geometry that will hold all of the vertices
  //     var particles = new Geometry();
  
  //   // Create the vertices and add them to the particles geometry
  //   for (var p = 0; p < particleCount; p++) {
    
  //     // This will create all the vertices in a range of -200 to 200 in all directions
  //     // console.log(innerHeight, innerWidth)
  //     // debugger;
  //     var x = Math.random() * this.currentScene.tileWidth;
  //     var y = Math.random() * this.currentScene.tileHeight * -1;
  //     var z = 0.1;
            
  //     // Create the vertex
  //     var particle = new Vector3(x, y, z);
      
  //     // Add the vertex to the geometry
  //     particles.vertices.push(particle);
  //   }
  
  //   // Create the material that will be used to render each vertex of the geometry
  //   var particleMaterial = new PointsMaterial(
  //       {color: 0xffffff, 
  //        size: 1.5,
  //       //  map: new TextureLoader().load(Snowflake),
  //        blending: AdditiveBlending,
  //        transparent: true,
  //       });
     
  //   // Create the particle system
  //   this.particleSystem = new Points(particles, particleMaterial);
  
  //   return this.particleSystem;	
  // }

  // animateParticles() {
  //   var verts = this.particleSystem.geometry.vertices;
  //   for(var i = 0; i < verts.length; i++) {
  //     var vert = verts[i];
  //     if (vert.y < -this.currentScene.tileHeight + 0.2) {
  //       vert.y = -0.1;
  //       vert.x = Math.random() * this.currentScene.tileWidth;
  //     }
  //     vert.y = vert.y - 0.025;
  //     vert.x += (Math.random()*Math.cos(this.time* i/100) - 0.3) * 0.02
  //   }
  //   this.particleSystem.geometry.verticesNeedUpdate = true;
  //   this.particleSystem.rotation.y -= .001 * this.deltaTime;
  // }
}

// Singleton pattern in modern JS
const instance = new SceneManager();

export default instance;
