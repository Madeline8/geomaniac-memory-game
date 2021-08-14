// The two constants below make reading the functions easier to understand
// const passed = true;
// const failed = false;
"use strict";

let gameVars = {
  imageArray : [],    //array of randomised image numbers
  maxImages  :  45,   //how many images I have on file in game images
  pauseTime  :  2000, // intervals between images shown in milliseconds
  choices    : 4,     // Number of images player can choose from
  maxRounds  : 8,     // Maximum number of rounds
  usedImages : [],    // An array of unique images used in the game
  round      : 0,     // Current round being played
  failed     : false, // Set to true if the user gets the wrong image
  failCount  : 0,     // How many times has the user failed in this round?
  maxRoundAttempts : 3,  // How many time can a round be attempted?
  level      : 0,     // Current game level
  startTimer : 0,     // In game time
  noMoveTime : 60,    // If player makes no move - then after this time it fails
  lastMoveTime : 0,   // Time the player last clicked a button
  failedReason : "",  // The reason the player failed
  lastImageClicked : -1,  // What was the last image the user clicked?
  maxFailCount     : 3,   //
  expectedResult   : [],// What is the image number (0-3 for easy, 0-5 medium etc.) order expected
  choiceNumber     : 0,   // Which sequence number user has clicked on
  timeDisplayInterval : 0,
  maxTimeBetweenActions : 60 * 1000, // 1 minute in miliseconds
  userTimeoutInterval : '',
  lastUserInteraction : 0, //Last time player did something
};

function clearMainImage() {
  document.getElementById("main-game-image").src = "assets/images/game-images/globe-icon.jpg";
  log("Set Main Image to Globe");
};

function showMainImage(n) { //showMainImage('03')
  let fileName = "";
  if(n == -1) {
      fileName = "assets/images/game-images/globe-icon.jpg";
  }
  else {
      fileName = "assets/images/game-images/img" + n + ".jpg";
  }
  log("Display Main Image: [" + fileName + "]");
  document.getElementById("main-game-image").src = fileName;
}

// Adds the image choices to the image placeholders
function fillImageChoices(n) {
  for(let i = 0; i < n; i++) {
      // Generate the correct id for the image
      let id = "img-choice-" + i;
      log("id: " + id);
      // Generate the image filename
      let imageFile = "assets/images/game-images/img" + gameVars.usedImages[i] + ".jpg";
      log("imageFile: " + imageFile);
      // Update the DOM with the new image
      document.getElementById(id).src = imageFile;
  }
}

// randomiseImage - fills imageArray with maxRounds or random images
// can be repeated
function randomiseImages() {
  log("In randomiseImages()");
  // Used Images is an array of 4 items from maxImages but must be unique
  for (let i = 0; i < gameVars.choices; i++) {
      log("i = " + i);
      // Get a random image number
      // and check that it is not in usedImages yet
      // and also not the same as the previous image
      let OK = false;
      while(!OK){
          let n = Math.floor(Math.random() * gameVars.maxImages);
          OK = true;
          for(let j = 0; j < i; j++)
              if(gameVars.usedImages[j] == n){
                  OK = false;
              }
          // Now I know "n" is not already in usedImages
          // So I can add it to the array
          gameVars.usedImages[i] = n;
      }
  }
  // usedImages is a list of 4 random and unique images
  // Assign randomly one of the 4 to imageArray.
  // imageArray[] can repeat images in the list of 4 availabale images
  // but not the previous image
  let lastImage = -1;
  var imageNumber;
  for (let i = 0; i < gameVars.maxRounds; i++) {
      let n = -1;
      //log("i = " + i);
      while(n == lastImage || n == -1) {
          imageNumber = Math.floor(Math.random() * gameVars.choices);
          n = gameVars.usedImages[imageNumber];
          //log("n is " + n);
      }
      //log("i: " + i + ", n: " + n + ", lastImage: " + lastImage);
      gameVars.imageArray[i] = n;
      gameVars.expectedResult[i] = imageNumber;
      //log("Saved to array at " + i + ", n: " + n + ", lastImage was: " + lastImage);
      lastImage = n;
  }
  log("usedImages: " + gameVars.usedImages);
  log("imageArray: " + gameVars.imageArray);
  log("expectedResult: " + gameVars.expectedResult);
}

