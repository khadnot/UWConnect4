/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let player1Name = localStorage.getItem("player1Name");
if (!player1Name) {
	player1Name = prompt("Player 1 enter your name");
	localStorage.setItem("player1Name", player1Name);
}
let player2Name = localStorage.getItem("player2Name");
if (!player2Name) {
	player2Name = prompt("Player 2 enter your name");
	localStorage.setItem("player2Name", player2Name);
}
let currPlayerName = player1Name || "Player 1";
let playerTurn = document.querySelector('#playerTurn');
let restartBtn = document.getElementById("reset");

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const board = document.getElementById('board');
  // TODO: add comment for this code
  // creates a top row where the player clicks to drop a piece
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  board.append(top);

  // TODO: add comment for this code
  // Iterates through the height and creates 6 table rows
  // then inside the first loop another loop iterates through the
  // width to create 7 table columns. Each cell will have a postion id
  // then append the cell to that row then the row to the game board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }

    board.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.classList.add('drop');
  piece.style.top = -50 * (y + 2);

  const position = document.getElementById(`${y}-${x}`);

  position.append(piece);
  
  let row5 = document.querySelector("table tr:nth-child(6)");
  row5.addEventListener("click", function() {
	  console.log("We Da Best Music!!");
  })
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  window.setTimeout(function() {
    alert(msg);
  }, 400);
}

restartBtn.addEventListener("click", function() {
	if (confirm("Restart Game??")) {
		if (confirm("Same Players??")) {
			location.reload();
		} else {
			localStorage.clear();
			location.reload();
		}
	} else {
		alert("Game Over!!");
	}
});
/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
	let loser = currPlayerName === player1Name ? player2Name : player1Name;
	playerTurn.innerText = `${currPlayerName} beat ${loser}!!`;
    return endGame(`${currPlayerName} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every((row) => row.every((cell) => cell))) {
    return endGame('Game Ended in a Tie!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
  player1Name = player1Name === null || 
  				player1Name === "" ? "Player 1" : player1Name;
  player2Name = player2Name === null || 
  				player2Name === "" ? "Player 2" : player2Name;
  currPlayerName = currPlayerName === player1Name ? player2Name : player1Name;
  playerTurn.innerText = `${currPlayerName} it's your turn!`
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) { // iterates through the columns
    for (let x = 0; x < WIDTH; x++) { //iterates through the rows
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; // horizontal win pattern
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; // vertical win pattern
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; // right diagonal win pattern
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; // left diagonal win pattern

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true; // if player gets any win combo, then function returns true for a win
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
playerTurn.innerText = `${currPlayerName} it's your turn!`;