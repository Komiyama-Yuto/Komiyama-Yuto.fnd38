'use strict'

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const penguinImg = new Image();
penguinImg.src = "penguin.png";
const PENGUIN_WIDTH = 48;
const PENGUIN_HEIGHT = 24;
let penguinX = 100;
let penguinY = HEIGHT / 2;
let velocityY = 0;

let isPressing = false;

let score = 0;
let gameRunning = false;

let obstacles = [];

function createObstacle(x) {
  const gapMargin = 100;
  const gapY = Math.random() * (HEIGHT - gapMargin * 2 - 150) + gapMargin;
  return {
    x: x,
    width: 60,
    gapY: gapY,
    gapHeight: 150,
  };
}

function initObstacles() {
  obstacles = [];
  for (let i = 0; i < 5; i++) {
    obstacles.push(createObstacle(WIDTH + i * 200));
  }
}

function updateObstacles() {
  for (let ob of obstacles) {
    ob.x -= 3;
  }

  if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
    obstacles.push(createObstacle(WIDTH));
    score++;
  }
}

function drawObstacles() {
  ctx.fillStyle = "#4B3621";
  for (let ob of obstacles) {
    ctx.fillRect(ob.x, 0, ob.width, ob.gapY);
    ctx.fillRect(ob.x, ob.gapY + ob.gapHeight, ob.width, HEIGHT - (ob.gapY + ob.gapHeight));
  }
}

function drawPenguin() {
  ctx.drawImage(penguinImg, penguinX, penguinY, PENGUIN_WIDTH, PENGUIN_HEIGHT);
}

function isColliding() {
  const penguin = {
    x: penguinX,
    y: penguinY,
    width: PENGUIN_WIDTH,
    height: PENGUIN_HEIGHT,
  };

  for (let ob of obstacles) {
    const inX = penguin.x + penguin.width > ob.x && penguin.x < ob.x + ob.width;
    const inTop = penguin.y < ob.gapY;
    const inBottom = penguin.y + penguin.height > ob.gapY + ob.gapHeight;
    if (inX && (inTop || inBottom)) {
      return true;
    }
  }
  return false;
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.fillStyle = "#66ccff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  velocityY += isPressing ? 0.2 : -0.2;
  penguinY += velocityY;

  if (penguinY < 0) {
    penguinY = 0;
    velocityY = 0;
  }
  if (penguinY > HEIGHT - PENGUIN_HEIGHT) {
    penguinY = HEIGHT - PENGUIN_HEIGHT;
    velocityY = 0;
  }

  updateObstacles();
  drawObstacles();

  drawPenguin();

  ctx.fillStyle = "gold";
  ctx.font = "30px sans-serif";
  ctx.fillText("SCORE: " + score, WIDTH - 160, 40);

  if (isColliding()) {
    gameRunning = false;
    document.getElementById("gameOver").style.display = "block";
    document.getElementById("finalScore").textContent = "SCORE: " + score;
    document.getElementById("bgm").pause();
    return;
  }

  requestAnimationFrame(gameLoop);
}

document.getElementById("startBtn").onclick = function () {
  penguinY = HEIGHT / 2;
  velocityY = 0;
  score = 0;
  gameRunning = true;

  document.getElementById("menu").style.display = "none";
  document.getElementById("gameOver").style.display = "none";
  canvas.style.display = "block";

  document.getElementById("bgm").currentTime = 0;
  document.getElementById("bgm").volume = 0.001;
  document.getElementById("bgm").play();

  initObstacles();
  gameLoop();
};

document.getElementById("restartBtn").onclick = function () {
  document.getElementById("menu").style.display = "block";
  document.getElementById("gameOver").style.display = "none";
  canvas.style.display = "none";
};

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    isPressing = true;
  }
});
document.addEventListener("keyup", function (e) {
  if (e.code === "Space") {
    isPressing = false;
  }
});
canvas.addEventListener("mousedown", function () {
  isPressing = true;
});
canvas.addEventListener("mouseup", function () {
  isPressing = false;
});

