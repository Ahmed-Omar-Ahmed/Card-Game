const cardObjectDefinitions = [
  { id: 1, imagePath: "Images/card-KingHearts.png" },
  { id: 2, imagePath: "Images/card-JackClubs.png" },
  { id: 3, imagePath: "Images/card-QueenDiamonds.png" },
  { id: 4, imagePath: "Images/card-AceSpades.png" },
];

const aceId = 4;

const cardBackImgPath = "Images/card-back-blue.png";

const cardContainerElem = document.querySelector(".card-container");

let cards = [];

const startGameBtnElem = document.getElementById("startGame");

const collapseGridArea = '"a a" "a a"';
const cardCollectionCellClass = ".card-pos-a";

const numCards = cardObjectDefinitions.length;

let cardPositions = [];

let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;

const currentGameStatusElem = document.querySelector(".current-status");
const scoreContainerElem = document.querySelector(".header-score-container");
const scoreElem = document.querySelector(".score");
const roundContainerElem = document.querySelector(".header-round-container");
const roundElem = document.querySelector(".round");

const winColor = "green";
const loseColor = "red";
const primaryColor = "black";

let roundNum = 0;
let maxRounds = 10;
let score = 0;
let standardPoints = 50;

let gameObj = {};

const localStorageGameKey = "HTA";

loadGame();

function gameOver() {
  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");
  const gameOverMessage = `Game Over! Final Score: <span class = "badge">${score}</span> Click "Start Game" to play again!`;

  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    gameOverMessage
  );

  gameInProgress = false;
  startGameBtnElem.style.display = "block";
  cards.forEach((card) => {
    card.classList.add("hoverable");
  });
}

function endRound() {
  setTimeout(() => {
    if (roundNum == maxRounds) {
      gameOver();
      return;
    } else {
      startRound();
    }
  }, 3000);
}

function chooseCard(card) {
  if (canChooseCard()) {
    evaluateCardChoice(card);
    saveGameObjectToLoclStorage(score, roundNum);
    flipCard(card, false);

    setTimeout(() => {
      flipCards(false);
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Card positions revealed"
      );
      endRound();
    }, 3000);
    cardsRevealed = true;
  }
}

function calculateScoreToAdd(roundNum) {
  const scoreToAdd = roundNum * standardPoints;
  score = score + scoreToAdd;
  return score;
}

function updateScore() {
  calculateScoreToAdd(roundNum);
  updateStatusElement(scoreElem, "block", primaryColor, score);
}

function updateStatusElement(elem, display, color, innerHTML) {
  elem.style.display = display;

  if (arguments.length > 2) {
    elem.style.color = color;
    elem.innerHTML = innerHTML;
  }
}

function outputChoiceFeedback(hit) {
  if (hit) {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      winColor,
      "Hit!! - Well Done! :)"
    );
  } else {
    updateStatusElement(
      currentGameStatusElem,
      "block",
      loseColor,
      "Missed!! :("
    );
  }
}

function evaluateCardChoice(card) {
  if (card.id == aceId) {
    updateScore();
    outputChoiceFeedback(true);
  } else {
    outputChoiceFeedback(false);
  }
}

function canChooseCard() {
  return gameInProgress == true && !shufflingInProgress && !cardsRevealed;
}

function loadGame() {
  createCards();
  cards = document.querySelectorAll(".card");
  cardFlyInEffect();

  startGameBtnElem.addEventListener("click", () => startGame());

  updateStatusElement(scoreContainerElem, "none");
  updateStatusElement(roundContainerElem, "none");
}

function checkForIncompleteGame() {
  const serializedGameObj = getLocalStorageItemValue(localStorageGameKey);
  if (serializedGameObj) {
    gameObj = getObjectFromJSON(serializedGameObj);

    if (gameObj.round >= maxRounds) {
      removeLocalStorageItem(localStorageGameKey);
    } else {
      if (confirm("Would you like to continue from where you left?")) {
        score = gameObj.score;
        roundNum = gameObj.round;
      }
    }
  }
}

