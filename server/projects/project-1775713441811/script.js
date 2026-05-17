document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission (placeholder for static site)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset(); // Clear the form
        });
    }

    // Optional: Add a subtle animation/interaction on scroll
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            } else {
                entry.target.classList.remove('fade-in'); // Optional: remove on scroll out
            }
        });
    }, options);

    sections.forEach(section => {
        section.classList.add('scroll-animate'); // Add class for initial styling
        observer.observe(section);
    });

    // Add CSS for fade-in effect (usually in style.css, but adding here for context)
    const style = document.createElement('style');
    style.innerHTML = `
        .scroll-animate {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .scroll-animate.fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});