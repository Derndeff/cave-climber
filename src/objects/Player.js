import { Group, Vector3, Box3 } from 'three';
import { TextureLoader, SpriteMaterial, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { TileData, Keyboard } from 'classes';



class Player extends Group {

  constructor(parent) {

    super();

    this.scene = parent;

    // physical bounding box of player
    this.boundingBox = new Box3(
      new Vector3(-0.4, -1, 0),
      new Vector3(0.3, 0.4, 0)
    );

    // where to sample tiles for collision detection, relative to center of player
    this.bottomChecks = [
      new Vector3(-0.4, -1, 0),
      new Vector3(0.3, -1, 0)
    ];
    this.topChecks = [
      new Vector3(-0.4, 0.4, 0),
      new Vector3(0.3, 0.4, 0)
    ];
    this.rightChecks = [
      new Vector3(0.3, -1, 0),
      new Vector3(0.3, 0, 0),
      new Vector3(0.3, 0.4, 0)
    ];
    this.leftChecks = [
      new Vector3(-0.4, -1, 0),
      new Vector3(-0.4, 0, 0),
      new Vector3(-0.4, 0.4, 0)
    ];

    // physical states of character
    this.grounded = false;
    this.rightWall = false;
    this.leftWall = false;

    // if jump button was active last frame
    this.prevJump = false;

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

  collide() {
    //let minScore = 10;
    let newPos = this.position.clone();
    let groundedCheck = false;
    let rightWallCheck = false;
    let leftWallCheck = false;

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
          groundedCheck = true;
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
          rightWallCheck = true;
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
          leftWallCheck = true;
          newPos.x += overlapX;
          break;
        }
      }
    }

    this.position.set(newPos.x, newPos.y, newPos.z);
    this.grounded = groundedCheck;
    this.rightWall = rightWallCheck;
    this.leftWall = leftWallCheck;
  }

  // Player update code
  update(time) {
    // temporary animation
    if (time - this.frameLastUpdated > (1.0/this.animationFrameRate)) {
      this.currentFrame = (this.currentFrame + 1) % this.numFrames;
      this.setTextureOffset(this.currentFrame, 1);
      this.frameLastUpdated += 1.0/this.animationFrameRate;
    }

    // update physics
    // this.velocity.y += -9.81*(1/60);
    this.velocity.y = Math.max(this.velocity.y-30*(1/60), -15);

    // update keyboard control
    if (Keyboard.ArrowRight) {
      if (!this.rightWall) {
        this.velocity.x = Math.min(this.velocity.x + 0.5, 5.0);
      }
    }
    else if (Keyboard.ArrowLeft) {
      if (!this.leftWall) {
        this.velocity.x = Math.max(this.velocity.x - 0.5, -5.0);
      }
    }
    else {
      this.velocity.x /= 1.2;
    }

    if (Keyboard.Space || Keyboard.ArrowUp) {
      if (!this.prevJump) {
        if (this.grounded) {
          this.velocity.y = 15.0;
        }
        else if (this.rightWall) {
          this.velocity.x = -10.0;
          this.velocity.y = 10.0;
        }
        else if (this.leftWall) {
          this.velocity.x = 10.0;
          this.velocity.y = 10.0;
        }
      }
      this.prevJump = true;
    }
    else {
      this.prevJump = false;
    }
    if (Keyboard.z) {
      this.position.x += this.velocity.x / 10;
    }


    // save start position so we can compare final position after velocity, collisions
    const startPos = this.position.clone();

    // update position based on physics
    this.position.add(this.velocity.clone().multiplyScalar(1/60));

    // if intersecting tiles, don't
    this.collide();

    // compare final position with collisions to the starting position to find true velocity
    const realPos = this.position.clone();
    const realVelocity = realPos.sub(startPos).multiplyScalar(60);

    // if real velocity is smaller than intended velocity, keep the real velocity
    // (if the player bumps their head and stops, the vertical velocity will now be 0)
    if (Math.abs(this.velocity.x) > Math.abs(realVelocity.x)) {
      this.velocity.x = realVelocity.x;
    }
    if (Math.abs(this.velocity.y) > Math.abs(realVelocity.y)) {
      this.velocity.y = realVelocity.y;
    }

    /*
    let newpos = this.position.clone().add((this.velocity.clone().multiplyScalar(1/60)));
    let newtile = this.scene.tiles[-Math.floor(newpos.y)][Math.floor(newpos.x)];
    let currtile = this.scene.tiles[-Math.floor(this.position.y)][Math.floor(this.position.x)];

    if (newtile == 0) {
      this.position.add(this.velocity.clone().multiplyScalar(1/60));
    }
    else if (currtile == newtile) {
      this.position.x += this.velocity.x * (1/60);
      this.velocity.y = 0
    }
    else {
      this.velocity.y = 0;
    }
    */

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
