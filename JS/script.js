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
let maxRound = 10;
let score = 0;

loadGame();

function chooseCard(card) {
  if (canChooseCard()) {
    evaluateCardChoice(card);
    flipCard(card, false);
  }
}

function calculateScoreToAdd(roundNum) {
  let standardPoints = 50;
  return roundNum * 50;
}

function updateScore() {
  const scoreToAdd = calculateScoreToAdd(roundNum);
  score = score + scoreToAdd;
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

  startGameBtnElem.addEventListener("click", () => startGame());
}

function startGame() {
  intializeNewGame();
  startRound();
}

function intializeNewGame() {
  score = 0;
  roundNum = 0;
  shufflingInProgress = false;
  updateStatusElement(scoreContainerElem, "flex");
  updateStatusElement(roundContainerElem, "flex");
  updateStatusElement(
    scoreElem,
    "block",
    primaryColor,
    `Score <span class="badge">${score}</span>`
  );
  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class="badge">${roundNum}</span>`
  );
}

function startRound() {
  intializeNewRound();
  collectCards();
  flipCards(true);
  shuffleCards();
}

function intializeNewRound() {
  roundNum++;
  // startGameBtnElem.disabled = true;
  gameInProgress = true;
  shufflingInProgress = true;
  cardsRevealed = false;
  updateStatusElement(
    currentGameStatusElem,
    "block",
    primaryColor,
    "Shuffling..."
  );
  updateStatusElement(
    roundElem,
    "block",
    primaryColor,
    `Round <span class="badge">${roundNum}</span>`
  );
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

function shuffleCards() {
  const id = setInterval(shuffle, 12);
  let shuffleCount = 0;

  function shuffle() {
    randomizeCardPosition();

    if (shuffleCount == 500) {
      clearInterval(id);
      dealCards();
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
