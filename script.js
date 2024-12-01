let categories = JSON.parse(localStorage.getItem("categories")) || [
  { id: 1, name: "Makanan" },
  { id: 2, name: "Minuman" },
  { id: 3, name: "Jajanan" },
];

let menus = JSON.parse(localStorage.getItem("menus")) || [
  {
    id: 1,
    name: "Bakso Padepokan Spesial",
    price: 25000,
    categoryId: 1,
    image: "asset/bakso.jpg",
  },
  {
    id: 2,
    name: "Mei Ayam Spesial",
    price: 25000,
    categoryId: 1,
    image: "asset/mieayam.jpeg",
  },
  {
    id: 3,
    name: "Es Teh Padepokan",
    price: 5000,
    categoryId: 2,
    image: "asset/esteh.jpg",
  },
  {
    id: 4,
    name: "Es Jeruk Manis",
    price: 5000,
    categoryId: 2,
    image: "asset/esjeruk.jpg",
  },
  {
    id: 5,
    name: "Pisang Goreng Crispy",
    price: 10000,
    categoryId: 3,
    image: "asset/pisang.jpg",
  },
];

function saveToLocalStorage() {
  localStorage.setItem("categories", JSON.stringify(categories));
  localStorage.setItem("menus", JSON.stringify(menus));
}

function login() {
  const userType = document.getElementById("userType").value;
  document.getElementById("loginPage").style.display = "none";

  if (userType === "admin") {
    document.getElementById("adminDashboard").style.display = "flex";
    populateCategorySelect();
    renderMenuManagement();
  } else {
    document.getElementById("userDashboard").style.display = "flex";
    renderCategories();
    showAllMenus();
  }
}

function logout() {
  document.getElementById("adminDashboard").style.display = "none";
  document.getElementById("userDashboard").style.display = "none";
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("userType").value = "";
}

function renderCategories() {
  const categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.className = "btn";
    btn.onclick = () => filterMenuByCategory(category.id);
    categoryList.appendChild(btn);
  });
}

function showAllMenus() {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";

  menus.forEach((menu) => {
    const menuItem = createMenuItemElement(menu);
    menuList.appendChild(menuItem);
  });
}

function createMenuItemElement(menu) {
  const menuItem = document.createElement("div");
  menuItem.className = "menu-item";
  menuItem.innerHTML = `
        <img src="${menu.image}" alt="${menu.name}">
        <div class="menu-details">
            <h4>${menu.name}</h4>
            <p>Rp ${menu.price.toLocaleString()}</p>
        </div>
    `;
  return menuItem;
}

function filterMenuByCategory(categoryId) {
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";
  const filteredMenus = menus.filter((menu) => menu.categoryId === categoryId);

  filteredMenus.forEach((menu) => {
    const menuItem = createMenuItemElement(menu);
    menuList.appendChild(menuItem);
  });
}

function showAddCategory() {
  document.getElementById("addCategoryForm").style.display = "block";
  document.getElementById("addMenuForm").style.display = "none";
  document.getElementById("menuManagementSection").style.display = "none";
}

function showAddMenu() {
  document.getElementById("addCategoryForm").style.display = "none";
  document.getElementById("addMenuForm").style.display = "block";
  document.getElementById("menuManagementSection").style.display = "none";
}

function populateCategorySelect() {
  const menuCategorySelect = document.getElementById("menuCategory");
  const updateMenuCategorySelect =
    document.getElementById("updateMenuCategory");
  menuCategorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
  updateMenuCategorySelect.innerHTML =
    '<option value="">Pilih Kategori</option>';

  categories.forEach((category) => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");

    option1.value = category.id;
    option1.textContent = category.name;

    option2.value = category.id;
    option2.textContent = category.name;

    menuCategorySelect.appendChild(option1);
    updateMenuCategorySelect.appendChild(option2);
  });
}

function addCategory() {
  const categoryName = document.getElementById("newCategoryName").value;
  if (categoryName) {
    const newId =
      categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
    categories.push({ id: newId, name: categoryName });
    saveToLocalStorage();
    populateCategorySelect();
    renderCategories();
    document.getElementById("newCategoryName").value = "";
    alert("Kategori berhasil ditambahkan!");
  }
}

