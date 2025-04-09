document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", returnToPage);

    document.getElementById("save-filter").addEventListener("click", saveFilter);
    document.getElementById("clear-filter").addEventListener("click", clearFilter);

    setupPresetButtons();
    setupTypeButtons();
    setupDateInputOverride();
});

// save filter
function saveFilter() {
    const minAmount = document.getElementById("min-amount").value;
    const maxAmount = document.getElementById("max-amount").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;
    const method = document.getElementById("method-select").value;
    const category = document.getElementById("category-select").value;

    const selectedTypeButton = document.querySelector(".type-button.selected");
    const selectedPresetButton = document.querySelector(".preset-button.selected");
    const type = selectedTypeButton ? selectedTypeButton.dataset.type : null;


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

    const filterData = {
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxAmount: maxAmount ? parseFloat(maxAmount) : null,
        startDate: calculatedStartDate || startDate || null,
        endDate: calculatedEndDate || endDate || null,
        method: method || null,
        category: category || null,
        type: type || null
    };

    const allNull = Object.values(filterData).every(value => value === null);
    if (!allNull) {
        sessionStorage.setItem("logFilters", JSON.stringify(filterData));
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
    document.getElementById("method-select").value = "";
    document.getElementById("category-select").value = "";

    document.querySelectorAll(".preset-button").forEach(b => b.classList.remove("selected"));
    document.querySelectorAll(".type-button").forEach(b => b.classList.remove("selected"));

    sessionStorage.removeItem("logFilters");
}

// type button logic
function setupTypeButtons() {
    const typeButtons = document.querySelectorAll(".type-button");
  
    typeButtons.forEach(button => {
      button.addEventListener("click", () => {
        typeButtons.forEach(b => b.classList.remove("selected"));

        button.classList.add("selected");
      });
    });
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