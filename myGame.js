let drawStarted = false;
let difficulty = "easy";
let startTime = null;
let elapsedTime = 0;

let canvas;
let ctx;

const dirtLeft = 520;
const dirtRight = 1400;
const dirtTop = 0;

const MONSTER_COLS = 6;
const MONSTER_ROWS = 6;
let monsterWidth, monsterHeight;

let x, y, dx, dy, radius;

let life = 3;
let wave = 1;
let monsters = [];
let boss = null;
let bossSpawned = false;
let waveIntervalId = null;

let charSprite = new Image();
let castleSprite = new Image();

const background = new Image();
const monsterImages = [];
const bossImg = new Image();

let skillReady = false;
let monsterKillCount = 0;

let skillEffect = null; // 현재 이펙트 이미지
let skillEffectX = 0;
let skillEffectY = 0;
let skillEffectW = 0;
let skillEffectH = 0;
let skillEffectEndTime = 0;

function handleGameOver() {
  const pages = ["ending_fail1.html", "ending_fail2.html"];
  const randomIndex = Math.floor(Math.random() * pages.length);
  window.location.href = pages[randomIndex];
}

function decrementLife() {
  life--;
  $("#life").text(life);
  if (life <= 0) {
    handleGameOver();
  }
}

class Monster {
  constructor(x, y, isBoss = false) {
    this.x = x;
    this.y = y;
    this.isBoss = isBoss;
    this.width = isBoss ? monsterWidth * 2 : monsterWidth;
    this.height = isBoss ? monsterHeight * 2 : monsterHeight;
    this.hp = this.getInitialHP();
    this.image = isBoss ? bossImg : monsterImages[Math.floor(Math.random() * 4)];
  }