// setGameLevel(n)
// This sets the variables required for a game
// n = 0 Easy
// n = 1 Medium
// n = 2 Hard
function setGameLevel(n) {
  if(n == 0) {
      gameVars.pauseTime = 2000;        // intervals between images shown in milliseconds
      gameVars.choices = 4;    // Number of images player can choose from
      gameVars.maxRounds = 8;  // Maximum number of rounds
  }
  else if(n == 1) {
    gameVars.pauseTime = 2000;        // intervals between images shown in milliseconds
      gameVars.choices = 8;    // Number of images player can choose from
      gameVars.maxRounds = 8;  // Maximum number of rounds
  }
  else {
    gameVars.pauseTime = 2000;        // intervals between images shown in milliseconds
      gameVars.choices = 10;    // Number of images player can choose from
      gameVars.maxRounds = 8;  // Maximum number of rounds
      
  }
  clearMainImage();
}

//  https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_substring
// The choiceImages ClickEvent Handler
function imageClicked() {
  let imgId = this.id;
  let choice = parseInt(imgId.substr(11));
  showMainImage(gameVars.usedImages[choice]);
  soundClick();
  gameVars.lastImageClicked = Date.now();
  log("Clicked on " + choice);
  log("Display image: " + gameVars.usedImages[choice]);
  gameVars.lastMoveTime = Date.now();
  gameVars.lastImageClicked = choice;
  let expected = gameVars.expectedResult[gameVars.choiceNumber];
  log(`Clicked on ${choice} : Expected ${expected}`);
  if(choice == expected) {
      // All is OK so far
      // Have we clicked on all the images required?
      if(++gameVars.choiceNumber >= gameVars.round) {
          // In this case, we have won this round
          // so start a new round
          //alert("Congratulations - Click OK to start next round");
          gameVars.round++;
          if (gameVars.round > gameVars.maxRounds) {
            setTimeout(displaySuccess, 1000);
          } else {
            setTimeout(displayWellDone, 1000);
          }        
      }
  }
  else {
      // Failed this round
      if(++gameVars.failCount >= gameVars.maxRoundAttempts) {
        gameVars.failReason = 'Failed! You have exceeded maximum number of attempts';
        endGame(false);
      }
      //alert("Failed - try this round again!");
      setTimeout(displayFail, 1000);
      //setTimeout(continueGame, 1000, gameVars.level);
  }
}

// enableClickEvents(n)
// Enable the click events on the user choices
function enableImageChoiceClickEvents() {
  for(let i = 0; i < gameVars.choices; i++) {
      // img-choice-2
      let imageId = "img-choice-" + i;
      console.log("Enabling Click for choice " + i + ", imageId: " + imageId);
      document.getElementById(imageId).addEventListener("click", imageClicked);
  }
}

