/* MAIN - CALENDAR TAB */

// initially render the calendar tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "calendar");

    bindButtons();
    setupToggle();
    monthSelector();

    updateMonthLabel();
    renderSummary();
    generateCalendar();
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

// toggle 
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

            generateCalendar();
        });
    });
}

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
let currentTypeFilter = "All";

// render the summary
function renderSummary() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    let totalIncome = 0.00;
    let totalExpense = 0.00;

    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    const filteredLocal = filterLogs(localLogs, year, month);

    for (const log of filteredLocal) {
        if (log.type === "INCOME") {
            totalIncome += log.amount;
        } else if (log.type === "EXPENSE") {
            totalExpense += log.amount;
        }
    }

    const displayIncome = Math.abs(totalIncome).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const displayExpense = Math.abs(totalExpense).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const summaryBox = document.getElementById("month-summary-box");
    summaryBox.id = "month-summary-box";
    summaryBox.innerHTML = "";

    summaryBox.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">INCOME</span>
            <span class="summary-amount income">
                <span class="dollar-sign">+ $</span>
                <span>${displayIncome}</span>
            </span>
        </div>
        <div class="summary-row">
            <span class="summary-label">EXPENSE</span>
            <span class="summary-amount expense">
                <span class="dollar-sign">- $</span>
                <span>${displayExpense}</span>
            </span>
        </div>
    `;
}

// generate calendar
function generateCalendar() {
    const calendarBody = document.querySelector(".calendar-body");
    calendarBody.innerHTML = "";

    currentYear = currentDate.getFullYear();
    currentMonth = currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const totalCells = setTotalCell(startDay, daysInMonth);

    const today = new Date();
    const todayStr = `
        ${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}
    `;

    // create each cell & represent income/expense of the day cell
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar-cell");
    
        const dayNumber = i - startDay + 1;
    
        if (i >= startDay && dayNumber <= daysInMonth) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
            cell.dataset.date = dateStr;
            
            // 오늘 날짜면 강조
            if (dateStr === todayStr) {
                cell.classList.add("today");
            }
        
            // 날짜 표시
            const dayLabel = document.createElement("div");
            dayLabel.className = "day-number";
            dayLabel.textContent = dayNumber;
            cell.appendChild(dayLabel);
        
            // 해당 날짜 거래 필터링
            let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
            const filteredLocal = localLogs.filter(log => log.date === dateStr);

            // total income/expense variables
            let totalIncome = 0.00;
            let totalExpense = 0.00;
        
            for (const log of filteredLocal) {
                if (log.amount >= 0) {
                    totalIncome += log.amount;
                } else {
                    totalExpense += log.amount; // 음수로 더해짐
                }
            }
        
            // income text
            if (totalIncome > 0) {
                const incomeEl = document.createElement("div");
                incomeEl.className = "cell-income";
                incomeEl.textContent = `+${Math.abs(totalIncome).toFixed(2)}`;

                if (currentTypeFilter === "All" || currentTypeFilter === "Income") {
                    cell.appendChild(incomeEl);
                }
            }
        
            // expense text
            if (totalExpense < 0) {
                const expenseEl = document.createElement("div");
                expenseEl.className = "cell-expense";
                expenseEl.textContent = `−${Math.abs(totalExpense).toFixed(2)}`;

                if (currentTypeFilter === "All" || currentTypeFilter === "Expense") {
                    cell.appendChild(expenseEl);
                }
            }
        
            // click a cell
            cell.addEventListener("click", () => openDayPopup(dateStr));
        }
    
        calendarBody.appendChild(cell);
    }
}


// month selector
function monthSelector() {
    const monthLeft = document.getElementById("left-arrow");
    const monthRight = document.getElementById("right-arrow");

    monthLeft.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateMonthLabel();
        renderSummary();
        generateCalendar();
    });

    monthRight.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateMonthLabel();
        renderSummary();
        generateCalendar();
    });
}

// cell 클릭하면 해당 day의 로그 목록 팝업 열기
function openDayPopup(dateStr) {
    sessionStorage.setItem("selectedDay", dateStr);
    window.location.href = "../popup-detail-day/popup-detail-day.html";
}


/* util function */
function setTotalCell(startDay, daysInMonth) {
    let totalCell = 0;
    if (startDay < 5) {
        totalCell = 35;
    } else if (startDay == 5) {
        if (daysInMonth < 31) {
            totalCell = 35;
        } else {
            totalCell = 42;
        }
    } else {
        if (daysInMonth < 30) {
            totalCell = 35;
        } else {
            totalCell = 42;
        }
    }

    return totalCell;
}