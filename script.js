/* Mock Data & Logic for Roohira Online */

const products = [
    {
        id: 1,
        name: 'Silk Rose Luxury Sheet',
        price: 3500,
        description: 'Experience the ultimate comfort with our premium silk rose bedsheet. Perfect for creating a romantic and elegant atmosphere in your bedroom.',
        size: 'King',
        material: '100% Silk',
        category: 'Luxury',
        images: [
            'https://images.unsplash.com/photo-1522771753035-0a153950c6f2?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=2070&auto=format&fit=crop'
        ],
        stock: 20
    },
    {
        id: 2,
        name: 'Floral Dream Quilt Set',
        price: 2800,
        description: 'A beautiful floral pattern quilt set that brings the freshness of spring into your home. Soft cotton material for a cozy sleep.',
        size: 'Queen',
        material: 'Cotton Blend',
        category: 'Floral',
        images: [
            'https://images.unsplash.com/photo-1595188800160-5a3962646c75?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1635739066103-ba956461994a?q=80&w=2070&auto=format&fit=crop'
        ],
        stock: 15
    },
    {
        id: 3,
        name: 'Classic White Cotton',
        price: 1500,
        description: 'Timeless elegance with our classic white cotton bedsheet. High thread count for durability and softness.',
        size: 'Double',
        material: 'Egyptian Cotton',
        category: 'Plain',
        images: [
            'https://images.unsplash.com/photo-1582582621959-48d27397dc69?q=80&w=2069&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1617325247661-675ab4b64ae8?q=80&w=2071&auto=format&fit=crop'
        ],
        stock: 30
    },
    {
        id: 4,
        name: 'Kids Adventure Theme',
        price: 1800,
        description: 'Fun and adventurous theme for your little ones. Bright colors and durable fabric suitable for kids rooms.',
        size: 'Single',
        material: 'Polyester Microfiber',
        category: 'Kids',
        images: [
            'https://images.unsplash.com/photo-1629949009765-4ef64b633a57?q=80&w=2059&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1632059032733-0c464402660d?q=80&w=2070&auto=format&fit=crop'
        ],
        stock: 25
    },
    {
        id: 5,
        name: 'Golden Elegance Duvet',
        price: 4200,
        description: 'Add a touch of gold to your bedroom with this exquisite duvet cover. Matches perfectly with our luxury collection.',
        size: 'King',
        material: 'Satin',
        category: 'Luxury',
        images: [
            'https://images.unsplash.com/photo-1616627547584-bf28cee262db?q=80&w=2070&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618377382555-d3680e908646?q=80&w=2069&auto=format&fit=crop'
        ],
        stock: 10
    },
    {
        id: 6,
        name: 'Pastel Pink Delight',
        price: 2200,
        description: 'Soft pastel pink sheets to create a serene and calming environment. Matches our brand colors perfectly.',
        size: 'Queen',
        material: 'Bamboo Fiber',
        category: 'Plain',
        images: [
            'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1510134446-3dc9a716eb3d?q=80&w=2070&auto=format&fit=crop'
        ],
        stock: 18
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('roohira_cart')) || [];
let user = JSON.parse(localStorage.getItem('roohira_user')) || null;

// DOM Elements & Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateUserUI();

    // Page specific logic
    if (document.getElementById('product-grid')) loadShop();
    if (document.getElementById('featured-products')) loadFeatured();
    if (document.getElementById('product-detail-container')) loadProductDetails();
    if (document.getElementById('cart-container')) loadCart();
    if (document.getElementById('checkout-form')) loadCheckout();
    if (document.getElementById('login-form')) initLogin();
    if (document.getElementById('signup-form')) initSignup();
    if (document.getElementById('profile-container')) {
        loadProfile();
        initChangePassword();
    }
});

// --- UI Updates ---

function updateCartCount() {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = count;
}

function updateUserUI() {
    const loginLink = document.getElementById('login-link');
    const userMenu = document.getElementById('user-menu');

    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (userMenu) {
            userMenu.style.display = 'block';
            userMenu.querySelector('span').textContent = user.name.split(' ')[0];
        }
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// --- Product Listing ---

function loadFeatured() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featured = products.slice(0, 3);
    container.innerHTML = featured.map(p => createProductCard(p)).join('');
}

function loadShop() {
    const container = document.getElementById('product-grid');
    const filterContainer = document.getElementById('category-filters');
    if (!container) return;

    // Render Filters
    const categories = ['All', ...new Set(products.map(p => p.category))];
    if (filterContainer) {
        filterContainer.innerHTML = categories.map(cat =>
            `<button class="filter-tab ${cat === 'All' ? 'active' : ''}" onclick="filterProducts('${cat}')">${cat}</button>`
        ).join('');
    }

    // Initial Load
    renderProducts(products);
}

