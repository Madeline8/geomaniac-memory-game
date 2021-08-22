// The below is to list variables defined in a different script, when using jshint
/* globals log, soundClick, showHide, soundImageSeq, soundInRoundSuccess,
				soundSuccess, closeAllModals, soundRoundFail, soundFail, $ */


"use strict";

let gameVars = {
  imageArray: [], //array of randomised image numbers
  maxImages: 45, //how many images I have on file in game images
  choices: 4, // Number of images player can choose from
  maxRounds: 8, // Maximum number of rounds
  pauseTime: 2000, // intervals between images shown in milliseconds
  round: 0, // Current round being played
  usedImages: [], // An array of unique images used in the game
  failed: false, // Set to true if the user gets the wrong image
  failCount: 0, // How many times has the user failed in this round?
  maxRoundAttempts: 3, // How many times can a round be attempted?
  level: 0, // Current game level
  startTimer: 0, // In game time
  noMoveTime: 60, // If player makes no move - then after this time it fails
  lastMoveTime: 0, // Time the player last clicked a button
  failedReason: "", // The reason the player failed
  lastImageClicked: -1, // What was the last image the user clicked?
  maxFailCount: 3,
  levelDiv: "", // the div to use for chosen level
  expectedResult: [],
  // What is the image number (0-3 for easy, 0-5 medium etc.) order expected
  choiceNumber: 0, // Which sequence number user has clicked on
  timeDisplayInterval: 0,
  maxTimeBetweenActions: 60 * 1000, // 1 minute in miliseconds
  userTimeoutInterval: "",
  lastUserInteraction: 0, //Last time player did something
  easyResults: [], // record the times for player completions during easy level game
  mediumResults: [], // record the times for player completions during medium level game
  advancedResults: [], // record the times for player completions during advanced level game
  successWellDone: 0, // save this event so I can cancel it if I have to
  homeClicked: false, // Has the home button been clicked?
  nextImageTimeout: 0
};

function clearMainImage() {
  let imageId = `main-game-image-${gameVars.level}`;
  //log(`imageId: ${imageId}`);
  document.getElementById(imageId).src = "assets/images/game-images/globe-icon.jpg";
  //log("Set Main Image to Globe");
}

// Display the main image
function showMainImage(n, enableClicks) {
  let imageId = `main-game-image-${gameVars.level}`;
  let fileName = "";
  if (n == -1) {
    fileName = "assets/images/game-images/globe-icon.jpg";
  } else {
    fileName = "assets/images/game-images/img" + n + ".jpg";
  }
  // Fade out the existing image
  let jId = '#' + imageId; // jQuery needs a # for an id
  $(jId).fadeOut(500, function () {
    // Swap in the new image
    document.getElementById(imageId).src = fileName;
    // And fade it In
    $(jId).fadeIn(500);
    if (enableClicks) {
      imageChoiceClickEvents.enable();
    }
  });
}

// Adds the image choices to the image placeholders
function fillImageChoices(n) {
  for (let i = 0; i < n; i++) {
    // Generate the correct id for the image
    let id = `img-choice-${gameVars.level}-${i}`;
    // Generate the image filename
    let imageFile = "assets/images/game-images/img" + gameVars.usedImages[i] + ".jpg";
    // Update the DOM with the new image
    document.getElementById(id).src = imageFile;
  }
}

// randomiseImage - fills imageArray with maxRounds or random images - it can be repeated
function randomiseImages() {
  // Used Images is an array of 4 items from maxImages but must be unique
  for (let i = 0; i < gameVars.choices; i++) {
    //log("i = " + i);
    // Get a random image number and check that it is not in usedImages yet and also not the same as the previous image
    let OK = false;
    while (!OK) {
      let n = Math.floor(Math.random() * gameVars.maxImages);
      OK = true;
      for (let j = 0; j < i; j++)
        if (gameVars.usedImages[j] == n) {
          OK = false;
        }
      // Now I know "n" is not already in usedImages so I can add it to the array
      gameVars.usedImages[i] = n;
    }
  }
  // usedImages is a list of 4 random and unique images
  // Assign randomly one of the 4 to imageArray.
  // imageArray[] can repeat images in the list of 4 availabale images but not the previous image
  let lastImage = -1;
  var imageNumber;
  for (let i = 0; i < gameVars.maxRounds; i++) {
    let n = -1;
    while (n == lastImage || n == -1) {
      imageNumber = Math.floor(Math.random() * gameVars.choices);
      n = gameVars.usedImages[imageNumber];
    }
    gameVars.imageArray[i] = n;
    gameVars.expectedResult[i] = imageNumber;
    lastImage = n;
  }
  log("expectedResult: " + gameVars.expectedResult);
}

