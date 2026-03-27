document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const menuItem = event.target.closest('.menu-item');
            const itemName = menuItem.querySelector('h3').textContent;
            const itemPrice = menuItem.querySelector('.price').textContent;

            // In a real application, you would add this to a cart array
            // and update a cart UI element.
            // For this simple static site, we'll just show an alert.
            alert(`Added "${itemName}" (${itemPrice}) to your cart!`);

            console.log(`Item added: ${itemName}, Price: ${itemPrice}`);
        });
    });
});