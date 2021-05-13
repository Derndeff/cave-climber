import { Group, Vector3, Box3 } from 'three';
import { TextureLoader, SpriteMaterial, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { TileData, Keyboard, Animator, AudioManager } from 'classes';
import { PlayerSprites } from 'images';



class Player extends Group {

  constructor(parent) {

    super();

    this.scene = parent;

    // physical bounding box of player
    this.boundingBox = new Box3(
      new Vector3(-0.25, -0.5, 0),
      new Vector3(0.25, 1, 0)
    );

    this.centerCheck = new Vector3(0, 0);

    // where to sample tiles for collision detection, relative to center of player
    this.bottomChecks = [
      new Vector3(-0.25, -0.5, 0),
      new Vector3(0.25, -0.5, 0)
    ];
    this.topChecks = [
      new Vector3(-0.25, 1, 0),
      new Vector3(0.25, 1, 0)
    ];
    this.rightChecks = [
      new Vector3(0.25, -0.5, 0),
      new Vector3(0.25, 0, 0),
      new Vector3(0.25, 1, 0)
    ];
    this.leftChecks = [
      new Vector3(-0.25, -0.5, 0),
      new Vector3(-0.25, 0, 0),
      new Vector3(-0.25, 1, 0)
    ];

    this.groundChecks = [
      new Vector3(-0.2, -0.55, 0),
      new Vector3(0.2, -0.55, 0)
    ];
    this.rightWallChecks = [
      new Vector3(0.35, -0.4, 0),
      new Vector3(0.35, 0, 0),
      new Vector3(0.35, 0.9, 0)
    ];
    this.leftWallChecks = [
      new Vector3(-0.35, -0.4, 0),
      new Vector3(-0.35, 0, 0),
      new Vector3(-0.35, 0.9, 0)
    ];

    // physical states of character
    this.grounded = false;
    this.rightWall = false;
    this.leftWall = false;

    // if jump button was active last frame
    this.prevJump = false;
    this.jumpStartTime = 0;

    // if special interaction occurs:
    // this.repeatCollisions = true;

    this.animator = new Animator(8, 8);
    this.texture = this.animator.createTexture(PlayerSprites);
    this.animator.setAction(0); // idle
    this.animator.setFacingLeft(false);

    //this.texture = this.createTexture();
    this.material = new SpriteMaterial({map: this.texture});
    this.sprite = new Sprite(this.material);
    this.sprite.scale.set(3, 3, 1);
    //this.setTextureOffset(0, 1);

    this.setSpritePosition(false);
    this.add(this.sprite);
    this.scene.addToUpdateList(this);
    this.scene.add(this);

    this.animationFrameRate = 6;
    this.frameLastUpdated = 0;
    this.numFrames = 6;
    this.currentFrame = 0;

    this.velocity = new Vector3(0, 0, 0);
  }

  setSpritePosition(facingLeft) {
    if (!facingLeft) {
      this.sprite.position.set(0.4, -0.3, 0);
    }
    else {
      this.sprite.position.set(-0.4, -0.3, 0);
    }
  }

  // create THREE texture that samples a small portion of a tilemap
  createTexture() {
    const tilesHoriz = 8;
    const tilesVert = 8;

    const eps = 0.03;

    const texture = new TextureLoader().load(PlayerSprites);
    texture.magFilter = NearestFilter;
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(1/tilesHoriz - (eps/tilesHoriz), 1.0/tilesVert - (eps/tilesVert));

    return texture;
  }

  // update offset used by texture to specify a tile from a tilemap
  setTextureOffset(offsetX, offsetY) {
    const tilesHoriz = 8;
    const tilesVert = 8;

    const eps = 0.03;

    this.texture.offset.x = offsetX/tilesHoriz + 0.5*eps/tilesHoriz;
    this.texture.offset.y = (tilesVert-1 - offsetY)/tilesVert  + 0.5*eps/tilesVert;
  }

  collide() {
    //let minScore = 10;
    let newPos = this.position.clone();

    // ground collisions
    for (const checkOffset of this.bottomChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        const bounds = new Box3(
          this.position.clone().add(this.boundingBox.min),
          this.position.clone().add(this.boundingBox.max)
        );
        const overlap = this.scene.overlapTile(checkPos.x, checkPos.y, bounds);
        const overlapX = overlap.max.x - overlap.min.x;
        const overlapY = overlap.max.y - overlap.min.y;
        if (overlapY > 0 && overlapY < overlapX) {
          newPos.y += overlapY;
          break;
        }
      }
    }

    // ceiling collisions
    for (const checkOffset of this.topChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        const bounds = new Box3(
          this.position.clone().add(this.boundingBox.min),
          this.position.clone().add(this.boundingBox.max)
        );
        const overlap = this.scene.overlapTile(checkPos.x, checkPos.y, bounds);
        const overlapX = overlap.max.x - overlap.min.x;
        const overlapY = overlap.max.y - overlap.min.y;
        if (overlapY > 0 && overlapY < overlapX) {
          newPos.y -= overlapY;
          break;
        }
      }
    }

    // right wall collisions
    for (const checkOffset of this.rightChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        const bounds = new Box3(
          this.position.clone().add(this.boundingBox.min),
          this.position.clone().add(this.boundingBox.max)
        );
        const overlap = this.scene.overlapTile(checkPos.x, checkPos.y, bounds);
        const overlapX = overlap.max.x - overlap.min.x;
        const overlapY = overlap.max.y - overlap.min.y;
        if (overlapX > 0 && overlapX < overlapY) {
          newPos.x -= overlapX;
          break;
        }
      }
    }

    // left wall collisions
    for (const checkOffset of this.leftChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        const bounds = new Box3(
          this.position.clone().add(this.boundingBox.min),
          this.position.clone().add(this.boundingBox.max)
        );
        const overlap = this.scene.overlapTile(checkPos.x, checkPos.y, bounds);
        const overlapX = overlap.max.x - overlap.min.x;
        const overlapY = overlap.max.y - overlap.min.y;
        if (overlapX > 0 && overlapX < overlapY) {
          newPos.x += overlapX;
          break;
        }
      }
    }

    this.position.set(newPos.x, newPos.y, newPos.z);
  }

  physicsIncrement(numIncrements, deltaTime) {
    for (let i = 0; i < numIncrements; i++) {
      // save start position so we can compare final position after velocity, collisions
      const startPos = this.position.clone();
      // update position based on physics
      this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
      // if intersecting tiles, don't
      this.collide();
      // compare final position with collisions to the starting position to find true velocity
      const realPos = this.position.clone();
      const realVelocity = realPos.sub(startPos).multiplyScalar(1/deltaTime);
      // if real velocity is smaller than intended velocity, keep the real velocity
      // (if the player bumps their head and stops, the vertical velocity will now be 0)
      if (Math.abs(this.velocity.x) > Math.abs(realVelocity.x)) {
        this.velocity.x = realVelocity.x;
      }
      if (Math.abs(this.velocity.y) > Math.abs(realVelocity.y)) {
        this.velocity.y = realVelocity.y;
      }
    }
  }

  checkGround() {
    for (const checkOffset of this.groundChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        return true;
      }
    }

    return false;
  }

  checkRightWall() {
    for (const checkOffset of this.rightWallChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        return true;
      }
    }

    return false;
  }

  checkLeftWall() {
    for (const checkOffset of this.leftWallChecks) {
      const checkPos = this.position.clone().add(checkOffset);
      const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
      const collisionType = TileData.getCollisionType(tile);
      if (collisionType == 1) {
        return true;
      }
    }

    return false;
  }

  // Player update code
  update(time) {
    // update physics

    // gravity
    this.velocity.y = Math.max(this.velocity.y-60*(1/60), -20);


    let moveAccel = 1;
    if (!this.grounded) moveAccel = 0.5;

    // update keyboard control
    if (Keyboard.ArrowRight) {
      if (!this.rightWall) {
        this.velocity.x = Math.min(this.velocity.x + moveAccel, 8.0);
      }
      else if (this.velocity.y < -1) {
        this.velocity.y *= 0.88;
        AudioManager.playSound(3, 0.1, -this.velocity.y*0.02);
      }
    }
    else if (Keyboard.ArrowLeft) {
      if (!this.leftWall) {
        this.velocity.x = Math.max(this.velocity.x - moveAccel, -8.0);
      }
      else if (this.velocity.y < -1) {
        this.velocity.y *= 0.88;
        AudioManager.playSound(3, 0.1, -this.velocity.y*0.02);
      }
    }
    else if (this.grounded) {
      this.velocity.x *= 0.7;
    }

    if (Keyboard.Space || Keyboard.ArrowUp) {
      if (!this.prevJump) {
        this.jumpStartTime = time;
        if (this.grounded) {
          this.velocity.y = 20.0;
          AudioManager.playSound(5, 1, 0.8);
        }
        else if (this.rightWall) {
          this.velocity.x = -10.0;
          this.velocity.y = 15.0;
          AudioManager.playSound(2, 1, 0.6);
        }
        else if (this.leftWall) {
          this.velocity.x = 10.0;
          this.velocity.y = 15.0;
          AudioManager.playSound(2, 1, 0.6);
        }
      }
      this.prevJump = true;
    }
    else {
      const jumpDuration = time - this.jumpStartTime;
      this.prevJump = false;
      if (jumpDuration < 0.3 && this.velocity.y > 0) {
        this.velocity.y -= (0.3 - jumpDuration)*10;
      }
    }
    if (Keyboard.z) {
      this.position.x += this.velocity.x / 10;
    }
    this.physicsIncrement(5, 1/(5*60));

    this.grounded = this.checkGround();
    this.rightWall = this.checkRightWall();
    this.leftWall = this.checkLeftWall();

    // check for spikes, chests, other special tiles
    const checkPos = this.position.clone().add(this.centerCheck);
    const tile = this.scene.getTileAt(checkPos.x, checkPos.y);
    const spikeType = TileData.getSpikeType(tile);
    const chestType = TileData.getChestType(tile);
    if (chestType != 0) {
      const sprite = new Sprite(TileData.getMaterial(6));
      const spriteName = String(Math.floor(-checkPos.y)) + ' ' + String(Math.floor(checkPos.x));
      sprite.position.set(Math.floor(checkPos.x) + 0.5, Math.floor(checkPos.y) + 0.5, 0);
      var object = this.scene.getObjectByName(spriteName);

      this.scene.remove(object);
      sprite.name = spriteName;
      this.scene.add(sprite);
      this.scene.setTileAt(checkPos.x, checkPos.y, 6)
    }
    if (spikeType != 0) {
      AudioManager.playSound(1, 1, 0.75);
      this.position.set(2, -13, 2);
      return;
    }


    // animate character

    // facing left?
    if (this.velocity.x < -0.1) {
      this.setSpritePosition(true);
      this.animator.setFacingLeft(true);
    }
    else if (this.velocity.x > 0.1) {
      this.setSpritePosition(false);
      this.animator.setFacingLeft(false);
    }

    if (this.grounded) {
      if (Math.abs(this.velocity.x) > 0.1) {
        this.animator.setAction(1); // run
        AudioManager.playSound(0, 0.1, Math.abs(this.velocity.x)*0.03); // play run sound
      }
      else this.animator.setAction(0); // idle
    }
    else {
      if (!this.rightWall && !this.leftWall) {
        if (this.velocity.y > 0) this.animator.setAction(2); // jump
        else this.animator.setAction(3); // fall
      }
      else {
        if (this.rightWall) {
          this.setSpritePosition(true);
          this.animator.setFacingLeft(true);
          this.animator.setAction(4);
        }
        else {
          this.setSpritePosition(false);
          this.animator.setFacingLeft(false);
          this.animator.setAction(4);
        }
      }
      if (this.velocity.y < 0) {
        AudioManager.playSound(4, 0.1, Math.abs(this.velocity.y)*0.005);
      }

    }


    this.animator.play(time);

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
