// ===============================
// Elements
// ===============================
const categoryList = document.getElementById("categoryList");
const plantsDiv = document.getElementById("plants");
const spinner = document.getElementById("spinner");
const cartDiv = document.getElementById("cart");
const totalSpan = document.getElementById("total");
const detailModal = document.getElementById("detailModal");

// Cart
let cart = [];

// API URLs
const allPlants = "https://openapi.programming-hero.com/api/plants";
const allCategories = "https://openapi.programming-hero.com/api/categories";
const byCategory = (id) => `https://openapi.programming-hero.com/api/category/${id}`;
const byId = (id) => `https://openapi.programming-hero.com/api/plant/${id}`;

// ===============================
// Load Categories
// ===============================
async function loadCategories() {
  try {
    const res = await fetch(allCategories);
    const data = await res.json();
    const cats = data.data || [];

    // Add "All Trees" first
    categoryList.innerHTML = "";
    addCategoryBtn({ id: "all", name: "All Trees" }, true);

    cats.forEach((c) => addCategoryBtn(c));

    // Auto load default 6 plants
    loadDefaultPlants();
  } catch (error) {
    console.error("Error loading categories:", error);
    categoryList.innerHTML = `<p class="text-red-500">Failed to load categories</p>`;
  }
}

function addCategoryBtn(cat, active = false) {
  const btn = document.createElement("button");
  btn.textContent = cat.name;
  btn.className = `px-3 py-1 rounded w-full text-left hover:bg-green-200 ${
    active ? "bg-green-600 text-white" : "bg-white"
  }`;
  btn.onclick = () => loadByCategory(cat.id, btn);
  categoryList.appendChild(btn);
}

// ===============================
// Default Plants (first 6)
// ===============================
async function loadDefaultPlants() {
  spinner.classList.remove("hidden");
  plantsDiv.innerHTML = "";

  try {
    const res = await fetch(allPlants);
    const data = await res.json();
    const plants = data.data || [];
    renderPlants(plants.slice(0, 6)); // show 6 by default
  } catch (error) {
    plantsDiv.innerHTML = `<p class="text-red-500">Failed to load plants</p>`;
  }

  spinner.classList.add("hidden");
}

// ===============================
// Load by Category
// ===============================
async function loadByCategory(id, btn) {
  // Highlight active button
  Array.from(categoryList.children).forEach((b) =>
    b.classList.remove("bg-green-600", "text-white")
  );
  btn.classList.add("bg-green-600", "text-white");

  spinner.classList.remove("hidden");
  plantsDiv.innerHTML = "";

  try {
    const url = id === "all" ? allPlants : byCategory(id);
    const res = await fetch(url);
    const data = await res.json();
    renderPlants(data.data || []);
  } catch (error) {
    plantsDiv.innerHTML = `<p class="text-red-500">Failed to load plants</p>`;
  }

  spinner.classList.add("hidden");
}

// ===============================
// Render Plant Cards
// ===============================
function renderPlants(plants) {
  plantsDiv.innerHTML = "";
  plants.forEach((p) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow p-4 flex flex-col justify-between";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="h-40 w-full object-cover mb-2 rounded cursor-pointer">
      <h3 class="text-lg font-semibold text-green-700 cursor-pointer">${p.name}</h3>
      <p class="text-sm text-gray-600 line-clamp-2">${p.short_description}</p>
      <div class="flex justify-between mt-2">
        <span class="badge badge-success">${p.category}</span>
        <span class="font-bold">৳${p.price}</span>
      </div>
      <button class="btn btn-success w-full mt-2">Add to Cart</button>
    `;

    card.querySelector("button").onclick = () => addToCart(p);
    card.querySelector("h3").onclick = () => showDetails(p.id);
    card.querySelector("img").onclick = () => showDetails(p.id);

    plantsDiv.appendChild(card);
  });
}

// ===============================
// Cart Functions
// ===============================
function addToCart(item) {
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  cartDiv.innerHTML = "";
  let total = 0;

  cart.forEach((c, idx) => {
    total += c.price * c.qty;

    const row = document.createElement("div");
    row.className =
      "flex justify-between items-center bg-green-100 px-2 py-1 rounded";

    row.innerHTML = `
      <span>${c.name} ৳${c.price} × ${c.qty}</span>
      <button class="text-red-600">✖</button>
    `;

    row.querySelector("button").onclick = () => {
      cart.splice(idx, 1);
      renderCart();
    };

    cartDiv.appendChild(row);
  });

  totalSpan.textContent = `৳${total}`;
}

// ===============================
// Show Plant Details (Modal)
// ===============================
async function showDetails(id) {
  try {
    const res = await fetch(byId(id));
    const data = await res.json();
    const p = data.data;

    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalImg").src = p.image;
    document.getElementById("modalDesc").textContent =
      p.long_description || p.short_description;

    detailModal.showModal();
  } catch (error) {
    console.error("Error loading details:", error);
  }
}

// ===============================
// Init
// ===============================
loadCategories();
