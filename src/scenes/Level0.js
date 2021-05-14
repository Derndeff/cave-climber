import { Scene, Color, OrthographicCamera, Vector3, Box3, AmbientLight, FontLoader, TextGeometry, Mesh, MeshPhongMaterial } from 'three';
import { TextureLoader, SpriteMaterial, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { TileData, SceneManager } from 'classes';
import { Player } from 'objects';
import { SimpleFont } from 'fonts';
// import { Snowflake } from 'images';


class Level0 extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.time = undefined;

        this.tileWidth = 36;
        this.tileHeight = 15;

        // Set up camera. Camera is tied to the scene itself so we can have different
        // levels of different sizes or custom camera code
        this.camera = new OrthographicCamera();

        this.camera.position.set(0.5*this.tileWidth, -0.5*this.tileHeight, 10);
        this.camera.lookAt(new Vector3(0.5*this.tileWidth, -0.5*this.tileHeight, 0));
        this.camera.near = 1;
        this.camera.far = 100;

        this.topLeft = new Vector3();

        // Resize Handler... we must update the camera when the window is resized
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            const ratio = innerWidth / innerHeight;
            SceneManager.renderer.setSize(innerWidth, innerHeight);
            this.camera.left = -0.5*this.tileWidth;
            this.camera.right = 0.5*this.tileWidth;
            this.camera.top = 0.5*this.tileWidth/ratio;
            this.camera.bottom = -0.5*this.tileWidth/ratio;
            this.camera.updateProjectionMatrix();
            this.topLeft = this.camera.position.clone().add(new Vector3(this.camera.left, this.camera.top, 0));
            this.repositionDeathCount(this.topLeft);
        };

        // List of object to update each scene update
        this.updateList = [];

        // Set background to a nice color. cool i guess
        this.background = new Color(0x000000);

        // we should probably just keep a list of objects, but for now store
        // the player
        this.player = undefined;

        this.tiles =[
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
        ];

        // Create level map
        this.createLevelMap();

        // Load in player at position 10, 10. Player constructor handles everything
        this.player = new Player(this);
        this.player.position.set(2, -13, 2);

        const light = new AmbientLight(0xffffff);
        this.add(light);

        this.deathCountMesh = undefined;
        this.deathCountText = undefined;

    }

    createDeathCount(fontUrl, text, size, position) {
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
          SceneManager.currentScene.add(mesh);
          SceneManager.currentScene.deathCountMesh = mesh;
          SceneManager.currentScene.deathCountText = geometry;
        }
      );
    }

    repositionDeathCount(position) {
      if (this.deathCountMesh !== undefined) {
        this.deathCountMesh.position.set(position.x, position.y, position.z);
      }
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

    // generates sprites for each tile specified by the map of the level
    createLevelMap() {
      for (let i = 0; i < this.tiles.length; i++) {
        for (let j = 0; j < this.tiles[0].length; j++) {
          // grab the material for the given tile using the TileData class (very easy)
          const sprite = new Sprite(TileData.getMaterial(this.tiles[i][j]));
          sprite.name = String(i) + ' ' + String(j);
          const setFront = TileData.getCollisionType(this.tiles[i][j])
          // tile position is negative in the y-axis... we may want to change
          // this early on, but for now it makes it so that the level matches the
          // array specified by "tiles"
          if (setFront > 0) {
            sprite.position.set(j + 0.5, -i - 0.5, 0.5);
          }
          else {
            sprite.position.set(j + 0.5, -i - 0.5, 0);
          }
          this.add(sprite);
        }
      }
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
        this.time = time;

        if (this.player.position.x > 35.5) {
          this.player.position.x = 35;
          SceneManager.switchScene(2);
        }

        if (this.deathCountText !== undefined) {
          this.deathCountText.dispose();
          this.remove(this.deathCountMesh);
          this.createDeathCount(SimpleFont, "Deaths: " + time, 0.5, new Vector3(0, 0, 0));
        }
    }

    // Called when the scene is loaded in. We want to link event listeners, but
    // we may want to do other stuff later
    load() {
      this.windowResizeHandler();
      window.addEventListener('resize', this.windowResizeHandler, false);
      this.createDeathCount(SimpleFont, "Deaths: ", 0.5, new Vector3(0, 0, 0));
    }

    // Called when a different scene is switched to. Unlinks event listeners,
    // but should also clean up the scene so that it is fresh the next time
    // it's loaded in. Think of it like "destroy()"
    unload() {
      window.removeEventListener('resize', this.windowResizeHandler, false);
      // this.player.destroy();
    }

}

export default Level0;
