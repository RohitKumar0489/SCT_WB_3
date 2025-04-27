document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = false;
    let gameMode = null; // 'pvp' or 'pvc'
    let scores = { X: 0, O: 0 };
    
    // DOM elements
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const playerXScore = document.getElementById('playerX');
    const playerOScore = document.getElementById('playerO');
    const pvpBtn = document.getElementById('pvpBtn');
    const pvcBtn = document.getElementById('pvcBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Winning conditions
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    // Initialize game
    function initGame(mode) {
        gameMode = mode;
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
            cell.addEventListener('click', handleCellClick);
        });
        
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    // Handle cell click
    function handleCellClick(e) {
        if (!gameActive) return;
        
        const cell = e.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));
        
        if (board[cellIndex] !== '') return;
        
        makeMove(cell, cellIndex);
        
        // If playing against computer and game is still active
        if (gameMode === 'pvc' && gameActive && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    // Make a move
    function makeMove(cell, cellIndex) {
        board[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        
        if (checkWin()) {
            handleWin();
            return;
        }
        
        if (checkDraw()) {
            handleDraw();
            return;
        }
        
        switchPlayer();
    }
    
    // Computer move (simple AI)
    function computerMove() {
        if (!gameActive) return;
        
        // Try to win if possible
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (checkWin('O')) {
                    board[i] = '';
                    return makeMove(cells[i], i);
                }
                board[i] = '';
            }
        }
        
        // Block player from winning
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (checkWin('X')) {
                    board[i] = '';
                    return makeMove(cells[i], i);
                }
                board[i] = '';
            }
        }
        
        // Take center if available
        if (board[4] === '') {
            return makeMove(cells[4], 4);
        }
        
        // Take a random available corner
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(index => board[index] === '');
        if (availableCorners.length > 0) {
            const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
            return makeMove(cells[randomCorner], randomCorner);
        }
        
        // Take any available space
        const availableSpaces = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (availableSpaces.length > 0) {
            const randomSpace = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
            return makeMove(cells[randomSpace], randomSpace);
        }
    }
    
    // Check for win
    function checkWin(player = currentPlayer) {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return board[index] === player;
            });
        });
    }
    
    // Check for draw
    function checkDraw() {
        return board.every(cell => cell !== '');
    }
    
    // Handle win
    function handleWin() {
        gameActive = false;
        scores[currentPlayer]++;
        updateScoreboard();
        
        // Highlight winning cells
        const winningCondition = winningConditions.find(condition => {
            return condition.every(index => {
                return board[index] === currentPlayer;
            });
        });
        
        winningCondition.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
        
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    }
    
    // Handle draw
    function handleDraw() {
        gameActive = false;
        statusDisplay.textContent = "Game ended in a draw!";
    }
    
    // Switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
    
    // Update scoreboard
    function updateScoreboard() {
        playerXScore.textContent = `Player X: ${scores.X}`;
        playerOScore.textContent = `Player O: ${scores.O}`;
    }
    
    // Reset game
    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning-cell');
        });
        
        if (gameMode === 'pvc' && currentPlayer === 'O') {
            setTimeout(computerMove, 500);
        }
    }
    
    // Reset scores
    function resetScores() {
        scores = { X: 0, O: 0 };
        updateScoreboard();
    }
    
    // Event listeners
    pvpBtn.addEventListener('click', () => {
        resetScores();
        initGame('pvp');
    });
    
    pvcBtn.addEventListener('click', () => {
        resetScores();
        initGame('pvc');
    });
    
    resetBtn.addEventListener('click', () => {
        if (gameMode) {
            resetGame();
        }
    });
});