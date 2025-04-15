/* 
    update month selector text
    for transaction, calendar
*/
function updateMonthLabel() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const label = `${monthNames[month]} ${year}`;
    const selectorText = document.getElementById("month-selector-text");

    selectorText.textContent = label;
}

/*
    return to previous page
    for (side) add a log, search logs
*/
function returnToPage() {
    const returnPage = sessionStorage.getItem("returnTo");

    if (returnPage === "transaction") {
        window.location.href = "../transaction/transaction.html";
    } else if (returnPage === "calendar") { 
        window.location.href = "../calendar/calendar.html";
    } 
}

/* 
    append logs to container
*/
function appendLogsByDate(dateGrouped, container, dateKey, dateString) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "date-group";
    groupDiv.innerHTML = `<div class="log-date">${dateString}</div><hr>`;

    for (const log of dateGrouped[dateKey]) {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.dataset.id = log.id;

        logItem.innerHTML = `
            <div class="log-left">
                <img src="../../../assets/${getIconForCategory(log.category[0])}">
                <span class="log-title">${log.title}</span>
            </div>
            <span class="log-amount ${log.type === 'INCOME' ? 'income' : 'expense'}">
                ${formatAmount(log.amount)}
            </span>
        `;

        logItem.addEventListener("click", () => {
            sessionStorage.setItem("selectedTransactionId", log.id);
            sessionStorage.setItem("returnTo", "transaction");
            window.location.href = "../popup-detail-log/popup-detail-log.html";
        });

        groupDiv.appendChild(logItem);
    }      
    container.appendChild(groupDiv);
}

/* util variables */
const monthNames = [
    "January", 
    "February", 
    "March", 
    "April", 
    "May", 
    "June",
    "July", 
    "August", 
    "September", 
    "October", 
    "November", 
    "December"
];

const weekdayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/* util functions */
function filterLogs(logs, year, month) {
    const filtered = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getFullYear() === year && logDate.getMonth() === month
    });

    return filtered;
}

function groupLogsByDate(logs) {
    const grouped = {};
    for (const log of logs) {
        if (!grouped[log.date]) {
            grouped[log.date] = [];
        }
        grouped[log.date].push(log);
    }

    return grouped;
}

function formatAmount(amount) {
    const sign = amount >= 0 ? "+ $ " : "- $ ";

    return `${sign}${Math.abs(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function getOrdinal(day) {
    if (day > 3 && day < 21) {
        return "th";
    }

    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
}

function getIconForCategory(category) {
    const iconMap = {
      beverage: "Coffee.png",
      education: "Book.png",
      salary: "Briefcase.png",
      entertainment: "Film.png",
      clothing: "Book.png",
      food: "Book.png",
      transfer: "Book.png",
      transportation: "Book.png"
    };
    
    return iconMap[category] || "Clipboard.png";
}

// keyboard
function showKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const content = document.querySelector(".device-content");
    keyboard.style.display = "block";
    content.style.paddingBottom = "320px"; 
    keyboard.style.height = "350px";
}
  
function hideKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const content = document.querySelector(".device-content");
    keyboard.style.display = "none";
    content.style.paddingBottom = "75px";
    keyboard.style.height = "0px";
}

document.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("focus", () => {
      showKeyboard();
      setTimeout(() => {
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    });
  
    field.addEventListener("blur", () => {
      hideKeyboard();
    });
});