function filterProducts(category) {
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === category);
    });

    const filtered = category === 'All'
        ? products
        : products.filter(p => p.category === category);

    renderProducts(filtered);
}

function renderProducts(items) {
    const container = document.getElementById('product-grid');
    if (items.length === 0) {
        container.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 3rem;"><h3>No products found under this category.</h3></div>`;
        return;
    }
    container.innerHTML = items.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
    return `
    <div class="product-card">
        <div class="product-image">
            <a href="product.html?id=${product.id}">
                <img src="${product.images[0]}" alt="${product.name}">
            </a>
            <div class="product-actions">
                <button onclick="addToCart(${product.id})" class="action-btn" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
                <a href="product.html?id=${product.id}" class="action-btn" title="View Details"><i class="fas fa-eye"></i></a>
            </div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <a href="product.html?id=${product.id}"><h3 class="product-title">${product.name}</h3></a>
            <div class="flex justify-between items-center mt-2">
                <span class="product-price">Rs. ${product.price.toLocaleString()}</span>
                <div class="text-warning"><i class="fas fa-star text-gold"></i> 4.5</div>
            </div>
        </div>
    </div>
    `;
}

// --- Product Details ---

function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    const product = products.find(p => p.id === id);

    if (!product) {
        document.getElementById('product-detail-container').innerHTML = '<div class="text-center p-10">Product not found</div>';
        return;
    }

    // Populate Details
    document.getElementById('detail-image').src = product.images[0];
    document.getElementById('detail-category').textContent = product.category;
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-price').textContent = `Rs. ${product.price.toLocaleString()}`;
    document.getElementById('detail-desc').textContent = product.description;

    // New fields
    document.getElementById('detail-size').textContent = product.size;
    document.getElementById('detail-material').textContent = product.material;

    const stockStatus = document.getElementById('detail-stock');
    if (product.stock > 0) {
        stockStatus.textContent = 'In Stock';
        stockStatus.style.color = 'green';
    } else {
        stockStatus.textContent = 'Out of Stock';
        stockStatus.style.color = 'red';
        document.getElementById('add-to-cart-btn').disabled = true;
    }

    // Render Thumbnails
    const thumbContainer = document.getElementById('thumbnail-container');
    if (product.images.length > 1) {
        thumbContainer.innerHTML = product.images.slice(0, 3).map((img, index) => `
            <img src="${img}" class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
        `).join('');
    } else {
        thumbContainer.style.display = 'none';
    }

    // Add event listener to Add Cart button
    const btn = document.getElementById('add-to-cart-btn');
    btn.onclick = () => {
        const qty = parseInt(document.getElementById('qty-input').value);
        addToCart(product.id, qty);
    };
}

