function generateWinningNumber() {
    return Math.floor(100 * Math.random() + 1)
}

function shuffle(arr) {
    let m = arr.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

class Game {
    constructor() {
        this.winningNumber = generateWinningNumber();
        this.playersGuess = null;
        this.pastGuesses = [];
        this.playerFeedback = null;
        this.playerWin = false;
        this.playedHint = false;
    }

    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }

    isLower() {
        return this.playersGuess < this.winningNumber;
    }

    playersGuessSubmission(guess) {
        if (guess < 1 || guess > 100 || isNaN(guess)) {
            throw `That is an invalid guess.`;
        }
        this.playersGuess = guess;
        return this.checkGuess();
    }

    checkGuess() {
        let guess = this.playersGuess;
        let diff = this.difference();
        let feedbackText = '';

        if (this.playersGuess === this.winningNumber) {
            this.pastGuesses.push(guess);
            this.playerWin = true;
            feedbackText = `You Win!`;
        } else if (this.pastGuesses.includes(guess)) {
            feedbackText = `You have already guessed that number.`;
        } else {

            this.pastGuesses.push(guess);
            if (this.pastGuesses.length === 5) {
                feedbackText = `You Lose.`;
            } else {
                if (diff < 10) {
                    feedbackText = `You're burning up!`;
                } else if (diff < 25) {
                    feedbackText = `You're lukewarm.`;
                } else if (diff < 50) {
                    feedbackText = `You're a bit chilly.`;
                } else {
                    feedbackText = `You're ice cold!`;
                }
            }
        }
        this.playerFeedback = feedbackText;
        return feedbackText;
    }

    provideHint() {
        if(!this.playedHint) {
            let hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
            this.playedHint = true;
            return shuffle(hintArray).join(" - ");
        } else {
            return 'Sorry, once per game.';
        }
    }

    gameRest() {
        this.winningNumber = generateWinningNumber();
        this.playersGuess = null;
        this.pastGuesses = [];
        this.playerFeedback = '';
        this.playerWin = false;
    }
}

function newGame() {
    return new Game();
}

(function(){
    const game = new Game();
    const submitButton = document.querySelector('#submit');
    const resetButton = document.querySelector('#resetButton');
    const guessedInput = document.querySelector('input#guess');
    const hintButton = document.querySelector('#hint');

    function updateHeatMap() {
        document.querySelector('#message').innerHTML = `${game.playerFeedback}`;
    }

    function displayGuess() {
        game.pastGuesses.map((val) => {
            document.querySelector(`#guess-list li:nth-child(${game.pastGuesses.length})`).innerHTML = val;
        })
    }

    function nextPlayHint() {
        document.querySelector('#nextPlayHint').innerHTML = `${game.isLower() ? 'Guess Higher' : 'Guess Lower!'}`;
    }

// Submit Guess
    function submitGuess(){
        game.playersGuessSubmission(parseInt(guessedInput.value));
        guessedInput.value = '';
        displayGuess();
        updateHeatMap();
        nextPlayHint();
    }

    submitButton.addEventListener('click', (e) => {
        submitGuess();
    });
    document.addEventListener('keydown', (event) => {
        if(event.key === 'Enter'){
            submitGuess();
        }
    })

// Reset Game
    resetButton.onclick = function () {
        document.querySelector('#message').innerHTML = 'Pick a number from 1-100';
        document.querySelector('#nextPlayHint').innerHTML = '';
        document.querySelectorAll('.guess').forEach(val => val.innerHTML = "_")
        game.gameRest();

    }

    // Hint
    hintButton.addEventListener('click', ()=>{
        document.querySelector('#nextPlayHint').innerHTML = game.provideHint();
    })
})()
