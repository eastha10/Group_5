const slides = [
  {
    text: `얼마나 시간이 지났을까 왕국에서 지원군의 도착으로\n
            전쟁은 끝났고, 성벽의 사람들은 살아남았다\n
            사람들은 케일 로슈를 영웅이라 불렀고, 그와 함께 싸운 이들에겐 칭호와 땅이 수여되었다`,
    image: "ending_clear1.png"
  },
  {
    text: `그러나 그 중 한 사람은\n
끝까지 이름을 밝히지 않았다\n
푸른 망토를 두르고 홀연히 나타나, 누구보다 강력한 마법으로 적을 얼리고\n
밤엔 조용히 상처 입은 자들을 치료하며\n
항상 그림자처럼 움직이던 그 방랑자 마법사
`,
    image: "ending_clear2.png"
  },
  {
    text: `시상식 날, 왕이 말했다\n
“에스트라의 구원자여, 그대의 이름은 무엇인가?”\n
그제야 마법사는 모자를 벗고 말했다\n
“엘리안느입니다.”\n
케일의 심장은 멎는 듯했다
`,
    image: "ending_clear3.png"
  },
  {
    text: `엘리안느\n
어릴 적 함께 검을 들고 훈련을 받았고,\n
자신이 어릴 적 정말 사랑했다고 말할 수 있었고,\n
어느 날 갑자기 사라져버려, 죽은 줄로만 알았던… 그 사람\n
`,
    image: "ending_clear4.png"
  }
, {
    text: `그녀는 말했다\n
당신은 모르겠지만…\n
내 아버지는 기사단 내부의 권력 싸움에 휘말려… 누명을 쓰고 살해당했어요\n
우리는 그날 이후 왕국의 기록에서 지워졌고,\n
가족도, 이름도, 모두를 잃었어요
`,
    image: "ending_clear5.png"
  }
  , {
    text: `그저 살아남기 위해 숨어 지냈죠\n
산 속에 살던 고대의 마법사가 저를 거둬주었고…\n
그렇게, 나는 엘리안느 라는 이름조차 감추고 살아야 했어요
`,
    image: "ending_clear6.png"
  }
  , {
    text: `케일은 말을 잇지 못했다\n
그의 눈엔 죄책감, 놀람, 그리고 진심 어린 그리움이 담겨 있었다\n
“…난, 아무것도 몰랐어\n
그렇게 아픈 줄도, 그렇게 숨었는지도..."
`,
    image: "ending_clear7.png"
  }
  , {
    text: `엘리안느는 조용히 웃었다\n
“그래도… 이제 이렇게 살아서 돌아왔잖아요\n
정말 미웠던 왕국이었지만 당신을 다시 만나는 걸 택했으니까요.”
`,
    image: "ending_clear8.png"
  }
  , {
    text: `그날 이후, 왕국은 그 두 사람에게\n
왕국의 구원자로서 왕국의 기사로서\n
두 사람은 왕국의 공식적인 기사단장과 왕실 마법사로서 임명되었다
`,
    image: "ending_clear9.png"
  }
  , {
    text: `그리고, 그 해 겨울\n
모든 상처와 과거를 뒤로한 채\n
에스트라 성의 회복된 정원에서, 조용한 결혼식이 열렸다
`,
    image: "ending_clear10.png"
  }
  , {
    text: `그녀를 거두었던 대마법사가 나지막히 말하였다\n
그날 결혼식에서 그녀가 펼쳤던 마법은\n
누구보다 사랑에 빠진 사람만이 보여줄 수 있는 색깔이었다고
`,
    image: "ending_clear11.png"
  }

];

const textBox = document.getElementById("ending-text");
const slideImage = document.getElementById("ending-image");
const skipBtn = document.getElementById("skip-btn");

let slideIndex = 0;
let typingIndex = 0;
let typingInterval;

function typeSlide() {
  const { text, image } = slides[slideIndex];
  slideImage.src = image;
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
    setTimeout(() => {
        location.reload();
    }, 3000)
  }
}

function skipSlides() {
  clearInterval(typingInterval);
  slideIndex = slides.length - 1;
  textBox.textContent = slides[slideIndex].text;
  slideImage.src = slides[slideIndex].image;
  typingIndex = slides[slideIndex].text.length;
}

window.onload = typeSlide;
document.addEventListener("click", nextSlide);
skipBtn.addEventListener("click", skipSlides);
