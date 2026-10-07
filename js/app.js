// ===== TABLE HELPERS =====

function getRestaurant(id) {
  return restaurants.find(r => r.restaurant_id === id);
}
function restaurantIcon(r) {
  return restaurantIcons[r.restaurant_id] || "🍽️";
}
// Composite address -> one line
function formatAddress(r) {
  return r.house_no + ", " + r.street + ", " + r.area + ", " + r.city + " - " + r.pincode;
}
function getCategories(restaurant_id) {
  return menuCategories.filter(c => c.restaurant_id === restaurant_id);
}
function getItems(category_id) {
  return menuItems.filter(i => i.category_id === category_id);
}
// Find a menu item and attach its restaurant and category
function findItem(item_id) {
  const item = menuItems.find(i => i.item_id === item_id);
  if (!item) return null;
  const cat = menuCategories.find(c => c.category_id === item.category_id);
  return {
    ...item,
    restaurant_id: cat.restaurant_id,
    category_name: cat.category_name,
    icon: categoryIcons[cat.category_name] || "🍽️"
  };
}

// ===== HOME PAGE =====

function restaurantCard(r) {
  const cats = getCategories(r.restaurant_id).map(c => c.category_name).join(" • ");
  return `
    <div class="restaurant-card">
      <div class="restaurant-image">${restaurantIcon(r)}</div>
      <div class="restaurant-info">
        <h3>${r.restaurant_name}</h3>
        <p>${cats}</p>
        <p>📍 ${r.area}, ${r.city}</p>
        <button onclick="viewRestaurant(${r.restaurant_id})">View Menu</button>
      </div>
    </div>
  `;
}

function renderPopular() {
  const grid = document.getElementById("restaurantGrid");
  grid.innerHTML = restaurants.slice(0, 3).map(restaurantCard).join("");
}

function searchFood() {
  const text = document.getElementById("searchInput").value.trim();
  if (text === "") {
    alert("Please enter something to search.");
    return;
  }
  window.location.href = "restaurants.html?search=" + encodeURIComponent(text);
}

function viewRestaurant(id) {
  window.location.href = "menu.html?restaurant=" + id;
}

function openCart() {
  window.location.href = "cart.html";
}

if (document.getElementById("restaurantGrid")) {
  renderPopular();
}

// ===== CART (saved in the browser) =====

function emptyCartObject() {
  return { restaurant_id: null, items: {} };   // items: item_id -> quantity
}

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));
    if (cart && cart.items && "restaurant_id" in cart) return cart;
  } catch (e) {}
  return emptyCartObject();
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function cartCount() {
  return Object.values(getCart().items).reduce((sum, qty) => sum + qty, 0);
}

// Sum of subtotals (this becomes FOOD-ORDER.order_total)
function cartTotal() {
  const cart = getCart();
  let total = 0;
  for (const id in cart.items) {
    const item = findItem(Number(id));
    if (item) total += item.price * cart.items[id];
  }
  return total;
}

function getQty(id) {
  return getCart().items[id] || 0;
}

function addToCart(id) {
  const item = findItem(id);
  if (!item) return;

  if (item.availability_status !== "Available") {
    alert(item.item_name + " is currently unavailable.");
    return;
  }

  let cart = getCart();
  if (cart.restaurant_id && cart.restaurant_id !== item.restaurant_id && cartCount() > 0) {
    const ok = confirm("Your cart has items from another restaurant. Clear it and add this item?");
    if (!ok) return;
    cart = emptyCartObject();
  }

  cart.restaurant_id = item.restaurant_id;
  cart.items[id] = (cart.items[id] || 0) + 1;
  saveCart(cart);
}

function changeQty(id, change) {
  const cart = getCart();
  cart.items[id] = (cart.items[id] || 0) + change;
  if (cart.items[id] <= 0) delete cart.items[id];
  if (Object.keys(cart.items).length === 0) cart.restaurant_id = null;
  saveCart(cart);
}

function clearCart() {
  saveCart(emptyCartObject());
}

function updateCartCount() {
  document.querySelectorAll(".cart-btn").forEach(btn => {
    btn.textContent = "🛒 Cart (" + cartCount() + ")";
  });
}

