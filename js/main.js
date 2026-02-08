/* =========================
   SIGNUP FORM HANDLER
========================= */

document.getElementById("signupForm")?.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("formMessage");

    if (email) {
        message.textContent = "Thank you. We'll notify you at launch.";
        message.style.color = "#2D6CDF";
        this.reset();
    } else {
        message.textContent = "Please enter a valid email.";
        message.style.color = "red";
    }
});


/* =========================
   SCROLL TRIGGER (ELEMENT BASED)
========================= */

const scrollElements = document.querySelectorAll(".scroll-hidden");

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("scroll-show");
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.25
});

scrollElements.forEach(el => {
    observer.observe(el);
});


/* =========================
   HERO PARALLAX EFFECT
========================= */

const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
    const offset = window.scrollY;

    if (hero) {
        hero.style.backgroundPositionY = offset * 0.2 + "px";
    }
});