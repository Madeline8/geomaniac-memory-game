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
  document.getElementById("div-difficulty").classList.remove("invisible");
  document.getElementById("div-difficulty").classList.add("visible");
});

// Play --> Choose difficulty level -> easy
document.getElementById("easy-level-button").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  document.getElementById("easy-level-game").classList.remove("invisible");
  document.getElementById("easy-level-game").classList.add("visible");
});

// Difficulty level - Go Back
document.getElementById("diff-level-go-back").addEventListener("click", event => {
  log("diff level.go back clicked");
  soundClick();
  document.getElementById("div-difficulty").classList.remove('visible');
  document.getElementById("div-difficulty").classList.add('invisible');
  document.getElementById("home-page-modal").classList.remove('invisible');
  document.getElementById("home-page-modal").classList.add('visible');
});

// Rules Button
document.getElementById("btn-rules").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  document.getElementById("div-rules").classList.remove("invisible");
  document.getElementById("div-rules").classList.add("visible");

});

// Rules form Go Back
document.getElementById("btn-rules-back").addEventListener("click", event => {
  log("btn-rules-back calling sound click");
  soundClick();
  document.getElementById("div-rules").classList.add("invisible");
  document.getElementById("home-page-modal").classList.remove('invisible');
  document.getElementById("home-page-modal").classList.add('visible');
});

// Sounds Button
document.getElementById("btn-sounds").addEventListener("click", event => {
  soundClick();
  closeAllModals();
  document.getElementById("div-sounds").classList.remove("invisible");
  document.getElementById("div-sounds").classList.add("visible");
});

// Sound form Go Back
document.getElementById("btn-sound-back").addEventListener("click", event => {
  soundClick();
  document.getElementById("div-sounds").classList.add('invisible');
  document.getElementById("home-page-modal").classList.remove('invisible');
  document.getElementById("home-page-modal").classList.add('visible');
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
  document.getElementById("home-page-modal").classList.remove('visible');
  document.getElementById("home-page-modal").classList.add('invisible');
  document.getElementById("div-rules").classList.remove('visible');
  document.getElementById("div-rules").classList.add('invisible');
  document.getElementById("div-sounds").classList.remove('visible');
  document.getElementById("div-sounds").classList.add('invisible');
  // document.getElementById("contact-page-window").classList.remove('visible');
  // document.getElementById("contact-page-window").classList.add('invisible');
  document.getElementById("div-difficulty").classList.remove('visible');
  document.getElementById("div-difficulty").classList.add('invisible');
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


// Logic for starting the game

// logic for the timer

//display of the results

//logic for number of retries 

// saving results and for showing the results table

//Audio related functions


