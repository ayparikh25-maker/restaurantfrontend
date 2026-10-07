function renderProfile() {
  const box = document.getElementById("profileContent");
  const customer = getCustomer();
  const orders = getOrders();
  const spent = orders.reduce((sum, o) => sum + o.order_total, 0);

  const name = fullName(customer);
  const initial = name ? name.charAt(0).toUpperCase() : "👤";

  box.innerHTML = `
    <div class="profile-head">
      <div class="avatar">${escapeHTML(initial)}</div>
      <div>
        <h1>${name ? escapeHTML(name) : "Guest Customer"}</h1>
        <p>Customer ID: ${customer.customer_id}${customer.email ? " • " + escapeHTML(customer.email) : ""}</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat"><strong>${orders.length}</strong><span>Orders placed</span></div>
      <div class="stat"><strong>₹${spent}</strong><span>Total spent</span></div>
    </div>

    <div class="form-box">
      <h3>Your details</h3>

      <div class="two-col">
        <div>
          <label class="field-label" for="firstName">First name</label>
          <input class="field" id="firstName" value="${escapeHTML(customer.first_name)}">
          <div class="error-text" id="nameError"></div>
        </div>
        <div>
          <label class="field-label" for="lastName">Last name</label>
          <input class="field" id="lastName" value="${escapeHTML(customer.last_name)}">
        </div>
      </div>

      <label class="field-label" for="email">Email</label>
      <input class="field" id="email" type="email" value="${escapeHTML(customer.email)}"
             placeholder="you@example.com">
      <div class="error-text" id="emailError"></div>

      <label class="field-label" for="phones">Phone numbers (separate with commas)</label>
      <input class="field" id="phones" inputmode="tel"
             value="${escapeHTML(customer.phone_no.join(", "))}"
             placeholder="9840012345, 9841067890">
      <div class="error-text" id="phoneError"></div>

      <label class="field-label" for="address">Address</label>
      <input class="field" id="address" value="${escapeHTML(customer.address)}"
             placeholder="House no, street, area, Chennai">

      <div style="margin-top:20px">
        <button class="primary-btn" onclick="saveDetails()">Save changes</button>
        <span class="save-msg" id="saveMsg"></span>
      </div>
    </div>

    <div class="form-box">
      <h3>Demo data</h3>
      <p class="demo-note" style="margin-bottom:14px">
        Removes your saved details, cart and order history from this browser.
      </p>
      <button class="danger-btn" onclick="resetData()">Reset all data</button>
    </div>
  `;
}

function saveDetails() {
  const first_name = document.getElementById("firstName").value.trim();
  const last_name = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone_no = document.getElementById("phones").value
    .split(",").map(p => p.trim()).filter(p => p !== "");

  let hasError = false;
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";

  if (first_name === "") {
    document.getElementById("nameError").textContent = "Please enter your first name.";
    hasError = true;
  }
  if (email !== "" && !/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById("emailError").textContent = "Enter a valid email address.";
    hasError = true;
  }
  if (!phone_no.every(p => /^\d{10}$/.test(p))) {
    document.getElementById("phoneError").textContent = "Each phone number must have 10 digits.";
    hasError = true;
  }
  if (hasError) return;

  const old = getCustomer();
  saveCustomer({ customer_id: old.customer_id, first_name, last_name, phone_no, email, address });
  renderProfile();

  const msg = document.getElementById("saveMsg");
  msg.textContent = "Saved ✓";
  setTimeout(() => { msg.textContent = ""; }, 2500);
}

function resetData() {
  if (confirm("Delete your profile, cart and all orders from this browser?")) {
    localStorage.clear();
    window.location.reload();
  }
}

renderProfile();
