const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend server port

// --- Utility Functions ---
function getUserId() {
    return localStorage.getItem('userId');
}

function getUserName() {
    return localStorage.getItem('userName');
}

function getUserEmail() {
    return localStorage.getItem('userEmail');
}

function isLoggedIn() {
    return getUserId() !== null;
}

function showMessage(elementId, msg, isError = false) {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = msg;
        messageElement.classList.remove('hidden', 'error-message');
        if (isError) {
            messageElement.classList.add('error-message');
        } else {
            messageElement.classList.remove('error-message');
        }
        setTimeout(() => {
            messageElement.classList.add('hidden');
            messageElement.textContent = '';
        }, 5000); // Hide message after 5 seconds
    }
}

function updateAuthButtons() {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');
    const logoutButton = document.getElementById('logoutButton');

    if (isLoggedIn()) {
        if (loginButton) loginButton.classList.add('hidden');
        if (signupButton) signupButton.classList.add('hidden');
        if (logoutButton) logoutButton.classList.remove('hidden');
    } else {
        if (loginButton) loginButton.classList.remove('hidden');
        if (signupButton) signupButton.classList.remove('hidden');
        if (logoutButton) logoutButton.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    updateAuthButtons();
    // Redirect to home or login page if on protected pages
    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('cart.html')) {
        window.location.href = 'index.html';
    } else {
        window.location.reload(); // Refresh current page to update UI
    }
}

// --- Common UI Setup ---
document.addEventListener('DOMContentLoaded', () => {
    updateAuthButtons();

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    // Add active class to current page in navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Normalize pathname to handle root and index.html consistently
        const currentPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
        const linkPath = new URL(link.href).pathname === '/' ? '/index.html' : new URL(link.href).pathname;

        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});


// --- Specific Page Logics ---

// Homepage (index.html)
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', async () => {
        const recordListElement = document.getElementById('recordList');
        const genreButtons = document.querySelectorAll('.genre-button');
        let allRecords = []; // Store all records fetched

        async function fetchRecords() {
            try {
                const response = await fetch(`${API_BASE_URL}/records`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                allRecords = await response.json();
                displayRecords('all'); // Display all records initially
            } catch (error) {
                console.error('Error fetching records:', error);
                recordListElement.innerHTML = '<p class="error-message">Failed to load records. Please try again later.</p>';
            }
        }

        function displayRecords(genre) {
            recordListElement.innerHTML = ''; // Clear previous records
            const filteredRecords = genre === 'all'
                ? allRecords
                : allRecords.filter(record => record.genre === genre);

            if (filteredRecords.length === 0) {
                recordListElement.innerHTML = `<p>No ${genre !== 'all' ? genre : ''} records found.</p>`;
                return;
            }

            filteredRecords.forEach(record => {
                const recordCard = document.createElement('div');
                recordCard.classList.add('record-card');
                recordCard.innerHTML = `
                    <img src="${record.image_url}" alt="${record.title} by ${record.artist}">
                    <div class="record-info">
                        <h3>${record.title}</h3>
                        <p>${record.artist}</p>
                        <p class="record-price">$${record.price.toFixed(2)}</p>
                        <button class="add-to-cart-btn" data-record-id="${record.id}">Add to Cart</button>
                    </div>
                `;
                recordListElement.appendChild(recordCard);
            });

            // Attach event listeners for 'Add to Cart' buttons
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', handleAddToCart);
            });
        }

        async function handleAddToCart(event) {
            if (!isLoggedIn()) {
                alert('Please log in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }

            const recordId = event.target.dataset.recordId;
            const userId = getUserId();

            try {
                const response = await fetch(`${API_BASE_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, recordId, quantity: 1 })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                alert(result.message); // Simple alert
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert(`Failed to add item to cart: ${error.message || 'Server error'}`);
            }
        }

        genreButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                genreButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
                displayRecords(event.target.dataset.genre);
            });
        });

        fetchRecords();
    });
}

// Login Page (login.html)
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await fetch(`${API_BASE_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        localStorage.setItem('userId', data.userId);
                        localStorage.setItem('userName', data.userName);
                        localStorage.setItem('userEmail', data.userEmail);
                        showMessage('message', data.message);
                        setTimeout(() => {
                            window.location.href = 'index.html'; // Redirect to home page
                        }, 1000);
                    } else {
                        showMessage('message', data.message, true);
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showMessage('message', 'An error occurred during login. Please try again.', true);
                }
            });
        }
    });
}

