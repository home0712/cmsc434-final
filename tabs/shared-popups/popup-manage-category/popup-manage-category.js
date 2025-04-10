/* SUB - MANAGE CATEGORIES */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    renderMainCategories();
    document.getElementById("add-main-category").addEventListener("click", () => {
        showEditPopup({ mode: "add", type: "main" });
    });
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const cancelDeleteButton = document.getElementById("cancel-delete");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelEditButton = document.getElementById("cancel-edit");
    const confirmEditButton = document.getElementById("confirm-edit");

    closeButton.addEventListener("click", returnToPage);
    cancelDeleteButton.addEventListener("click", cancelDelete);
    confirmDeleteButton.addEventListener("click", confirmDelete);
    cancelEditButton.addEventListener("click", cancelEdit);
    confirmEditButton.addEventListener("click", confirmEdit);
}

function attachEventHandlers() {
    document.querySelectorAll(".toggle-sub").forEach(button => {
        button.addEventListener("click", () => toggleSubCategory(button.dataset.main));
    });
  
    document.querySelectorAll(".delete-main").forEach(button => {
        button.addEventListener("click", () => showDeletePopup({ type: "main", main: button.dataset.main }));
    });
    document.querySelectorAll(".delete-sub").forEach(button => {
        button.addEventListener("click", () => showDeletePopup({ type: "sub", main: button.dataset.main, sub: button.dataset.sub }));
    });

    document.querySelectorAll(".add-sub").forEach(button => {
      button.addEventListener("click", () => showEditPopup({ mode: "add", type: "sub", main: button.dataset.main }));
    });

    document.querySelectorAll(".edit-main").forEach(button => {
        button.addEventListener("click", () => showEditPopup({ mode: "edit", type: "main", main: button.dataset.main }));
    });
    document.querySelectorAll(".edit-sub").forEach(button => {
        button.addEventListener("click", () => showEditPopup({ mode: "edit", type: "sub", main: button.dataset.main, sub: button.dataset.sub }));
    });
}

// return to previous page
function returnToPage() {
    const returnPage = sessionStorage.getItem("returnTo");

    if (returnPage === "transaction") {
        window.location.href = "../../tab2-record/transaction/transaction.html";
    } else if (returnPage === "calendar") { 
        window.location.href = "../../tab2-record/calendar/calendar.html";
    } else if (returnPage === "category") {
        window.location.href = "../../tab4-report/category/category.html";
    }
}

function renderMainCategories() {
    const container = document.getElementById("main-category-list");
    container.innerHTML = "";

    const mainCategories = JSON.parse(localStorage.getItem("mainCategories")) || [];
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};

    mainCategories.forEach(main => {
        const mainRow = document.createElement("div");
        mainRow.className = "main-category-row";
        mainRow.innerHTML = `
            <div class="main-category-header">
                <span>${main}</span>
                <div class="icon-buttons">
                    <img src="../../../assets/Edit.png" class="edit-main" data-main="${main}">
                    <img src="../../../assets/Trash.png" class="delete-main" data-main="${main}">
                    <img src="../../../assets/Arrow-down.png" class="toggle-sub" data-main="${main}">
                </div>
            </div>

            <div class="sub-category-container hidden" data-main="${main}">
                ${
                    (subCategories[main] || []).map(sub => `
                        <div class="sub-category-row">
                            <span>${sub}</span>
                            <div class="icon-buttons">
                                <img src="../../../assets/Edit.png" class="edit-sub" data-main="${main}" data-sub="${sub}">
                                <img src="../../../assets/Trash.png" class="delete-sub" data-main="${main}" data-sub="${sub}">
                            </div>
                        </div>
                    `).join("")
                }
                <button class="add-sub" data-main="${main}">+ Add Subcategory</button>
            </div>
        `;
        container.appendChild(mainRow);
    });
    attachEventHandlers();
}

// toggle sub category
function toggleSubCategory(main) {
    const container = document.querySelector(`.sub-category-container[data-main="${main}"]`);
    container.classList.toggle("hidden");
}

// hide popup
function hidePopup(popup) {
    popup.classList.add("hidden");
}

