/* SIDE SCREEN - FILTER GOALS */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setupStatusOptionsByGoalType();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", () => {
      window.location.href = "../goal.html";
    });

    document.getElementById("save-filter").addEventListener("click", saveFilter);
    document.getElementById("clear-filter").addEventListener("click", clearFilter);

    const minGoalAmount = document.getElementById("amount-min");
    const maxGoalAmount = document.getElementById("amount-max");
    clearError(minGoalAmount);
    clearError(maxGoalAmount);
    
    const minCurrAmount = document.getElementById("min-progress");
    const maxCurrAmount = document.getElementById("max-progress");
    clearError(minCurrAmount);
    clearError(maxCurrAmount);

    const startDate = document.getElementById("date-start");
    const endDate = document.getElementById("date-end");
    clearError(startDate);
    clearError(endDate);
}

function saveFilter() {
    const type = document.getElementById("type-select").value;
    const status = document.getElementById("status-select").value;
    const minGoalAmount = parseFloat(document.getElementById("amount-min").value);
    const maxGoalAmount = parseFloat(document.getElementById("amount-max").value);
    const minProgress = parseFloat(document.getElementById("min-progress").value);
    const maxProgress = parseFloat(document.getElementById("max-progress").value);
    const startDate = document.getElementById("date-start").value;
    const endDate = document.getElementById("date-end").value;

    if (minGoalAmount > maxGoalAmount) {
        showGoalAmountError();
        return;
    }

    if (minProgress > maxProgress) {
        showCurrentAmountError();
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showDateError();
        return;
    }

    const filterData = {
        type: type || null,
        status: status || null,
        minGoalAmount: minGoalAmount ? parseFloat(minGoalAmount) : null,
        maxGoalAmount: maxGoalAmount ? parseFloat(maxGoalAmount) : null,
        minProgress: minProgress ? parseFloat(minProgress) : null,
        maxProgress: maxProgress ? parseFloat(maxProgress) : null,
        startDate: startDate || null,
        endDate: endDate || null,        
    };

    const allNull = Object.values(filterData).every(value => value === null);
    if (!allNull) {
        sessionStorage.setItem("goalFilters", JSON.stringify(filterData));
        window.location.href = "../goal.html";
    } else {
        window.location.href = "../goal.html";
    }
}

// clear filter 
function clearFilter() {
    document.getElementById("type-select").value = "";
    document.getElementById("status-select").value = "";
    document.getElementById("amount-min").value = "";
    document.getElementById("amount-max").value = "";
    document.getElementById("min-progress").value = "";
    document.getElementById("max-progress").value = "";
    document.getElementById("date-start").value = "";
    document.getElementById("date-end").value = "";

    sessionStorage.removeItem("goalFilters");
}

// status selector option
function setupStatusOptionsByGoalType() {
    const goalTypeSelect = document.getElementById("type-select");
    const statusSelect = document.getElementById("status-select");
    const label = document.getElementById("current-amount");

    goalTypeSelect.addEventListener("change", () => {
        const type = goalTypeSelect.value;
        statusSelect.innerHTML = "";

        if (type === "Budget") {
            statusSelect.innerHTML = `
                <option value="All">All</option>
                <option value="Exceeded">Exceeded</option>
                <option value="Inprogress">In Progress</option>
            `;
            label.textContent = "USED AMOUNT";
        } else if (type === "Saving") {
            statusSelect.innerHTML = `
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Inprogress">In Progress</option>
            `;
            label.textContent = "SAVED AMOUNT";
        } else {
            statusSelect.innerHTML = `
                <option value="">All</option>
                <option value="ExceededCompleted">Exceeded/Completed</option>
                <option value="Inprogress">In Progress</option>
            `;
            label.textContent = "CURRENT AMOUNT";
        }
    });
}

// input value error
function showGoalAmountError() {
    const minAmount = document.getElementById("amount-min");
    const maxAmount = document.getElementById("amount-max");
    
    minAmount.classList.add("input-error");
    maxAmount.classList.add("input-error");
}

function showCurrentAmountError() {
    const minAmount = document.getElementById("min-progress");
    const maxAmount = document.getElementById("max-progress");
    
    minAmount.classList.add("input-error");
    maxAmount.classList.add("input-error");
}

function showDateError() {
    const startDate = document.getElementById("date-start");
    const endDate = document.getElementById("date-end");
    
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