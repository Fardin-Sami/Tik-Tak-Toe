let board = Array(9).fill(null);
let gameActive = false;
let currentMode = 'hard'; 
let gameType = 'pvc'; // 'pvc' (Player vs Computer) or 'pvp' (Player vs Player)
let currentPlayer = HUMAN; // Tracks whose turn it is in PvP mode
let lastHumanMoveIndex = -1;

// Screen & UI Elements
const startScreen = document.getElementById('start-screen');
const modeScreen = document.getElementById('mode-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const boxes = document.querySelectorAll('.box');
const resultMessage = document.getElementById('result-message');
const turnIndicator = document.getElementById('turn-indicator');

// Buttons
const btnPvc = document.getElementById('btn-pvc');
const btnPvp = document.getElementById('btn-pvp');
const modeBtns = document.querySelectorAll('.menu-btn[data-mode]');
const resetGameBtn = document.querySelector('.resetGame');
const backToMenuBtn = document.getElementById('back-to-menu');
const playAgainBtn = document.getElementById('play-again');

// --- EVENT LISTENERS ---

// 1. Initial Menu Selection
btnPvc.addEventListener('click', () => {
    gameType = 'pvc';
    startScreen.classList.add('hidden');
    modeScreen.classList.remove('hidden');
});

btnPvp.addEventListener('click', () => {
    gameType = 'pvp';
    startScreen.classList.add('hidden');
    startGame();
});

// 2. AI Difficulty Selection
modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.dataset.mode) {
            currentMode = e.target.dataset.mode;
            startGame();
        }
    });
});

// 3. Gameplay Clicks
boxes.forEach((box, index) => {
    box.addEventListener('click', () => {
        if (board[index] === null && gameActive) {
            
            if (gameType === 'pvp') {
                // PvP Mode: Two Humans
                makeMove(index, currentPlayer);
                if (!checkGameOver()) {
                    // Switch turn to the other player
                    currentPlayer = currentPlayer === HUMAN ? AI : HUMAN;
                    updateTurnIndicator();
                }
            } else {
                // PvC Mode: Human vs Computer
                lastHumanMoveIndex = index; 
                makeMove(index, HUMAN);
                
                if (!checkGameOver()) {
                    gameActive = false; // Lock board while AI thinks
                    setTimeout(aiMove, 600); 
                }
            }
        }
    });
});

// 4. Navigation Buttons
resetGameBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);
backToMenuBtn.addEventListener('click', () => location.reload());

// --- GAME FUNCTIONS ---

function startGame() {
    board = Array(9).fill(null);
    gameActive = true;
    lastHumanMoveIndex = -1;
    currentPlayer = HUMAN; // Always start with X
    
    // Clear the visual board and remove color classes
    boxes.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('x-mark', 'o-mark');
    });

    // Handle Screen Visibility
    startScreen.classList.add('hidden');
    modeScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    updateTurnIndicator();
}

function updateTurnIndicator() {
    if (gameType === 'pvp') {
        turnIndicator.innerText = `Player ${currentPlayer}'s Turn`;
        turnIndicator.classList.remove('hidden');
        // Change color based on whose turn it is
        turnIndicator.style.color = currentPlayer === HUMAN ? '#00d2ff' : '#ff0080';
    } else {
        turnIndicator.classList.add('hidden');
    }
}

function makeMove(index, player) {
    board[index] = player;
    boxes[index].innerHTML = `<span>${player}</span>`; 
    // Add CSS class for neon colors
    boxes[index].classList.add(player === HUMAN ? 'x-mark' : 'o-mark');
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
        if (!checkGameOver()) {
            gameActive = true; 
        }
    }
}

function checkGameOver() {
    const modeName = currentMode === "easy" ? "Thor" : "Strange";

    if (checkWin(board, HUMAN)) {
        if (gameType === 'pvp') endGame("Player X Wins!");
        else endGame(`You Win! (${modeName} Mode)`);
        return true;
    } else if (checkWin(board, AI)) {
        if (gameType === 'pvp') endGame("Player O Wins!");
        else endGame(`${modeName} Wins!`);
        return true;
    } else if (getEmptySpots(board).length === 0) {
        if (gameType === 'pvp') endGame("It's a Tie!");
        else endGame(`It's a Tie! (${modeName} Mode)`);
        return true;
    }
    return false;
}

function endGame(message) {
    gameActive = false;
    setTimeout(() => {
        gameScreen.classList.add('hidden');
        resultMessage.innerText = message;
        resultScreen.classList.remove('hidden');
    }, 800);
}