// setGameLevel(n)
// This sets the variables required for a game
// n = 0 Easy
// n = 1 Medium
// n = 2 Hard
function setGameLevel(n) {
  if (n == 0) {
    gameVars.level = 0;
    gameVars.pauseTime = 1800; // intervals between images shown in milliseconds
    gameVars.choices = 4; // Number of images player can choose from
    gameVars.maxRounds = 8; // Maximum number of rounds
  } else if (n == 1) {
    gameVars.level = 1;
    gameVars.pauseTime = 1600; // intervals between images shown in milliseconds
    gameVars.choices = 6; // Number of images player can choose from
    gameVars.maxRounds = 8; // Maximum number of rounds
  } else {
    gameVars.level = 2;
    gameVars.pauseTime = 1400; // intervals between images shown in milliseconds
    gameVars.choices = 8; // Number of images player can choose from
    gameVars.maxRounds = 8; // Maximum number of rounds
  }
  clearMainImage();
}

//  https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_substring
// The choiceImages ClickEvent Handler
function imageClicked() {
  imageChoiceClickEvents.disable();
  let imgId = this.id;
  // imgId looks like "img-choice-x-y"
  // x = game level, y - choice number
  // choice is the last character in imgId
  let choice = parseInt(imgId.substr(imgId.length - 1));
  soundClick();
  gameVars.lastImageClicked = Date.now();
  gameVars.lastMoveTime = Date.now();
  gameVars.lastImageClicked = choice;
  let expected = gameVars.expectedResult[gameVars.choiceNumber];
  log(`Clicked on ${choice} : Expected ${expected}`);
  if (choice == expected) {
    // All is OK so far
    // Has player clicked on all the images required?
    if (++gameVars.choiceNumber >= gameVars.round) {
      // In this case, has player won this round
      // so start a new round
      //let player know ("Well done - Click OK to start next round");
      gameVars.round++;
      showMainImage(gameVars.usedImages[choice], false);
      if (gameVars.round > gameVars.maxRounds) {
        gameVars.successWellDone = setTimeout(displaySuccess, 1000);
      } else {
        gameVars.successWellDone = setTimeout(displayWellDone, 1000);
      }
    } else {
      showMainImage(gameVars.usedImages[choice], true);
    }
  } else {
    showMainImage(gameVars.usedImages[choice], false);
    // Failed this round
    if (++gameVars.failCount >= gameVars.maxRoundAttempts) {
      gameVars.failReason = "Failed! You have exceeded maximum number of attempts";
      endGame(false);
    }
    //alert("Failed - try this round again!");
    gameVars.successWellDone = setTimeout(displayFail, 1000);
    //setTimeout(continueGame, 1000, gameVars.level);
  }
}

// Enable or Disable Click Events
// imageChoiceClickEvents.enable();
// imageChoiceClickEvents.disable();
// bool: imageChoiceClickEvents.isEnabled();
var imageChoiceClickEvents = {
  eventsEnabled: false,
  enable() {
    if (!this.eventsEnabled) {
      for (let i = 0; i < gameVars.choices; i++) {
        // img-choice-2
        let imageId = `img-choice-${gameVars.level}-${i}`;
        document.getElementById(imageId).addEventListener("click", imageClicked);
      }
    }
    this.eventsEnabled = true;
  },
  disable() {
    if (this.eventsEnabled) {
      for (let i = 0; i < gameVars.choices; i++) {
        // img-choice-2
        let imageId = `img-choice-${gameVars.level}-${i}`;
        document.getElementById(imageId).removeEventListener("click", imageClicked);
      }

    }
    this.eventsEnabled = false;
  },
  isEnabled() {
    return (this.eventsEnabled);
  }
}

// start the display timer
function startTimer() {
  gameVars.lastMoveTime = gameVars.startTime = Date.now();
  gameVars.timeDisplayInterval = setInterval(displayTime, 1000);
  gameVars.lastUserInteraction = Date.now();
  gameVars.userTimeoutInterval = setInterval(checkUserTimeout, 1000);
}

