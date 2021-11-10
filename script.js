let origBoard;
let human;
let ai;

let winningArrays = [[0,1,2],[0,3,6],[0,4,8],[1,4,7],[2,4,6],[2,5,8],[3,4,5],[6,7,8]];
let cells = Array.from(document.getElementById("origBoard").children);

startGame();
function startGame()  {
    document.querySelector(".winning-message").classList.add('hidden');
    document.querySelector('.start-message').classList.remove('hidden');
    document.querySelector('button.PlayerX').addEventListener('click', tokenSelect, false);
    document.querySelector('button.PlayerO').addEventListener('click', tokenSelect, false);
    origBoard = Array.from(Array(9).keys());
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click', turnClick, false);
        }
}; 

function tokenSelect(e) {
    if (e.target.classList.contains('PlayerX')) {
        [human, ai] = ['X', 'O'];
    } else if (e.target.classList.contains('PlayerO')) {
        [human, ai] = ['O', 'X'];
    }
    document.querySelector('button.PlayerX').removeEventListener('click', tokenSelect, false);
    document.querySelector('button.PlayerO').removeEventListener('click', tokenSelect, false);
    document.querySelector('.start-message').classList.add('hidden');

    if (ai == 'X') {
        turn(bestSpot(), ai);
    }
}

function turnClick(cell) {
    if (typeof origBoard[cell.target.id] === 'number') {
        turn(cell.target.id, human);
        if (!checkWin(origBoard, human) && !checkTie()) turn(bestSpot(), ai);
    }
}

function turn(cellId, player) {
    origBoard[cellId] = player;
    document.getElementById(cellId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) { gameOver(gameWon) } else { checkTie() };
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => 
        (e === player) ? a.concat(i) : a, []); 
    let gameWon = null;
    for (let [index, win] of winningArrays.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}


function gameOver(gameWon) {
    for (let index of winningArrays[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == human ? 'blue' : 'red';
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You Win" : "You lose");
}

function declareWinner(who) {
    document.querySelector('.winning-message-text').innerText = who;
    document.querySelector(".winning-message").classList.remove('hidden');
    document.querySelector(".winning-message").classList.add('display');
    document.querySelector('#restartButton').addEventListener('click', startGame, false);
}

function emptyCells() {
    return origBoard.filter(s => typeof s === 'number');
}

function bestSpot() {
    let board = emptyCells();
    let i = Math.floor(Math.random() * (board.length));
    return board[i];
    //return minimax(origBoard, ai).index;
}

function checkTie() {
    if (emptyCells().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.background = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("tie Game!!");
        return true;
    }
    return false;
}


function minimax(newBoard, player) {
    var free_cells = emptyCells(newBoard);

    if (checkWin(newBoard, human)) {
        return {score: -10};
    } else if (checkWin(newBoard, ai)) {
        return {score: 10};
    } else if (free_cells.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (var i = 0; i < free_cells.length; i++) {
        var move = {};
        move.index = newBoard[free_cells[i]];
        newBoard[free_cells[i]] = player;

        if (player == ai) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[free_cells[i]] = move.index;

        moves.push(move);
    }

    var best_move;
    if (player === ai) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                best_move = i;
            }
        }
    } else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                best_move = i;
            }
        }
    }

    return moves[best_move]

}


