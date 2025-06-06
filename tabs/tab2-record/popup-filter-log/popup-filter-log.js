document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setupPresetButtons();
    setupDateInputOverride();

    const filters = sessionStorage.getItem("logFilters");
    const wasCleared = sessionStorage.getItem("filterWasCleared");
    
    if (wasCleared) {
        clearFilter();
        sessionStorage.removeItem("filterWasCleared");
    } else {
        updateFilterUIFromSession(); 
    }
    toggleSubCategoryField();
});

// collection of buttons
// 버튼 모음
function bindButtons() {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", returnToPage);

    document.getElementById("save-filter").addEventListener("click", saveFilter);
    document.getElementById("clear-filter").addEventListener("click", clearFilter);

    document.getElementById("select-type-button").addEventListener("click", () => {
        saveTemp();
        window.location.href = "../popup-select/popup-select-type/popup-select-type.html";
    });

    document.getElementById("select-method-button").addEventListener("click", () => {
        saveTemp();
        window.location.href = "../popup-select/popup-select-method/popup-select-method.html";
    });
      
    document.getElementById("select-category-button").addEventListener("click", () => {
        saveTemp();
        window.location.href = "../popup-select/popup-select-category/popup-select-category.html";
    });

    document.getElementById("select-subcategory-button").addEventListener("click", () => {
        saveTemp();
        window.location.href = "../popup-select/popup-select-sub-category/popup-select-sub-category.html";
    });

    const minAmount = document.getElementById("min-amount");
    const maxAmount = document.getElementById("max-amount");
    clearError(minAmount);
    clearError(maxAmount);

    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");
    clearError(startDate);
    clearError(endDate);
}

function saveTemp() {
    const selectedBtn = document.querySelector(".preset-button.selected");

    sessionStorage.setItem("pendingFilterData", JSON.stringify({
        minAmount:  document.getElementById("min-amount").value,
        maxAmount: document.getElementById("max-amount").value,
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        selectedPresetButton: selectedBtn ? selectedBtn.dataset.range : null,
    }));
}

// save filter
function saveFilter() {
    const minAmount = document.getElementById("min-amount").value;
    const maxAmount = document.getElementById("max-amount").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (minAmount > maxAmount) {
        showAmountError();
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showDateError();
        return;
    }

    const selectedPresetButton = document.querySelector(".preset-button.selected");
    
    let calculatedStartDate = null;
    let calculatedEndDate = null;

    if (selectedPresetButton) { 
        const days = parseInt(selectedPresetButton.dataset.range); 
        const today = new Date();
        calculatedEndDate = today.toISOString().slice(0, 10);

        const past = new Date(today);
        past.setDate(today.getDate() - days);
        calculatedStartDate = past.toISOString().slice(0, 10);
    } 

    const types = JSON.parse(sessionStorage.getItem("filterTypes")) || [];
    const methods = JSON.parse(sessionStorage.getItem("filterMethods")) || [];
    const categories = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    const subCategories = JSON.parse(sessionStorage.getItem("filterSubCategories")) || [];

    const filterData = {
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxAmount: maxAmount ? parseFloat(maxAmount) : null,
        startDate: calculatedStartDate || startDate || null,
        endDate: calculatedEndDate || endDate || null,
        types: types.length > 0 ? types : null,
        methods: methods.length > 0 ? methods : null,
        categories: categories.length > 0 ? categories : null,
        subCategories: subCategories.length > 0 ? subCategories : null
    };

    const isAllNull = Object.values(filterData).every(val => {
        if (Array.isArray(val)) return val.length === 0;
        return val === null;
    });

    if (!isAllNull) {
        sessionStorage.setItem("logFilters", JSON.stringify(filterData));
        window.location.href = "../transaction/transaction.html";
    } else {
        sessionStorage.removeItem("logFilters");
        window.location.href = "../transaction/transaction.html";
    }
}

// preset button logic
function setupPresetButtons() {
    const presetButtons = document.querySelectorAll(".preset-button");
  
    presetButtons.forEach(button => {
      button.addEventListener("click", () => {
        presetButtons.forEach(b => b.classList.remove("selected"));

        button.classList.add("selected");
  
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";
      });
    });
}

// clear filter 
function clearFilter() {
    document.getElementById("min-amount").value = "";
    document.getElementById("max-amount").value = "";
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";

    document.getElementById("type-count").textContent = "All";
    document.getElementById("method-count").textContent = "All";
    document.getElementById("category-count").textContent = "All";
    document.getElementById("subcategory-count").textContent = "All";

    document.querySelectorAll(".preset-button").forEach(b => b.classList.remove("selected"));

    sessionStorage.removeItem("logFilters");
    sessionStorage.removeItem("filterTypes");
    sessionStorage.removeItem("filterMethods");
    sessionStorage.removeItem("filterCategories");
    sessionStorage.removeItem("filterSubCategories");

    toggleSubCategoryField();
}
  
// de-select preset button when date input entered
function setupDateInputOverride() {
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");

    [startDate, endDate].forEach(input => {
        input.addEventListener("input", () => {
            document.querySelectorAll(".preset-button").forEach(b => b.classList.remove("selected"));
        });
    });
}

//
function updateFilterUIFromSession() {
    const saved = JSON.parse(sessionStorage.getItem("pendingFilterData"));
    if (!saved) return;

    const types = JSON.parse(sessionStorage.getItem("filterTypes")) || [];
    const methods = JSON.parse(sessionStorage.getItem("filterMethods")) || [];
    const mainCategories = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    const subCategories = JSON.parse(sessionStorage.getItem("filterSubCategories")) || [];
  
    document.getElementById("type-count").textContent = types.length > 0 ? `${types.length}` : "All";
    document.getElementById("method-count").textContent = methods.length > 0 ? `${methods.length}` : "All";
    document.getElementById("category-count").textContent = mainCategories.length > 0 ? `${mainCategories.length}` : "All";
    document.getElementById("subcategory-count").textContent = subCategories.length > 0 ? `${subCategories.length}` : "All";

    if (saved.selectedPresetButton) {
        const presetButtons = document.querySelectorAll(".preset-button");
        presetButtons.forEach(btn => {
            if (btn.dataset.range === saved.selectedPresetButton) {
                btn.classList.add("selected");
            }
        });
    }

    sessionStorage.removeItem("pendingFilterData");
    toggleSubCategoryField();
}

//
function toggleSubCategoryField() {
    const categories = JSON.parse(sessionStorage.getItem("filterCategories")) || [];
    const subField = document.getElementById("subcategory");
  
    if (categories.length === 0) {
      subField.classList.add("hidden");
    } else {
      subField.classList.remove("hidden");
    }
}

// input value error
function showAmountError() {
    const minAmount = document.getElementById("min-amount");
    const maxAmount = document.getElementById("max-amount");
    
    minAmount.classList.add("input-error");
    maxAmount.classList.add("input-error");
}

function showDateError() {
    const startDate = document.getElementById("start-date");
    const endDate = document.getElementById("end-date");
    
    startDate.classList.add("input-error");
    endDate.classList.add("input-error");
}

function clearError(element) {
    const eventList = ["input", "click", "focus"];

    eventList.forEach(eventName => {
        element.addEventListener(eventName, () => {
            element.classList.remove("input-error");
        });
    });
}