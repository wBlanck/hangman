// https://random-word-api.herokuapp.com/word?number=1 get random word
// https://rapidapi.com/community/api/urban-dictionary/ get definition

/* const getRandomWord = async () => {
  const base = "https://random-words-api.vercel.app/word";

  const response = await fetch(base);
  const data = await response.json();

  return data[0];
};

getRandomWord()
  .then((data) => {

  })
  .catch((error) => console.log(error));

 */

const chars =
  "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z".split(
    ", "
  );
const word = "Honorificabilit".toUpperCase();
const hint = "Its not right you silly goose";

const answerContainer = document.querySelector(".answer");
const charsContainer = document.querySelector(".chars");
const displayContainer = document.querySelector(".display");
const livesContainer = document.querySelector(".lives");
const hintContainer = document.querySelector(".hint");
const tradeButtons = document.querySelector(".buttons");
const charBtn = document.querySelector(".trade-btn");
const hintBtn = document.querySelector(".hint-btn");
const tradeModal = document.querySelector(".trade-modal");
const tradeModalButtons = document.querySelectorAll(
  ".trade-modal .buttons button"
);

let livesLeft = 9;
let correctCharsLeft = word.length;

const renderElements = () => {
  let charsHtml = "";
  let answerHtml = "";
  let livesHtml = "";

  chars.forEach((char) => {
    charsHtml += `<div class="char">${char}</div>`;
  });

  charsContainer.innerHTML = charsHtml;
  for (let i = 0; i < word.length; i++) {
    answerHtml += `<div class="correct-char underline"></div>`;
  }
  answerContainer.innerHTML = answerHtml;

  for (let i = 0; i < livesLeft; i++) {
    livesHtml += `<i class="fas fa-heart"></i>`;
  }
  livesContainer.innerHTML = livesHtml;
};
const showHint = () => {
  hintContainer.innerHTML = `<p>Hint: ${hint}</p>`;
  livesLeft--;
  livesContainer.children[0].remove();
  hintBtn.remove();
};
const showChar = () => {
  //hidden chars left to guess
  const charsLeft = Array.from(answerContainer.children).filter(
    (ele) => ele.classList.length > 1
  );
  const randomNum = Math.floor(Math.random() * charsLeft.length);
  //randomize one hidden char
  const randomChar = charsLeft[randomNum];
  //store index of hidden char in parent container (answerContainer)
  let indexOfChar = Array.from(randomChar.parentNode.children).indexOf(
    randomChar
  );
  //store the hidden char
  let hiddenChar = word[indexOfChar];
  //filter out the hidden char element from the key char
  let charElement = Array.from(charsContainer.children).filter(
    (char) => char.textContent === hiddenChar
  );
  //check the hidden char and the key char element
  checkChar(hiddenChar, charElement[0]);

  livesLeft--;
  livesContainer.children[0].remove();
};
const tradeLife = (choice) => {
  if (choice === "char") {
    showChar();
  } else if (choice === "hint" && !hintContainer.innerHTML) {
    showHint();
  }
};

const checkChar = (char, element) => {
  // if word contains the clicked char, loop through the correct word char by char, compare clicked char to correct char if true display it
  // else livesLeft--
  if (word.includes(char)) {
    for (let i = 0; i < word.length; i++) {
      if (char === word[i]) {
        correctCharsLeft--;
        if (!correctCharsLeft) {
          console.log("you won");
        }
        const correctCharElement = answerContainer.children[i];

        correctCharElement.textContent = char;
        correctCharElement.classList.remove("underline");
        element.classList.add("fade-out--correct");
      }
    }
  } else {
    element.classList.add("fade-out--wrong");
    livesLeft--;
    livesContainer.children[0].remove();
    if (!livesLeft) {
      console.log("you lose buddy");
      element.classList.add("fade-out--wrong");
    } else {
      console.log(`lives: ${livesLeft} left`);
    }
  }
};

const confirmAndCloseModal = (choice) => {
  if (choice === "Yes") {
    tradeModal.classList.remove("show");
    console.log(`i want to trade a life for: ${choice}`);
    tradeLife(choice);
  } else {
    console.log(`i dont want to trade`);
    tradeModal.classList.remove("show");
  }
};

const confirmTrade = (choice) => {
  tradeModal.classList.add("show");
  tradeModalButtons[0].onclick = (e) => {
    tradeModal.classList.remove("show");
    console.log(`i want to trade a life for: ${choice}`);
    tradeLife(choice);
  };
  tradeModalButtons[1].onclick = (e) => {
    console.log(`i dont want to trade`);
    tradeModal.classList.remove("show");
  };
};

charsContainer.addEventListener("click", (e) => {
  const char = e.target.textContent;
  const clickedAChar = char.length <= 1;
  const gotLives = livesLeft > 0;
  const notWonYet = correctCharsLeft != 0;
  const notPressedBefore = e.target.classList.length <= 1;

  if (clickedAChar && gotLives && notWonYet && notPressedBefore) {
    console.log("check char");
    checkChar(char, e.target);
  }
});

tradeButtons.addEventListener("click", (e) => {
  const buttonClicked = e.target.textContent.toLowerCase();
  if (buttonClicked === "char") {
    confirmTrade(buttonClicked);
  } else if (buttonClicked === "hint") {
    confirmTrade(buttonClicked);
  }
});

renderElements();
