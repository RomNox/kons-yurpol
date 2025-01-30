document.addEventListener("DOMContentLoaded", function () {
    const texts = document.querySelectorAll(".text");
    const wrapper = document.getElementById("wrapper");

    function animateText() {
        gsap.set(texts, { autoAlpha: 0, scale: 0.5 });

        texts.forEach((text, index) => {
            gsap.to(text, {
                autoAlpha: index === texts.length - 1 ? 1 : 0.6, // Самый крупный белый, остальные серые
                scale: 1,
                delay: 1 + index * 0.07, // Задержка 1 сек перед стартом
                duration: 1.2,
                ease: "power2.out",
            });
        });

        // Рассчитываем длительность всей анимации текста
        const totalAnimationTime = 1 + texts.length * 0.07 + 1.2;

        // Стартуем глитч позже (ещё увеличена задержка)
        setTimeout(triggerGlitch, totalAnimationTime * 1000 + 2500); // Было 500 → стало 1200 мс
    }

    function triggerGlitch() {
        wrapper.classList.add("glitch");

        // Убираем всё через 0.5 сек после старта глитча (резко)
        setTimeout(() => {
            wrapper.style.display = "none"; // Полностью убираем контейнер
        }, 500);
    }

    setTimeout(animateText, 500); // Стартуем текстовую анимацию через 0.5 сек после загрузки
});
