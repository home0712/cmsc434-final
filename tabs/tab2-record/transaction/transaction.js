/* MAIN - TRANSACTION TAB */

// initially render the transaction tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "transaction");

    bindButtons();
    setupFilterPopup();
    setupToggle();
    monthSelector();
    updateMonthLabel();

    isFilterActive = !!sessionStorage.getItem("logFilters"); 
    updateFilterUI(isFilterActive);
    renderTransactionLogs();
});

function bindButtons() {
    const settingButton = document.getElementById("header-button");
    const addButton = document.getElementById("add");
    const searchButton = document.getElementById("search");

    settingButton.addEventListener("click", navigateToPage);
    addButton.addEventListener("click", navigateToPage);
    searchButton.addEventListener("click", navigateToPage);
}

function navigateToPage(event) {
    const clickedButtonId = event.target.id;

    if (clickedButtonId === "add") {
        window.location.href = "../popup-add-log/popup-add-log.html";
    } else if (clickedButtonId === "search") {
        window.location.href = "../popup-search-log/popup-search-log.html";
    } else if (clickedButtonId === "header-button") {
        window.location.href = "../../shared-popups/popup-manage-category/popup-manage-category.html";
    }
}

// save the default transaction data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

let currentTypeFilter = "All";
let currentDate = new Date(); 

function setupToggle() {
    const toggleButton = document.getElementById("type-toggle");
    const toggleIcon = document.getElementById("toggle-icon");
    const dropdown = document.getElementById("dropdown-list");
    const selectedText = document.getElementById("dropdown-selected");

    toggleButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
        toggleIcon.src = dropdown.classList.contains("hidden")
          ? "../../../assets/Arrow-up.png"
          : "../../../assets/Arrow-down.png";
    });

    const options = document.querySelectorAll(".dropdown-option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            currentTypeFilter = option.dataset.id;
            selectedText.textContent = currentTypeFilter;
            dropdown.classList.add("hidden");

            options.forEach(option => {
                option.classList.remove("selected");
            });
            option.classList.add("selected");

            renderTransactionLogs();
        });
    });
}

// apply the filters
function applyFilters(logs) {
    const filters = JSON.parse(sessionStorage.getItem("logFilters"));
    if (!filters) {
        return logs; 
    }

    return logs.filter((log) => {
        const {
            minAmount,
            maxAmount,
            startDate,
            endDate,
            method,
            category,
            type
        } = filters;

        const amount = Math.abs(log.amount);
        const date = log.date;

        if (minAmount != null && amount < minAmount) return false;
        if (maxAmount != null && amount > maxAmount) return false;
        if (startDate && date < startDate) return false;
        if (endDate && date > endDate) return false;
        if (method && log.method !== method) return false;
        if (category && log.category[0] !== category) return false;
        if (type && log.type !== type) return false;

        return true;
    });
}

// filtering functions 
let isFilterActive = !!sessionStorage.getItem("logFilters");
function updateFilterUI(isActive) {
    const filterButton = document.getElementById("filter");
    if (isActive) {
        filterButton.classList.add("active"); 
    } else {
        filterButton.classList.remove("active"); 
    }
}

function clearFiltersInTransactionPage() {
    sessionStorage.removeItem("logFilters");
    isFilterActive = false;
    updateFilterUI(false);
    renderTransactionLogs();
}

function setupFilterPopup() {
    const filterButton = document.getElementById("filter");
    const popup = document.getElementById("clear-filter-popup");
    const confirmButton = document.getElementById("confirm-clear-filter");
    const cancelButton = document.getElementById("cancel-clear-filter");
  
    filterButton.addEventListener("click", () => {
      if (isFilterActive) {
        popup.classList.remove("hidden"); 
      } else {
        window.location.href = "../popup-filter-log/popup-filter-log.html"; 
      }
    });
  
    confirmButton.addEventListener("click", () => {
      clearFiltersInTransactionPage();
      popup.classList.add("hidden");
    });

    cancelButton.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
}

// render transaction lists based on the month selected
function renderTransactionLogs() {
    const container = document.getElementById("logs-container");
    container.innerHTML = "";

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // local data 에서 selected 월의 데이터만 선택
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    let filteredLocal = filterLogs(localLogs, year, month);
    filteredLocal = applyFilters(filteredLocal);
    filteredLocal.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 
    if (currentTypeFilter === "Income") {
        filteredLocal = filteredLocal.filter((log) => log.type === "INCOME");
    } else if (currentTypeFilter === "Expense") {
        filteredLocal = filteredLocal.filter((log) => log.type === "EXPENSE");
    }

    // 동일 날짜별로 여러개의 기록 있으면 -> 하나의 오브젝트(키: 날짜)로 묶어 그룹화
    const dateGrouped = groupLogsByDate(filteredLocal);

    // 최신 날짜부터 정렬해야 되니까 -> dateGroupedLogs의 키를 내림차순으로 정렬
    const dateGroupedKeys = Object.keys(dateGrouped).sort((a, b) => new Date(b.date) - new Date(a.date));

    for (const dateKey of dateGroupedKeys) {
        const [year, month, day] = dateKey.split("-");
        const date = new Date(year, month - 1, day);
        const dateString = `
            ${monthNames[date.getMonth()]} 
            ${date.getDate()}${getOrdinal(date.getDate())} 
            ${date.getFullYear()} 
            ${weekdayNames[date.getDay()]}
        `;

        appendLogsByDate(dateGrouped, container, dateKey, dateString);
    }
}

// month selector
function monthSelector() {
    const monthLeft = document.getElementById("left-arrow");
    const monthRight = document.getElementById("right-arrow");

    monthLeft.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthLabel();
        renderTransactionLogs();
    });

    monthRight.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthLabel();
        renderTransactionLogs();
    });
}