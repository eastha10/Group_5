const jobs = ["bow", "knight", "magic witch"];
const bow = ["bow_angel", "bow_elf", "bow_soldier"];
const knight = ["knight_dark", "knight_silver", "knight_white"];
const magic_witch = ["magic_witch", "magic_white", "magic_vampire"];
const castleicon = ["castle1", "castle2", "castle3"];
const bgmTracks = [
  "stealth-battle",
  "fearless-final-boss-battle",
  "epic-battle",
];

// 기본값
let job = 0;
let skin = 0;
let music = 0;
let castle = 0;
let story = 0;
let storyInterval;

// 새로고침 시 localStorage 초기화
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
  // 새로고침 감지
  localStorage.clear();
}

$(document).ready(function () {
  // localStorage에서 상태 복원
  if (localStorage.getItem("job")) {
    job = parseInt(localStorage.getItem("job"));
    skin = parseInt(localStorage.getItem("skin"));
    music = parseInt(localStorage.getItem("music"));
    castle = parseInt(localStorage.getItem("castle"));

    $(".job").text(jobs[job]);
    SkinChange();
    MusicChange();
    CastleChange();
  } else {
    $(".job").text(jobs[job]);
    JobChange();
    MusicChange();
    CastleChange();
  }

  $(".menu-btn").eq(1).on("click", function () {
    $(".menu").hide();
    $(".start-logo").hide();
    $("#setting-wrapper").removeClass("hidden");
  });

  $(".setting-btn").on("click", function () {
    $(".menu").show();
    $(".start-logo").show();
    $("#setting-wrapper").addClass("hidden");
  });

  $(".job-before").on("click", function () {
    job = job - 1 + jobs.length;
    job = job % jobs.length;
    $(".job").text(jobs[job]);
    JobChange();
  });

  $(".job-next").on("click", function () {
    job = job + 1 + jobs.length;
    job = job % jobs.length;
    $(".job").text(jobs[job]);
    JobChange();
  });

  $(".job-skin-before").on("click", function () {
    skin = skin - 1 + 3;
    skin = skin % 3;
    SkinChange();
  });

  $(".job-skin-next").on("click", function () {
    skin = skin + 1 + 3;
    skin = skin % 3;
    SkinChange();
  });

  $(".bgm-before").on("click", function () {
    music = (music - 1 + bgmTracks.length) % bgmTracks.length;
    MusicChange();
  });

  $(".bgm-next").on("click", function () {
    music = (music + 1) % bgmTracks.length;
    MusicChange();
  });

  $(".castle-before").on("click", function () {
    castle = (castle - 1 + castleicon.length) % castleicon.length;
    CastleChange();
  });

  $(".castle-next").on("click", function () {
    castle = (castle + 1) % castleicon.length;
    CastleChange();
  });

  // 게임 시작: 상태 저장 후 이동
  $(".menu-btn").eq(0).on("click", function () {
    localStorage.setItem("job", job);
    localStorage.setItem("skin", skin);
    localStorage.setItem("music", music);
    localStorage.setItem("castle", castle);

    window.location.href = "story.html";
  });

  // 스토리 끝나고 game.html#level로 돌아온 경우 → 음악 자동 재생
  if (window.location.hash === "#level") {
    const savedMusic = localStorage.getItem("music");
    if (savedMusic !== null) {
      music = parseInt(savedMusic);
      MusicChange();
    }
  }
});

function JobChange() {
  if (jobs[job] === "bow") {
    $(".job-icon").attr("src", `${bow[0]}.png`);
    skin = 0;
  } else if (jobs[job] === "knight") {
    $(".job-icon").attr("src", `${knight[0]}.png`);
    skin = 0;
  } else if (jobs[job] === "magic witch") {
    $(".job-icon").attr("src", `${magic_witch[0]}.png`);
    skin = 0;
  }
}

function SkinChange() {
  if (jobs[job] === "bow") {
    $(".job-icon").attr("src", `${bow[skin]}.png`);
  } else if (jobs[job] === "knight") {
    $(".job-icon").attr("src", `${knight[skin]}.png`);
  } else if (jobs[job] === "magic witch") {
    $(".job-icon").attr("src", `${magic_witch[skin]}.png`);
  }
}

// 음악 재생 함수 개선됨
function MusicChange() {
  const src = `${bgmTracks[music]}.mp3`;
  const bgm = document.getElementById("bgm");

  if (!bgm) return;

  // 같은 음악이면 재설정하지 않음
  if (!bgm.src.includes(src)) {
    bgm.pause();
    bgm.src = src;
  }

  // 재생 시도
  bgm.play().catch(() => {
    document.body.addEventListener("click", () => {
      bgm.play();
    }, { once: true });
  });

  $(".bgm-name").text(bgmTracks[music].replace(/-/g, " "));
  localStorage.setItem("music", music);
}

function CastleChange() {
  $(".castle-icon").attr("src", `${castleicon[castle]}.png`);
}
