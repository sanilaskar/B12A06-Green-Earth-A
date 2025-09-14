const categoryList = document.getElementById('categoryList');
const plantGrid    = document.getElementById('plantGrid');
const cartList     = document.getElementById('cartList');
const totalPriceAll = document.getElementById('totalPrice');

const modal        = document.getElementById('modal');
const modalImg     = document.getElementById('modalImg');
const modalName    = document.getElementById('modalName');
const modalDesc    = document.getElementById('modalDesc');
const modalCat     = document.getElementById('modalCat');
const modalPrice   = document.getElementById('modalPrice');
document.getElementById('closeModal').onclick = () => modal.classList.add('hidden');

let cart = [];
let totalPrice = 0;

const categories = [
  { id: 1, name: "Fruit Trees" },
  { id: 2, name: "Flowering Trees" },
  { id: 3, name: "Shade Trees" },
  { id: 4, name: "Medicinal Trees" },
  { id: 5, name: "Timber Trees" },
  { id: 6, name: "Evergreen Trees" },
  { id: 7, name: "Ornamental Trees" },
  { id: 8, name: "Bamboo" },
  { id: 9, name: "Climbers" },
  { id: 10, name: "Aquatic Plants" }
];

function renderCategories() {
  const allBtn = document.createElement('li');
  allBtn.innerHTML = `<button class="catBtn w-full text-left px-2 py-1 bg-[#15803D] text-white rounded"
                        data-id="">All Trees</button>`;
  categoryList.appendChild(allBtn);

  categories.forEach(cat => {
    const li = document.createElement('li');
    li.innerHTML = `<button class="catBtn w-full text-left px-2 py-1 hover:bg-green-100 rounded"
                        data-id="${cat.id}">${cat.name}</button>`;
    categoryList.appendChild(li);
  });

  categoryList.addEventListener('click', e => {
    if (e.target.matches('.catBtn')) {
      highlightActive(e.target);
      loadPlants(e.target.dataset.id || null);
    }
  });

  highlightActive(allBtn.querySelector('button')); 
}

function highlightActive(btn) {
  document.querySelectorAll('.catBtn')
    .forEach(b => b.classList.remove('bg-[#15803D]','text-white'));
  btn.classList.add('bg-[#15803D]','text-white');
}

async function loadPlants(catId = null) {
  plantGrid.innerHTML = `<p class="col-span-full text-center">Loading...</p>`;
  let url = 'https://openapi.programming-hero.com/api/plants';
  if (catId) url = `https://openapi.programming-hero.com/api/category/${catId}`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.plants || data.plants.length === 0) {
      plantGrid.innerHTML = `<p class="col-span-full text-center text-gray-600">No plants found.</p>`;
      return;
    }
    const plants = data.plants.slice(0,6); 
    displayPlants(plants);
  } catch (err) {
    plantGrid.innerHTML = `<p class="text-red-500">Failed to load plants</p>`;
  }
}

function displayPlants(plants) {
  plantGrid.innerHTML = "";
  plants.forEach(p => {
    const card = document.createElement('div');
    card.className = "bg-white rounded shadow p-3 flex flex-col";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="h-40 w-full object-cover rounded mb-2">
      <h3 class="text-lg font-bold text-black-700 cursor-pointer hover:underline plantName">${p.name}</h3>
      <p class="text-sm text-gray-600 flex-grow">${p.description.slice(0,70)}...</p>
      <div class="flex justify-between mt-2 font-semibold">
        <span class="bg-[#DCFCE7] text-green-700 rounded-full shadow p-2 text-xs">${p.category}</span>
        <span> <i class="fa-solid fa-bangladeshi-taka-sign"></i>${p.price}</span>
      </div>
      <button class="addBtn mt-2 bg-[#15803D] hover:bg-green-600 text-white py-1 rounded-full">Add to Cart</button>
    `;
    card.querySelector('.plantName').onclick = () => openModal(p);
    card.querySelector('.addBtn').onclick = () => addToCart(p);
    plantGrid.appendChild(card);
  });
}

function openModal(plant) {
  modalImg.src = plant.image;
  modalName.textContent = plant.name;
  modalDesc.textContent = plant.description;
  modalCat.textContent  = plant.category;
  modalPrice.textContent= plant.price;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function addToCart(plant) {
  const existing = cart.find(item => item.id === plant.id);
  if (existing) {
    existing.quantity += 1;         
  } else {
    cart.push({ ...plant, quantity: 1 }); 
  }
  totalPrice += plant.price;
  updateCart();
}

function removeFromCart(index) {
  const item = cart[index];
  totalPrice -= item.price;
  item.quantity -= 1;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}


function updateCart() {
  cartList.innerHTML = "";
  cart.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = "flex justify-between items-center  bg-[#CFF0DC80] p-2 rounded shadow";
    li.innerHTML = `
      <span>
        ${p.name} <br>
        <i class="fa-solid fa-bangladeshi-taka-sign"></i>${p.price} × ${p.quantity}
      </span>
      <button class="text-red-500 font-bold">&times;</button>
    `;
    li.querySelector('button').onclick = () => removeFromCart(i);
    cartList.appendChild(li);
  });
  totalPriceAll.textContent = totalPrice;
}

renderCategories();
loadPlants(); 
