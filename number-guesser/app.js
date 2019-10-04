/**
 * GAME FUNCTION:
 * - Player must guess a number between a min and max
 * - Player gets a certain amount of guesses
 * - Notify player of guesses remaining
 * - Notify the player of the correct answer if lose
 * - Let player choose to play again
 **/

// Game values
let min = 1;
let max = 10;
let winningNum = 2;
let guessesLeft = 3;

// UI Elements
const game = document.querySelector('#game');
const minNum = document.querySelector('.min-num');
const maxNum = document.querySelector('.max-num');
const guessBtn = document.querySelector('#guess-btn');
const guessInput = document.querySelector('#guess-input');
const message = document.querySelector('.message');

// Assign UI min and max
minNum.textContent = min;
maxNum.textContent = max;

guessBtn.addEventListener('click', function() {
  let guess = parseInt(guessInput.value);
  console.log(guessInput.value);

  // Check if won
  if (guess === winningNum) {
    // Game over - won
    gameOver(true, `${winningNum} is correct, YOU WON!`);
  } else {
    guessesLeft -= 1; // Wrong guess

    if (guessesLeft === 0) {
      // Game over - lost
      gameOver(
        false,
        `Game Over, YOU LOST! The correct number was ${winningNum}.`
      );
    } else {
      // Game continues - answer wrong

      guessInput.value = ''; // Clear input
      guessInput.style.borderColor = 'red'; // Change border color
      setMessage(
        `${guess} is not correct, ${guessesLeft} guesses left.`,
        'red'
      ); // Tell user it's wrong guess
    }
  }

  // Validate
  if (isNaN(guess) || guess < min || guess > max) {
    setMessage(`Please enter a number between ${min} and ${max}`, 'red');
  }
});

// Game over
function gameOver(won, msg) {
  let color;
  won === true ? (color = 'green') : (color = 'red');

  guessInput.disabled = true; // Disable input
  guessInput.style.borderColor = color; // Change border color
  message.style.color = color; // Set text color
  setMessage(msg); // Set message
}

// Set message
function setMessage(msg, color) {
  message.style.color = color;
  message.textContent = msg;
}
