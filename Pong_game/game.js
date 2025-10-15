const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle properties
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 5;

// Ball properties
const BALL_SIZE = 14;
const BALL_SPEED = 5;

// Left paddle (player)
let leftPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Right paddle (AI)
let rightPaddleY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

// Ball position and velocity
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

// Scores
let leftScore = 0;
let rightScore = 0;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, size = "32px", color = "#fff") {
  ctx.fillStyle = color;
  ctx.font = `${size} Arial`;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

// Mouse controls for left paddle
canvas.addEventListener('mousemove', (e) => {
  // Get mouse position relative to canvas
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddleY = mouseY - PADDLE_HEIGHT / 2;

  // Clamp paddle within canvas
  leftPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, leftPaddleY));
});

// Update AI paddle position
function updateAIPaddle() {
  const paddleCenter = rightPaddleY + PADDLE_HEIGHT / 2;
  if (paddleCenter < ballY) {
    rightPaddleY += PADDLE_SPEED;
  } else if (paddleCenter > ballY) {
    rightPaddleY -= PADDLE_SPEED;
  }
  // Clamp paddle within canvas
  rightPaddleY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, rightPaddleY));
}

// Update ball position and handle collisions
function updateBall() {
  ballX += ballVX;
  ballY += ballVY;

  // Top and bottom wall collision
  if (ballY <= 0) {
    ballY = 0;
    ballVY = -ballVY;
  }
  if (ballY + BALL_SIZE >= HEIGHT) {
    ballY = HEIGHT - BALL_SIZE;
    ballVY = -ballVY;
  }

  // Left paddle collision
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= leftPaddleY &&
    ballY <= leftPaddleY + PADDLE_HEIGHT
  ) {
    ballX = PADDLE_MARGIN + PADDLE_WIDTH;
    ballVX = -ballVX * 1.05; // Add slight speed up
    // Add a bit of randomness to Y direction
    ballVY += (Math.random() - 0.5) * 2;
  }

  // Right paddle collision
  if (
    ballX + BALL_SIZE >= WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE >= rightPaddleY &&
    ballY <= rightPaddleY + PADDLE_HEIGHT
  ) {
    ballX = WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE;
    ballVX = -ballVX * 1.05;
    ballVY += (Math.random() - 0.5) * 2;
  }

  // Score
  if (ballX < 0) {
    rightScore++;
    resetBall(-1);
  }
  if (ballX + BALL_SIZE > WIDTH) {
    leftScore++;
    resetBall(1);
  }
}

// Reset ball after scoring
function resetBall(direction = 1) {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballVX = BALL_SPEED * direction;
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main draw function
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw net
  for (let i = 0; i < HEIGHT; i += 30) {
    drawRect(WIDTH / 2 - 2, i, 4, 20, "#ccc");
  }

  // Draw paddles
  drawRect(PADDLE_MARGIN, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");
  drawRect(WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, "#fff");

  // Draw ball
  drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");

  // Draw scores
  drawText(leftScore, WIDTH / 2 - 50, 50);
  drawText(rightScore, WIDTH / 2 + 50, 50);
}

// Main game loop
function gameLoop() {
  updateAIPaddle();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();