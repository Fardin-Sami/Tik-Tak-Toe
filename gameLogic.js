const HUMAN = 'X';
const AI = 'O';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8], 
  [0, 4, 8], [2, 4, 6]             
];

function checkWin(board, player) {
  return WIN_COMBOS.some(combo => {
    return combo.every(index => board[index] === player);
  });
}

function getEmptySpots(board) {
  return board.map((val, index) => val === null ? index : null).filter(val => val !== null);
}

// --- HARD MODE LOGIC (Minimax) ---
function minimax(board, depth, isMaximizing) {
  if (checkWin(board, AI)) return 10 - depth;      
  if (checkWin(board, HUMAN)) return depth - 10;   
  if (getEmptySpots(board).length === 0) return 0; 

  if (isMaximizing) {
    let bestScore = -Infinity;
    let emptySpots = getEmptySpots(board);
    for (let i = 0; i < emptySpots.length; i++) {
      let spot = emptySpots[i];
      board[spot] = AI; 
      let score = minimax(board, depth + 1, false); 
      board[spot] = null; 
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    let emptySpots = getEmptySpots(board);
    for (let i = 0; i < emptySpots.length; i++) {
      let spot = emptySpots[i];
      board[spot] = HUMAN; 
      let score = minimax(board, depth + 1, true); 
      board[spot] = null; 
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

function getBestMove(board) {
  let bestScore = -Infinity;
  let move = -1;
  let emptySpots = getEmptySpots(board);
  for (let i = 0; i < emptySpots.length; i++) {
    let spot = emptySpots[i];
    board[spot] = AI; 
    let score = minimax(board, 0, false); 
    board[spot] = null; 
    if (score > bestScore) {
      bestScore = score;
      move = spot;
    }
  }
  return move;
}

// --- EASY MODE LOGIC ---
// Map of valid adjacent neighbors for every grid index (horizontal, vertical, diagonal)
const ADJACENT_MAP = {
    0: [1, 3, 4],
    1: [0, 2, 3, 4, 5],
    2: [1, 4, 5],
    3: [0, 1, 4, 6, 7],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [1, 2, 4, 7, 8],
    6: [3, 4, 7],
    7: [3, 4, 5, 6, 8],
    8: [4, 5, 7]
};

function getEasyMove(board, lastHumanMove) {
    let emptySpots = getEmptySpots(board);
    if (emptySpots.length === 0) return -1;

    // Try to pick an empty spot adjacent to the human's last move
    if (lastHumanMove !== -1 && ADJACENT_MAP[lastHumanMove]) {
        let adjacentIndices = ADJACENT_MAP[lastHumanMove];
        let emptyAdjacent = adjacentIndices.filter(index => board[index] === null);
        
        if (emptyAdjacent.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyAdjacent.length);
            return emptyAdjacent[randomIndex];
        }
    }
    
    // Fallback: If no adjacent spots are open, pick a completely random open spot
    let randomFallback = Math.floor(Math.random() * emptySpots.length);
    return emptySpots[randomFallback];
}