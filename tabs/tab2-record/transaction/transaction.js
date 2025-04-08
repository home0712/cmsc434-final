/* MAIN - TRANSACTION TAB */

// initially render the transaction tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "transaction");

    bindButtons();
    setupToggle();
    monthSelector();

 
    updateMonthLabel();
    renderTransactionLogs();
});

function bindButtons() {
    const settingButton = document.getElementById("header-button");
    const filterBtn = document.getElementById("filter");
    const addBtn = document.getElementById("add");
    const searchBtn = document.getElementById("search");

    settingButton.addEventListener("click", navigateToPage);
    filterBtn.addEventListener("click", navigateToPage);
    addBtn.addEventListener("click", navigateToPage);
    searchBtn.addEventListener("click", navigateToPage);
}

function navigateToPage(event) {
    const clickedButtonId = event.target.id;

    if (clickedButtonId === "filter") {
        window.location.href = "../popup-filter-log/popup-filter-log.html";
    } else if (clickedButtonId === "add") {
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

// render transaction lists based on the month selected
function renderTransactionLogs() {
    const container = document.getElementById("logs-container");
    container.innerHTML = "";

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    // local data 에서 selected 월의 데이터만 선택
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    let filteredLocal = filterLogs(localLogs, year, month);
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
        renderTransactionLogs(currentDate);
    });

    monthRight.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthLabel();
        renderTransactionLogs(currentDate);
    });
}