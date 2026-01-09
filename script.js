// API URL
const API_URL = "https://fakestoreapi.com/products";

// Fetch products dynamically
async function fetchProducts(category = "all") {
    try {
        const response = await fetch(API_URL); // Fetch all products
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

if(document.location.pathname.includes("products.html")){
    const productList = document.querySelector("#productsList");
    // console.log(productList);
    // render products
    async function renderProducts(category="all"){
        const products = await fetchProducts(category);
        productList.innerHTML = ""; //clear previos items

        products.forEach(product => {
            const productCard = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="viewDetails(${product.id})">View Details</button>
                <button onclick="addToCart(${product.id}, ${product.price}, '${product.title}', '${product.image}' )">Add to cart</button>
            </div>
            `;
            productList.innerHTML+= productCard;
        });
    }

    document.querySelector('#categoryFilter').addEventListener("change", e=>{
        renderProducts(e.target.value);
    })
    renderProducts();
};

async function viewDetails(productId){
    try{
        const response = await fetch(`${API_URL}/${productId}`);
        const product = await response.json();
        localStorage.setItem("currentProduct", JSON.stringify(product));
        document.location.href = "product-details.html";
    }catch(err){
        console.error("error feaching products", err);
    }
};

async function addToCart(productId, price, title, image){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({productId, price, title, image});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${title} added to cart`);
}

if(document.location.pathname.includes("product-details.html")){
    const product = JSON.parse(localStorage.getItem("currentProduct"));
    if(product){
        document.querySelector("#productDetails").innerHTML = `
            <!-- <div class="product-card"> -->
                <h1>${product.title}</h1>
                <img src="${product.image}" alt="${product.title}">
                <p>Price: $${product.price}</p>
                <p>${product.description}</p>
                <button onclick="addToCart(${product.id}, ${product.price}, '${product.title}', '${product.image}' )">Add to cart</button>
            <!-- </div> -->
            `;
    }else{
        document.querySelector("#productDetails").innerHTML = '<p>Product not found</p>'
    }
}

if(document.location.pathname.includes("cart.html")){
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItems = document.querySelector("#cartItems");
    const totalPrice = document.querySelector("#totalPrice");

    function renderCart(){
        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach(product=>{
            total+= product.price;
            cartItems.innerHTML+= `
                <li>
                    <img src="${product.image}" alt="${product.title}" style="width:50px; vertical-align:middle;">
                    ${product.title} - $${product.price}
                </li>
                `;
        });
        totalPrice.textContent = total.toFixed(2);

        document.querySelector("#buyNow").addEventListener("click", () => {
        alert("Your order has been successfully placed!");
        localStorage.setItem("cart", "[]"); // Clear cart
        document.location.href = "success.html";
    });

    }
    renderCart();
}
if (document.location.pathname.includes("signup.html")) {
    const signupForm = document.querySelector("#signupForm");
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = signupForm.username.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;

        // Save user data in localStorage
        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Sign-up successful! Please log in.");
        document.location.href = "login.html";
    });
}

// Handle Login
if (document.location.pathname.includes("login.html")) {
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Fetch user data from localStorage
        const savedUser = JSON.parse(localStorage.getItem("user"));

        // Verify credentials
        if (savedUser && savedUser.email === email && savedUser.password === password) {
            alert(`Welcome back, ${savedUser.username}!`);
            localStorage.setItem("loggedIn", true);
            document.location.href = "products.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });
}

// Redirect Unauthenticated Users
if (document.location.pathname.includes("signup.html")) {
    const signupForm = document.querySelector("#signupForm");
    signupForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const username = signupForm.username.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;

        // Save user data in localStorage
        const user = { username, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        alert("Sign-up successful! Please log in.");
        document.location.href = "login.html";
    });
}

// Handle Login
if (document.location.pathname.includes("login.html")) {
    const loginForm = document.querySelector("#loginForm");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Fetch user data from localStorage
        const savedUser = JSON.parse(localStorage.getItem("user"));

        // Verify credentials
        if (savedUser && savedUser.email === email && savedUser.password === password) {
            alert(`Welcome back, ${savedUser.username}!`);
            localStorage.setItem("loggedIn", true);
            document.location.href = "products.html";
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });
}

// Redirect Unauthenticated Users
if (
    !document.location.pathname.includes("login.html") &&
    !document.location.pathname.includes("signup.html") &&
    !JSON.parse(localStorage.getItem("loggedIn"))
) {
    document.location.href = "login.html";
}


// slider functionality

let slider_img = document.querySelector(".slider-img");
let images = ["images/img1.png", "images/img2.png", "images/img3.png", "images/img4.png", "images/img5.png", "images/img6.png", "images/img7.png"];
let idx = 0;

function showImages(){
    let interval = setInterval(()=>{
        slider_img.src = images[idx % images.length];
        idx++;
    }, 1000)
}

window.addEventListener("load", showImages);