function startGame() {
  intializeNewGame();
  startRound();
  cards.forEach((card) => {
    card.classList.remove("hoverable");
  });
}

function intializeNewGame() {
  score = 0;
  roundNum = 0;

  checkForIncompleteGame();
  shufflingInProgress = false;
  updateStatusElement(scoreContainerElem, "flex");
  updateStatusElement(roundContainerElem, "flex");
  updateStatusElement(scoreElem, "block", primaryColor, score);
  updateStatusElement(roundElem, "block", primaryColor, roundNum);
}

function startRound() {
  intializeNewRound();
  collectCards();
  flipCards(true);
  shuffleCards();
}

function intializeNewRound() {
  roundNum++;
  startGameBtnElem.style.display = "none";
  gameInProgress = true;
  shufflingInProgress = true;
  cardsRevealed = false;
  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    "Shuffling..."
  );
  updateStatusElement(roundElem, "block", primaryColor, roundNum);
}

function collectCards() {
  transformGridArea(collapseGridArea);
  addCardsToGridAreaCell(cardCollectionCellClass);
}

function transformGridArea(areas) {
  cardContainerElem.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName) {
  const cellPositionElem = document.querySelector(cellPositionClassName);

  cards.forEach((card, index) => {
    addChildElement(cellPositionElem, card);
  });
}

function flipCard(card, flipToBack) {
  const innerCardElem = card.firstChild;

  if (flipToBack && !innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.add("flip-it");
  } else if (innerCardElem.classList.contains("flip-it")) {
    innerCardElem.classList.remove("flip-it");
  }
}

function flipCards(flipToBack) {
  cards.forEach((card, index) => {
    setTimeout(() => {
      flipCard(card, flipToBack);
    }, index * 100);
  });
}

function cardFlyInEffect() {
  const id = setInterval(flyIn, 5);
  let cardCount = 0;
  let count = 0;

  function flyIn() {
    count++;
    if (cardCount == numCards) {
      clearInterval(id);
      startGameBtnElem.style.scale = 1;
      startGameBtnElem.style.opacity = 1;
    }
    if (count == 1 || count == 100 || count == 200 || count == 300) {
      cardCount++;
      let card = document.getElementById(cardCount);
      card.classList.remove("fly-in");
    }
  }
}

function removeShuffleClasses() {
  cards.forEach((card) => {
    card.classList.remove("shuffle-left");
    card.classList.remove("shuffle-right");
  });
}

function animateShuffle(shuffleCount) {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  let card1 = document.getElementById(random1);
  let card2 = document.getElementById(random2);

  if (shuffleCount % 4 == 0) {
    card1.classList.toggle("shuffle-left");
    card1.style.zIndex = 100;
  }

  if (shuffleCount % 10 == 0) {
    card2.classList.toggle("shuffle-right");
    card2.style.zIndex = 200;
  }
}

function shuffleCards() {
  const id = setInterval(shuffle, 12);
  let shuffleCount = 0;

  function shuffle() {
    randomizeCardPosition();
    animateShuffle(shuffleCount);
    if (shuffleCount == 500) {
      clearInterval(id);
      shufflingInProgress = false;
      removeShuffleClasses();
      dealCards();
      updateStatusElement(
        currentGameStatusElem,
        "block",
        primaryColor,
        "Pick a Card!"
      );
    } else {
      shuffleCount++;
    }
  }
}

function randomizeCardPosition() {
  const random1 = Math.floor(Math.random() * numCards) + 1;
  const random2 = Math.floor(Math.random() * numCards) + 1;

  const temp = cardPositions[random1 - 1];

  cardPositions[random1 - 1] = cardPositions[random2 - 1];
  cardPositions[random2 - 1] = temp;
}

function dealCards() {
  addCardsToAppropriateCell();
  const areasTemplate = returnGridAreasMappedToCardPos();
  transformGridArea(areasTemplate);
}

