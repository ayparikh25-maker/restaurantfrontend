let activeCategory = "All";
let searchText = "";

// Filter buttons come from MENU-CATEGORY.category_name (no duplicates)
const categoryNames = ["All", ...new Set(menuCategories.map(c => c.category_name))];

function getFilteredRestaurants() {
  const text = searchText.toLowerCase();

  return restaurants.filter(r => {
    const cats = getCategories(r.restaurant_id);

    const matchesCategory =
      activeCategory === "All" || cats.some(c => c.category_name === activeCategory);

    const matchesSearch =
      r.restaurant_name.toLowerCase().includes(text) ||
      r.area.toLowerCase().includes(text) ||
      cats.some(c => c.category_name.toLowerCase().includes(text)) ||
      cats.some(c => getItems(c.category_id).some(i => i.item_name.toLowerCase().includes(text)));

    return matchesCategory && matchesSearch;
  });
}

function renderChips() {
  document.getElementById("chips").innerHTML = categoryNames.map(c => `
    <button class="chip ${c === activeCategory ? "selected" : ""}"
            onclick="setCategory('${c}')">${c}</button>
  `).join("");
}

function renderList() {
  const list = getFilteredRestaurants();
  const grid = document.getElementById("restaurantList");
  const count = document.getElementById("resultCount");

  count.textContent = list.length + " restaurant" + (list.length === 1 ? "" : "s") + " found";

  if (list.length === 0) {
    grid.innerHTML = `<p class="empty-message">No restaurants match. Try another category or search word.</p>`;
    return;
  }
  grid.innerHTML = list.map(restaurantCard).join("");
}

function setCategory(category) {
  activeCategory = category;
  renderChips();
  renderList();
}

function runSearch() {
  searchText = document.getElementById("pageSearch").value.trim();
  renderList();
}

const params = new URLSearchParams(window.location.search);
if (params.get("search")) {
  searchText = params.get("search");
  document.getElementById("pageSearch").value = searchText;
}

renderChips();
renderList();
