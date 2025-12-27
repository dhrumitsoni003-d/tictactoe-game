const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const resultModal = document.getElementById('resultModal');
const winnerText = document.getElementById('winnerText');
const newGameBtn = document.getElementById('newGameBtn');

// New Elements
const startModal = document.getElementById('startModal');
const startGameBtn = document.getElementById('startGameBtn');
const playerXInput = document.getElementById('playerXName');
const playerOInput = document.getElementById('playerOName');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let currentPlayer = 'X';
let gameActive = false; // Start inactive until names are entered
let gameState = ["", "", "", "", "", "", "", "", ""];
let playerXName = "Player X";
let playerOName = "Player O";
let confettiInterval;

// Resize canvas
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Start Game Handler
startGameBtn.addEventListener('click', () => {
    playerXName = playerXInput.value.trim() || "Player X";
    playerOName = playerOInput.value.trim() || "Player O";
    startModal.classList.add('hidden');
    gameActive = true;
    updateStatusText();
});

const updateStatusText = () => {
    const name = currentPlayer === 'X' ? playerXName : playerOName;
    statusText.innerHTML = `<span class="player-${currentPlayer.toLowerCase()}">${name}</span>'s Turn`;
};

const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.innerText = currentPlayer;
};

const handleResultValidation = () => {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningLine = winCondition;
            break;
        }
    }

    if (roundWon) {
        const name = currentPlayer === 'X' ? playerXName : playerOName;
        statusText.innerHTML = `<span class="player-${currentPlayer.toLowerCase()}">${name}</span> Wins!`;
        gameActive = false;
        highlightWinningCells(winningLine);
        startConfetti();
        setTimeout(() => showResult(`${name} Wins!`), 1000);
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusText.innerText = "Draw!";
        gameActive = false;
        setTimeout(() => showResult("It's a Draw!"), 500);
        return;
    }

    handlePlayerChange();
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatusText();
};

const highlightWinningCells = (winningLine) => {
    winningLine.forEach(index => {
        cells[index].classList.add('winning');
    });
};

const showResult = (message) => {
    winnerText.innerText = message;
    resultModal.classList.remove('hidden');
};

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    updateStatusText();
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winning');
    });
    resultModal.classList.add('hidden');
    stopConfetti();
};

// Confetti System
const particles = [];
const confettiColors = ['#06b6d4', '#f43f5e', '#3b82f6', '#8b5cf6', '#ffffff'];

class Particle {
    constructor() {
        this.x = Math.random() * confettiCanvas.width;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 + 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.size -= 0.05;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function startConfetti() {
    confettiInterval = setInterval(() => {
        particles.push(new Particle());
        particles.push(new Particle());
    }, 20);
    animateConfetti();
}

function stopConfetti() {
    clearInterval(confettiInterval);
    particles.length = 0;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function animateConfetti() {
    if (particles.length === 0) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].size <= 0.2 || particles[i].y > confettiCanvas.height) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateConfetti);
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
newGameBtn.addEventListener('click', handleRestartGame);
