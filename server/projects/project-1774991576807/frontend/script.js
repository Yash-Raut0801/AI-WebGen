const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const recordsGrid = document.getElementById('records-grid');
const genreButtons = document.querySelectorAll('.genre-filter button');
const authMessage = document.getElementById('auth-message');

const cartModal = document.getElementById('cart-modal');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotal = document.getElementById('cart-total');
const purchaseButton = document.getElementById('purchase-button');
const cartMessage = document.getElementById('cart-message');
const closeCartButton = document.querySelector('#cart-modal .close-button');

const profileModal = document.getElementById('profile-modal');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const orderHistoryList = document.getElementById('order-history-list');
const closeProfileButton = document.querySelector('#profile-modal .close-button');

const loginButtonNav = document.getElementById('login-btn-nav');
const logoutButtonNav = document.getElementById('logout-btn-nav');
const cartButtonNav = document.getElementById('cart-btn-nav');
const profileButtonNav = document.getElementById('profile-btn-nav');

// State variables
let currentUserId = null;
let currentUserName = null;
let currentToken = null;

// --- Utility Functions ---

function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
    };
}

function isLoggedIn() {
    return currentToken !== null;
}

function updateNavButtons() {
    if (isLoggedIn()) {
        loginButtonNav.classList.add('hidden');
        logoutButtonNav.classList.remove('hidden');
        cartButtonNav.classList.remove('hidden');
        profileButtonNav.classList.remove('hidden');
    } else {
        loginButtonNav.classList.remove('hidden');
        logoutButtonNav.classList.add('hidden');
        cartButtonNav.classList.add('hidden');
        profileButtonNav.classList.add('hidden');
    }
}

function showModal(modalElement) {
    modalElement.style.display = 'flex';
}

function hideModal(modalElement) {
    modalElement.style.display = 'none';
}

// --- Record Display Functions ---

async function fetchRecords(genre = '') {
    try {
        const url = genre ? `${API_BASE_URL}/records?genre=${genre}` : `${API_BASE_URL}/records`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch records');
        }
        const records = await response.json();
        displayRecords(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        recordsGrid.innerHTML = '<p class="error-message">Failed to load records. Please try again later.</p>';
    }
}

function displayRecords(records) {
    recordsGrid.innerHTML = '';
    if (records.length === 0) {
        recordsGrid.innerHTML = '<p>No records found for this genre.</p>';
        return;
    }
    records.forEach(record => {
        const recordCard = document.createElement('div');
        recordCard.classList.add('record-card');
        recordCard.innerHTML = `
            <img src="${record.image_url}" alt="${record.title} Album Cover">
            <h3>${record.title}</h3>
            <p class="artist">${record.artist}</p>
            <p class="genre">${record.genre}</p>
            <p class="price">$${record.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-record-id="${record.id}">Add to Cart</button>
        `;
        recordsGrid.appendChild(recordCard);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });
}

// --- Cart Functions ---

async function handleAddToCart(event) {
    if (!isLoggedIn()) {
        alert('Please log in to add items to your cart.');
        return;
    }
    const recordId = event.target.dataset.recordId;
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ record_id: recordId, quantity: 1 })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to add item to cart');
        }
        alert(data.message);
        await fetchCartItems(); // Refresh cart display
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert(error.message || 'Error adding item to cart.');
    }
}

async function fetchCartItems() {
    if (!isLoggedIn()) {
        cartItemsList.innerHTML = '<p>Please log in to view your cart.</p>';
        cartTotal.textContent = '$0.00';
        purchaseButton.disabled = true;
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch cart items');
        }
        displayCartItems(data);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        cartItemsList.innerHTML = '<p class="error-message">Failed to load cart. Please try again.</p>';
        cartTotal.textContent = '$0.00';
        purchaseButton.disabled = true;
    }
}

function displayCartItems(items) {
    cartItemsList.innerHTML = '';
    let total = 0;
    if (items.length === 0) {
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        purchaseButton.disabled = true;
    } else {
        items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('cart-item');
            const itemPrice = item.price * item.quantity;
            total += itemPrice;
            li.innerHTML = `
                <img src="${item.image_url}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>Artist: ${item.artist}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-from-cart-btn" data-cart-item-id="${item.cart_item_id}">Remove</button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });
        purchaseButton.disabled = false;
    }
    cartTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
}

async function handleRemoveFromCart(event) {
    const cartItemId = event.target.dataset.cartItemId;
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to remove item from cart');
        }
        alert(data.message);
        await fetchCartItems(); // Refresh cart display
    } catch (error) {
        console.error('Error removing from cart:', error);
        alert(error.message || 'Error removing item from cart.');
    }
}

async function handlePurchase() {
    if (!isLoggedIn()) {
        alert('Please log in to purchase.');
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/order`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Purchase failed');
        }
        cartMessage.textContent = data.message;
        cartMessage.classList.remove('hidden');
        purchaseButton.disabled = true;
        cartItemsList.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.textContent = '$0.00';
        setTimeout(() => {
            cartMessage.classList.add('hidden');
            hideModal(cartModal);
        }, 3000);
        await fetchUserOrders(); // Refresh profile orders if profile is open
    } catch (error) {
        console.error('Error during purchase:', error);
        cartMessage.textContent = error.message || 'Error processing your order.';
        cartMessage.classList.remove('hidden');
        setTimeout(() => cartMessage.classList.add('hidden'), 3000);
    }
}

