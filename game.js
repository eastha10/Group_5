const jobs = ["bow", "knight", "magic which"];
const bow = ["bow_angel", "bow_elf", "bow_soldier"];
const knight = ["knight_dark", "knight_silver", "knight_white"];
const magic_which = ["magic_witch", "magic_white", "magic_vampire"];
const castleicon = ["castle1", "castle2", "castle3"];
const bgmTracks = [
  "stealth-battle",
  "fearless-final-boss-battle",
  "epic-battle",
];
let job = 0;
let skin = 0;
let music = 0;
let castle = 0;

$(document).ready(function () {
  $(".menu-btn")
    .eq(1)
    .on("click", function () {
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
});

function JobChange() {
  if (jobs[job] === "bow") {
    $(".job-icon").attr("src", `${bow[0]}.png`);
    skin = 0;
  } else if (jobs[job] === "knight") {
    $(".job-icon").attr("src", `${knight[0]}.png`);
    skin = 0;
  } else if (jobs[job] === "magic which") {
    $(".job-icon").attr("src", `${magic_which[0]}.png`);
    skin = 0;
  }
}

function SkinChange() {
  if (jobs[job] === "bow") {
    $(".job-icon").attr("src", `${bow[skin]}.png`);
  } else if (jobs[job] === "knight") {
    $(".job-icon").attr("src", `${knight[skin]}.png`);
  } else if (jobs[job] === "magic which") {
    $(".job-icon").attr("src", `${magic_which[skin]}.png`);
  }
}
function MusicChange() {
  const src = `${bgmTracks[music]}.mp3`;
  $("#bgm").attr("src", src)[0].play();
  $(".bgm-name").text(bgmTracks[music].replace(/-/g, " "));
}
function CastleChange() {
  $(".castle-icon").attr("src", `${castleicon[castle]}.png`);
}
