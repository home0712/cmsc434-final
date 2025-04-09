document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    restoreMethodFilter();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveMethodButton = document.getElementById("save-method");

    closeButton.addEventListener("click", () => {
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });

    saveMethodButton.addEventListener("click", () => {
        const selected = [...document.querySelectorAll(".method-checkbox:checked")].map(check => check.value);
        sessionStorage.setItem("filterMethods", JSON.stringify(selected));
        window.location.href = "../../popup-filter-log/popup-filter-log.html";
    });
}

function restoreMethodFilter() {
    const saved = JSON.parse(sessionStorage.getItem("filterMethods")) || [];
    document.querySelectorAll(".method-checkbox").forEach(check => {
        if (saved.includes(check.value)) {
            check.checked = true;
        }
    });
}