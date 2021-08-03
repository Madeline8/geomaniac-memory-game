let gameVars = {
    imageArray : [], //array of randomised image numbers
    maxImages :45, //how many images I have on file in game images
    pauseTime :  2, // intervals between images shown in second
    choices : 4,    // Number of images player can choose from
    maxRounds : 8,  // Maximum number of rounds
    usedImages : [], // An array of unique images used in the game
    round : 0,      // Current round being played
    failed : false, // Set to true if the user gets the wrong image
    failCount : 0,  // How many times has the user failed in this round?
    lastImageClicked : -1,  // What was the last image the user clicked?
    maxFailCount : 3,   // 
};

function clearMainImage() {
    document.getElementById("main-game-image").src = "../assets/images/game-images/globe-icon.jpg";
};

function showMainImage(n) {
    let fileName = "../assets/images/game-images/img" + n + ".jpg";
    document.getElementById("main-game-image").src = fileName;
};

// Adds the image choices to the image placeholders
function fillImageChoices(n) {
    for(let i = 0; i < n; i++) {
        // Generate the correct id for the image
        let id = "img-choice-" + i;
        console.log("id: " + id);
        // Generate the image filename
        let imageFile = "../assets/images/game-images/img" + gameVars.usedImages[i] + ".jpg";
        console.log("imageFile: " + imageFile);
        // Update the DOM with the new image
        document.getElementById(id).src = imageFile;
    }
}

// randomiseImage - fills imageArray with maxRounds or random images
// can be repeated
function randomiseImages() {
    console.log("In randomiseImages()");
    // Used Images is an array of 4 items from maxImages but must be unique
    for (let i=0; i < gameVars.choices; i++) {
        console.log("i = " + i);
        // Get a random image number
        // and check that it is not in usedImages yet
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
    console.log(gameVars.usedImages);
    // usedImages is a list of 4 random and unique images
    // Assign randomly one of the 4 to imageArray.
    // imageArray[] can repeat images in the list of 4 availabale images
    for (let i=0; i < gameVars.maxRounds; i++) {
        gameVars.imageArray[i] = gameVars.usedImages[Math.floor(Math.random() * gameVars.choices)];
    }
    console.log(gameVars.imageArray);
};


// setGameLevel(n)
// This sets the variables required for a game
// n = 0 Easy
// n = 1 Medium
// n = 2 Hard
function setGameLevel(n) {
  if(n == 0) {
    gameVars.pauseTime =  2; // intervals between images shown in second
    gameVars.choices = 4;    // Number of images player can choose from
    gameVars.maxRounds = 8;  // Maximum number of rounds    
  }
  else if(n == 1) {
    gameVars.pauseTime =  2; // intervals between images shown in second
    gameVars.choices = 8;    // Number of images player can choose from
    gameVars.maxRounds = 8;  // Maximum number of rounds
  }
  else {
    gameVars.pauseTime =  2; // intervals between images shown in second
    gameVars.choices = 10;    // Number of images player can choose from
    gameVars.maxRounds = 8;  // Maximum number of rounds
    
  }
  clearMainImage();
  randomiseImages();
  fillImageChoices(gameVars.choices);
}

// https://stackoverflow.com/questions/16623852/how-to-pause-javascript-code-execution-for-2-seconds
function sleep(miliseconds) {
    // Get current time
    var currentTime = new Date().getTime();
    // Loop until the currentTime plus milliseconds is greater the actual time
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

//  https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_substring
// The choiceImages CLickEvent Handler
function imageClicked() {
    let imgId = this.id;
    let choice = parseInt(imgId.substr(10,1));
    console.log("Clicked on " + choice);
    gameVars.lastImageClicked = choice;
}

 // enableClickEvents(n)
 // Enable the click events on the user choices
 function enableClickEvents(n) {
     for(let i = 0; i < n; i++) {
         // img-choice-2
         let imageId = "img-choice-" + i;
         console.log("Enabling Click for choice " + n);
         document.getElementById(imageId).addEventListener("click", event => {
            let imgId = this.id;
            let choice = parseInt(imgId.substr(10,1));
            console.log("Clicked on " + choice);
            gameVars.lastImageClicked = choice;
         });
     }
 }

 // disableClickEvents(n)
 // Remove the click event handlers on the user choices
 function disableClickEvents(n) {
    for(let i = 0; i < n; i++) {
        // img-choice-2
        let imageId = "img-choice-" + i;
        document.getElementById(imageId).removeEventListener();
    }
}


// playGame
function playGame(level) {
    clearMainImage();
    setGameLevel(level);
    round = 1;
    // Display the images one after the other up to round
    console.log("Display the images in turn");

    //for(let i = 0; i < round + 1; i++) {
    for(let i = 0; i < round + 1; i++) {
        console.log("Display image " + i);
        showMainImage(gameVars.imageArray[i]);
        console.log("Image " + i + " displayed");
        sleep(gameVars.pauseTime * 1000)
    };

    // Clear the main image
    clearMainImage();
    // Now let the player click on the image choices
    enableClickEvents(gameVars.choices);
    return;
    for(let i = 0; i < gameVars.maxRounds; i++) {
        // Wait for an image to be clicked
        while(gameVars.lastImageClicked == -1)
            sleep(50);
        showMainImage(gameVars.lastImageClicked);
        if(gameVars.lastImageClicked != gameVars.imageArray[i]) {
            gameVars.failCount++;
            break;
        }
    }
    if(gameVars.failCount > 2)
        handleFailure();

}
