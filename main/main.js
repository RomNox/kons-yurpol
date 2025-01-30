document.addEventListener("DOMContentLoaded", function () {
    const texts = document.querySelectorAll(".text");

    function animateText() {
        gsap.set(texts, { autoAlpha: 0, scale: 0.5 });

        texts.forEach((text, index) => {
            gsap.to(text, {
                autoAlpha: index === texts.length - 1 ? 1 : 0.6, // Чуть белее серые буквы
                scale: 1,
                delay: 1 + index * 0.07, // Задержка 1 секунда перед началом
                duration: 1.2,
                ease: "power2.out",
            });
        });
    }

    setTimeout(animateText, 500); // Запускаем анимацию с задержкой 1 секунда
});