// open delete popup
function showDeletePopup({type, main, sub}) {
    const popup = document.getElementById("delete-popup");
    const text = popup.querySelector(".popup-text");

    if (type === "main") {
        text.textContent = `
            Delete main category "${main}" and all its subcategories?
        `;
    } else {
        text.textContent = `
            Delete subcategory "${sub}" under "${main}"?
        `;
    }

    popup.dataset.type = type;
    popup.dataset.main = main;
    popup.dataset.sub = sub || "";
    popup.classList.remove("hidden");
}

function confirmDelete() {
    const popup = document.getElementById("delete-popup");
    const { type, main, sub } = popup.dataset;

    if (type === "main") {
        deleteMainCategory(main);
    } else if (type === "sub") {
        deleteSubCategory(main, sub);
    }

    hidePopup(popup);
}

function cancelDelete() {
    const popup = document.getElementById("delete-popup");
    hidePopup(popup);
}

function deleteMainCategory(main) {
    const mainCategories = JSON.parse(localStorage.getItem("mainCategories")) || [];
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};

    localStorage.setItem("mainCategories", JSON.stringify(mainCategories.filter(m => m !== main)));
    delete subCategories[main];

    localStorage.setItem("subCategories", JSON.stringify(subCategories));
    renderMainCategories();
}

function deleteSubCategory(main, sub) {
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};

    subCategories[main] = subCategories[main].filter(s => s !== sub);
    localStorage.setItem("subCategories", JSON.stringify(subCategories));
    renderMainCategories();
}

// add/edit popup
function showEditPopup({ mode, type, main, sub }) {
    const popup = document.getElementById("edit-popup");
    const text = popup.querySelector(".popup-text");
    const input = document.getElementById("category-input");

    popup.dataset.mode = mode;
    popup.dataset.type = type;
    popup.dataset.main = main || "";
    popup.dataset.sub = sub || "";

    if (mode === "add") {
        input.value = "";
        text.textContent = type === "main" ? "Add Main Category" : `Add Subcategory under "${main}"`;
    } else {
        input.value = type === "main" ? main : sub;
        text.textContent = type === "main" ? "Edit Main Category" : `Edit Subcategory "${sub}"`;
    }

    popup.classList.remove("hidden");
}

function confirmEdit() {
    const popup = document.getElementById("edit-popup");
    const input = document.getElementById("category-input").value.trim();
    const { mode, type, main, sub } = popup.dataset;
    console.log(input);

    if (!input) return;

    if (type === "main") {
        if (mode === "add") addMainCategory(input);
        else editMainCategory(main, input);
    } else {
        if (mode === "add") addSubCategory(main, input);
        else editSubCategory(main, sub, input);
    }

    
    hidePopup(popup);
}

function cancelEdit() {
    const popup = document.getElementById("edit-popup");
    hidePopup(popup);
}

function addMainCategory(name) {
    const mainCategories = JSON.parse(localStorage.getItem("mainCategories")) || [];
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};
    if (mainCategories.includes(name)) return;

    mainCategories.push(name);
    subCategories[name] = [];

    localStorage.setItem("mainCategories", JSON.stringify(mainCategories));
    localStorage.setItem("subCategories", JSON.stringify(subCategories));
    renderMainCategories();
}

function addSubCategory(main, name) {
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};

    if (!subCategories[main].includes(name)) {
        subCategories[main].push(name);
        localStorage.setItem("subCategories", JSON.stringify(subCategories));
        renderMainCategories();
    }
}

function editMainCategory(oldName, newName) {
    const mainCategories = JSON.parse(localStorage.getItem("mainCategories")) || [];
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};
    const index = mainCategories.indexOf(oldName);

    if (index !== -1) {
        mainCategories[index] = newName;
        subCategories[newName] = subCategories[oldName];

        delete subCategories[oldName];
        localStorage.setItem("mainCategories", JSON.stringify(mainCategories));
        localStorage.setItem("subCategories", JSON.stringify(subCategories));
        renderMainCategories();
    }
}

function editSubCategory(main, oldSub, newSub) {
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || {};
    const index = subCategories[main].indexOf(oldSub);
    if (index !== -1) {
        subCategories[main][index] = newSub;
        localStorage.setItem("subCategories", JSON.stringify(subCategories));
        renderMainCategories();
    }
}