updateCartCount();

// ===== CUSTOMER (CUSTOMER table; phone_no is multivalued, so it is a list) =====

function getCustomer() {
  try {
    const c = JSON.parse(localStorage.getItem("customer"));
    if (c && Array.isArray(c.phone_no)) return c;
  } catch (e) {}
  return { customer_id: 1, first_name: "", last_name: "", phone_no: [], email: "", address: "" };
}

function saveCustomer(customer) {
  localStorage.setItem("customer", JSON.stringify(customer));
}

function fullName(c) {
  return (c.first_name + " " + c.last_name).trim();
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[ch]));
}

// ===== ORDERS (FOOD-ORDER + ORDER-ITEM + PAYMENT + DELIVERY) =====

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch (e) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function placeOrder(delivery_address, payment_mode) {
  const cart = getCart();
  const orders = getOrders();
  const customer = getCustomer();
  const now = Date.now();
  const order_id = 1001 + orders.length;

  // ORDER-ITEM rows: item_no is the partial key, subtotal = quantity x unit_price
  const items = Object.keys(cart.items).map((id, index) => {
    const item = findItem(Number(id));
    const quantity = cart.items[id];
    return {
      item_no: index + 1,
      item_id: item.item_id,
      item_name: item.item_name,
      icon: item.icon,
      quantity: quantity,
      unit_price: item.price,
      subtotal: item.price * quantity
    };
  });

  // order_total is derived from the subtotals
  const order_total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const paidNow = payment_mode !== "Cash on delivery";

  const order = {
    order_id: order_id,
    customer_id: customer.customer_id,
    restaurant_id: cart.restaurant_id,
    order_status: orderStatuses[0],
    order_date_time: now,
    delivery_address: delivery_address,
    order_total: order_total,
    items: items,
    // PAYMENT (1:1 with the order)
    payment: {
      payment_id: "PAY" + order_id,
      payment_mode: payment_mode,
      payment_date: paidNow ? now : null,
      payment_status: paidNow ? "Paid" : "Pending",
      paid_amount: paidNow ? order_total : 0
    },
    // DELIVERY (1:1 with the order; the agent is assigned later)
    delivery: {
      delivery_id: "DEL" + order_id,
      agent_id: null,
      pickup_time: null,
      delivery_status: "Not assigned",
      delivered_time: null
    }
  };

  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}

// DEMO ONLY: moves each order to its next status every 8 seconds and fills in
// agent, pickup_time, delivered_time and COD payment. A real backend does this.
function advanceOrders() {
  const orders = getOrders();
  let changed = false;

  orders.forEach(o => {
    const stage = Math.min(3, Math.floor((Date.now() - o.order_date_time) / 8000));

    if (o.order_status !== orderStatuses[stage]) {
      o.order_status = orderStatuses[stage];
      changed = true;
    }
    if (stage >= 2 && !o.delivery.agent_id) {
      o.delivery.agent_id = deliveryAgents[o.order_id % deliveryAgents.length].agent_id;
      o.delivery.pickup_time = o.order_date_time + 16000;
      o.delivery.delivery_status = "On the way";
      changed = true;
    }
    if (stage >= 3 && !o.delivery.delivered_time) {
      o.delivery.delivered_time = o.order_date_time + 24000;
      o.delivery.delivery_status = "Delivered";
      if (o.payment.payment_status === "Pending") {      // cash collected on delivery
        o.payment.payment_status = "Paid";
        o.payment.paid_amount = o.order_total;
        o.payment.payment_date = o.delivery.delivered_time;
      }
      changed = true;
    }
  });

  if (changed) saveOrders(orders);
  return orders;
}

function getOrder(id) {
  return advanceOrders().find(o => o.order_id === id);
}

function getAgent(order) {
  return deliveryAgents.find(a => a.agent_id === order.delivery.agent_id);
}

function itemsSummary(order) {
  return order.items.map(i => i.quantity + " × " + i.item_name).join(", ");
}

function formatTime(timestamp) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "numeric", month: "short", hour: "numeric", minute: "2-digit"
  });
}
