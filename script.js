// API URL
const API_URL = "https://fakestoreapi.com/products";

// Fetch products dynamically
async function fetchProducts(category = "all") {
    try {
        const response = await fetch(API_URL);
        const products = await response.json();

        if (category !== "all") {
            return products.filter(product => product.category === category);
        }
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

// Products page
if(document.location.pathname.includes("products.html")){
    const productList = document.querySelector("#productsList");
    
    // Render products
    async function renderProducts(category="all"){
        const products = await fetchProducts(category);
        productList.innerHTML = "";

        products.forEach(product => {
            const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button onclick="viewDetails(${product.id})">View Details</button>
                <button onclick="addToCart(${product.id}, ${product.price}, '${product.title.replace(/'/g, "\\'")}', '${product.image}' )">Add to cart</button>
            </div>
            `;
            productList.innerHTML+= productCard;
        });
    }

    document.querySelector('#categoryFilter').addEventListener("change", e=>{
        renderProducts(e.target.value);
    })
    renderProducts();
}

// View product details
async function viewDetails(productId){
    try{
        const response = await fetch(`${API_URL}/${productId}`);
        const product = await response.json();
        
        // Store in memory instead of localStorage
        sessionStorage.setItem("currentProduct", JSON.stringify(product));
        document.location.href = "product-details.html";
    }catch(err){
        console.error("error fetching products", err);
    }
}

// Add to cart
function addToCart(productId, price, title, image){
    let cart = [];
    try {
        cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    } catch (e) {
        cart = [];
    }
    
    cart.push({productId, price, title, image});
    sessionStorage.setItem("cart", JSON.stringify(cart));
    
    // Show better notification
    showNotification(`${title} added to cart!`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Product details page
if(document.location.pathname.includes("product-details.html")){
    const product = JSON.parse(sessionStorage.getItem("currentProduct"));
    if(product){
        document.querySelector("#productDetails").innerHTML = `
            <h1>${product.title}</h1>
            <img src="${product.image}" alt="${product.title}">
            <p style="font-size: 2rem; color: #667eea; font-weight: bold;">$${product.price}</p>
            <p>${product.description}</p>
            <p style="color: #666; margin-top: 1rem;"><strong>Category:</strong> ${product.category}</p>
            <p style="color: #666;"><strong>Rating:</strong> ${product.rating?.rate || 'N/A'} ⭐ (${product.rating?.count || 0} reviews)</p>
            <button onclick="addToCart(${product.id}, ${product.price}, '${product.title.replace(/'/g, "\\'")}', '${product.image}' )">Add to cart</button>
            <button onclick="window.location.href='products.html'" style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%);">Back to Products</button>
        `;
    }else{
        document.querySelector("#productDetails").innerHTML = '<p>Product not found</p>'
    }
}

// Cart page
if(document.location.pathname.includes("cart.html")){
    let cart = [];
    try {
        cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    } catch (e) {
        cart = [];
    }
    
    const cartItems = document.querySelector("#cartItems");
    const totalPrice = document.querySelector("#totalPrice");

    function renderCart(){
        cartItems.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            totalPrice.textContent = '0.00';
            return;
        }

        cart.forEach((product, index) => {
            total += product.price;
            cartItems.innerHTML += `
                <li>
                    <img src="${product.image}" alt="${product.title}">
                    <span style="flex: 1;">${product.title} - $${product.price}</span>
                    <button onclick="removeFromCart(${index})" style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 0.5rem 1rem;">Remove</button>
                </li>
            `;
        });
        totalPrice.textContent = total.toFixed(2);
    }

    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        sessionStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
        showNotification('Item removed from cart');
    }

    document.querySelector("#buyNow").addEventListener("click", () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        sessionStorage.setItem("cart", "[]");
        document.location.href = "success.html";
    });

    renderCart();
}

// Signup
if (document.location.pathname.includes("signup.html")) {
    const signupForm = document.querySelector("#signupForm");
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = signupForm.username.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters');
            return;
        }

        const user = { username, email, password };
        sessionStorage.setItem("user", JSON.stringify(user));
        showNotification('Sign-up successful! Please log in.');
        setTimeout(() => {
            document.location.href = "login.html";
        }, 1500);
    });
}

// Login
if (document.location.pathname.includes("login.html")) {
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const savedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

        if (savedUser.email === email && savedUser.password === password) {
            showNotification(`Welcome back, ${savedUser.username}!`);
            sessionStorage.setItem("loggedIn", "true");
            setTimeout(() => {
                document.location.href = "products.html";
            }, 1000);
        } else {
            showNotification('Invalid credentials. Please try again.');
        }
    });
}

// Auth redirect
if (
    !document.location.pathname.includes("login.html") &&
    !document.location.pathname.includes("signup.html") &&
    sessionStorage.getItem("loggedIn") !== "true"
) {
    document.location.href = "login.html";
}

// Enhanced slider functionality
let slider_img = document.querySelector(".slider-img");
if (slider_img) {
    let images = ["images/img1.png", "images/img2.png", "images/img3.png", "images/img4.png", "images/img5.png", "images/img6.png", "images/img7.png"];
    let idx = 0;

    function showImages(){
        setInterval(()=>{
            slider_img.style.opacity = '0';
            setTimeout(() => {
                slider_img.src = images[idx % images.length];
                slider_img.style.opacity = '1';
                idx++;
            }, 400);
        }, 3000);
    }

    slider_img.style.transition = 'opacity 0.4s ease-in-out';
    window.addEventListener("load", showImages);
}