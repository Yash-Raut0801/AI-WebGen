document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.target.dataset.productName;
            alert(`${productName} has been added to your cart! (Note: This is a static site, no actual cart functionality)`);
            console.log(`User added "${productName}" to cart.`);
            
            // In a real application, you would send this to a backend or update local storage.
            // For a static site, a simple alert or console log is sufficient.
        });
    });

    // Optional: Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});