/* MAIN - CALENDAR TAB */

/*
    click the icon to open the category setting page
*/
const settingButton = document.getElementById("header-button");
settingButton.addEventListener("click", navigateToPage);

/* 
    click the icons to navigate to dedicated screens 
    (add, search)
*/
const addBtn = document.getElementById("add");
const searchBtn = document.getElementById("search");

addBtn.addEventListener("click", navigateToPage);
searchBtn.addEventListener("click", navigateToPage);

function navigateToPage(event) {
    const clickedButtonId = event.target.id;

    sessionStorage.setItem("returnTo", "calendar");
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

/* 
    load & pdate the summary
    Summary 업데이트 함수
    1. a month, year 가져와서 
    2-1. default logs 에서 selected 월의 기록만 선별 -> 함수로 만드는 게 낫겠다
    2-2. local logs 에서 selected 월의 기록만 선별
    3. income/expense 따로 변수 만들어서 총합 계산
*/
function updateSummary(date) {
    // selected 월/년 데이터 
    const month = date.getMonth();
    const year = date.getFullYear();

    // total income/expense 변수 생성, 0으로 설정
    let totalIncome = 0.00;
    let totalExpense = 0.00;

    // local data 에서 selected 월의 데이터만 선택
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

/*
    generate calendar
    1. month year 가져와서 해당 월의 일 설정
    2. day의 수에 맞게 칸 생성하기
    3. if a day 에 로그 있으면 income/expense 표시
*/
function generateCalendar(year, month) {
    const calendarBody = document.querySelector(".calendar-body");
    calendarBody.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const totalCells = setTotalCell(startDay, daysInMonth);

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    
    // create each cell
    // add income/expense of the day
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("calendar-cell");
    
        const dayNumber = i - startDay + 1;
    
        if (i >= startDay && dayNumber <= daysInMonth) {
            const dateStr = 
                `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
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
                cell.appendChild(incomeEl);
            }
        
            // expense text
            if (totalExpense < 0) {
                const expenseEl = document.createElement("div");
                expenseEl.className = "cell-expense";
                expenseEl.textContent = `−${Math.abs(totalExpense).toFixed(2)}`;
                cell.appendChild(expenseEl);
            }
        
            // cell 클릭
            cell.addEventListener("click", () => openDayPopup(dateStr));
        }
    
        calendarBody.appendChild(cell);
    }
}

const monthLeft = document.getElementById("left-arrow");
const monthRight = document.getElementById("right-arrow");

let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();

monthLeft.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthLabel();
    updateSummary(currentDate)
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
});
monthRight.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthLabel();
    updateSummary(currentDate)
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth())
});

/* 
    cell 클릭하면 디테일 팝업 띄우기
    여기서 삭제 버튼도 구현
*/
function openDayPopup(dateStr) {
    console.log(dateStr);
}

// 페이지 첫 로딩 시 초기 표시
updateSummary(currentDate);
updateMonthLabel();
generateCalendar(currentYear, currentMonth);

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