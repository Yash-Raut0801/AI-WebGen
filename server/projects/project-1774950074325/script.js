document.addEventListener('DOMContentLoaded', () => {
    // Basic functionality: Log a message to the console when the page loads
    console.log('LaptopStore website loaded!');

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Example of adding a simple interaction: Alert when a "View Details" button is clicked
    document.querySelectorAll('.product-card .btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productTitle = e.target.closest('.product-card').querySelector('h3').textContent;
            alert(`You clicked "View Details" for: ${productTitle}`);
        });
    });
});