//display the timer on the screen
//check that a player has clicked an image in the last 'noMoveTime' seconds
function displayTime() {
  let seconds = Math.floor((Date.now() - gameVars.startTime) / 1000);
  document.getElementById("time-span").innerHTML= fmtTime(seconds);
  // If the game timer has expired, then endGame(failed)
  if (((Date.now() - gameVars.lastMoveTime) / 1000) > gameVars.noMoveTime) {
    gameVars.failedReason = `You haven't made any move for more than ${gameVars.noMoveTime} seconds`;
    endGame(false);
  }

}
//convert time in second into a string of minutes and seconds
function fmtTime(t) {
  let m = Math.floor(t / 60);
  let s = t % 60;
  if (s < 10)
    s = "0" + s;
  return (`${m}:${s}`);
}

// playGame
function playGame(level) {
  gameVars.homeClicked = false;
  scrollWindow(level);
  clearMainImage();
  imageChoiceClickEvents.disable();
  setGameLevel(level);
  randomiseImages();
  gameVars.round = 1;
  gameVars.failCount = 0;
  setGameLevel(level);
  fillImageChoices(gameVars.choices);
  document.getElementById("round-span").innerHTML = gameVars.round + " of " + gameVars.maxRounds;
  setTimeout(nextImage, gameVars.pauseTime, 0);
  document.getElementById(`home-btn-${level}`).addEventListener("click", homeButtonClicked);
  startTimer();
}

// Clicking the home button can happen at whatever stage the game is at
// so I have to make sure all timers are stopped, clicks disabled, and
// any special modal windows closed
function homeButtonClicked() {
  gameVars.homeClicked = true;
  clearTimeout(gameVars.nextImageTimeout);
  clearTimeout(gameVars.successWellDone);
  clearInterval(gameVars.userTimeoutInterval);
  clearInterval(gameVars.timeDisplayInterval);
  closeAllModals();
  imageChoiceClickEvents.disable();
  showHide(true, "home-page-modal");
  let divs = ["timer-div", "your-turn", "ready-play", "well-done", "first-fail", "second-fail"];
  for (let i = 0; i < divs.length; i++) {
    showHide(false, divs[i]);
  }
  window.scroll(0, 0);
  document.getElementById(`home-btn-${gameVars.level}`).removeEventListener("click", homeButtonClicked);
}

// https://stackoverflow.com/questions/3437786/get-the-size-of-the-screen-current-web-page-and-browser-window - to set the game grid in the right place once player starts the game
function scrollWindow(level) {
  let height = window.screen.height;
  let width = window.screen.width;
  let scroll = 0; // Default scroll position
  switch (level) {
    case 0: // Easy level
      scroll = 96; // The size of the logo (5rem * 16
      break;
    case 1: // Medium level
      scroll = 120;
      break;
    case 2: // Advanced level
      scroll = 120;
      break;
  }
  if (width <= 768) { //Small Devices
    scroll = 0;
  } else if (width === 768 || width === 1024) { // Assume iPad
    scroll = 0;
  } else if (width >= 1024 && width <= 1366) { // Assume iPad Pro
    scroll = 0;
  }
  window.scroll(0, scroll);
}

function getPlayerInput() {
  gameVars.lastUserInteraction = Date.now();
  showHide(false, "your-turn");
  document.getElementById("your-turn").removeEventListener("click", getPlayerInput);
  imageChoiceClickEvents.enable();
  //startTimer();
  //setTimeout(nextImage, gameVars.pauseTime, 0);
}
// continueGame
function continueGame(level) {
  if (gameVars.homeClicked)
    return;
  gameVars.lastUserInteraction = Date.now();
  clearMainImage();
  imageChoiceClickEvents.disable();
  fillImageChoices(gameVars.choices);
  document.getElementById("round-span").innerHTML = gameVars.round + " of " + gameVars.maxRounds;
  setTimeout(nextImage, gameVars.pauseTime, 0);
}

//end the game for either a win or a loose
function endGame(result) { // result can be failed or passed
  if (result == true) {
    clearInterval(gameVars.timeDisplayInterval);
    // The player won the game
  } else {
    // The player failed the game
    // Get the faied reason from gameVars.failedReason
    // Cancel the display timer dependent on a reason for a fail
  }
}

function nextImage(i) {
  if (i == -1) {
    if (gameVars.homeClicked)
      return;
    clearMainImage();
    gameVars.choiceNumber = 0;
    showHide(true, "your-turn");
    document.getElementById("your-turn").addEventListener("click", getPlayerInput);
    imageChoiceClickEvents.disable();
    return;
  } else {
    if (gameVars.homeClicked)
      return;
    showMainImage(gameVars.imageArray[i], true);
    soundImageSeq();
    if (++i >= gameVars.round) {
      gameVars.nextImageTimeout = setTimeout(nextImage, gameVars.pauseTime, -1);
    } else {
      gameVars.nextImageTimeout = setTimeout(nextImage, gameVars.pauseTime, i);
    }
  }
}