  getInitialHP() {
    if (this.isBoss) {
      return difficulty === "easy" ? 4 : difficulty === "normal" ? 8 : 12;
    }
    return difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

function generateMonsterRow() {
  const row = [];
  const positions = [0, 1, 2, 3, 4, 5];
  const empty = positions.sort(() => 0.5 - Math.random()).slice(0, 2);

  for (let i = 0; i < MONSTER_COLS; i++) {
    if (!empty.includes(i)) {
      const xPos = dirtLeft + i * monsterWidth;
      const yPos = dirtTop;
      row.push(new Monster(xPos, yPos));
    }
  }
  return row;
}

function isPositionOccupied(xPos, yPos) {
  if (boss && boss.x === xPos && boss.y === yPos) return true;
  return monsters.some(m => m.x === xPos && m.y === yPos);
}
function isOverlappingArea(x1, y1, w1, h1, x2, y2, w2, h2) {
  return !(x1 + w1 <= x2 || x2 + w2 <= x1 || y1 + h1 <= y2 || y2 + h2 <= y1);
}
function pushMonsterDown(monster) {
  monster.y += monsterHeight * 2;
  monsters.forEach(other => {
    if (
      other !== monster &&
      isOverlappingArea(
        monster.x, monster.y, monster.width, monster.height,
        other.x, other.y, other.width, other.height
      )
    ) {
      pushMonsterDown(other);
    }
  });
}

function spawnBoss() {
  const bossX = dirtLeft + monsterWidth * 2;
  const bossY = dirtTop;
  const bossW = monsterWidth * 2;
  const bossH = monsterHeight * 2;

  monsters.forEach(m => {
    if (isOverlappingArea(m.x, m.y, m.width, m.height, bossX, bossY, bossW, bossH)) {
      pushMonsterDown(m);
    }
  });

  if (isPositionOccupied(bossX, bossY)) {
    const fake = { x: bossX, y: bossY, width: bossW, height: bossH };
    pushMonsterDown(fake);
  }

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
  shiftAllDown();

  let maxWave = 3;
  if (difficulty === "normal") maxWave = 4;
  else if (difficulty === "hard") maxWave = 5;

  if (wave < maxWave) {
    monsters.unshift(...generateMonsterRow());
    wave++;
    $("#wave").text(wave);
  } else if (!boss && !bossSpawned) {
    spawnBoss();
    $("#wave").text("Boss");
  }
}

function checkGameClear() {
  if (bossSpawned && !boss && monsters.length === 0) {
    clearInterval(waveIntervalId);

    dx = 0;
    dy = 0;
    startTime = null;

    const timeTaken = elapsedTime;
    const lostLife = (difficulty === "easy" ? 3 : difficulty === "normal" ? 2 : 100) - life;
    let score = 10000 - (timeTaken * 25) - lostLife * 1000;
    if (score < 0) score = 0;

    let message = "";
    if (difficulty === "easy") message = "✅ Easy 클리어! Normal 모드를 시작합니다.";
    else if (difficulty === "normal") message = "✅ Normal 클리어! Hard 모드를 시작합니다.";
    else message = "🎉 Hard 모드까지 클리어했습니다! 수고하셨습니다!";

    $("#clear-message").text(message);
    $("#clear-score").html(`⏱ 시간: ${timeTaken}초<br>❤️ 잃은 생명: ${lostLife}<br>🏆 점수: ${score}`);
    $("#clear-popup").show();

    // 버튼 클릭 처리
    $("#next-button").off("click").on("click", function () {
      $("#clear-popup").hide();

      if (difficulty === "easy") startNewGame("normal");
      else if (difficulty === "normal") startNewGame("hard");
      else window.location.href = "ending_clear.html";
    });
  }
}


function resetBall() {
  x = paddle.x + paddle.width / 2;
  y = paddle.y - 30;
  dx = 3;
  dy = -3;
}

function startGame() {
  background.src = `${difficulty}.png`;

  monsterImages.length = 0;
  for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `${difficulty}${i}.png`;
    monsterImages.push(img);
  }

  bossImg.src = `${difficulty}boss.png`;

  if (difficulty === "easy") life = 3;
  else if (difficulty === "normal") life = 2;
  else life = 100;

  $("#life").text(life);
  $("#wave").text(wave);

  let charName = "";
  if (jobs[job] === "bow") charName = bow[skin];
  else if (jobs[job] === "knight") charName = knight[skin];
  else if (jobs[job] === "magic witch") charName = magic_witch[skin];

  charSprite.src = `${charName}.png`;
  castleSprite.src = `${castleicon[castle]}.png`;

  $("#ui").show();
  resetBall();

  background.onload = () => {
    startTime = Date.now();
    monsters.push(...generateMonsterRow());

    if (!drawStarted) {
      drawStarted = true;
      draw();
    }

    if (waveIntervalId) clearInterval(waveIntervalId);
    waveIntervalId = setInterval(nextWave, 10000);
  };
}

function startNewGame(difficultyName) {
  difficulty = difficultyName;
  monsters = [];
  boss = null;
  bossSpawned = false;
  wave = 1;
  life = 3;
  dx = 5;
  dy = -5;
  x = canvas.width / 2;
  y = canvas.height - 60;

  skillReady = false;
  monsterKillCount = 0;
  $("#skill-status").text("대기중").css("color", "gray");


  $("#life").text(life);
  $("#wave").text(wave);

  startGame();
}

function draw() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(castleSprite, 0, canvas.height - 250, canvas.width, 300);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  const toRemove = [];
  for (let i = monsters.length - 1; i >= 0; i--) {
    const m = monsters[i];
    m.draw();
    if (isColliding(x, y, radius, m)) {
      handleBallMonsterCollision(x, y, radius, m);
      m.hp--;
      if (m.hp <= 0) toRemove.push(i);
      break;
    }
  }
  toRemove.forEach(i => {
    const killed = monsters[i];
    if (!killed.isBoss) {
      monsterKillCount++;
      if (monsterKillCount >= 8) {
        skillReady = true;
        monsterKillCount = 0;
        $("#skill-status").text("준비됨").css("color", "aqua");
      }
    }
    monsters.splice(i, 1);
  });

  for (let i = monsters.length - 1; i >= 0; i--) {
    const m = monsters[i];
    if (m.y >= monsterHeight * (MONSTER_ROWS - 1)) {
      monsters.splice(i, 1);
      decrementLife();
      if (life <= 0) return;
    }
  }

  if (boss) {
    boss.draw();
    if (isColliding(x, y, radius, boss)) {
      handleBallMonsterCollision(x, y, radius, boss);
      boss.hp--;
      if (boss.hp <= 0) {
        boss = null;
      }
    }
    if (
      boss &&
      boss.y > monsterHeight * 2 &&
      boss.y + boss.height >= monsterHeight * MONSTER_ROWS
    ) {
      boss = null;
      decrementLife();
      if (life <= 0) return;
    }
  }

  paddle.draw();

