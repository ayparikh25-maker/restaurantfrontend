const restaurantId = Number(new URLSearchParams(window.location.search).get("restaurant"));
const restaurant = getRestaurant(restaurantId);

function renderMenu() {
  const box = document.getElementById("menuContent");

  if (!restaurant) {
    box.innerHTML = `<p class="empty-message">Restaurant not found.
      <a href="restaurants.html">Back to restaurants</a></p>`;
    return;
  }

  const categories = getCategories(restaurant.restaurant_id);

  box.innerHTML = `
    <a href="restaurants.html" class="back-link">← All restaurants</a>

    <div class="menu-header">
      <h1>${restaurantIcon(restaurant)} ${restaurant.restaurant_name}</h1>
      <p>📍 ${formatAddress(restaurant)}</p>
      <p>📞 ${restaurant.phone_no}</p>
    </div>

    ${categories.map(cat => `
      <div class="menu-category">
        <h2>${cat.category_name}</h2>
        ${getItems(cat.category_id)
            .map(item => menuItemHTML(item, categoryIcons[cat.category_name] || "🍽️"))
            .join("")}
      </div>
    `).join("")}
  `;

  renderCartBar();
}

function menuItemHTML(item, icon) {
  const qty = getQty(item.item_id);
  const available = item.availability_status === "Available";

  let controls;
  if (!available) {
    controls = `<span class="unavailable-tag">Unavailable</span>`;
  } else if (qty === 0) {
    controls = `<button class="add-btn" onclick="add(${item.item_id})">Add</button>`;
  } else {
    controls = `<div class="qty-box">
         <button onclick="change(${item.item_id}, -1)">−</button>
         <span>${qty}</span>
         <button onclick="change(${item.item_id}, 1)">+</button>
       </div>`;
  }

  return `
    <div class="menu-item ${available ? "" : "dimmed"}">
      <div class="menu-icon">${icon}</div>
      <div class="menu-details">
        <strong>${item.item_name}</strong>
        <p class="item-desc">${item.description}</p>
        <span>₹${item.price}</span>
      </div>
      ${controls}
    </div>
  `;
}

function renderCartBar() {
  const bar = document.getElementById("cartBar");
  const count = cartCount();

  if (count === 0) {
    bar.classList.remove("show");
    return;
  }

  bar.classList.add("show");
  bar.innerHTML = `
    <span>${count} item${count === 1 ? "" : "s"} • ₹${cartTotal()}</span>
    <button onclick="openCart()">View Cart</button>
  `;
}

function add(id) {
  addToCart(id);
  renderMenu();
}

function change(id, amount) {
  changeQty(id, amount);
  renderMenu();
}

renderMenu();
