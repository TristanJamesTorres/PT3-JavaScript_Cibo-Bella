let isDiscountApplied = false;

function computeMainCourse() {
    const getQty = (id) => {
        const el = document.getElementById(id);
        return el ? parseInt(el.value) || 0 : 0;
    };

    const menuItems = [
        { id: "GarlicPepperBeefQty", name: "Garlic Pepper Beef", price: 265 },
        { id: "ChickenAndWaffleQty", name: "Chicken and Waffles", price: 295 },
        { id: "CrispyPorkBellyQty", name: "Crispy Pork Belly", price: 265 },
        { id: "MarinaraMeatBallsQty", name: "Marinara Meatballs", price: 165 },
        { id: "ParmesanCrustedFishQty", name: "Parmesan Crusted Fish", price: 255 },
        { id: "TunaSteakQty", name: "Tuna Steak", price: 345 },
        { id: "Strawberry&CreamQty", name: "Strawberry Cream", price: 165 },
        { id: "OreoMilkshakeQty", name: "Oreo Milkshake", price: 170 },
        { id: "MatchaQty", name: "Matcha", price: 165 },
        { id: "MochaCaramelQty", name: "Mocha Caramel", price: 175 },
        { id: "ChocoJavaChipQty", name: "Choco Java Chip", price: 170 },
        { id: "CookieCrumble", name: "Cookie Crumbler", price: 175 },
        { id: "CampfireSmoreQty", name: "Campfire Smore", price: 85 },
        { id: "DulceDeLecheBarQty", name: "Dulce De Leche Bar", price: 75 },
        { id: "StrawberryBananaQty", name: "Strawberry Banana Shake", price: 155 }
    ];

    let cart = JSON.parse(localStorage.getItem("ciboCart")) || [];
    let localTotal = 0;

    menuItems.forEach(item => {
        let qty = getQty(item.id);
        if (qty > 0) {
            localTotal += item.price * qty;
            let existingItem = cart.find(cartItem => cartItem.name === item.name);
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ name: item.name, qty: qty, price: item.price });
            }
            document.getElementById(item.id).value = 0; // Reset input
        }
    });

    localStorage.setItem("ciboCart", JSON.stringify(cart));
    
    const totalDisplay = document.getElementById("totalMain");
    if (totalDisplay) {
        totalDisplay.innerText = localTotal.toLocaleString();
    }
    
    if (localTotal > 0) alert("Items added to cart!");
}

// 2. CART DISPLAY LOGIC 

function displayCart() {
    const tableBody = document.getElementById("cartTableBody");
    const subtotalDisplay = document.getElementById("subtotalDisplay");
    
    if (!tableBody) return; 

    let cart = JSON.parse(localStorage.getItem("ciboCart")) || [];
    let subtotal = 0;
    tableBody.innerHTML = "";

    cart.forEach((item, index) => {
        let itemSubtotal = item.price * item.qty;
        subtotal += itemSubtotal;
        
        tableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>₱${itemSubtotal.toLocaleString()}</td>
                <td><button class="remove_btn" onclick="removeItem(${index})">Remove</button></td>
            </tr>
        `;
    });

    subtotalDisplay.innerText = subtotal.toLocaleString();
    updateTotals(subtotal);
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("ciboCart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("ciboCart", JSON.stringify(cart));
    displayCart();
}
// 3. DISCOUNT & CHECKOUT 

function updateTotals(subtotal) {
    let discount = isDiscountApplied ? subtotal * 0.12 : 0;
    let finalPay = subtotal - discount;

    document.getElementById("discountDisplay").innerText = discount.toLocaleString(undefined, {minimumFractionDigits: 2});
    document.getElementById("finalDisplay").innerText = finalPay.toLocaleString(undefined, {minimumFractionDigits: 2});
}

function applySeniorDiscount() {
    if (isDiscountApplied) {
        alert("Discount has already been applied.");
        return;
    }

    let isSenior = confirm("Is your age 60 or above?");

    if (isSenior) {
        isDiscountApplied = true;
        let subtotalText = document.getElementById("subtotalDisplay").innerText.replace(/,/g, '');
        let subtotal = parseFloat(subtotalText) || 0;
        
        updateTotals(subtotal);
        alert("12% Discount Applied Successfully!");
    } else {
        alert("This discount is only applicable for ages 60 and above.");
    }
}

function finishOrder() {
    let finalAmount = document.getElementById("finalDisplay").innerText;
    if (finalAmount === "0" || finalAmount === "0.00") {
        alert("Your cart is empty!");
    } else {
        alert("Transaction Complete! Thank you for dining with Cibo & Bella.");
        localStorage.removeItem("ciboCart"); 
        window.location.href = "index.html"; 
    }
}

//Ensure the table loads as soon as the cart page opens
window.onload = displayCart;
