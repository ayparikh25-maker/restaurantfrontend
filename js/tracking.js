const orderId = Number(new URLSearchParams(window.location.search).get("order"));

function renderTracking() {
  const box = document.getElementById("trackContent");
  const order = getOrder(orderId);

  if (!order) {
    box.innerHTML = `<p class="empty-message">Order not found.
      <a href="orders.html">Back to my orders</a></p>`;
    return;
  }

  const restaurant = getRestaurant(order.restaurant_id);
  const stage = orderStatuses.indexOf(order.order_status);
  const d = order.delivery;
  const p = order.payment;
  const agent = getAgent(order);

  box.innerHTML = `
    <a href="orders.html" class="back-link">← My orders</a>
    <h1 class="page-title" style="margin-top:12px">
      Order #${order.order_id} from ${restaurant.restaurant_name}
    </h1>

    <div class="form-box">
      <h3>Order status</h3>
      <ol class="timeline">
        ${orderStatuses.map((label, i) => `
          <li class="${i <= stage ? "done" : ""} ${i === stage ? "current" : ""}">${label}</li>
        `).join("")}
      </ol>
      <p class="eta-text">
        ${stage < 3
          ? "Placed on " + formatTime(order.order_date_time) + ". Your order is in progress."
          : "Delivered at " + formatTime(d.delivered_time) + ". Enjoy your meal! 🎉"}
      </p>
    </div>

    <div class="form-box">
      <h3>Delivery</h3>
      <p class="order-meta" style="margin-top:10px">
        Delivery ID: ${d.delivery_id} • Status: <strong>${d.delivery_status}</strong>
      </p>
      <p class="order-meta">
        Pickup time: ${formatTime(d.pickup_time)} • Delivered time: ${formatTime(d.delivered_time)}
      </p>
      ${agent
        ? `<p style="margin-top:12px"><strong>${agent.agent_name}</strong> • ${agent.vehicle_no}</p>
           <p class="order-meta">Call: ${agent.phone_no}</p>`
        : `<p class="order-meta" style="margin-top:12px">
             A delivery agent is assigned once your food is ready.</p>`}
    </div>

    <div class="form-box">
      <h3>Payment</h3>
      <p style="margin-top:10px">
        ${p.payment_mode} • <strong>${p.payment_status}</strong>
      </p>
      <p class="order-meta">
        Payment ID: ${p.payment_id} • Paid amount: ₹${p.paid_amount} •
        Payment date: ${formatTime(p.payment_date)}
      </p>
    </div>

    <div class="form-box">
      <h3>Items</h3>
      ${order.items.map(i => `
        <div class="bill-line">
          <span>${i.item_no}. ${i.quantity} × ${i.item_name} (₹${i.unit_price})</span>
          <span>₹${i.subtotal}</span>
        </div>
      `).join("")}
      <div class="bill-line total"><span>Order total</span><span>₹${order.order_total}</span></div>
      <p class="order-meta" style="margin-top:12px">
        Deliver to: ${escapeHTML(order.delivery_address)}
      </p>
    </div>
  `;
}

renderTracking();

const trackTimer = setInterval(() => {
  renderTracking();
  const order = getOrder(orderId);
  if (order && order.order_status === "Delivered") clearInterval(trackTimer);
}, 2000);
