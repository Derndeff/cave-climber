import { Group, Vector3, Box3 } from 'three';
import { TextureLoader, SpriteMaterial, Sprite, RepeatWrapping, NearestFilter } from 'three';
import { TileData, Keyboard } from 'classes';
import { PlayerSprites } from 'images';

class Animator {

  constructor(tilesHoriz, tilesVert) {
    this.texture = undefined;
    this.tilesHoriz = tilesHoriz;
    this.tilesVert = tilesVert;
    this.eps = 0.03;

    // number of frames in an action
    this.actionFrames = new Map();
    this.actionFrames.set(0, 4); // idle
    this.actionFrames.set(1, 6); // run
    this.actionFrames.set(2, 4); // jump
    this.actionFrames.set(3, 2); // fall
    this.actionFrames.set(4, 2); // wall slide

    // speed of action
    this.actionFramerates = new Map();
    this.actionFramerates.set(0, 2);
    this.actionFramerates.set(1, 12);
    this.actionFramerates.set(2, 18);
    this.actionFramerates.set(3, 12);
    this.actionFramerates.set(4, 12);

    // whether or not the action animaion loops
    this.actionLoop = new Map();
    this.actionLoop.set(0, true);
    this.actionLoop.set(1, true);
    this.actionLoop.set(2, false);
    this.actionLoop.set(3, true);
    this.actionLoop.set(4, true);

    this.numFrames = -1;
    this.currentAction = -1;
    this.currentFrame = -1;
    this.currentFramerate = -1;
    this.lastUpdateTime = -1;
    this.facingLeft = false;
    this.loop = false;
  }

  createTexture(spriteUrl) {
    this.texture = new TextureLoader().load(spriteUrl);
    this.texture.magFilter = NearestFilter;
    this.texture.wrapS = this.texture.wrapT = RepeatWrapping;
    this.setRepeat();

    return this.texture;
  }

  setRepeat() {
    if (!this.facingLeft) {
      this.texture.repeat.set(1/this.tilesHoriz - (this.eps/this.tilesHoriz), 1.0/this.tilesVert - (this.eps/this.tilesVert));
    }
    else {
      this.texture.repeat.set(-1/this.tilesHoriz + (this.eps/this.tilesHoriz), 1/this.tilesVert - (this.eps/this.tilesVert));
    }
  }

  setAction(actionNumber) {
    if (actionNumber == this.currentAction) return;

    this.currentAction = actionNumber;
    this.numFrames = this.actionFrames.get(this.currentAction);
    this.currentFrame = 0;
    this.currentFramerate = this.actionFramerates.get(this.currentAction);
    this.loop = this.actionLoop.get(this.currentAction);
    this.lastUpdateTime = -10; // force immediate update

    this.setOffset(this.currentFrame, this.currentAction);
  }

  play(time) {
    if (this.lastUpdateTime == -1) {
      this.lastUpdateTime = time;
      return;
    }

    if (time - this.lastUpdateTime > 1/this.currentFramerate) {
      if (this.loop) {
        this.currentFrame = (this.currentFrame + 1)%this.numFrames;
      }
      else {
        this.currentFrame = Math.min(this.numFrames - 1, this.currentFrame + 1);
      }

      this.setRepeat();
      if (!this.facingLeft) {
        this.setOffset(this.currentFrame, this.currentAction);
      }
      else {
        this.setOffset(this.currentFrame + 1 - this.eps, this.currentAction);
      }

      this.lastUpdateTime = time;
    }
  }

  setOffset(offsetX, offsetY) {
    const eps = 0.03;

    this.texture.offset.x = offsetX/this.tilesHoriz + 0.5*eps/this.tilesHoriz;
    this.texture.offset.y = (this.tilesVert-1 - offsetY)/this.tilesVert  + 0.5*eps/this.tilesVert;
  }

  setFacingLeft(isLeft) {
    if (isLeft == this.facingLeft) return;
    this.facingLeft = isLeft;
    this.lastUpdateTime = -10; // force immediate update
  }

}

export default Animator;