function returnGridAreasMappedToCardPos() {
  let firstPart = "";
  let secondPart = "";
  let areas = "";
  cards.forEach((card, index) => {
    if (cardPositions[index] == 1) {
      areas = areas + "a ";
    } else if (cardPositions[index] == 2) {
      areas = areas + "b ";
    } else if (cardPositions[index] == 3) {
      areas = areas + "c ";
    } else if (cardPositions[index] == 4) {
      areas = areas + "d ";
    }

    if (index == 1) {
      firstPart = areas.substring(0, areas.length - 1);
    } else if (index == 3) {
      secondPart = areas.substring(firstPart.length + 1, areas.length - 1);
    }
  });

  return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropriateCell() {
  cards.forEach((card) => {
    addCardToGridCell(card);
  });
}

function createCards() {
  cardObjectDefinitions.forEach((cardItem) => {
    createCard(cardItem);
  });
}

function createCard(cardItem) {
  const cardElem = createElement("div");
  const cardInsideElem = createElement("div");
  const frontSideElem = createElement("div");
  const backSideElem = createElement("div");

  const cardFrontImg = createElement("img");
  const cardBackImg = createElement("img");

  addClassToElement(cardElem, "card");
  addClassToElement(cardElem, "fly-in");
  addClassToElement(cardElem, "hoverable");
  addIdToElement(cardElem, cardItem.id);

  addClassToElement(cardInsideElem, "card-inside");

  addClassToElement(frontSideElem, "front-side");

  addClassToElement(backSideElem, "back-side");

  addSrcToImageElem(cardBackImg, cardBackImgPath);

  addSrcToImageElem(cardFrontImg, cardItem.imagePath);

  addClassToElement(cardBackImg, "card-img");
  addClassToElement(cardFrontImg, "card-img");

  addChildElement(frontSideElem, cardFrontImg);
  addChildElement(backSideElem, cardBackImg);

  addChildElement(cardInsideElem, frontSideElem);
  addChildElement(cardInsideElem, backSideElem);

  addChildElement(cardElem, cardInsideElem);

  addCardToGridCell(cardElem);
  intializeCardPositions(cardElem);
  attachClickEventHandlerToCard(cardElem);
}

function attachClickEventHandlerToCard(card) {
  card.addEventListener("click", () => chooseCard(card));
}

function intializeCardPositions(card) {
  cardPositions.push(card.id);
}

function createElement(elemType) {
  return document.createElement(elemType);
}

function addClassToElement(elem, className) {
  elem.classList.add(className);
}

function addIdToElement(elem, id) {
  elem.id = id;
}

function addSrcToImageElem(imgElem, src) {
  imgElem.src = src;
}

function addChildElement(parentElem, childElem) {
  parentElem.appendChild(childElem);
}

function addCardToGridCell(card) {
  const cardPositionClassName = mapCardToGridCell(card);
  const cardPosElem = document.querySelector(cardPositionClassName);
  addChildElement(cardPosElem, card);
}

function mapCardToGridCell(card) {
  if (card.id == 1) {
    return ".card-pos-a";
  } else if (card.id == 2) {
    return ".card-pos-b";
  } else if (card.id == 3) {
    return ".card-pos-c";
  } else if (card.id == 4) {
    return ".card-pos-d";
  }
}

function getSerializedObjAsJSON(obj) {
  return JSON.stringify(obj);
}

function getObjectFromJSON(json) {
  return JSON.parse(json);
}

function updateLocalStorageItem(key, value) {
  localStorage.setItem(key, value);
}

function getLocalStorageItemValue(key) {
  return localStorage.getItem(key);
}

function removeLocalStorageItem(key) {
  localStorage.removeItem(key);
}

function updateGameObject(score, round) {
  gameObj.score = score;
  gameObj.round = round;
}

function saveGameObjectToLoclStorage(score, round) {
  updateGameObject(score, round);
  updateLocalStorageItem(localStorageGameKey, getSerializedObjAsJSON(gameObj));
}
