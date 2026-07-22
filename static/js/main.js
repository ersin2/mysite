/* main.js v20.0 — clean, no syntax errors */
document.addEventListener("DOMContentLoaded", () => {

    /* ---- 1. NAV SCROLL EFFECT ---- */
    const nav = document.getElementById("nav");
    if (nav) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 30) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    /* ---- 2. CUSTOM CURSOR ---- */
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (dot && ring && window.matchMedia("(pointer: fine)").matches) {
        document.body.classList.add("has-cursor");
        let mx = 0, my = 0, rx = 0, ry = 0;
        window.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + "px";
            dot.style.top  = my + "px";
        }, { passive: true });
        const animRing = () => {
            rx += (mx - rx) * 0.18;
            ry += (my - ry) * 0.18;
            ring.style.left = rx + "px";
            ring.style.top  = ry + "px";
            requestAnimationFrame(animRing);
        };
        animRing();
        document.querySelectorAll("a, button, .project-card, .contact-item, .nav-cta").forEach((el) => {
            el.addEventListener("mouseenter", () => ring.classList.add("hover"));
            el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
        });
    }

    /* ---- 3. SCROLL REVEAL ---- */
    const revealEls = document.querySelectorAll(
        ".hero-inner, .hero-orb, .project-card, .skill-group, .contact-left, .contact-form-card, .section-header"
    );
    revealEls.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay || "0");
                setTimeout(() => {
                    el.style.opacity = "1";
                    el.style.transform = "translateY(0)";
                }, delay);
                revealObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

    revealEls.forEach((el, i) => {
        el.dataset.delay = String(i * 60);
        revealObserver.observe(el);
    });

    /* ---- 4. SKILL BAR ANIMATION ---- */
    const skillFills = document.querySelectorAll(".skill-fill");
    if (skillFills.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animated");
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        skillFills.forEach((el) => skillObserver.observe(el));
    }

    /* ---- 5. PROJECT CARD MOUSE GLOW ---- */
    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width * 100) + "%");
            card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height * 100) + "%");
        });
    });

    /* ---- 6. CONTACT FORM AJAX ---- */
    const form = document.getElementById("contact-form");
    const statusEl = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");

    if (form && statusEl && submitBtn) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btnText = submitBtn.querySelector(".submit-text");
            if (btnText) btnText.textContent = "Sending...";
            submitBtn.disabled = true;
            statusEl.className = "form-status";
            statusEl.textContent = "";

            try {
                const res = await fetch("/contact/send/", {
                    method: "POST",
                    body: new FormData(form)
                });
                const data = await res.json();
                if (res.ok && data.status === "success") {
                    statusEl.className = "form-status success";
                    statusEl.textContent = "✓ Message sent! I'll get back to you soon.";
                    form.reset();
                } else {
                    statusEl.className = "form-status error";
                    statusEl.textContent = data.message || "Something went wrong. Please try again.";
                }
            } catch (err) {
                statusEl.className = "form-status error";
                statusEl.textContent = "Network error. Please check your connection.";
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = "Send Message";
            }
        });
    }

});