// Signup Page (signup.html)
if (window.location.pathname.includes('signup.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                try {
                    const response = await fetch(`${API_BASE_URL}/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        showMessage('message', data.message);
                        setTimeout(() => {
                            window.location.href = 'login.html'; // Redirect to login page
                        }, 1000);
                    } else {
                        showMessage('message', data.message, true);
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    showMessage('message', 'An error occurred during signup. Please try again.', true);
                }
            });
        }
    });
}

// Cart Page (cart.html)
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!isLoggedIn()) {
            alert('Please log in to view your cart.');
            window.location.href = 'login.html';
            return;
        }

        const cartItemsElement = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        const cartSummaryElement = document.getElementById('cartSummary');
        const cartTotalElement = document.getElementById('cartTotal');
        const purchaseButton = document.getElementById('purchaseButton');
        const purchaseMessage = document.getElementById('purchaseMessage');
        let currentCartItems = []; // Store current cart items for purchase

        async function fetchCart() {
            const userId = getUserId();
            if (!userId) {
                // Should not happen if isLoggedIn check passes, but for safety
                cartItemsElement.innerHTML = '<p class="error-message">User not logged in.</p>';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/cart/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                currentCartItems = await response.json();
                displayCart(currentCartItems);
            } catch (error) {
                console.error('Error fetching cart:', error);
                cartItemsElement.innerHTML = '<p class="error-message">Failed to load cart. Please try again.</p>';
                cartSummaryElement.classList.add('hidden'); // Hide summary on error
            }
        }

        function displayCart(items) {
            cartItemsElement.innerHTML = ''; // Clear previous items
            if (items.length === 0) {
                emptyCartMessage.classList.remove('hidden');
                cartSummaryElement.classList.add('hidden');
                return;
            }

            emptyCartMessage.classList.add('hidden');
            cartSummaryElement.classList.remove('hidden');

            let total = 0;
            items.forEach(item => {
                total += item.price * item.quantity;
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image_url}" alt="${item.title}">
                    <div class="item-details">
                        <h4>${item.title}</h4>
                        <p>${item.artist}</p>
                    </div>
                    <div class="item-actions">
                        <span class="item-quantity">Qty: ${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="remove-button" data-cart-item-id="${item.cart_item_id}">Remove</button>
                    </div>
                `;
                cartItemsElement.appendChild(cartItemDiv);
            });
            cartTotalElement.textContent = total.toFixed(2);

            document.querySelectorAll('.remove-button').forEach(button => {
                button.addEventListener('click', handleRemoveFromCart);
            });
        }

        async function handleRemoveFromCart(event) {
            const cartItemId = event.target.dataset.cartItemId;
            if (!confirm('Are you sure you want to remove this item from your cart?')) {
                return;
            }
            try {
                const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                showMessage('purchaseMessage', result.message);
                fetchCart(); // Refresh cart display
            } catch (error) {
                console.error('Error removing from cart:', error);
                showMessage('purchaseMessage', `Failed to remove item from cart: ${error.message || 'Server error'}`, true);
            }
        }

        purchaseButton.addEventListener('click', async () => {
            if (currentCartItems.length === 0) {
                showMessage('purchaseMessage', 'Your cart is empty. Add items before purchasing.', true);
                return;
            }
            const userId = getUserId();
            const itemsToOrder = currentCartItems.map(item => ({
                record_id: item.record_id,
                quantity: item.quantity
            }));

            try {
                const response = await fetch(`${API_BASE_URL}/order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId, cartItems: itemsToOrder })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                showMessage('purchaseMessage', 'Your order has been dispatched!'); // Display success message
                currentCartItems = []; // Clear local cart
                displayCart([]); // Update UI to show empty cart
            } catch (error) {
                console.error('Error placing order:', error);
                showMessage('purchaseMessage', `Failed to place order: ${error.message || 'Server error'}`, true);
            }
        });

        fetchCart();
    });
}

// Profile Page (profile.html)
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        if (!isLoggedIn()) {
            alert('Please log in to view your profile.');
            window.location.href = 'login.html';
            return;
        }

        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        const ordersListElement = document.getElementById('ordersList');
        const emptyOrdersMessage = document.getElementById('emptyOrdersMessage');

        async function fetchUserProfile() {
            const userId = getUserId();
            if (!userId) {
                // Should not happen if isLoggedIn check passes
                showMessage('profileMessage', 'User not logged in.', true);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                displayUserProfile(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                showMessage('profileMessage', `Failed to load profile data: ${error.message || 'Server error'}`, true);
            }
        }

        function displayUserProfile(data) {
            userNameElement.textContent = data.user.name;
            userEmailElement.textContent = data.user.email;

            ordersListElement.innerHTML = ''; // Clear previous orders

            if (data.orderHistory && data.orderHistory.length > 0) {
                emptyOrdersMessage.classList.add('hidden');
                data.orderHistory.forEach(order => {
                    const orderDiv = document.createElement('div');
                    orderDiv.classList.add('order-entry');
                    orderDiv.innerHTML = `
                        <div class="order-header">
                            <h4>Order ID: ${order.order_id}</h4>
                            <span>Date: ${new Date(order.order_date).toLocaleDateString()}</span>
                        </div>
                        <div class="order-item-list">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image_url}" alt="${item.title}">
                                    <div class="item-details">
                                        <h4>${item.title}</h4>
                                        <p>${item.artist}</p>
                                        <p>Qty: ${item.quantity} | Price: $${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                    ordersListElement.appendChild(orderDiv);
                });
            } else {
                emptyOrdersMessage.classList.remove('hidden');
            }
        }

        fetchUserProfile();
    });
}