import { Group, Vector3 } from 'three';
import { TextureLoader, SpriteMaterial, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { Keyboard } from 'classes';



class Player extends Group {

  constructor(parent) {

    super();

    this.scene = parent;

    this.texture = this.createTexture();
    this.material = new SpriteMaterial({map: this.texture});
    this.sprite = new Sprite(this.material);
    this.sprite.scale.set(3, 3, 1);
    this.setTextureOffset(0, 1);

    this.add(this.sprite);
    this.scene.addToUpdateList(this);
    this.scene.add(this);

    this.animationFrameRate = 12;
    this.frameLastUpdated = 0;
    this.numFrames = 8;
    this.currentFrame = 0;

    this.velocity = new Vector3(0, 0, 0);
  }

  // create THREE texture that samples a small portion of a tilemap
  createTexture() {
    const tilesHoriz = 16;
    const tilesVert = 16;

    const eps = 0;

    const texture = new TextureLoader().load("./src/images/character.png");
    texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1/tilesHoriz - (eps/tilesHoriz), 1.0/tilesVert - (eps/tilesVert));

    return texture;
  }

  // update offset used by texture to specify a tile from a tilemap
  setTextureOffset(offsetX, offsetY) {
    const tilesHoriz = 16;
    const tilesVert = 16;

    const eps = 0.03;

    this.texture.offset.x = offsetX/tilesHoriz + 0.5*eps/tilesHoriz;
    this.texture.offset.y = (tilesVert-1 - offsetY)/tilesVert  + 0.5*eps/tilesVert;
  }

  // Player update code
  update(time) {
    if (time - this.frameLastUpdated > (1.0/this.animationFrameRate)) {
      this.currentFrame = (this.currentFrame + 1) % this.numFrames;
      this.setTextureOffset(this.currentFrame, 1);
      this.frameLastUpdated += 1.0/this.animationFrameRate;
    }

    // update physics
    this.velocity.y += -9.81*(1/60);

    // update keyboard control
    if (Keyboard.ArrowRight) {
      this.velocity.x = 5.0;
    }
    else if (Keyboard.ArrowLeft) {
      this.velocity.x = -5.0;
    }
    else {
      this.velocity.x = 0.0;
    }

    if (Keyboard.Space) {
      this.velocity.y = 10.0;
    }

    // update position based on physics
    this.position.add(this.velocity.clone().multiplyScalar(1/60));
  }

  // destroy the player by unloading texture, material, sprite, and then removing from its scene
  destroy() {
    this.texture.dispose();
    this.material.dispose();
    this.remove(this.sprite);
    this.scene.removeFromUpdateList(this);
    this.scene.remove(this);
  }

}

export default Player;
