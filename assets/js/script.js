// The below is to list variables defined in a different script, when using jshint
/* globals soundClick, setGameLevel, gameVars, playGame, soundManager, musicManager */
"use strict";

// Play Button
document.getElementById("btn-play").addEventListener("click", () => {
  soundClick();
  closeAllModals();
  showHide(true, 'div-difficulty');
});

// Play --> Choose difficulty level -> easy
document.getElementById("easy-level-button").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  setGameLevel(0);
  gameVars.levelDiv = 'easy-level-game';
  showHide(true, 'ready-play');
 });

// Play --> Choose difficulty level -> medium
document.getElementById("medium-level-button").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  setGameLevel(1);
  gameVars.levelDiv = 'medium-level-game';
  showHide(true, 'ready-play');
});

// Play --> Choose difficulty level -> advanced
document.getElementById("advanced-level-button").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  setGameLevel(2);
  gameVars.levelDiv = 'advanced-level-game';
  showHide(true, 'ready-play');
});

// Ready-play button clicked
document.getElementById('ready-play').addEventListener('click', event => {
  soundClick();
  showHide(false, 'ready-play');
  showHide(true, gameVars.levelDiv);
  showHide(true, "timer-div");
  playGame(gameVars.level);
});


// Difficulty level - Go Back
document.getElementById("diff-level-go-back").addEventListener("click", event => {
  soundClick();
  showHide(false, 'div-difficulty');
  showHide(true, 'home-page-modal');
});

// Rules Button
document.getElementById("btn-rules").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  showHide(true, 'div-rules');

});

// Rules form Go Back
document.getElementById("btn-rules-back").addEventListener("click", event => {
  soundClick();
  showHide(false, 'div-rules');
  showHide(true, 'home-page-modal');
});

// Sounds Button
document.getElementById("btn-sounds").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  showHide(true, 'div-sounds');
});

// Sound form Go Back
document.getElementById("btn-sound-back").addEventListener("click", event => {
  soundClick();
  showHide(false, 'div-sounds');
  showHide(true, 'home-page-modal');
});

function closeAllModals() {
  //let divs = [ 'home-page-modal', 'div-rules', 'div-sounds', 'contact-page-window',  'div-difficulty' ];
  let divs = [ 
  'home-page-modal', 
  'div-rules', 
  'div-sounds', 
  'div-difficulty', 
  'easy-level-game',
  'ready-go',
  'your-turn',
  'well-done',
  'medium-level-game', 
  'advanced-level-game', 
];
  for(let i = 0; i < divs.length; i++) {
    showHide(false, divs[i]);
  }
}

// Show or hide a div (show == true will show it, show == false will hide it)
function showHide(show, div) {
  let elm = document.getElementById(div);
  if(!elm) {
    return;
  }
  if(show) {
    elm.classList.remove('invisible');
    elm.classList.add('visible');
  } else {
    elm.classList.remove('visible');
    elm.classList.add('invisible');
  }
}

// Audio and music settings
document.getElementById("sound-btn").addEventListener("click", event => {
  soundClick();
  soundManager();
});

document.getElementById("music-btn").addEventListener("click", event => {
  soundClick();
  musicManager();
});