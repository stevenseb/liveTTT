let currentPlayer = 'X'; // Player X always starts
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 3x3 game board
let gameActive = true;
let clickedCellIndex;

window.addEventListener('load', () => {
  const storedGameBoard = localStorage.getItem('gameBoard');
  const storedCurrentPlayer = localStorage.getItem('currentPlayer');

  if (storedGameBoard && storedCurrentPlayer) {
    gameBoard = JSON.parse(storedGameBoard);
    console.log(gameBoard);
    let store = storedCurrentPlayer;
    // Iterate through the cells and update the board based on the saved game state
    gameBoard.forEach((cell, index) => {
      if (cell !== '') {
        currentPlayer = cell;
        let target = `square-${index}`;
        if (currentPlayer === 'X') {
          imgSrc = 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg'
        } else if (currentPlayer === 'O') {
          imgSrc = 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg'
        }
      
        let e = document.createElement("img");
        e.setAttribute("src", `${imgSrc}`);
        e.setAttribute("height", "40");
        e.setAttribute("alt", "U");
        document.getElementById(target).appendChild(e);
      }
    });
    currentPlayer = store;
  }
});

function saveGameState() {
  localStorage.setItem('gameBoard', JSON.stringify(gameBoard));
  localStorage.setItem('currentPlayer', currentPlayer);
}

// Call this function after a game reset to clear local storage
function clearLocalStorage() {
  localStorage.removeItem('gameBoard');
  localStorage.removeItem('currentPlayer');
}


document.getElementById("giveUp").disabled = false;
document.getElementById("resetButton").disabled = false;

function handlePlayerTurn(clickedCellIndex) {
  if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
      return;
  }
  gameBoard[clickedCellIndex] = currentPlayer;
  checkWinOrDraw();
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  saveGameState();
}

function cellClicked(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  clickedCellIndex = parseInt(clickedCell.id.replace('square-', ''));
  if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
      return;
  }
  updateBoard();
  handlePlayerTurn(clickedCellIndex);
  saveGameState();
}

// attach listener to each cell
const cells = document.querySelectorAll('.cell');

cells.forEach(cell => {
  cell.addEventListener('click', cellClicked, false);
});

function updateBoard() {
  let imgSrc;
  let i = clickedCellIndex;
  if (currentPlayer === 'X') {
    imgSrc = 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-x.svg'
  } else if (currentPlayer === 'O') {
    imgSrc = 'https://assets.aaonline.io/Module-DOM-API/formative-project-tic-tac-toe/player-o.svg'
  }

  let e = document.createElement("img");
  e.setAttribute("src", `${imgSrc}`);
  e.setAttribute("height", "40");
  e.setAttribute("alt", "U");
  document.getElementById(`square-${i}`).appendChild(e);
}

function declareWinner(player) {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText = `Winner: ${player}`;
  document.getElementById("giveUp").disabled = true;
}

function declareDraw() {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText ="Winner: None";
  document.getElementById("giveUp").disabled = true;
}

const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Left-to-right diagonal
  [2, 4, 6]  // Right-to-left diagonal
];

function checkWinOrDraw() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
          roundWon = true;
          break;
      }
  } 

  if (roundWon) {
      declareWinner(currentPlayer);
      gameActive = false;
      document.getElementById("resetButton").disabled = false;
      return;
  }

  let roundDraw = !gameBoard.includes('');
  if (roundDraw) {
      declareDraw();
      gameActive = false;
      document.getElementById("resetButton").disabled = false;
      return;
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  document.getElementById("resetButton").disabled = true;
  document.getElementById("giveUp").disabled = false;
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
      cell.innerText = '';
  });
  document.getElementById('gameMessage').innerText = '';
  clearLocalStorage();
}

// event listeners for buttons

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame, false);

const giveUp = document.getElementById('giveUp');
giveUp.addEventListener("click", (event) => {
  let loser;
  if (currentPlayer==='X') loser = 'O';
  if (currentPlayer==='O') loser = 'X';
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText =`Winner: ${loser}`;
  document.getElementById("resetButton").disabled = false;
  document.getElementById("giveUp").disabled = true;
  event.preventDefault();
});
