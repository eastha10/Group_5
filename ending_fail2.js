const slides = [
  {
    text: `깨어난 케일은, 폐허가 된 성의 한 구석에서\n
얼어붙은 듯 누운 그녀를 발견했다.
`,
    image: "ending_fail2_1.png"
  },
  {
    text: `숨이 꺼져가는 그녀는 마지막으로 미소 지으며 입을 열었다\n
“미안해… 미리 이름을 말하지 못해서…\n
…나야, 케일. 엘리안느야…”
`,
    image: "ending_fail2_2.png"
  },
  {
    text: `같이 어린 시절 검술을 연습하고\n
누구보다 사랑했던 그녀
`,
    image: "ending_clear4.png"
  },
  {
    text: `케일의 눈동자가 흔들렸다\n
“말도 안 돼… 너… 왜 지금 말하는 거야…!”\n
“미안해… 마지막에는 꼭 너의 이름을 불러 보고 싶었어…”
`,
    image: "ending_fail2_3.png"
  }
, {
    text: `그녀는 마지막 힘으로 케일의 손을 잡았고, 그 안에서 천천히 사라졌다\n
바람에 흩날리는 망토만이 그녀의 흔적처럼 남아 있었다.
`,
    image: "ending_fail2_4.png"
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
        window.location.href = "game.html";
    }, 3000)
  }
}

function skipSlides() {
  clearInterval(typingInterval);
  window.location.href = "game.html";
}

window.onload = typeSlide;
document.addEventListener("click", nextSlide);
skipBtn.addEventListener("click", skipSlides);
