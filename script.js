
document.addEventListener("DOMContentLoaded", () => {
    // Biography language switcher
    const languageButtons = document.querySelectorAll(".language-button");
    const biographyTexts = document.querySelectorAll(".bio-text");

    function showLanguage(language) {
        const target = document.getElementById(language);
        if (!target || !target.classList.contains("bio-text")) return;

        biographyTexts.forEach((article) => {
            const isActive = article === target;
            article.classList.toggle("active", isActive);
            article.hidden = !isActive;
        });

        languageButtons.forEach((button) => {
            const isActive = button.dataset.language === language;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    if (languageButtons.length && biographyTexts.length) {
        // Keep the currently marked language, falling back to English.
        const initiallyActive = document.querySelector(".language-button.active");
        const initialLanguage = initiallyActive?.dataset.language || "english";
        showLanguage(initialLanguage);

        languageButtons.forEach((button) => {
            button.addEventListener("click", () => {
                showLanguage(button.dataset.language);
            });
        });
    }

    // Send the contact form asynchronously, show a confirmation, and clear the fields.
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        const status = contactForm.querySelector(".form-status");
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (status) {
                status.hidden = true;
                status.textContent = "";
            }

            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: new FormData(contactForm),
                    headers: { Accept: "application/json" }
                });
                if (!response.ok) throw new Error("Message could not be sent");

                contactForm.reset();
                if (status) {
                    status.textContent = "Email sent";
                    status.hidden = false;
                }
            } catch (error) {
                if (status) {
                    status.textContent = "Sorry, the email could not be sent. Please try again.";
                    status.hidden = false;
                }
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const hash = link.getAttribute("href");
            if (!hash || hash === "#") return;

            const target = document.querySelector(hash);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            // Keep the URL's hash in sync without causing a second jump.
            if (window.location.hash !== hash) {
                history.pushState(null, "", hash);
            }
        });
    });
});
