document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - document.querySelector('.header').offsetHeight, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Optional: Add a simple scroll-to-top button functionality
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.textContent = '↑';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--secondary-color);
        color: var(--light-text-color);
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 999;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(scrollToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) { // Show button after scrolling 300px
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});