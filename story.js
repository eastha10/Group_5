const slides = [
  {
    text: `한때 세상은 하나의 인간 왕국 ‘라스테일’에 의해 지배되었다.\n지혜로운 왕과 강력한 기사단, 수백 개의 도시와 수천의 농토가 조화를 \n이루며 수백 년간 평화를 지켜왔다.`,
    image: "images/slide1.jpg"
  },
  {
    text: `그러나 그 평화는 심연의 틈이 열리며 무너졌다.`,
    image: "images/slide2.jpg"
  },
  {
    text: `라스테일 북쪽의 거대한 바위산 너머에서, 처음보는 종족들이 나타났다.\n누구도 그들이 어디서 왔는지 몰랐고, 그들은 말 그대로 잔혹했다.`,
    image: "images/slide3.jpg"
  },
  {
    text: `사람들은 그들을 통칭해 심연의 무리라 부른다.`,
    image: "images/slide4.jpg"
  },
  {
    text: `처음엔 단순한 약탈이라 생각했다. \n그러나 그들의 진격은 너무도 조직적이었고,\n그들이 남긴 마을은 조용히 사라졌다.\n마치 원래 없던 마을이었던 것처럼..`,
    image: "images/slide5.jpg"
  },
  {
    text: `라스테일은 급히 북부의 모든 병력을 소집했고,\n수도 방어를 위해 주요 병력은 본진으로 이동시켰다.\n결국 북동부 변방에 위치한 에스트라 성은 소식을 듣지 못하고 홀로 고립되었다`,
    image: "images/slide6.jpg"
  },
  {
    text: `에스트라 성은 한때 국경을 지키던 관문이었지만, 지금은\n늙은 병사들, 부상병, 무기 수리공, 그리고 아무 교육조차 받지 못한\n평범한 민간인 몇백명이 전부였다.`,
    image: "images/slide7.jpg"
  },
  {
    text: `당신은 이곳의 임시 성주, 기사 케일 로슈.\n성의 병력은 지금 당장 무너지더라도 문제 없는, 그저 심연의 무리에겐 걸림돌조차 되지 않을\n자그마한 성을 지키고 있는 성주이다.`,
    image: "images/slide8.jpg"
  },
  {
    text: `하지만 여기서 도망치면 심연의 무리는 곧장 남하할 것이며, 수도까지 며칠도 걸리지 않는다.\n시간을 벌어준다면 왕국에서 지원군이 온다는 전갈을 받았고 당신은 이 성벽을\n굳건히 지키기로 마음 먹었다.`,
    image: "images/slide9.jpg"
  },
  {
    text: `어릴 적부터 가장 친했던 소꿉친구이자 왕국 최고의 궁수, 시에르 \n그도 나와 함께 이 왕국을 지키겠다 다짐하고 당신의 옆을 지켜주고 있다.`,
    image: "images/slide10.jpg"
  },
  {
    text: `어디서 온지 모르는 방랑자 마법사, 이름은 듣지 못하였지만 \n우리 상황을 듣고 선뜻 왕국을 지키는 것을 돕겠다고 하였다.`,
    image: "images/slide11.jpg"
  },
  {
    text: `3명의 용사\n당신들은 과연 왕국을, 백성을, 자신들의 운명을 지켜나갈 수 있을 것인가`,
    image: "images/slide12.jpg"
  },
  {
    text: `“우리는, 이 작은 성벽 하나로 왕국 전체의 운명을 막아야 한다.”`,
    image: "images/slide13.jpg"
  }
];

const textBox = document.getElementById("text-box");
const slideImage = document.getElementById("slide-image");
const skipBtn = document.getElementById("skip-btn");

let slideIndex = 0;
let typingIndex = 0;
let typingInterval;
let typingDone = false;

function typeSlide() {
  const { text, image } = slides[slideIndex];
  slideImage.src = image;
  textBox.innerHTML = "";
  typingIndex = 0;
  typingDone = false;

  typingInterval = setInterval(() => {
    if (typingIndex < text.length) {
      textBox.innerHTML += text[typingIndex++];
    } else {
      clearInterval(typingInterval);
      typingDone = true;
    }
  }, 40);
}

function nextSlide() {
  slideIndex++;
  if (slideIndex < slides.length) {
    typeSlide();
  } else {
    startGame();
  }
}

function nextOnClick() {
  if (!typingDone) {
    clearInterval(typingInterval);
    textBox.innerHTML = slides[slideIndex].text;
    typingDone = true;
  } else {
    nextSlide();
  }
}

function skipSlides() {
  clearInterval(typingInterval);
  startGame();
}

function startGame() {
  clearScreen();
  loadGameAssets();
}

function clearScreen() {
  document.body.innerHTML = `
    <div id="ui">
      <span>❤️ 생명: <span id="life">3</span></span>
      <span> | 🌊 웨이브: <span id="wave">1</span></span>
    </div>
    <canvas id="gameCanvas"></canvas>
  `;
}

function loadGameAssets() {
  const script = document.createElement("script");
  script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
  document.head.appendChild(script);

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "game.css";
  document.head.appendChild(css);

  const gameScript = document.createElement("script");
  gameScript.src = "game.js";
  gameScript.defer = true;
  document.body.appendChild(gameScript);
}

document.addEventListener("click", nextOnClick);
skipBtn.addEventListener("click", skipSlides);
window.onload = typeSlide;
