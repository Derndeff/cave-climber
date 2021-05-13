import { AudioListener, Audio, AudioLoader } from 'three';
import { SceneManager } from 'classes';
import { RunAudio, DeathAudio, WallJumpAudio, JumpAudio, SlideAudio, WindAudio } from 'audio';

class AudioManager {

  constructor() {
    this.audioListener = new AudioListener();

    this.sounds = new Map();
    this.sounds.set(0, new Sound(this.audioListener, RunAudio, true)); // run sound
    this.sounds.set(1, new Sound(this.audioListener, DeathAudio, false)); // death sound
    this.sounds.set(2, new Sound(this.audioListener, WallJumpAudio, false)); // wall jump sound
    this.sounds.set(3, new Sound(this.audioListener, SlideAudio, true)); // slide sound
    this.sounds.set(4, new Sound(this.audioListener, WindAudio, true)); // wind sound
    this.sounds.set(5, new Sound(this.audioListener, JumpAudio, false)); // slide sound

    this.sounds.get(0).audio.playbackRate = 1.2;
    this.sounds.get(2).audio.detune = 0;
    this.sounds.get(3).audio.detune = 0;
    this.sounds.get(4).audio.detune = 2400;
    this.sounds.get(5).audio.detune = 0;
  }

  initialize() {

  }

  playSound(soundId, duration, volume) {
    this.sounds.get(soundId).play(duration, volume);
  }

  update(time) {
    this.audioListener.position.set(SceneManager.currentScene.camera.position);

    for (let [soundId, sound] of this.sounds) {
      sound.update(time);
    }
  }
}

class Sound {

  constructor(audioListener, audioUrl, isLoop) {
    this.audio = this.createAudio(audioListener, audioUrl, isLoop);
    this.timeStart = -1;
    this.isPlaying = false;
    this.duration = -1;
    this.updateTimeStart = false;
    this.isLoop = isLoop;

    return this;
  }

  createAudio(audioListener, audioUrl, isLoop) {
    const audio = new Audio(audioListener);
    const audioLoader = new AudioLoader();
    audioLoader.load(
      audioUrl,
      function(buffer) {
        audio.setBuffer(buffer);
        audio.setLoop(isLoop);
      }
    );

    return audio;
  }

  play(duration, volume) {
    this.updateTimeStart = true;
    this.duration = duration;
    this.audio.setVolume(volume);
    if (this.isPlaying) {
      if (!this.isLoop) {
        this.audio.stop();
        this.audio.play();
      }
      return;
    }

    this.audio.play();
    this.isPlaying = true;
  }

  stop() {
    if (this.isLoop) {
      this.audio.pause();
    }
    else {
      this.audio.stop();
    }
    this.isPlaying = false;
  }

  update(time) {
    if (this.updateTimeStart) {
      this.timeStart = time;
      this.updateTimeStart = false;
    }

    if (this.isPlaying && time - this.timeStart > this.duration) {
      this.stop();
    }
  }
}

// Singleton pattern in modern JS
const instance = new AudioManager();

export default instance;
