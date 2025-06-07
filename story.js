const slides = [
  {
      text: `한때 세상은 하나의 인간왕국 \'라스테일\'에 의해 지배되었다.\n
지혜로운 왕과 강력한 기사단, 수백개의 도시와\n 
수천의 농토가 조화를 이루며 수백년간 평화를 지켜왔다.\n
그러나 그 평화는 심연의 틈이 열리며 무너졌다.`, 
      image: "story1.png" 
    },
  {
     text: `라스테일 북쪽의 거대한 바위산 너머에서\n
처음보는 종족들이 나타났다.\n
누구도 그들이 어디서 왔는지 몰랐고\n
그들은 말 그대로 잔혹했다.\n\n
사람들은 그들을 통칭해 심연의 무리라 부른다.
`, 
     image: "story2.png" 
    },
  {
     text: `처음엔 단순한 약탈이라 생각했다.\n
그러나 그들의 진격은 너무도 조직적이었고\n
그들이 들린 마을은 조용히 사라졌다.\n
마치 원래 없던 마을이었던 것처럼..
`, 
     image: "story3.png" 
    },
  {
     text: `라스테일은 급히 북부의 모든 병력을 소집했고\n
수도 방어를 위해 주요 병력은 본진으로 이동시켰다.\n
결국 북동부 변방에 위치한 에스트라 성은\n
소식을 듣지 못하고 홀로 고립되었다.\n
`, 
     image: "story4.png" 
    },
      {
     text: `에스트라 성은 한때 국경을 지키던 관문이었지만\n
지금은 늙은 병사들, 부상병, 무기 수리공,\n
그리고 아무 교육조차 받지 못한\n
평범한 민간인 몇백명이 전부였다.\n`,  
     image: "story5.png" 
    },
  {
     text: `당신은 이곳의 임시 성주, 기사 케일 로슈.\n
성의 병력은 지금 당장 무너지더라도 문제 없는,\n
그저 심연의 무리에겐 걸림돌조차 되지 않을\n
자그마한 성을 지키고 있는 성주이다.
`, 
     image: "story6.png" 
    },
  {
     text: `하지만 여기서 도망치면 심연의 무리는 곧장 남하할 것이며\n
수도까지 며칠도 걸리지 않는다.\n
시간을 벌어준다면 왕국에서 지원군이 온다는 전갈을 받았고\n
당신은 이 성벽을 굳건히 지키기로 마음 먹었다.`,  
     image: "story7.png" 
    },
  {
     text: `어릴 적부터 가장 친했던 소꿉친구이자 왕국 최고의 궁수 시에르,\n
그도 나와 함께 이 왕국을 지키겠다 다짐하고\n
당신의 옆을 지켜주고 있다.\n
어디서 온지 모르는 방랑자 마법사, 이름은 듣지 못하였지만\n
우리 상황을 듣고 선뜻 왕국을 지키는 것을 돕겠다고 하였다.`, 
     image: "story8.png" 
    },
  {
     text: `3명의 용사\n
당신들은 과연 왕국을, 백성을, 자신들의 운명을\n
지켜나갈 수 있을 것인가
`,  
     image: "story9.png" 
    }
];

const textBox = document.getElementById("story-text");
const storyImage = document.getElementById("story-image");
const skipBtn = document.getElementById("skip-btn");

let slideIndex = 0;
let typingIndex = 0;
let typingInterval;

function typeSlide() {
  const { text, image } = slides[slideIndex];
  storyImage.src = image;
  textBox.textContent = "";
  typingIndex = 0;

  typingInterval = setInterval(() => {
    if (typingIndex < text.length) {
      textBox.textContent += text[typingIndex++];
    } else {
      clearInterval(typingInterval);
    }
  }, 40);
}

function nextSlide() {
  const fullText = slides[slideIndex].text;
  if (typingIndex < fullText.length) {
    clearInterval(typingInterval);
    textBox.textContent = fullText;
    typingIndex = fullText.length;
    return;
  }

  slideIndex++;
  if (slideIndex < slides.length) {
    typeSlide();
  } else {
    // 마지막 슬라이드 후 game.html의 #level로 이동
    setTimeout(() => {
      window.location.href = "game.html#level";
    }, 2000);
  }
}

function skipSlides(event) {
  event.stopPropagation(); // 배경 클릭 이벤트 방지
  clearInterval(typingInterval);
  window.location.href = "game.html#level";
}

window.onload = typeSlide;
document.addEventListener("click", nextSlide);
skipBtn.addEventListener("click", skipSlides);