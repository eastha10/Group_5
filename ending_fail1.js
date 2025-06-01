const slides = [
  {
    text: `성은 끝내 무너졌다\n
심연의 무리의 마지막 물결은 그 무엇도 남기지 않고 덮쳐왔다\n
성벽이 무너지는 순간, 케일은 시에르의 외침을 들었다
`,
    image: "ending_fail1_1.png"
  },
  {
    text: `“케일, 지금이야. 문을 닫아…!”\n
그는 적들의 파도를 막기 위해 문 바깥에서 시간을 끌고 있었다\n
이미 적들의 공격으로 엉망진창이 되어버린 그의 몸\n
그럼에도 그는 끝까지 활을 놓지 않았다.
`,
    image: "ending_fail1_2.png"
  },
  {
    text: `마지막까지 케일을 향해 웃으며 말했다\n
“넌 반드시 살아남아… 라스테일을 지켜…”\n
그 순간, 무너진 성벽의 잔해들이 그를 덮쳤다
`,
    image: "ending_fail1_3.png"
  },
  {
    text: `케일은 그를 꺼내려 했지만, 더 이상 아무 대답도 돌아오지 않았다
`,
    image: "ending_fail1_4.png"
  }
, {
    text: `왕국은 결국, 성벽이 저지하지 못한 심연의 무리로 멸망당했고\n
왕국을 끝까지 지키던 케일도 심연의 무리에 의해 머나먼 어둠속으로 내려갔다
`,
    image: "ending_fail1_5.png"
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