// disableClickEvents()
// Remove the click event handlers on the user choices
function disableClickEvents() {
  for(let i = 0; i < gameVars.choices; i++) {
      // img-choice-2
      let imageId = "img-choice-" + i;
      document.getElementById(imageId).removeEventListener("click", imageClicked);
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
  document.getElementById('time-span').innerHTML = fmtTime(seconds);
  // If the game timer has expired, then endGame(failed)
  if(((Date.now() - gameVars.lastMoveTime) / 1000) > gameVars.noMoveTime) {
    gameVars.failedReason = `You haven't done any move for more than ${gameVars.noMoveTime} seconds`;
    endGame(false);
  }

}
//convert time in second into a string of minutes and seconds
function fmtTime(t) {
    let m = Math.floor(t / 60);
    let s = t %60;
    if(s < 10) {
        s = "0" + s;
    } 
    return(`${m}:${s}`);
}

// playGame
function playGame(level) {
  clearMainImage();
  disableClickEvents();
  setGameLevel(level);
  randomiseImages();
  gameVars.round = 1;
  gameVars.failCount = 0;
  setGameLevel(level);
  fillImageChoices(gameVars.choices);
  document.getElementById("round-span").innerHTML = gameVars.round + " of " + gameVars.maxRounds;
  setTimeout(nextImage, gameVars.pauseTime, 0);
  startTimer();

}
  
function getPlayerInput() {
  log("getPlayerInput clicked");
  gameVars.lastUserInteraction = Date.now();
  showHide(false, "your-turn");
  document.getElementById("your-turn").removeEventListener("click", getPlayerInput);
  enableImageChoiceClickEvents();
  //startTimer();
  //setTimeout(nextImage, gameVars.pauseTime, 0);
}
// continueGame
function continueGame(level) {
  log("Continue " + gameVars.round);
  gameVars.lastUserInteraction = Date.now();
  clearMainImage();
  disableClickEvents();
  fillImageChoices(gameVars.choices);
  document.getElementById("round-span").innerHTML = gameVars.round + " of " + gameVars.maxRounds;
  setTimeout(nextImage, gameVars.pauseTime, 0);
}

//end the game for either a win or a loose
function endGame(result) {  // result can be failed or passed
  if(result == true) {
    clearInterval(gameVars.timeDisplayInterval);
    // The player won the game
  } else {
    // The player failed the game
    // We get the faied reason from gameVars.failedReason
    // Cancel the display timer dependent on a reason for a fail
  }
}

function nextImage(i) {
  if(i == -1) {
      let currentTime = new Date();
      log("Showing globe and not setting a timeout");
      clearMainImage();
      gameVars.choiceNumber = 0;
      showHide(true, "your-turn");
      document.getElementById("your-turn").addEventListener("click", getPlayerInput);
      return;
  }
  else {
      log("Display image " + i);
      showMainImage(gameVars.imageArray[i]);
      if(++i >= gameVars.round) {
          log("All images shown : next image is -1 : globe");
          setTimeout(nextImage, gameVars.pauseTime, -1);
      }
      else {
          log("Setting next timeout for image " + i);
          setTimeout(nextImage, gameVars.pauseTime, i);
      }
  }
}

function displayWellDone() {
  showHide(true, 'well-done');
   document.getElementById('well-done').addEventListener('click', event => {
    soundClick();
    showHide(false, 'well-done');
    continueGame(gameVars.level);
  });
}

function stringFormatTime(s) {
  let m = Math.floor(s / 60);
  s = s % 60;
  let seconds = '';
  if(s == 0)
    seconds = ``;
  else if(s == 1)
    seconds = 'and 1 second';
  else
    seconds = `and ${s} seconds`;
  let plural = '';
  if(m > 1)
    plural = 's';
  return(`${m} minute${plural} ${seconds}`);
}

function displaySuccess() {
  let seconds = Math.floor((Date.now() - gameVars.startTime) / 1000);
  document.getElementById("time-completed").innerHTML = stringFormatTime(seconds);
  showHide(true, "game-success");
  clearInterval(gameVars.userTimeoutInterval);
  closeAllModals();
  document.getElementById("success-play-again").addEventListener("click", event => {
    soundClick();
    showHide(true, "div-difficulty");
    showHide(false, "game-success");
  });
  document.getElementById("success-take-me-home").addEventListener("click", event => {
    soundClick();
    showHide(true, "home-modal");
    showHide(false, "game-success");
  });
}

function displayFail() {
  let failbtn = '';
  if(gameVars.failCount == 1) {
    failbtn = 'first-fail';
  } else if(gameVars.failCount == 2) {
    failbtn = 'second-fail';
  } else if(gameVars.failCount == 3 || gameVars.failCount == 4) {
    clearInterval(gameVars.userTimeoutInterval);
    setTimeout(closeAllModals, 1000);
    if(gameVars.failCount == 3) {
      document.getElementById("fail-reason").innerHTML = "You've failed! Want to try again?";
    } else if(gameVars.failCount == 4) {
      document.getElementById("fail-reason").innerHTML = "Game over! You haven't done any move. <br> Still want to play?";
    }
    showHide(true, "game-fail");
    document.getElementById("play-again").addEventListener("click", event => {
      soundClick();
      showHide(false, "game-fail");
      // endGame(true);
      showHide(true, 'div-difficulty');
    });
    document.getElementById("take-me-home").addEventListener("click", event => {
      soundClick();
      closeAllModals();
      showHide(false, "game-fail");
      //endGame(false);
      showHide(true, 'home-page-modal');
    });
    return;
  }
  showHide(true, failbtn);
  document.getElementById(failbtn).addEventListener('click', event => {
    soundClick();
    showHide(false, failbtn);
    if(gameVars.failCount < 3) {
      continueGame(gameVars.level);
    } else {
      endGame();
    }
  });
}

function checkUserTimeout() {
  let elapsed = Date.now() - gameVars.lastUserInteraction;
  //log(`checkUserTimout - elaped = ${elapsed}`);
  if ((Date.now() - gameVars.lastUserInteraction) > gameVars.maxTimeBetweenActions) {
    gameVars.failCount = 4; //this is a failure for timeout
    displayFail();
  }
}

// User initiates action by clicking "ready to start"? (once clicked on 'easy-level') DONE
// Once the sequence of main images has been completed, player gets a notification: 'Now, your turn!' DONE
// User gets a notification when he correctly guesses the sequence DONE
// fail notifications (player can fail twice within one game) DONE
// setInterval and setTimer. Use them both to display the elapsed time on the screen and to force and end to the game if the player is taking too long. DONE
// anonymous functions

