document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple "Add to Cart" button feedback (can be expanded for actual cart functionality)
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            alert('Item added to cart! (This is a demo)');
            // In a real application, you would add actual cart logic here.
        });
    });

    // Form submission alert
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon. (This is a demo)');
            contactForm.reset();
            // In a real application, you would send this form data to a backend server.
        });
    }
});