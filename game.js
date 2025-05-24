const canvas = $("#gameCanvas")[0];
const ctx = canvas.getContext("2d");

canvas.width = 1920;
canvas.height = 969;

const dirtLeft = 520;
const dirtRight = 1400;
const dirtTop = 0;
const dirtBottom = canvas.height;

const MONSTER_COLS = 6;
const MONSTER_ROWS = 6;

const monsterWidth = Math.floor((dirtRight - dirtLeft) / MONSTER_COLS);
const monsterHeight = Math.floor((canvas.height) / MONSTER_ROWS);

let x = canvas.width / 2;
let y = canvas.height - 60;
let dx = 5;
let dy = -5;
const radius = 10;

let life = 3;
let wave = 1;
let monsters = [];
let boss = null;
let bossSpawned = false;

const background = new Image();
background.src = "gamebackground.png";

const monsterImg = new Image();
monsterImg.src = "slime_blue.png";

const bossImg = new Image();
bossImg.src = "slime_king.png";

const paddle = {
  width: 150,
  height: 20,
  x: canvas.width / 2 - 75,
  y: canvas.height - 40,
  draw: function () {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  move: function (mouseX) {
    this.x = mouseX - this.width / 2;
    if (this.x < dirtLeft) this.x = dirtLeft;
    if (this.x + this.width > dirtRight) this.x = dirtRight - this.width;
  }
};

$(document).on("mousemove", function (e) {
  const rect = canvas.getBoundingClientRect();
  paddle.move(e.clientX - rect.left);
});

class Monster {
  constructor(x, y, isBoss = false) {
    this.x = x;
    this.y = y;
    this.width = isBoss ? monsterWidth * 2 : monsterWidth;
    this.height = isBoss ? monsterHeight * 1.5 : monsterHeight;
    this.hp = isBoss ? 4 : 1;
    this.isBoss = isBoss;
  }

  draw() {
    ctx.drawImage(this.isBoss ? bossImg : monsterImg, this.x, this.y, this.width, this.height);
  }
}

function generateMonsterRow() {
  const row = [];
  const positions = [0, 1, 2, 3, 4, 5];
  const empty = positions.sort(() => 0.5 - Math.random()).slice(0, 2);

  for (let i = 0; i < 6; i++) {
    if (!empty.includes(i)) {
      const x = dirtLeft + i * monsterWidth;
      const y = dirtTop;
      row.push(new Monster(x, y));
    }
  }

  monsters.forEach(m => m.y += monsterHeight);
  return row;
}

function spawnBoss() {
  const bossX = dirtLeft + monsterWidth * 2;
  const bossY = dirtTop;

  monsters.forEach(m => {
    const mMidX = m.x + m.width / 2;
    if (mMidX >= bossX && mMidX <= bossX + monsterWidth * 2) {
      m.y += monsterHeight;
    }
  });

  boss = new Monster(bossX, bossY, true);
  bossSpawned = true;
}

function isColliding(ballX, ballY, ballR, m) {
  return (
    ballX + ballR > m.x &&
    ballX - ballR < m.x + m.width &&
    ballY + ballR > m.y &&
    ballY - ballR < m.y + m.height
  );
}

function handleBallMonsterCollision(ballX, ballY, ballR, m) {
  const prevX = ballX - dx;
  const prevY = ballY - dy;

  const wasAbove = prevY + ballR <= m.y;
  const wasBelow = prevY - ballR >= m.y + m.height;
  const wasLeft = prevX + ballR <= m.x;
  const wasRight = prevX - ballR >= m.x + m.width;

  if (wasAbove || wasBelow) {
    dy = -dy;
  } else if (wasLeft || wasRight) {
    dx = -dx;
  } else {
    dx = -dx;
    dy = -dy;
  }
}

function nextWave() {
  if (wave < 3) {
    monsters.unshift(...generateMonsterRow());
    wave++;
    $("#wave").text(wave);
  } else if (!boss && !bossSpawned) {
    spawnBoss();
    $("#wave").text("Boss");
  }
}
setInterval(nextWave, 10000);

function checkGameClear() {
  if (bossSpawned && !boss && monsters.length === 0) {
    alert("🎉 게임 클리어!");
    window.location.reload();
  }
}

function draw() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  for (let i = monsters.length - 1; i >= 0; i--) {
    const m = monsters[i];
    m.draw();
    if (isColliding(x, y, radius, m)) {
      handleBallMonsterCollision(x, y, radius, m);
      m.hp--;
      if (m.hp <= 0) monsters.splice(i, 1);
    }
  }

  if (boss) {
    boss.draw();
    if (isColliding(x, y, radius, boss)) {
      handleBallMonsterCollision(x, y, radius, boss);
      boss.hp--;
      if (boss.hp <= 0) boss = null;
    }
  }

  paddle.draw();

  if (
    y + radius > paddle.y &&
    y + radius < paddle.y + paddle.height &&
    x > paddle.x &&
    x < paddle.x + paddle.width
  ) {
    dy = -Math.abs(dy);
  }

  if (x - radius <= dirtLeft || x + radius >= dirtRight) dx = -dx;
  if (y - radius <= 0) dy = -dy;

  if (y + radius > canvas.height) {
    life--;
    $("#life").text(life);
    resetBall();
    if (life <= 0) {
      alert("게임 오버!");
      document.location.reload();
    }
  }

  x += dx;
  y += dy;

  checkGameClear();
  requestAnimationFrame(draw);
}

function resetBall() {
  x = canvas.width / 2;
  y = canvas.height - 60;
  dx = 5;
  dy = -5;
}

background.onload = () => {
  monsters.push(...generateMonsterRow());
  draw();
};
