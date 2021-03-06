// https://random-word-api.herokuapp.com/word?number=1 get random word
// https://api.dictionaryapi.dev/api/v2/entries/en/ get definition

const getRandomWord = async () => {
  const base = "https://random-word-api.herokuapp.com/word?number=1";

  const response = await fetch(base);
  const data = await response.json();

  return data[0];
};

const getDefinition = async (word) => {
  const base = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  const response = await fetch(base);
  const data = await response.json();
  return data[0];
};

const fetchData = async () => {
  const word = await getRandomWord();
  const definition = await getDefinition(word);
  return [word, definition];
};

fetchData()
  .then((data) => {
    if (data[1]) {
      playGame(data[0], data[1]);
    } else {
      location.reload();
    }
  })
  .catch((error) => console.log(error));

const playGame = (randomWord, definition) => {
  const chars =
    "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z".split(
      ", "
    );
  const word = randomWord.toUpperCase();
  const hint = definition.meanings[0].definitions[0].definition;

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
  const hangmanParts = document.querySelectorAll(".hangman div");

  let livesLeft = 10;
  let correctCharsLeft = word.length;

  const renderElements = () => {
    let charsHtml = "";
    let answerHtml = "";
    let livesHtml = "";
    let tradeButtonsHtml = "";
    livesLeft = 10;
    correctCharsLeft = word.length;
    answerContainer.style.color = "#000";

    tradeButtonsHtml = `
      <button class="trade-btn">Char</button>
      <button class="hint-btn">Hint</button>
    `;
    //renders out the trade buttons
    tradeButtons.innerHTML = tradeButtonsHtml;
    //renders out char buttons
    chars.forEach((char) => {
      charsHtml += `<div class="char">${char}</div>`;
    });
    charsContainer.innerHTML = charsHtml;
    //renders out a "_" for each char in word
    for (let i = 0; i < word.length; i++) {
      answerHtml += `<div class="correct-char underline"></div>`;
    }
    answerContainer.innerHTML = answerHtml;
    //renders the lives
    for (let i = 0; i < livesLeft; i++) {
      livesHtml += `<i class="fas fa-heart"></i>`;
    }
    livesContainer.innerHTML = livesHtml;
  };

  const showHint = () => {
    hintContainer.innerHTML = `<p>Hint: ${hint}</p>`;
    livesLeft--;
    hangmanParts[livesLeft].style.opacity = "1";
    livesContainer.children[0].remove();
    tradeButtons.children[1].style.display = "none";
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
    hangmanParts[livesLeft].style.opacity = "1";
    livesContainer.children[0].remove();
  };

  const showChars = () => {
    Array.from(answerContainer.children).forEach((ele, i) => {
      ele.textContent = word[i];
      ele.classList.remove("underline");
    });
  };

  const tradeLife = (choice) => {
    if (choice === "char" && livesLeft > 1) {
      showChar();
    } else if (choice === "hint" && !hintContainer.innerHTML && livesLeft > 1) {
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
          //CHECK IF WON
          if (!correctCharsLeft) {
            tradeButtons.children[0].textContent = "Restart Game";
            answerContainer.style.color = "green";
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
      hangmanParts[livesLeft].style.opacity = "1";
      livesContainer.children[0].remove();
      // CHECK IF LOST
      if (!livesLeft) {
        tradeButtons.children[0].textContent = "Restart Game";
        answerContainer.style.color = "red";
        element.classList.add("fade-out--wrong");
        showChars();
      } else {
        console.log(`lives: ${livesLeft} left`);
      }
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
    } else if (buttonClicked === "restart game") {
      /* renderElements(); */
      location.reload();
    }
  });

  renderElements();
};
