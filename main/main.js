document.addEventListener("DOMContentLoaded", function () {
  const texts = document.querySelectorAll(".text");
  const wrapper = document.getElementById("wrapper");

  // Задержки (в мс)
  const extraDelay = 1500;          // дополнительная задержка после GSAP-анимации
  const delayBeforeFirstBlock = 3000; // задержка перед запуском генерации первого блока второй анимации (пока пульсирует знак)
  const delayBetweenBlocks = 3000;    // задержка между генерацией последующих блоков

  function animateText() {
    gsap.set(texts, { autoAlpha: 0, scale: 0.5 });
    texts.forEach((text, index) => {
      gsap.to(text, {
        autoAlpha: index === texts.length - 1 ? 1 : 0.6,
        scale: 1,
        delay: 1 + index * 0.07,
        duration: 1.2,
        ease: "power2.out"
      });
    });
    // Вычисляем общее время первой анимации
    const totalAnimationTime = 1 + texts.length * 0.07 + 1.2;
    // Запуск triggerGlitch после завершения GSAP-анимации плюс дополнительная задержка
    setTimeout(triggerGlitch, totalAnimationTime * 1000 + extraDelay);
  }

  function triggerGlitch() {
    wrapper.classList.add("glitch");
    // Через 500 мс после старта глитча скрываем контейнер первой анимации и запускаем вторую
    setTimeout(() => {
      wrapper.style.display = "none";
      startScrambleAnimation();
    }, 500);
  }

  setTimeout(animateText, 500);

  // Класс для эффекта "разбивания" текста (TextScramble)
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.update = this.update.bind(this);
    }

    setText(newText) {
      // Если присутствует пульсирующий символ, удаляем его
      const blinking = this.el.querySelector('.blinking');
      if (blinking) blinking.remove();

      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to = newText[i] || '';
        // Диапазоны увеличены для более длительного эффекта (настраивается по необходимости)
        const start = Math.floor(Math.random() * 250);
        const end = start + Math.floor(Math.random() * 250);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      return new Promise(resolve => {
        this.resolve = resolve;
        this.update();
      });
    }

    update() {
      let output = '';
      let complete = 0;
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          complete++;
          output += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.randomChar();
            this.queue[i].char = char;
          }
          output += `<span class="dud">${char}</span>`;
        } else {
          output += from;
        }
      }
      this.el.innerHTML = output;
      if (complete === this.queue.length) {
        this.resolve();
      } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
      }
    }

    randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
  }

  function startScrambleAnimation() {
    const scrambleContainer = document.getElementById("scrambleContainer");
    scrambleContainer.style.display = "flex";
    showThreeLines();
  }

  function showThreeLines() {
    const lines = [
      "Кажуть, що реальність визначають неписані закони.",
      "Та що, коли ці закони можна осягнути й перетворити на свою перевагу?",
      `Ми допоможемо тобі в цьому.
Наша команда спеціалізується на повному спектрі юридичних рішень:
від індивідуальних консультацій до масштабних державних проєктів.
Крокуй разом із нами за межі очевидного.`
    ];

    const line1El = document.getElementById("line1");
    const line2El = document.getElementById("line2");
    const line3El = document.getElementById("line3");

    // 1. Показываем пульсирующий символ в line1
    line1El.innerHTML = '<span class="blinking">|</span>';
    // Ждём delayBeforeFirstBlock, чтобы знак успел пульсировать, затем запускаем генерацию первого блока
    setTimeout(() => {
      const fx1 = new TextScramble(line1El);
      fx1.setText(lines[0]).then(() => {
        // 2. После генерации первого блока вставляем пульсирующий символ в line2
        line2El.innerHTML = '<span class="blinking">|</span>';
        setTimeout(() => {
          const fx2 = new TextScramble(line2El);
          fx2.setText(lines[1]).then(() => {
            // 3. После генерации второго блока вставляем пульсирующий символ в line3
            line3El.innerHTML = '<span class="blinking">|</span>';
            setTimeout(() => {
              const fx3 = new TextScramble(line3El);
              fx3.setText(lines[2]);
            }, delayBetweenBlocks);
          });
        }, delayBetweenBlocks);
      });
    }, delayBeforeFirstBlock);
  }
});