function displayWellDone() {
  gameVars.successWellDone = 0;
  showHide(true, "well-done");
  soundInRoundSuccess();
  document.getElementById("well-done").addEventListener("click", event => {
    soundClick();
    showHide(false, "well-done");
    continueGame(gameVars.level);
  });
}

function stringFormatTime(s) {
  let m = Math.floor(s / 60);
  s = s % 60;
  let seconds = "";
  if (s == 0)
    seconds = "";
  else if (s == 1)
    seconds = "and 1 second";
  else
    seconds = `and ${s} seconds`;
  let plural = "";
  if (m > 1)
    plural = "s";
  return (`${m} minute${plural} ${seconds}`);
}

function displaySuccess() {
  gameVars.successWellDone = 0;
  let seconds = Math.floor((Date.now() - gameVars.startTime) / 1000);
  document.getElementById("time-completed").innerHTML = stringFormatTime(seconds);
  if (gameVars.level == 0) {
    gameVars.easyResults.push(seconds);
  } else if (gameVars.level == 1) {
    gameVars.mediumResults.push(seconds);
  } else {
    gameVars.advancedResults.push(seconds);
  }
  showHide(true, "game-success");
  soundSuccess();
  clearInterval(gameVars.userTimeoutInterval);
  showHide(false, "timer-div");
  closeAllModals();
  document.getElementById("eTimeRecords").innerHTML = formatResults(gameVars.easyResults);
  document.getElementById("mTimeRecords").innerHTML = formatResults(gameVars.mediumResults);
  document.getElementById("aTimeRecords").innerHTML = formatResults(gameVars.advancedResults);
  document.getElementById("success-play-again").addEventListener("click", event => {
    soundClick();
    showHide(true, "div-difficulty");
    showHide(false, "game-success");
  });
  document.getElementById("success-take-me-home").addEventListener("click", event => {
    soundClick();
    window.scroll(0, 0);
    showHide(true, "home-page-modal");
    showHide(false, "game-success");
  });
}

// formatted the time to show player results
function formatResults(results) {
  results.sort(compareNumbers);
  let output = "<ul>\n";
  for (let i = 0; i < results.length; i++) {
    output += `<li>${fmtTime(results[i])}</li>`;
  }
  output += "</ul>\n";
  return (output);
}

// Allows sort to compare numerically reverse
function compareNumbers(a, b) {
  return (b - a);
}

function displayFail() {
  let failbtn = "";
  if (gameVars.failCount == 1) {
    failbtn = "first-fail";
    soundRoundFail();
  } else if (gameVars.failCount == 2) {
    failbtn = "second-fail";
    soundRoundFail();
  } else if (gameVars.failCount == 3 || gameVars.failCount == 4) {
    soundFail();
    clearInterval(gameVars.userTimeoutInterval);
    showHide(false, "timer-div");
    setTimeout(closeAllModals, 1000);
    if (gameVars.failCount == 3) {
      document.getElementById("fail-reason").innerHTML = "You've failed! Want to try again?";
    } else if (gameVars.failCount == 4) {
      document.getElementById("fail-reason").innerHTML = "Game over! You haven't done any move. <br> Still want to play?";
    }
    showHide(true, "game-fail");
    document.getElementById("play-again").addEventListener("click", event => {
      soundClick();
      showHide(false, "game-fail");
      showHide(true, "div-difficulty");
    });
    document.getElementById("take-me-home").addEventListener("click", event => {
      soundClick();
      closeAllModals();
      showHide(false, "game-fail");
      window.scroll(0, 0);
      showHide(true, "home-page-modal");
    });
    return;
  }
  showHide(true, failbtn);
  document.getElementById(failbtn).addEventListener("click", event => {
    soundClick();
    showHide(false, failbtn);
    if (gameVars.failCount < 3) {
      continueGame(gameVars.level);
    } else {
      endGame();
    }
  });
}

function checkUserTimeout() {
  let elapsed = Date.now() - gameVars.lastUserInteraction;
  if (elapsed > gameVars.maxTimeBetweenActions) {
    gameVars.failCount = 4; //this is a failure for timeout
    displayFail();
  }
}