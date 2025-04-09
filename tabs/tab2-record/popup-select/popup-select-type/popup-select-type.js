document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    restoreTypeFilter();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveTypeButton = document.getElementById("save-type");

    closeButton.addEventListener("click", () => {
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });

    saveTypeButton.addEventListener("click", () => {
        const selected = [...document.querySelectorAll(".type-checkbox:checked")].map(check => check.value);
        sessionStorage.setItem("filterTypes", JSON.stringify(selected));
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    }); 
}

function restoreTypeFilter() {
    const saved = JSON.parse(sessionStorage.getItem("filterTypes")) || [];
    document.querySelectorAll(".type-checkbox").forEach(check => {
        if (saved.includes(check.value)) {
            check.checked = true;
        }
    });
}