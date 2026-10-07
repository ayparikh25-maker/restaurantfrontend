function renderOrders() {
  const box = document.getElementById("ordersContent");
  const orders = advanceOrders();

  if (orders.length === 0) {
    box.innerHTML = `
      <h1 class="page-title">My Orders</h1>
      <div class="empty-cart">
        <h2>No orders yet</h2>
        <p>Your placed orders will show up here.</p>
        <a href="restaurants.html" class="primary-btn link-btn">Browse restaurants</a>
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <h1 class="page-title">My Orders</h1>
    ${orders.map(orderCardHTML).join("")}
  `;
}

function orderCardHTML(order) {
  const restaurant = getRestaurant(order.restaurant_id);
  const delivered = order.order_status === "Delivered";

  return `
    <div class="order-card">
      <div class="order-top">
        <strong>#${order.order_id} • ${restaurantIcon(restaurant)} ${restaurant.restaurant_name}</strong>
        <span class="status-tag ${delivered ? "done" : ""}">${order.order_status}</span>
      </div>
      <p class="order-items">${itemsSummary(order)}</p>
      <div class="order-bottom">
        <span class="order-meta">
          ₹${order.order_total} • ${order.payment.payment_mode} (${order.payment.payment_status}) •
          ${formatTime(order.order_date_time)}
        </span>
        <a class="small-btn" href="tracking.html?order=${order.order_id}">
          ${delivered ? "View details" : "Track order"}
        </a>
      </div>
    </div>
  `;
}

renderOrders();
setInterval(renderOrders, 3000);
