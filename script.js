
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 640;

let player = { x: canvas.width / 2 - 20, y: canvas.height - 60, width: 40, height: 20, speed: 5 };
let bullets = [];
let enemies = [];
let enemyRows = 4;
let enemyCols = 8;
let score = 0;
let gameOver = false;

// Create enemies
function createEnemies() {
  enemies = [];
  for (let r = 0; r < enemyRows; r++) {
    for (let c = 0; c < enemyCols; c++) {
      enemies.push({ x: 60 * c + 30, y: 40 * r + 30, width: 30, height: 20 });
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawBullets() {
  ctx.fillStyle = "red";
  bullets.forEach((b, index) => {
    b.y -= 7;
    if (b.y < 0) bullets.splice(index, 1);
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
}

function drawEnemies() {
  ctx.fillStyle = "lime";
  enemies.forEach((e) => {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  });
}

function checkCollisions() {
  bullets.forEach((b, bIndex) => {
    enemies.forEach((e, eIndex) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        bullets.splice(bIndex, 1);
        enemies.splice(eIndex, 1);
        score += 10;
      }
    });
  });
}

function moveEnemies() {
  let moveDown = false;
  enemies.forEach((e) => {
    e.x += 1;
    if (e.x + e.width > canvas.width || e.x < 0) moveDown = true;
  });
  if (moveDown) {
    enemies.forEach((e) => {
      e.y += 10;
      e.x -= 2;
      if (e.y + e.height > canvas.height) gameOver = true;
    });
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) {
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();
    moveEnemies();
    drawScore();
  } else {
    drawGameOver();
  }
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= player.speed;
  if (e.key === "ArrowRight" && player.x + player.width < canvas.width) player.x += player.speed;
  if (e.key === " " || e.key === "Spacebar") {
    bullets.push({ x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 });
  }
});

createEnemies();
gameLoop();
