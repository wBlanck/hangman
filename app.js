// https://random-word-api.herokuapp.com/word?number=1 get random word
// https://rapidapi.com/community/api/urban-dictionary/ get definition

/* const getRandomWord = async () => {
  const base = "https://random-words-api.vercel.app/word";

  const response = await fetch(base);
  const data = await response.json();

  return data[0];
};

getRandomWord()
  .then((data) => console.log(data.word + " => definition: " + data.definition))
  .catch((error) => console.log(error));
 */
const chars =
  "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z".split(
    ", "
  );
const word = "hello".toUpperCase();
const answerContainer = document.querySelector(".answer");
const charsContainer = document.querySelector(".chars");
const displayContainer = document.querySelector(".display");

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
    livesHtml += ` <i class="fas fa-heart"></i>`;
  }
  displayContainer.innerHTML = livesHtml;
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
    displayContainer.children[0].remove();
    if (!livesLeft) {
      console.log("you lose buddy");
      element.classList.add("fade-out--wrong");
    } else {
      console.log(`lives: ${livesLeft} left`);
    }
  }
};
charsContainer.addEventListener("click", (e) => {
  const char = e.target.textContent;
  const clickedAChar = char.length <= 1;
  const gotLives = livesLeft > 0;
  const notWonYet = correctCharsLeft != 0;
  const notPressedBefore = e.target.classList.length <= 1;

  if (clickedAChar && gotLives && notWonYet && notPressedBefore) {
    checkChar(char, e.target);
  }
});
renderElements();
