document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    restoreSubCategoryFilter();
    renderSubCategoryOptions();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveCategoryButton = document.getElementById("save-sub-category");

    closeButton.addEventListener("click", () => {
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });

    saveCategoryButton.addEventListener("click", () => {
        const selected = [...document.querySelectorAll(".sub-category-checkbox:checked")].map(check => check.value);
        sessionStorage.setItem("filterSubCategories", JSON.stringify(selected));
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });
}

function restoreSubCategoryFilter() {
    const saved = JSON.parse(sessionStorage.getItem("filterSubCategories")) || [];
    document.querySelectorAll(".sub-category-checkbox").forEach(check => {
        if (saved.includes(check.value)) {
            check.checked = true;
        }
    });
}

function renderSubCategoryOptions() {
    const container = document.getElementById("sub-category-list");
    const mains = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    const subCategories = JSON.parse(localStorage.getItem("subCategories")) || [];
    const saved = JSON.parse(sessionStorage.getItem("filterSubCategories")) || [];

    mains.forEach(main => {
        const group = document.createElement("div");
        group.classList.add("sub-container")
        group.innerHTML = `<span class="main-title">${main}</span>`;

        subCategories[main].forEach(sub => {
            const label = document.createElement("label");
            label.classList.add("option-item");
            label.innerHTML = `
                <input type="checkbox" value="${sub}" class="sub-category-checkbox" ${saved.includes(sub) ? "checked" : ""}/> 
                <span>${sub}</span>
            `;
            group.appendChild(label);
        });
        container.appendChild(group);
    });
}