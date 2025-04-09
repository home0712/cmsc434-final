document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    restoreCategoryFilter();
    renderCategoryOptions();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveCategoryButton = document.getElementById("save-category");

    closeButton.addEventListener("click", () => {
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });

    saveCategoryButton.addEventListener("click", () => {
        const selected = [...document.querySelectorAll(".category-checkbox:checked")].map(check => check.value);
        sessionStorage.setItem("filterCategories", JSON.stringify(selected));
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });
}

function restoreCategoryFilter() {
    const saved = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    document.querySelectorAll(".category-checkbox").forEach(check => {
        if (saved.includes(check.value)) {
            check.checked = true;
        }
    });
}

function renderCategoryOptions() {
    const container = document.getElementById("category-list");
    const mainCategories = JSON.parse(localStorage.getItem("mainCategories")) || [];
    const saved = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    
    mainCategories.forEach(main => {
        const label = document.createElement("label");
        label.classList.add("option-item");
        label.innerHTML = `
            <input type="checkbox" value="${main}" class="category-checkbox" ${saved.includes(main) ? "checked" : ""}/> 
            <span>${main}</span>
        `;
        container.appendChild(label);
    });
}