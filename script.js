// State management variables
let products = [];
let cart = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartModal = document.getElementById('cartModal');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// 1. Fetch product data from products.json file using Fetch API
async function loadProducts() {
  try {
    const response = await fetch('products.json');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching product data:', error);
    productGrid.innerHTML = '<p>Failed to load products. Please run using a local web server.</p>';
  }
}

// 2. Render product cards to HTML
function displayProducts(items) {
  productGrid.innerHTML = '';
  
  if (items.length === 0) {
    productGrid.innerHTML = '<p class="empty-msg">No products found matching your search.</p>';
    return;
  }

  items.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <div class="image-box">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="card-body">
        <span class="category">${product.category}</span>
        <h3>${product.name}</h3>
        <div class="details-row">
          <span class="price">$${product.price.toFixed(2)}</span>
          <span class="rating">${product.rating}</span>
        </div>
        <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// 3. Add to Cart Logic
function addToCart(productId) {
  const selectedProduct = products.find(p => p.id === productId);
  cart.push(selectedProduct);
  updateCart();
}

// 4. Update Cart display UI & calculations
function updateCart() {
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#ef4444; cursor:pointer;">Remove</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = `$${total.toFixed(2)}`;
}

// 5. Remove item from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// 6. Search Bar Filtering
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});

// 7. Toggle Cart Modal Display
cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCart.addEventListener('click', () => cartModal.classList.remove('active'));

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProducts);