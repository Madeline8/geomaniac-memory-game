

let gameVars = {
    imageArray : [], //array of randomised image numbers
    maxImages :45, //how many images I have on file in game images
    pauseTime :  2000, // intervals between images shown in milliseconds
    choices : 4,    // Number of images player can choose from
    maxRounds : 8,  // Maximum number of rounds
    usedImages : [], // An array of unique images used in the game
    round : 0,      // Current round being played
    failed : false, // Set to true if the user gets the wrong image
    failCount : 0,  // How many times has the user failed in this round?
    lastImageClicked : -1,  // What was the last image the user clicked?
    maxFailCount : 3,   //
    expectedResult : [],// What is the image number (0-3 for easy, 0-5 medium etc.) order expected
    choiceNumber : 0,   // Which sequence number user has clicked on
    level : 0,        // Current game level
};

// Functions to log to console with a timestamp
function log(txt) {
    let currentDateTime = new Date();
    let formattedTime = currentDateTime.getHours() + ":" + currentDateTime.getMinutes() + ":" + currentDateTime.getSeconds() + "." + currentDateTime.getMilliseconds();
    console.log(formattedTime + ": " + txt);
}


function clearMainImage() {
    document.getElementById("main-game-image").src = "assets/images/game-images/globe-icon.jpg";
    log("Set Main Image to Globe");
};

function showMainImage(n) {
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
    for (let i = 0; i < gameVars.maxRounds; i++) {
        let n = -1;
        //log("i = " + i);
        while(n == lastImage || n == -1) {
            p = Math.floor(Math.random() * gameVars.choices);
            n = gameVars.usedImages[p];
            //log("n is " + n);
        }
        //log("i: " + i + ", n: " + n + ", lastImage: " + lastImage);
        gameVars.imageArray[i] = n;
        gameVars.expectedResult[i] = p;
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
        pauseTime = 2000;        // intervals between images shown in milliseconds
        gameVars.choices = 4;    // Number of images player can choose from
        gameVars.maxRounds = 8;  // Maximum number of rounds
    }
    else if(n == 1) {
        pauseTime = 2000;        // intervals between images shown in milliseconds
        gameVars.choices = 8;    // Number of images player can choose from
        gameVars.maxRounds = 8;  // Maximum number of rounds
    }
    else {
        pauseTime = 2000;        // intervals between images shown in milliseconds
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
    log("Clicked on " + choice);
    gameVars.lastImageClicked = choice;
    if(choice == gameVars.expectedResult[gameVars.choiceNumber]) {
        // All is OK so far
        // Have we clicked on all the images required?
        if(++gameVars.choiceNumber >= gameVars.round) {
            // In this case, we have won this round
            // so start a new round
            alert("Congratulations - Click OK to start next round");
            gameVars.round++;
            continueGame(gameVars.level);
        }
    }
    else {
        // Failed
        alert("Failed --- Try again");
        continueGame(gameVars.level);
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
        //document.getElementById(imageId).addEventListener("click", event => {
        //   let imgId = this.id;
        //   let choice = parseInt(imgId.substr(10,1));
        //   console.log("Clicked on " + choice);
        //   gameVars.lastImageClicked = choice;
        //});
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

// playGame
function playGame(level) {
    clearMainImage();
    disableClickEvents();
    setGameLevel(level);
    randomiseImages();
    gameVars.round = 1;
    setGameLevel(level);
    fillImageChoices(gameVars.choices);
    setTimeout(nextImage, gameVars.pauseTime, 0);
}

// continueGame
function continueGame(level) {
    log("Continue " + gameVars.round);
    clearMainImage();
    disableClickEvents();
    fillImageChoices(gameVars.choices);
    setTimeout(nextImage, gameVars.pauseTime, 0);
}

function nextImage(i) {
    if(i == -1) {
        let currentTime = new Date();
        log("Showing globe and not setting a timeout");
        clearMainImage();
        enableImageChoiceClickEvents();
        gameVars.choiceNumber = 0;
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

// User initiates action by clicking "ready to start"? (once clicked on 'easy-level')


// One the sequence of main images has been completed, player gets a notification: 'Now, your turn!'

// User gets a notification when he correctly guesses the sequence

// fail notifications (player can fail twice within one game)


// setInterval and setTimer. Use them both to display the elapsed time on the screen and to force and end to the game if the player is taking too long.

// anonymous functions

// Divs to show the countdown to the game starting and to show the result.

