
// Play Button
document.getElementById("btn-play").addEventListener("click", event => {
    closeAllModals();
    document.getElementById("div-difficulty").classList.remove("invisible");
    document.getElementById("div-difficulty").classList.add("visible");
  });
  
  // Rules Button
  document.getElementById("btn-rules").addEventListener("click", event => {
    // soundClick();
    closeAllModals();
    document.getElementById("div-rules").classList.remove("invisible");
    document.getElementById("div-rules").classList.add("visible");
  });

  // Sounds Button
  document.getElementById("btn-sounds").addEventListener("click", event => {
    soundClick();
    closeAllModals();
    document.getElementById("div-sounds").classList.remove("invisible");
    document.getElementById("div-sounds").classList.add("visible");
  });
  
  // Contact Us Button
  document.getElementById("btn-contact").addEventListener("click", event => {
    soundClick();
    closeAllModals();
    document.getElementById("contact-page-window").classList.remove("invisible");
    document.getElementById("contact-page-window").classList.add("visible");
  });
  
  // Contact Form Go Back
  document.getElementById("btn-contact-back").addEventListener("click", event => {
    document.getElementById("contact-page-window").classList.add("invisible");
  });

  // Sound form Go Back
  document.getElementById("btn-sound-back").addEventListener("click", event => {
    document.getElementById("div-sounds").classList.add('invisible');
  });

  // Rules form Go Back
  document.getElementById("btn-rules-back").addEventListener("click", event => {
    document.getElementById("div-rules").classList.add("invisible");
  });

  // Play --> Choose level
  document.getElementById("easy-level-button").addEventListener("click", event => {
    // soundClick();
    closeAllModals();
    document.getElementById("div-difficulty").classList.remove("invisible");
    document.getElementById("easy-level-game").classList.add("visible");
  });
 
  function closeAllModals() {
    document.getElementById("div-rules").classList.remove('visible');
    document.getElementById("div-rules").classList.add('invisible');
    document.getElementById("div-sounds").classList.remove('visible');
    document.getElementById("div-sounds").classList.add('invisible');
    document.getElementById("contact-page-window").classList.remove('visible');
    document.getElementById("contact-page-window").classList.add('invisible');
    document.getElementById("div-difficulty").classList.remove('visible');
    document.getElementById("div-difficulty").classList.add('invisible');
  }
  
  // Audio setup
//   let audio = {
//     click:   new Audio("assets/audio/clicksound.mp3"),
//     success: new Audio("assets/audio/success.mp3"),
//     fail:    new Audio("assets/audio/file.mp3"),
//     flip:    new Audio("assets/audio/flip.mp3"),
//     music:   new Audio("assets/audio/genmusic.mp3"),
//     isMuted: false,
//   };
  
  function soundClick(){
    audio.click.play();
  }


  // Logic for starting the game

  // logic for the timer

  //display of the results

  //logic for number of retries 

  // saving results and for showing the results table
  
  //Audio related functions


  