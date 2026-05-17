document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.main-nav a, .hero .btn').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - (document.querySelector('.main-header').offsetHeight), // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Basic form submission message (for static site, no actual submission)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent actual form submission

            // In a real application, you would send this data to a server.
            // For a static site, we just show a message.
            alert('Thank you for your message! We will get back to you soon.');

            // Optionally clear the form
            this.reset();
        });
    }
});