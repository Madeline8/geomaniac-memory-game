"use strict";

// Functions to log to console with a timestamp
function log(txt) {
  let currentDateTime = new Date();
  let formattedTime = currentDateTime.getHours() + ":" + currentDateTime.getMinutes() + ":" + currentDateTime.getSeconds() + "." + currentDateTime.getMilliseconds();
  console.log(formattedTime + ": " + txt);
}

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
  log("diff level.go back clicked");
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
  log("btn-rules-back calling sound click");
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

// Contact Us Button
// document.getElementById("btn-contact").addEventListener("click", event => {
//   soundClick();
//   closeAllModals();
//   document.getElementById("contact-page-window").classList.remove("invisible");
//   document.getElementById("contact-page-window").classList.add("visible");
// });

// Contact Form Go Back
// document.getElementById("btn-contact-back").addEventListener("click", event => {
//   document.getElementById("contact-page-window").classList.add("invisible");
// });


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
   log(`Hiding ${divs[i]}`);
    showHide(false, divs[i]);
  }
}


// Show or hide a div (show == true will show it, show == false will hide it)
function showHide(show, div) {
  let elm = document.getElementById(div);
  if(!elm) {
    log("Cannot set element - not found: " + div);
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