let drawStarted = false;
let difficulty = "easy";

let canvas;
let ctx;

// 흙길 영역
const dirtLeft = 520;
const dirtRight = 1400;
const dirtTop = 0;
const dirtBottom = () => canvas.height;

// 몬스터 그리드 설정
const MONSTER_COLS = 6;
const MONSTER_ROWS = 6;
let monsterWidth, monsterHeight;

// 공 속성
let x, y, dx, dy, radius;

// 상태 변수
let life = 3;
let wave = 1;
let monsters = [];
let boss = null;
let bossSpawned = false;
let waveIntervalId = null;

// 이미지 로드
const background = new Image();
const monsterImages = [];
const bossImg = new Image();

// 패들 객체
const paddle = {
  width: 150,
  height: 20,
  x: 0,
  y: 0,
  draw() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  },
  move(mouseX) {
    this.x = mouseX - this.width / 2;
    if (this.x < dirtLeft) this.x = dirtLeft;
    if (this.x + this.width > dirtRight) this.x = dirtRight - this.width;
  }
};

// 마우스 이동 → 패들 이동
$(document).ready(function () {
  canvas = $("#gameCanvas")[0];
  ctx = canvas.getContext("2d");
  canvas.width = 1920;
  canvas.height = 969;
  x = canvas.width / 2;
  y = canvas.height - 60;
  dx = 5;
  dy = -5;
  radius = 10;
  monsterWidth = Math.floor((dirtRight - dirtLeft) / MONSTER_COLS);
  monsterHeight = Math.floor(canvas.height / MONSTER_ROWS);
  paddle.x = canvas.width / 2 - paddle.width / 2;
  paddle.y = canvas.height - 40;

  $(document).on("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    paddle.move(e.clientX - rect.left);
  });

  // 난이도 선택
  $(".level-choice").on("click", function () {
    console.log("레벨 클릭됨 -> 난이도:", $(this).attr("id"));
    difficulty = $(this).attr("id");
    $("#level").hide();
    $("#gameCanvas").show();
    $("#ui").show();

    startGame();
  });
});

// 몬스터 클래스
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

// 몬스터 한 줄 생성
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

// 보스 소환
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

// 충돌 체크
function isColliding(ballX, ballY, ballR, m) {
  return (
    ballX + ballR > m.x &&
    ballX - ballR < m.x + m.width &&
    ballY + ballR > m.y &&
    ballY - ballR < m.y + m.height
  );
}

// 충돌 처리
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

// 다음 웨이브 진행
function nextWave() {
  // ✅ 난이도별 최대 웨이브 수
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

// 게임 클리어 체크
function checkGameClear() {
  if (bossSpawned && !boss && monsters.length === 0) {
    clearInterval(waveIntervalId);
    if (difficulty === "easy") {
      alert("✅ Easy 클리어! Normal 모드를 시작합니다.");
      startNewGame("normal");
    } else if (difficulty === "normal") {
      alert("✅ Normal 클리어! Hard 모드를 시작합니다.");
      startNewGame("hard");
    } else {
      alert("🎉 Hard 모드까지 클리어했습니다! 수고하셨습니다!");
    }
  }
}

// 공 위치 초기화
function resetBall() {
  x = canvas.width / 2;
  y = canvas.height - 60;
  dx = 5;
  dy = -5;
}

// 게임 시작
function startGame() {
  background.src = `${difficulty}.png`;

  monsterImages.length = 0;
  for (let i = 1; i <= 4; i++) {
    const img = new Image();
    img.src = `${difficulty}${i}.png`;
    monsterImages.push(img);
  }

  bossImg.src = `${difficulty}boss.png`;

  // ✅ 난이도별 생명 설정
  if (difficulty === "easy") life = 3;
  else if (difficulty === "normal") life = 2;
  else life = 1;

  $("#life").text(life);
  $("#wave").text(wave);

  $("#ui").show();

  background.onload = () => {
    monsters.push(...generateMonsterRow());

    if (!drawStarted) {
      drawStarted = true;
      draw();
    }

    if (waveIntervalId) clearInterval(waveIntervalId);
    waveIntervalId = setInterval(nextWave, 10000);
  };
}

// 난이도 변경 시 새 게임 시작
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

  $("#life").text(life);
  $("#wave").text(wave);

  startGame();
}

// 메인 루프
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
    const hitPoint = (x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
    const angle = hitPoint * (Math.PI / 3);
    const speed = Math.sqrt(dx * dx + dy * dy);

    dx = speed * Math.sin(angle);
    dy = -Math.abs(speed * Math.cos(angle));
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