// --- Profile Functions ---

async function fetchUserProfile() {
    if (!isLoggedIn()) {
        profileName.textContent = 'Please log in';
        profileEmail.textContent = '';
        orderHistoryList.innerHTML = '<p>Please log in to view your order history.</p>';
        return;
    }
    try {
        const userResponse = await fetch(`${API_BASE_URL}/profile`, {
            headers: getAuthHeaders()
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) {
            throw new Error(userData.message || 'Failed to fetch user profile');
        }
        profileName.textContent = `Name: ${userData.name}`;
        profileEmail.textContent = `Email: ${userData.email}`;
        currentUserName = userData.name; // Update global user name

        await fetchUserOrders();

    } catch (error) {
        console.error('Error fetching user profile:', error);
        profileName.textContent = 'Error loading profile';
        profileEmail.textContent = '';
        orderHistoryList.innerHTML = '<p class="error-message">Failed to load profile or orders.</p>';
    }
}

async function fetchUserOrders() {
    if (!isLoggedIn()) {
        orderHistoryList.innerHTML = '<p>Please log in to view your order history.</p>';
        return;
    }
    try {
        const ordersResponse = await fetch(`${API_BASE_URL}/profile/orders`, {
            headers: getAuthHeaders()
        });
        const ordersData = await ordersResponse.json();
        if (!ordersResponse.ok) {
            throw new Error(ordersData.message || 'Failed to fetch user orders');
        }
        displayUserOrders(ordersData);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        orderHistoryList.innerHTML = '<p class="error-message">Failed to load order history.</p>';
    }
}

function displayUserOrders(orders) {
    orderHistoryList.innerHTML = '';
    if (orders.length === 0) {
        orderHistoryList.innerHTML = '<p>You have no past orders.</p>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');
        const orderDate = new Date(order.order_date).toLocaleDateString();
        orderCard.innerHTML = `
            <h3>Order #${order.order_id} - ${orderDate}</h3>
            <ul class="order-item-list"></ul>
        `;
        const orderItemList = orderCard.querySelector('.order-item-list');
        let orderTotal = 0;

        order.items.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('order-item');
            const itemTotal = item.price_at_purchase * item.quantity;
            orderTotal += itemTotal;
            li.innerHTML = `
                <img src="${item.image_url}" alt="${item.title}">
                <div class="order-item-details">
                    <p class="item-title">${item.title} by ${item.artist}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.price_at_purchase.toFixed(2)} each</p>
                </div>
            `;
            orderItemList.appendChild(li);
        });
        orderCard.innerHTML += `<p style="text-align: right; font-weight: bold; color: #2ecc71;">Order Total: $${orderTotal.toFixed(2)}</p>`;
        orderHistoryList.appendChild(orderCard);
    });
}

// --- Authentication Functions ---

function loadAuthFromLocalStorage() {
    currentToken = localStorage.getItem('token');
    currentUserId = localStorage.getItem('userId');
    currentUserName = localStorage.getItem('userName');
    updateNavButtons();
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    currentToken = null;
    currentUserId = null;
    currentUserName = null;
    updateNavButtons();
    alert('Logged out successfully!');
    window.location.href = 'auth.html'; // Redirect to auth page after logout
}

// --- Event Listeners ---

// Genre filter
genreButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        genreButtons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        const genre = event.target.dataset.genre;
        fetchRecords(genre === 'All' ? '' : genre);
    });
});

// Navigation buttons
loginButtonNav.addEventListener('click', () => {
    window.location.href = 'auth.html';
});
logoutButtonNav.addEventListener('click', logout);
cartButtonNav.addEventListener('click', () => {
    fetchCartItems();
    showModal(cartModal);
});
profileButtonNav.addEventListener('click', () => {
    fetchUserProfile();
    showModal(profileModal);
});

// Modal close buttons
closeCartButton.addEventListener('click', () => hideModal(cartModal));
closeProfileButton.addEventListener('click', () => hideModal(profileModal));
window.addEventListener('click', (event) => {
    if (event.target == cartModal) {
        hideModal(cartModal);
    }
    if (event.target == profileModal) {
        hideModal(profileModal);
    }
});

// Purchase button in cart modal
purchaseButton.addEventListener('click', handlePurchase);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadAuthFromLocalStorage();
    fetchRecords();
    updateNavButtons(); // Ensure nav buttons are correctly displayed on page load
});