  if (
    y + radius > paddle.y &&
    y + radius < paddle.y + paddle.height &&
    x > paddle.x &&
    x < paddle.x + paddle.width
  ) {
    const hitPoint = (x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const angle = hitPoint * (Math.PI / 3);
    const speed = Math.sqrt(dx * dx + dy * dy);
    dx = speed * Math.sin(angle);
    dy = -Math.abs(speed * Math.cos(angle));
  }

  if (x - radius <= dirtLeft || x + radius >= dirtRight) dx = -dx;
  if (y - radius <= 0) dy = -dy;

  if (y + radius > paddle.y + paddle.height + 5) {
    decrementLife();
    if (life <= 0) return;
    resetBall();
  }

  x += dx;
  y += dy;
  if (startTime !== null) {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  $("#time").text(elapsedTime + "초");
}


  if (skillEffect && Date.now() < skillEffectEndTime) {
    ctx.drawImage(skillEffect, skillEffectX, skillEffectY, skillEffectW, skillEffectH);
  } else {
    skillEffect = null;
  }
  checkGameClear();
  requestAnimationFrame(draw);
}

function shiftAllDown() {
  monsters.forEach(m => {
    m.y += monsterHeight;
  });
  if (boss) {
    boss.y += monsterHeight;
  }
}

const paddle = {
  width: 150,
  height: 20,
  x: 0,
  y: 0,
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(charSprite, this.x + this.width / 2 - 50, this.y + 5, 100, 100);
  },
  move(mouseX) {
    this.x = mouseX - this.width / 2;
    if (this.x < dirtLeft) this.x = dirtLeft;
    if (this.x + this.width > dirtRight) this.x = dirtRight - this.width;
    const char = document.getElementById("selected-character");
    if (char) {
      char.style.left = `${this.x + this.width / 2 - 50}px`;
      char.style.top = `${this.y + 5}px`;
    }
  }
};

$(document).ready(function () {
  canvas = $("#gameCanvas")[0];
  ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 969;

  x = canvas.width / 2;
  dx = 5;
  dy = -5;
  radius = 10;

  monsterWidth = Math.floor((dirtRight - dirtLeft) / MONSTER_COLS);
  monsterHeight = Math.floor(canvas.height / MONSTER_ROWS);

  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 100;

  $(document).on("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    paddle.move(e.clientX - rect.left);
  });

  $(".level-choice").on("click", function () {
    difficulty = $(this).attr("id");
    $("#level").hide();
    $("#gameCanvas").show();
    $("#ui").show();
    startGame();
  });
  $(document).on("mousedown", function (e) {
    if (e.button === 0) {
      console.log("좌클릭 감지됨");
      if (skillReady) {
        console.log("스킬 발동!");
        useSkill();
      }
    }
  });
});

function useSkill() {
  if (jobs[job] === "knight") useKnightSkill();
  else if (jobs[job] === "bow") useBowSkill();
  else if (jobs[job] === "magic witch") useMagicSkill();

  skillReady = false;
  $("#skill-status").text("대기중").css("color", "gray");
}

function useKnightSkill() {
  playSkillSound("garen");
  monsters.forEach((m) => {
    if (Math.abs(m.y - y) < monsterHeight) m.hp -= 3;
  });
  if (boss && Math.abs(boss.y - y) < boss.height) boss.hp -= 3;
  cleanupMonsters();

  skillEffect = new Image();
  skillEffect.src = "garen.png";
  skillEffectX = dirtLeft;
  skillEffectY = Math.floor(y / monsterHeight) * monsterHeight;
  skillEffectW = dirtRight - dirtLeft;
  skillEffectH = monsterHeight;
  skillEffectEndTime = Date.now() + 400;
}

function useBowSkill() {
  playSkillSound("ash");
  monsters.forEach((m) => {
    if (Math.abs(m.x - x) < monsterWidth) m.hp -= 3;
  });
  if (boss && Math.abs(boss.x - x) < boss.width) boss.hp -= 3;
  cleanupMonsters();

  skillEffect = new Image();
  skillEffect.src = "ash.png";

  const col = Math.floor((x - dirtLeft) / monsterWidth);
  skillEffectX = dirtLeft + col * monsterWidth;
  skillEffectY = 0;
  skillEffectW = monsterWidth;
  skillEffectH = canvas.height;
  skillEffectEndTime = Date.now() + 400;
}


function useMagicSkill() {
  playSkillSound("lux");
  monsters.forEach((m) => m.hp -= 1);
  if (boss) boss.hp -= 1;
  cleanupMonsters();

  skillEffect = new Image();
  skillEffect.src = "lux.png";
  skillEffectX = dirtLeft;
  skillEffectY = dirtTop;
  skillEffectW = dirtRight - dirtLeft;
  skillEffectH = paddle.y; // 패들 윗부분까지만 출력
  skillEffectEndTime = Date.now() + 400;
}
function cleanupMonsters() {
  for (let i = monsters.length - 1; i >= 0; i--) {
    if (monsters[i].hp <= 0) {
      monsters.splice(i, 1);
    }
  }

  if (boss && boss.hp <= 0) {
    boss = null;
  }
}
function playSkillSound(name) {
  const sound = new Audio(`${name}.mp3`);
  sound.volume = 1.0;
  sound.play();
}