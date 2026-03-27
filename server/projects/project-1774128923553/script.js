// This script can be used for smooth scrolling or other interactive elements.
// For a simple static website, basic interactivity like smooth scrolling is common.

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - document.querySelector('header').offsetHeight, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log("AEC Civil Solutions website loaded!");
});