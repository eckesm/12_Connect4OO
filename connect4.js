/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

/* **********************************************
----------------- Player class ------------------
********************************************** */
class Player {
	constructor(color) {
		this.color = color;
		this.playerNumber = undefined;
	}
}

/* **********************************************
------------------ Game class -------------------
********************************************** */
class Game {
	constructor(height, width) {
		this.height = height;
		this.width = width;
		this.currPlayer = undefined;
		// ---> SOLUTION: runs these functions when game is created
		this.makeStartBtn();
		this.gameOver = false;
		this.started = false;
	}
	// ____________________________________________

	updateGameColors(evt) {
		evt.preventDefault();
		for (let player of this.players) {
			player.color = document.querySelector(`#p${player.playerNumber}color`).value;

			const playerPieces = document.querySelectorAll(`.p${player.playerNumber}`);

			for (let piece of playerPieces) {
				console.log(piece, player.color);
				piece.style.backgroundColor = player.color;
			}
		}
	}
	// ____________________________________________

	makeStartBtn() {
		// create startbutton element
		const startBtn = document.createElement('button');
		startBtn.innerText = 'Start Game';
		startBtn.setAttribute('id', 'startbutton');

		// create bound event handler for start button click
		this.startGameHandlerBound = this.startGameHandler.bind(this);
		startBtn.addEventListener('click', this.startGameHandlerBound);

		document.querySelector('#game').prepend(startBtn);
		// console.log(document.querySelector('#game'))
	}

	// ____________________________________________

	// ----- Starting & Restarting the Game -----

	startGameHandler() {
		// processes to run only when game starts for the first time
		if (!this.started) {
			this.createColorForm();
			this.makePlayerObjects();
			this.setDefaultColors();
		}

		// processes to run when the game refreshes after the first load
		if (this.started) {
			document.querySelector('#board').innerHTML = '';
			document.querySelector('#startbutton').innerText = 'Restart Game';
		}

		// processes to run on first load and every subsequent restart
		this.makeBoard();
		this.makeHtmlBoard();
		this.gameOver = false;
		this.started = true;
		this.startPlayer1();
	}
	// --------------------------------------------
	createColorForm() {
		const newForm = document.createElement('form');
		newForm.setAttribute('id', 'colorform');
		document.querySelector('#game').insertBefore(newForm, board);

		for (let player of [ 1, 2 ]) {
			// create label and add to form
			const newLabel = document.createElement('label');
			newLabel.innerText = `Player ${player} color: `;
			newLabel.classList.add('colorlabels');
			newForm.append(newLabel);

			// create input and add to label
			const newColorInput = document.createElement('input');
			newColorInput.setAttribute('type', 'color');
			newColorInput.setAttribute('id', `p${player}color`);
			newLabel.append(newColorInput);
		}

		// add submit button to form
		const newSubmit = document.createElement('button');
		newSubmit.setAttribute('id', 'submitbutton');
		newSubmit.innerText = 'Update Colors';

		// create bound function for event listener callback
		this.updateGameColorsBound = this.updateGameColors.bind(this);
		newSubmit.addEventListener('click', this.updateGameColorsBound);

		// append submit button to form
		newForm.append(newSubmit);
  }
  // --------------------------------------------
	makePlayerObjects() {
		this.players = [];
		for (let player of [ 1, 2 ]) {
			const newPlayer = new Player(document.querySelector(`#p${player}color`).value);
			newPlayer.playerNumber = player;
			this.players.push(newPlayer);
		}
  }
  // --------------------------------------------
  setDefaultColors() {
		for (let player of this.players) {
			if (player.playerNumber === 1) {
				document.querySelector(`#p${player.playerNumber}color`).value = '#ff0000';
				player.color = '#ff0000';
			}

			if (player.playerNumber === 2) {
				document.querySelector(`#p${player.playerNumber}color`).value = '#0000ff';
				player.color = '#0000ff';
			}
		}
	}
	// --------------------------------------------
	makeBoard() {
		this.board = [];
		for (let y = 0; y < this.height; y++) {
			this.board.push(Array.from({ length: this.width }));
		}
	}

	// --------------------------------------------

	makeHtmlBoard() {
		const HTMLboard = document.getElementById('board');

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement('tr');
		top.setAttribute('id', 'column-top');

		this.handleClickBound = this.handleClick.bind(this); // ---> SOLUTION: bind handleClick function to this... because the event listener will be triggered on HTML board and not in class?
		top.addEventListener('click', this.handleClickBound);

		for (let x = 0; x < this.width; x++) {
			const headCell = document.createElement('td');
			headCell.setAttribute('id', x);
			top.append(headCell);
		}

		HTMLboard.append(top);

		// make main part of board
		for (let y = 0; y < this.height; y++) {
			const row = document.createElement('tr');

			for (let x = 0; x < this.width; x++) {
				const cell = document.createElement('td');
				cell.setAttribute('id', `${y}-${x}`);
				row.append(cell);
			}

			HTMLboard.append(row);
		}
  }
  // --------------------------------------------
  startPlayer1() {
		// make players with default colors
		for (let player of this.players) {
			if (player.playerNumber === 1) this.currPlayer = player;
		}
	}
	// ____________________________________________

	findSpotForCol(x) {
		for (let y = this.height - 1; y >= 0; y--) {
			if (!this.board[y][x]) {
				return y;
			}
		}
		return null;
	}

	// ____________________________________________

	placeInTable(y, x) {
		const piece = document.createElement('div');
		piece.classList.add('piece');
		piece.classList.add(`p${this.currPlayer.playerNumber}`);
		piece.style.top = -50 * (y + 2);
		piece.style.backgroundColor = this.currPlayer.color;

		const spot = document.getElementById(`${y}-${x}`);
		spot.append(piece);
	}

	// ____________________________________________

	endGame(msg) {
		// prevent additional moves from being made before game is restarted
		this.gameOver = true;

		// prompt players to start a new game
		document.querySelector('#startbutton').innerText = 'Start a New Game!';

		alert(msg);
	}

	// ____________________________________________

	handleClick(evt) {
		// prevent additional moves from being made if the game has ended and not been restarted yet
		if (this.gameOver) return;

		// get x from ID of clicked cell
		const x = +evt.target.id;
		// get next spot in column (if none, ignore click)
		const y = this.findSpotForCol(x);

		if (y === null) {
			return;
		}

		// place piece in board and add to HTML table
		this.board[y][x] = this.currPlayer;
		this.placeInTable(y, x);

		// check for win
		if (this.checkForWin()) {
			return this.endGame(`Player ${this.currPlayer.playerNumber} won!`);
		}

		// check for tie
		if (this.board.every(row => row.every(cell => cell))) {
			return this.endGame('Tie!');
		}

		// switch players
		if (this.currPlayer === this.players[0]) {
			this.currPlayer = this.players[1];
		} else {
			this.currPlayer = this.players[0];
		}
	}

	// ____________________________________________

	checkForWin() {
		const _win = cells => {
			// ---> SOLUTION: arrow function because it does not create a new this.
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match currPlayer

			return cells.every(
				([ y, x ]) => y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer
			);
		};

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
				const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
				const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
				const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

				// find winner (only checking each win-possibility as needed)
				if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
					return true;
				}
			}
		}
	}
}

/* **********************************************
-------------- Code to Run on Load --------------
********************************************** */

const game1 = new Game(6, 7);
