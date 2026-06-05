let board = Array(9).fill(null);
let gameActive = false;
let currentMode = 'hard'; 
let lastHumanMoveIndex = -1;

// Screen & UI Elements
const modeScreen = document.getElementById('mode-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');

// Buttons
const modeBtns = document.querySelectorAll('.menu-btn');
const resetGameBtn = document.querySelector('.resetGame');
const backToMenuBtn = document.getElementById('back-to-menu');
const playAgainBtn = document.getElementById('play-again');
const drax = document.getElementById("drax");
const strange = document.getElementById("strange");

// --- EVENT LISTENERS ---

// 1. Mode Selection Menu
modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.dataset.mode) {
            currentMode = e.target.dataset.mode;
            startGame();
        }
    });
});

strange.addEventListener("mouseover", () => {
    strange.style.backgroundColor = "red";
    strange.style.color = "black";
});

strange.addEventListener("mouseout", () => {
    strange.style.backgroundColor = "black";
    strange.style.color = "white";
});

drax.addEventListener("mouseover", () => {
    drax.style.backgroundColor = "green";
    drax.style.color = "black";
});

drax.addEventListener("mouseout", () => {
    drax.style.backgroundColor = "black";
    drax.style.color = "white";
});

// 2. Gameplay Clicks
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        // Allow move only if spot is empty AND it is human's turn (gameActive is true)
        if (board[index] === null && gameActive) {
            lastHumanMoveIndex = index; // Save this for the Easy AI to track
            makeMove(index, HUMAN);
            
            if (!checkGameOver()) {
                // Lock the board temporarily so human can't click while AI is "thinking"
                gameActive = false; 
                // Add a 600ms delay for the AI move
                setTimeout(aiMove, 600); 
            }
        }
    });
});

// 3. Navigation Buttons
resetGameBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);
backToMenuBtn.addEventListener('click', () => {
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
});

// --- GAME FUNCTIONS ---

function startGame() {
    board = Array(9).fill(null);
    gameActive = true;
    lastHumanMoveIndex = -1;
    
    // Clear the visual board
    boxes.forEach(box => {
        box.innerHTML = "";
    });

    // Handle Screen Visibility
    modeScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

function makeMove(index, player) {
    board[index] = player;
    // We wrap the text in a <span> so the CSS @keyframes animation triggers
    boxes[index].innerHTML = `<span>${player}</span>`; 
}

function aiMove() {
    let moveIndex = -1;
    
    if (currentMode === 'easy') {
        moveIndex = getEasyMove(board, lastHumanMoveIndex);
    } else {
        moveIndex = getBestMove(board);
    }

    if (moveIndex !== -1) {
        makeMove(moveIndex, AI);
        
        // Unlock the board for the human's next turn if the game isn't over
        if (!checkGameOver()) {
            gameActive = true; 
        }
    }
}

function checkGameOver() {
    // 1. Capitalize the first letter so 'easy' becomes 'Easy'
    const mode = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
    const modeName = mode === "Easy" ? "Drax" : "Strange";

    // 2. Add the modeName into the winning/tying messages
    if (checkWin(board, HUMAN)) {
        endGame(`You Win! (${modeName} Mode)`);
        return true;
    } else if (checkWin(board, AI)) {
        endGame(`${modeName} Wins!`);
        return true;
    } else if (getEmptySpots(board).length === 0) {
        endGame(`It's a Tie! (${modeName} Mode)`);
        return true;
    }
    return false;
}

function endGame(message) {
    gameActive = false;
    
    // Wait 800ms before showing the result screen so the final animation finishes
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        resultMessage.innerText = message;
        resultScreen.classList.remove('hidden');
    }, 800);
}