function changeImage(src, element) {
    document.getElementById('detail-image').src = src;

    // Toggle active class
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

// --- Cart Logic ---

function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    // Use first image for cart display
    const cartItem = {
        ...product,
        image: product.images[0],
        qty
    };

    const existingItem = cart.find(x => x.id === id);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('roohira_cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`, 'success');
}

function loadCart() {
    const container = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-10"><h3>Your cart is empty</h3><a href="shop.html" class="text-primary">Continue Shopping</a></div>';
        summary.style.display = 'none';
        return;
    }

    renderCartItems();
    updateCartTotals();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div style="flex-grow: 1;">
                <h3>${item.name}</h3>
                <p class="text-gray-500">Rs. ${item.price.toLocaleString()}</p>
            </div>
            <div class="quantity-control">
                <button onclick="updateQty(${item.id}, ${item.qty - 1})" class="qty-btn">-</button>
                <span class="qty-display">${item.qty}</span>
                <button onclick="updateQty(${item.id}, ${item.qty + 1})" class="qty-btn">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700" title="Remove"><i class="fas fa-trash"></i></button>
        </div>
    `).join('');
}

function updateQty(id, newQty) {
    if (newQty < 1) return;
    const item = cart.find(x => x.id === id);
    if (item) {
        // Check stock ideally
        item.qty = newQty;
        localStorage.setItem('roohira_cart', JSON.stringify(cart));
        renderCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

function removeFromCart(id) {
    cart = cart.filter(x => x.id !== id);
    localStorage.setItem('roohira_cart', JSON.stringify(cart));
    loadCart(); // Reload whole view
    updateCartCount();
}

function updateCartTotals() {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    document.getElementById('cart-total').textContent = `Rs. ${subtotal.toLocaleString()}`;
}

// --- Checkout ---

function loadCheckout() {
    if (cart.length === 0) {
        window.location.href = 'shop.html';
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    document.getElementById('checkout-total').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('summary-list').innerHTML = cart.map(item => `
        <div class="flex justify-between py-2 border-b border-gray-100">
            <span>${item.name} x ${item.qty}</span>
            <span>Rs. ${(item.price * item.qty).toLocaleString()}</span>
        </div>
    `).join('');

    // Pre-fill if user logged in
    if (user) {
        document.getElementById('name').value = user.name;
        document.getElementById('phone').value = user.phone;
    }
}

function placeOrder(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const phone = document.getElementById('phone').value;

    if (!name || !address || !city || !phone) {
        showToast('Please fill all fields', 'error');
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const orderItemsText = cart.map(item => `${item.name} x ${item.qty} - Rs ${item.price}`).join('%0A');

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${day}${month}${year}`;

    // Increment local order counter
    let orderCount = parseInt(localStorage.getItem('roohira_order_count') || '0') + 1;
    localStorage.setItem('roohira_order_count', orderCount.toString());
    const sequence = String(orderCount).padStart(3, '0');

    const orderId = `ORD-RO-${dateStr}-${sequence}`;
    const message = `Hello Roohira Online,%0AI would like to place an order.%0A%0AOrder ID: ${orderId}%0A%0ACustomer Details:%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}, ${city}%0A%0AOrder Items:%0A${orderItemsText}%0A%0ATotal: Rs ${subtotal}%0A%0AThank you.`;

    // Save order to local history (mock)
    if (user) {
        const orders = JSON.parse(localStorage.getItem(`roohira_orders_${user.email}`)) || [];
        orders.push({
            id: orderId,
            date: new Date().toISOString(),
            total: subtotal,
            items: cart
        });
        localStorage.setItem(`roohira_orders_${user.email}`, JSON.stringify(orders));
    }

    // Clear cart
    cart = [];
    localStorage.removeItem('roohira_cart');

    // Open WhatsApp
    window.open(`https://wa.me/94714433279?text=${message}`, '_blank');
    window.location.href = 'index.html';
}

// --- Auth ---

function initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Mock Login
        const storedUser = JSON.parse(localStorage.getItem(`roohira_user_${email}`));

        if (storedUser && storedUser.password === password) {
            localStorage.setItem('roohira_user', JSON.stringify(storedUser));
            showToast('Login Successful!', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showToast('Invalid credentials (Check signup)', 'error');
        }
    };
}

function initSignup() {
    const form = document.getElementById('signup-form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;

        const newUser = { name, email, phone, password };
        localStorage.setItem(`roohira_user_${email}`, JSON.stringify(newUser));
        localStorage.setItem('roohira_user', JSON.stringify(newUser));

        showToast('Account Created!', 'success');
        setTimeout(() => window.location.href = 'index.html', 1000);
    };
}

function initChangePassword() {
    const form = document.getElementById('change-password-form');
    if (!form) return;

    form.onsubmit = (e) => {
        e.preventDefault();
        const currentPass = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirmPass = document.getElementById('confirm-password').value;

        if (!user) return; // Should not happen if on profile page

        const storedUser = JSON.parse(localStorage.getItem(`roohira_user_${user.email}`));

        if (storedUser.password !== currentPass) {
            showToast('Incorrect current password', 'error');
            return;
        }

        if (newPass !== confirmPass) {
            showToast('New passwords do not match', 'error');
            return;
        }

        storedUser.password = newPass;
        localStorage.setItem(`roohira_user_${user.email}`, JSON.stringify(storedUser));
        localStorage.setItem('roohira_user', JSON.stringify(storedUser)); // Update session

        showToast('Password updated successfully!', 'success');
        form.reset();
    };
}

function loadProfile() {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;

    const orders = JSON.parse(localStorage.getItem(`roohira_orders_${user.email}`)) || [];
    const container = document.getElementById('order-history');

    if (orders.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No orders found.</p>';
    } else {
        container.innerHTML = orders.map(o => `
            <div class="border-b py-4">
                <div class="flex justify-between font-semibold">
                    <span>Order #${o.id.toString().slice(-6)}</span>
                    <span>Rs. ${o.total.toLocaleString()}</span>
                </div>
                <div class="text-sm text-gray-500">${new Date(o.date).toLocaleDateString()}</div>
                <div class="text-sm mt-1">${o.items.map(i => i.name).join(', ')}</div>
            </div>
        `).join('');
    }
}

function logout() {
    localStorage.removeItem('roohira_user');
    window.location.href = 'index.html';
}

// --- Utilities ---

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
