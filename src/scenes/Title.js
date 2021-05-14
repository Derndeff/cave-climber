import { Scene, Color, OrthographicCamera, Vector3, Box3, Mesh, MeshPhongMaterial, AmbientLight } from 'three';
import { FontLoader, TextGeometry, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { TileData, SceneManager, Keyboard } from 'classes';
import { Player } from 'objects';
import { SimpleFont } from 'fonts';
// import { Snowflake } from 'images';


class Title extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.tileWidth = 10;
        this.tileHeight = 10;

        // Set up camera. Camera is tied to the scene itself so we can have different
        // levels of different sizes or custom camera code
        this.camera = new OrthographicCamera();

        this.camera.position.set(5, -5, 10);
        this.camera.lookAt(new Vector3(5, -5, 0));
        this.camera.near = 1;
        this.camera.far = 100;

        // Resize Handler... we must update the camera when the window is resized
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            const ratio = innerWidth / innerHeight;
            SceneManager.renderer.setSize(innerWidth, innerHeight);
            this.camera.left = -5;
            this.camera.right = 5;
            this.camera.top = 5/ratio;
            this.camera.bottom = -5/ratio;
            this.camera.updateProjectionMatrix();
        };

        // List of object to update each scene update
        this.updateList = [];

        // Set background to a nice color. cool i guess
        this.background = new Color(0x2e003a);

        const light = new AmbientLight(0xffffff);
        this.add(light);

        this.createTextBox(SimpleFont, "Cave Climber", 1, new Vector3(1, -4, 0));
        this.createTextBox(SimpleFont, "CONTROLS", 0.25, new Vector3(1, -5, 0));
        this.createTextBox(SimpleFont, "Move - ArrowRight and ArrowLeft", 0.25, new Vector3(1, -5.5, 0));
        this.createTextBox(SimpleFont, "Jump - ArrowUp or Space", 0.25, new Vector3(1, -6, 0));
        this.createTextBox(SimpleFont, "Wall Slide - ArrowRight and ArrowLeft into wall", 0.25, new Vector3(1, -6.5, 0));
        this.createTextBox(SimpleFont, "Wall Jump - ArrowUp or Space while on wall", 0.25, new Vector3(1, -7, 0));
        this.createTextBox(SimpleFont, "PRESS SPACE TO BEGIN", 0.25, new Vector3(3.3, -8, 0));
    }

    createTextBox(fontUrl, text, size, position) {
      const loader = new FontLoader();
      loader.load(
        fontUrl,
        function(font) {
        	const geometry = new TextGeometry(
            text,
            {
        		font: font,
        		size: size,
        		height: 1
        	  }
          );

          const mesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
          mesh.position.set(position.x, position.y, position.z);
          mesh.scale.set(1, 1, 1);
          SceneManager.scenes[0].add(mesh);

        }
      );
    }

    // return the integer tile type at an unrounded position
    getTileAt(x, y) {
      const roundX = Math.floor(x);
      const roundY = Math.floor(-y);
      if (roundX < 0 || roundX >= this.tileWidth || roundY < 0 || roundY >= this.tileHeight) {
        return -1;
      }
      else {
        return this.tiles[roundY][roundX];
      }
    }

    setTileAt(x, y, val) {
      const roundX = Math.floor(x);
      const roundY = Math.floor(-y);
      if (roundX < 0 || roundX >= this.tileWidth || roundY < 0 || roundY >= this.tileHeight) {
        return -1;
      }
      else {
        this.tiles[roundY][roundX] = val
        return this.tiles[roundY][roundX];
      }
    }

    // given unrounded position and a bounding box, return the overlap between
    // the tile at the position
    overlapTile(x, y, boundingBox) {
      let tileBox = new Box3(
        new Vector3(Math.floor(x), Math.floor(y), 0),
        new Vector3(Math.ceil(x), Math.ceil(y), 0)
      );
      tileBox.min.x = Math.max(tileBox.min.x, boundingBox.min.x);
      tileBox.min.y = Math.max(tileBox.min.y, boundingBox.min.y);
      tileBox.max.x = Math.min(tileBox.max.x, boundingBox.max.x);
      tileBox.max.y = Math.min(tileBox.max.y, boundingBox.max.y);
      return tileBox;
    }

    // The scene has a list of objects it updates every scene update. Add to list
    addToUpdateList(object) {
        this.updateList.push(object);
    }

    // find the object in the update list, remove it so it no longer gets updated
    removeFromUpdateList(object) {
      const index = this.updateList.indexOf(object);
      if (index > -1) {
        this.updateList.splice(index, 1);
      }
    }

    // scene update function... find each object in the scene and update it
    update(time) {
        // Call update for each object in the updateList
        for (const obj of this.updateList) {
            obj.update(time);
        }

        if (Keyboard.Space) {
          SceneManager.switchScene(1);
        }
    }

    // Called when the scene is loaded in. We want to link event listeners, but
    // we may want to do other stuff later
    load() {
      this.windowResizeHandler();
      window.addEventListener('resize', this.windowResizeHandler, false);
    }

    // Called when a different scene is switched to. Unlinks event listeners,
    // but should also clean up the scene so that it is fresh the next time
    // it's loaded in. Think of it like "destroy()"
    unload() {
      window.removeEventListener('resize', this.windowResizeHandler, false);
      // this.player.destroy();
    }

}

export default Title;
