function renderCheckout() {
  const box = document.getElementById("paymentContent");
  const cart = getCart();

  if (Object.keys(cart.items).length === 0) {
    window.location.href = "cart.html";
    return;
  }

  const restaurant = getRestaurant(cart.restaurant_id);
  const customer = getCustomer();

  box.innerHTML = `
    <a href="cart.html" class="back-link">← Back to cart</a>
    <h1 class="page-title" style="margin-top:12px">Checkout</h1>

    <div class="form-box">
      <h3>Delivery details</h3>

      <label class="field-label" for="address">Delivery address</label>
      <input class="field" id="address" placeholder="House no, street, area, Chennai"
             value="${escapeHTML(customer.address)}">
      <div class="error-text" id="addressError"></div>

      <label class="field-label" for="phone">Contact phone number</label>
      <input class="field" id="phone" inputmode="tel" placeholder="10-digit mobile number"
             value="${escapeHTML(customer.phone_no[0] || "")}">
      <div class="error-text" id="phoneError"></div>
    </div>

    <div class="form-box">
      <h3>Payment mode</h3>
      <div class="pay-options">
        <label><input type="radio" name="method" value="UPI" checked>UPI</label>
        <label><input type="radio" name="method" value="Card">Card</label>
        <label><input type="radio" name="method" value="Cash on delivery">Cash on delivery</label>
      </div>
      <p class="demo-note">This is a demo project, so no real payment is taken.</p>
    </div>

    <div class="form-box">
      <h3>Order summary</h3>
      <p class="demo-note" style="margin:0 0 10px">${restaurant.restaurant_name}</p>
      ${Object.keys(cart.items).map(id => {
        const item = findItem(Number(id));
        return `<div class="bill-line">
                  <span>${cart.items[id]} × ${item.item_name}</span>
                  <span>₹${item.price * cart.items[id]}</span>
                </div>`;
      }).join("")}
      <div class="bill-line total"><span>Order total</span><span>₹${cartTotal()}</span></div>
    </div>

    <button class="primary-btn" onclick="submitOrder()">Pay ₹${cartTotal()} and place order</button>
  `;
}

function submitOrder() {
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const method = document.querySelector("input[name='method']:checked").value;

  let hasError = false;

  if (address.length < 8) {
    document.getElementById("addressError").textContent = "Please enter your full delivery address.";
    hasError = true;
  } else {
    document.getElementById("addressError").textContent = "";
  }

  if (!/^\d{10}$/.test(phone)) {
    document.getElementById("phoneError").textContent = "Enter a 10-digit phone number.";
    hasError = true;
  } else {
    document.getElementById("phoneError").textContent = "";
  }

  if (hasError) return;

  // Update the customer: add the phone to the list, keep the first address as default
  const customer = getCustomer();
  if (!customer.phone_no.includes(phone)) customer.phone_no.push(phone);
  if (!customer.address) customer.address = address;
  saveCustomer(customer);

  const order = placeOrder(address, method);
  renderSuccess(order);
}

function renderSuccess(order) {
  const restaurant = getRestaurant(order.restaurant_id);

  document.getElementById("paymentContent").innerHTML = `
    <div class="success-box">
      <div class="success-tick">✅</div>
      <h1>Order placed!</h1>
      <p>Thanks for ordering from ${restaurant.restaurant_name}.</p>

      <div class="success-details">
        <div><strong>Order ID:</strong> #${order.order_id}</div>
        <div><strong>Order total:</strong> ₹${order.order_total}</div>
        <div><strong>Payment:</strong> ${order.payment.payment_mode} (${order.payment.payment_status})</div>
        <div><strong>Payment ID:</strong> ${order.payment.payment_id}</div>
        <div><strong>Deliver to:</strong> ${escapeHTML(order.delivery_address)}</div>
      </div>

      <div class="cart-actions" style="justify-content:center">
        <a class="primary-btn link-btn" href="tracking.html?order=${order.order_id}">Track my order</a>
        <a class="secondary-btn link-btn" href="orders.html">View my orders</a>
      </div>
    </div>
  `;
}

renderCheckout();
