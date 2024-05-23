
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const GRAVITY = 0.6;
const FLAP = -10;
const PIPE_WIDTH = 50;
const PIPE_SPACING = 200;
const PIPE_HEIGHT = 300;
const BIRD_SIZE = 20;

let bird = { x: 50, y: canvas.height / 2, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

canvas.width = 800;
canvas.height = 600;

document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = FLAP;
    }
});

function createPipe() {
    const gapStart = Math.random() * (canvas.height - PIPE_HEIGHT);
    pipes.push({ x: canvas.width, gapStart });
}

function update() {
    bird.velocity += GRAVITY;
    bird.y += bird.velocity;

    if (bird.y + BIRD_SIZE > canvas.height || bird.y - BIRD_SIZE < 0) {
        gameOver = true;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2;
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING) {
        createPipe();
    }

    for (const pipe of pipes) {
        if (
            bird.x + BIRD_SIZE > pipe.x &&
            bird.x - BIRD_SIZE < pipe.x + PIPE_WIDTH &&
            (bird.y - BIRD_SIZE < pipe.gapStart || bird.y + BIRD_SIZE > pipe.gapStart + PIPE_HEIGHT)
        ) {
            gameOver = true;
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#FF0";
    context.beginPath();
    context.arc(bird.x, bird.y, BIRD_SIZE, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#0F0";
    for (const pipe of pipes) {
        context.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapStart);
        context.fillRect(pipe.x, pipe.gapStart + PIPE_HEIGHT, PIPE_WIDTH, canvas.height - pipe.gapStart - PIPE_HEIGHT);
    }

    context.fillStyle = "#000";
    context.font = "30px Arial";
    context.fillText(`Score: ${score}`, 10, 50);

    if (gameOver) {
        context.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2);
    }
}

function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();
