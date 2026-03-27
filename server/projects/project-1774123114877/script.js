document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuToggle.classList.toggle('open');
    });

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                nav.classList.remove('open');
                menuToggle.classList.remove('open');
            }
        });
    });

    // Scroll reveal animations with Intersection Observer
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // Simple header sticky effect (optional, CSS fixed position handles most)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.7)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
        }
    });

    // Active navigation link on scroll (optional)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav ul li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) { // Adjust for better trigger point
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Initial active link for home on load
    if (window.location.hash === '') {
        document.querySelector('.nav ul li a[href="#hero"]').classList.add('active');
    }
});