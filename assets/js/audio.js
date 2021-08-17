// log is defined in another file
/* globals log */
// The following functions are used in other files
/* exported soundClick, soundSuccess, soundInRoundSuccess, soundFail, 
	soundRoundFail, soundImageSeq, soundManager, musicManager, defaultVol */
  "use strict";

// Audio setup
  let audio = {
    soundBtn:       document.getElementById("sound-btn"),
    musicBtn:       document.getElementById("music-btn"),
    musicMuted:     true,
    soundMuted:     false,
    musicVolAdj:    document.getElementById("vol-music"),
    soundVolAdj:    document.getElementById("vol-sounds"),
    music:          document.getElementById("music"),
    click:          new Audio("assets/audio/click-sound.wav"),
    success:        new Audio("assets/audio/game-end-success.wav"),
    inRoundSuccess: new Audio("assets/audio/game-round-success.mp3"),
    fail:           new Audio("assets/audio/game-over-sound.wav"),
    roundFail:      new Audio("assets/audio/first-second-fail-sound.wav"),
    flip:           new Audio("assets/audio/main-img-sound.wav"),
  };

// Sound click rule
function soundClick() {
  log ("soundClick()");
  if (audio.soundMuted === false) {
    audio.click.play();
  }
}

// Sound is played when a player successfully completes all rounds of the game 
function soundSuccess() {
  let vol = audio.music.volume;
  audio.music.volume = 0;
  if (audio.soundMuted === false) {
      audio.success.play();
  }
  fadeIn(audio.music, vol, 2000, 2000, 10);
}

// Sound is played when a player successfully completes each round of the game
function soundInRoundSuccess() {
  if (audio.soundMuted === false) {
    audio.inRoundSuccess.play();
  }
}

//Sound is played when a player fails the game
function soundFail() {
  let vol = audio.music.volume;
  audio.music.volume = 0;
  if (audio.soundMuted === false) {
    audio.fail.play();
  }
  fadeIn(audio.music,vol,2000, 2000, 10);
}

//Sound is played when a player fails one of the game rounds
function soundRoundFail() {
  log("SoundRoundFail");
  if (audio.soundMuted === false) {
    audio.roundFail.play();
  }
}

//Sound is played when a the main images are shown to the player 
function soundImageSeq() {
  if (audio.soundMuted === false) {
    audio.flip.play();
  }
}

// player can turn sound On and Off
function soundManager() {
    if (audio.soundMuted === true) {
        audio.soundMuted = false;
        audio.soundBtn.innerHTML = "On";
    } else if (audio.soundMuted === false) {
        audio.soundMuted = true;
        audio.soundBtn.innerHTML = "Off";
    }
}

//player can turn music On and Off
function musicManager() {
    if (audio.musicMuted === true) {
        audio.musicMuted = false;
        audio.musicBtn.innerHTML = "On";
        playMusic();
    } else if (audio.musicMuted === false) {
        audio.musicMuted = true;
        audio.musicBtn.innerHTML = "Off";
        stopMusic();
    }
}

// play music function
function playMusic() {
  if (audio.musicMuted !== true) {
      audio.music.play();
      audio.music.loop = true;
  }
}

// stop music function and set it to 0
function stopMusic() {
  audio.music.pause();
  audio.music.currentTime = 0;
}

//set default volume
function defaultVol() {
  audio.music.volume = audio.musicVolAdj.defaultValue / 50;
  audio.click.volume = audio.soundVolAdj.defaultValue / 100;
  audio.inRoundSuccess.volume = audio.soundVolAdj.defaultValue / 100;
  audio.fail.volume = audio.soundVolAdj.defaultValue / 100;
  audio.roundFail.volume = audio.soundVolAdj.defaultValue / 100;
  audio.flip.volume = audio.soundVolAdj.defaultValue / 100;
  audio.success.volume = audio.soundVolAdj.defaultValue / 100;
}

// setting a rule when a player pauses the music
audio.musicVolAdj.addEventListener("change", event => {
  audio. music.volume = audio.musicVolAdj.value / 100;
  if (audio.music.volume === 0) {
    stopMusic();
  } else  {
    playMusic();
  }
});

// player can change sound volumes
audio.soundVolAdj.addEventListener("change", event => {
  audio.soundVolAdj.volume = audio.soundVolAdj.value / 100;
  audio.click.volume = audio.soundVolAdj.value / 100;
  audio.inRoundSuccess.volume = audio.soundVolAdj.value / 100;
  audio.fail.volume = audio.soundVolAdj.value / 100;
  audio.roundFail.volume = audio.soundVolAdj.value / 100;
  audio.flip.volume = audio.soundVolAdj.value / 100;
  audio.success.volume = audio.soundVolAdj.value / 100;
});

// https://stackoverflow.com/questions/7451508/html5-audio-playback-with-fade-in-and-fade-out
// this helped me design the function
function fadeIn(audioElement, maxVol, startDelay, fadeInTime, steps) {
  let i = 0;
  let interval = fadeInTime / steps;
  setTimeout(function () {
    log("start fade-in");
    let intervalId = setInterval(function() {
      let volume = (maxVol / steps) * i;
      audioElement.volume = volume;
      log(`Volume set to ${volume}`);
      if(++i >= steps)
        clearInterval(intervalId);
    }, interval);
  }, startDelay);
}