function addMenu() {
  const name = document.getElementById("menuName").value;
  const price = document.getElementById("menuPrice").value;
  const categoryId = document.getElementById("menuCategory").value;
  const imageFile = document.getElementById("menuImage").files[0];

  if (name && price && categoryId && imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newId =
        menus.length > 0 ? Math.max(...menus.map((m) => m.id)) + 1 : 1;
      menus.push({
        id: newId,
        name: name,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        image: e.target.result,
      });
      saveToLocalStorage();
      alert("Menu berhasil ditambahkan!");
      document.getElementById("menuName").value = "";
      document.getElementById("menuPrice").value = "";
      document.getElementById("menuCategory").value = "";
      document.getElementById("menuImage").value = "";
      renderMenuManagement();
    };
    reader.readAsDataURL(imageFile);
  }
}

function renderMenuManagement() {
  const menuManagementSection = document.getElementById(
    "menuManagementSection"
  );
  menuManagementSection.innerHTML = "";
  menuManagementSection.style.display = "block";
  document.getElementById("addCategoryForm").style.display = "none";
  document.getElementById("addMenuForm").style.display = "none";

  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nama Menu</th>
        <th>Harga</th>
        <th>Kategori</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody id="menuManagementBody"></tbody>
  `;

  const tbody = document.createElement("tbody");
  tbody.id = "menuManagementBody";

  menus.forEach((menu) => {
    const category = categories.find((cat) => cat.id === menu.categoryId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${menu.id}</td>
      <td>${menu.name}</td>
      <td>Rp ${menu.price.toLocaleString()}</td>
      <td>${category ? category.name : "Tidak Diketahui"}</td>
      <td>
        <button onclick="showUpdateMenu(${
          menu.id
        })" class="btn btn-update">Update</button>
        <button onclick="deleteMenu(${
          menu.id
        })" class="btn btn-delete">Hapus</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  menuManagementSection.appendChild(table);

  const style = document.createElement("style");
  style.textContent = `
    #menuManagementSection table {
      width: 100%;
      border-collapse: collapse;
    }
    #menuManagementSection th, 
    #menuManagementSection td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    #menuManagementSection th {
      background-color: var(--primary-color);
      color: white;
    }
    .btn-update, .btn-delete {
      margin: 5px;
      padding: 5px 10px;
      font-size: 0.8rem;
    }
    .btn-update {
      background-color: var(--accent-color);
    }
    .btn-delete {
      background-color: #e74c3c;
    }
  `;
  document.head.appendChild(style);
}

function showUpdateMenu(menuId) {
  const menu = menus.find((m) => m.id === menuId);
  if (menu) {
    document.getElementById("updateMenuId").value = menu.id;
    document.getElementById("updateMenuName").value = menu.name;
    document.getElementById("updateMenuPrice").value = menu.price;
    document.getElementById("updateMenuCategory").value = menu.categoryId;

    document.getElementById("menuManagementSection").style.display = "none";
    document.getElementById("updateMenuForm").style.display = "block";
  }
}

function updateMenu() {
  const id = parseInt(document.getElementById("updateMenuId").value);
  const name = document.getElementById("updateMenuName").value;
  const price = document.getElementById("updateMenuPrice").value;
  const categoryId = document.getElementById("updateMenuCategory").value;
  const imageFile = document.getElementById("updateMenuImage").files[0];

  const menuIndex = menus.findIndex((m) => m.id === id);
  if (menuIndex !== -1) {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        menus[menuIndex] = {
          id: id,
          name: name,
          price: parseInt(price),
          categoryId: parseInt(categoryId),
          image: e.target.result,
        };
        saveToLocalStorage();
        alert("Menu berhasil diupdate!");
        document.getElementById("updateMenuForm").style.display = "none";
        renderMenuManagement();
      };
      reader.readAsDataURL(imageFile);
    } else {
      menus[menuIndex] = {
        id: id,
        name: name,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        image: menus[menuIndex].image,
      };
      saveToLocalStorage();
      alert("Menu berhasil diupdate!");
      document.getElementById("updateMenuForm").style.display = "none";
      renderMenuManagement();
    }
  }
}

function deleteMenu(menuId) {
  const confirmDelete = confirm("Apakah Anda yakin ingin menghapus menu ini?");
  if (confirmDelete) {
    const menuIndex = menus.findIndex((m) => m.id === menuId);
    if (menuIndex !== -1) {
      menus.splice(menuIndex, 1);
      saveToLocalStorage();
      alert("Menu berhasil dihapus!");
      renderMenuManagement();
    }
  }
}
