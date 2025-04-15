/* MAIN - TRANSACTION TAB */

// global variables
// 전역변수
let currentTypeFilter = "All";
let currentDate = new Date(); 
let isFilterActive = !!sessionStorage.getItem("logFilters");

// initially render the transaction tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "transaction");
    loadDefaultData();
    renderTransactionLogs();
    bindButtons();
    setupFilterPopup();
    setupToggle();
    monthSelector();
    updateMonthLabel();

    isFilterActive = !!sessionStorage.getItem("logFilters"); 
    updateFilterUI(isFilterActive);
    updateToggleVisibility();
});

// collection of buttons
// 버튼 모음
function bindButtons() {
    const settingButton = document.getElementById("header-button");
    const addButton = document.getElementById("add");
    const searchButton = document.getElementById("search");

    settingButton.addEventListener("click", () => {
        window.location.href = "../../shared-popups/popup-manage-category/popup-manage-category.html";
    });
    addButton.addEventListener("click", () => {
        window.location.href = "../popup-add-log/popup-add-log.html";
    });
    searchButton.addEventListener("click", () => {
        window.location.href = "../popup-search-log/popup-search-log.html";
    });
}

// save the default transaction data to local storage 
// (처음 페이지 1회 방문했을 때만) 디폴트 로그 데이터 -> 로컬에 저장
if (!localStorage.getItem("transactions")) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// all/income/expense toggle: click, type filtering, rendering
// all/income/expense 토글
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

function updateToggleVisibility() {
    const toggleArea = document.getElementById("type-toggle");
    toggleArea.style.visibility = isFilterActive ? "hidden" : "visible";
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
            types,
            methods,
            categories,
            subCategories
        } = filters;

        const amount = Math.abs(log.amount);
        const logDate = new Date(log.date);
        const logType = log.type === "EXPENSE" ? "Expense" : "Income";

        if (minAmount != null && amount < minAmount) return false;
        if (maxAmount != null && amount > maxAmount) return false;   
        if (startDate && logDate < new Date(startDate)) return false;
        if (endDate && logDate > new Date(endDate)) return false;
        if (types && types.length > 0 && !types.includes(logType)) return false;
        if (methods && methods.length > 0 && !methods.includes(log.method)) return false;
        if (categories && categories.length > 0 && !categories.includes(log.category.main)) return false;
        if (subCategories && subCategories.length > 0 && !subCategories.includes(log.category.sub)) return false;

        return true;
    });
}

// filtering functions 
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
    sessionStorage.removeItem("filterTypes");
    sessionStorage.removeItem("filterMethods");
    sessionStorage.removeItem("filterCategories");
    sessionStorage.removeItem("filterSubCategories");
    sessionStorage.setItem("filterWasCleared", "true");
    isFilterActive = false;
    updateFilterUI(false);
    updateToggleVisibility();
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

// render transaction logs based on the month selected
// 선택된 월을 기준으로 월별 렌더링
function renderTransactionLogs() {
    const container = document.getElementById("logs-container");
    container.innerHTML = "";

    if (sessionStorage.getItem("prevMonthView")) {
        const [year, month, day] = sessionStorage.getItem("prevMonthView").split("-");
        currentDate = new Date(year, month - 1, day);
        sessionStorage.removeItem("prevMonthView");
    }

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // select current month data from localLogs
    // localLogs 에서 현재 선택된 월의 데이터만 가져오기
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    let filteredLocal = filterLogs(localLogs, year, month);
    if (sessionStorage.getItem("logFilters")) {
        filteredLocal = applyFilters(filteredLocal);
    }
    filteredLocal.sort((a, b) => new Date(b.date) - new Date(a.date));

    // unset advanced filter (no filterLog) -> apply the simple filter (toggle buttons) only
    // 심화 filter 설정되지 않은 경우 (filterLog 없음) -> 심플 필터 (토글 버튼)만 처리
    if (!isFilterActive) {
        if (currentTypeFilter === "Income") {
            filteredLocal = filteredLocal.filter((log) => log.type === "INCOME");
        } else if (currentTypeFilter === "Expense") {
            filteredLocal = filteredLocal.filter((log) => log.type === "EXPENSE");
        }
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