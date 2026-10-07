function renderCart() {
  const box = document.getElementById("cartContent");
  const cart = getCart();
  const ids = Object.keys(cart.items);

  if (ids.length === 0) {
    box.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add something tasty from a restaurant menu.</p>
        <a href="restaurants.html" class="primary-btn link-btn">Browse restaurants</a>
      </div>
    `;
    return;
  }

  const restaurant = getRestaurant(cart.restaurant_id);

  box.innerHTML = `
    <h1 class="page-title">Your Cart</h1>
    <p class="result-count">Ordering from
      <a href="menu.html?restaurant=${restaurant.restaurant_id}">${restaurant.restaurant_name}</a></p>

    <div class="cart-box">
      ${ids.map(id => cartRowHTML(Number(id), cart.items[id])).join("")}
    </div>

    <div class="cart-box bill">
      <div class="bill-line total"><span>Order total</span><span>₹${cartTotal()}</span></div>
    </div>

    <div class="cart-actions">
      <button class="primary-btn" onclick="goToCheckout()">Proceed to checkout</button>
      <button class="secondary-btn" onclick="emptyCart()">Clear cart</button>
    </div>
  `;
}

function cartRowHTML(id, qty) {
  const item = findItem(id);
  return `
    <div class="cart-row">
      <div class="menu-icon">${item.icon}</div>
      <div class="menu-details">
        <strong>${item.item_name}</strong>
        <span>₹${item.price} each</span>
      </div>
      <div class="qty-box">
        <button onclick="update(${id}, -1)">−</button>
        <span>${qty}</span>
        <button onclick="update(${id}, 1)">+</button>
      </div>
      <div class="cart-line-total">₹${item.price * qty}</div>
    </div>
  `;
}

function update(id, amount) {
  changeQty(id, amount);
  renderCart();
}

function emptyCart() {
  if (confirm("Remove all items from your cart?")) {
    clearCart();
    renderCart();
  }
}

function goToCheckout() {
  window.location.href = "payment.html";
}

renderCart();
