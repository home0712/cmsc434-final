// initially render the detail log page
document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", returnToPage);

    renderTransactionLogs();
});

// render the transaction logs of a day
function renderTransactionLogs() {
    const container = document.getElementById("logs-container");
    container.innerHTML = "";

    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    const [year, month, day] = sessionStorage.getItem("selectedDay").split("-");
    const selectedDay = new Date(year, month - 1, day);
    const logsOfDay = localLogs.filter((log) => {
        const [logYear, logMonth, logDay] = log.date.split("-");
        return logYear === year && logMonth === month && logDay === day;
    });
    
    const groupDiv = document.createElement("div");
    const dateString = `
            ${monthNames[selectedDay.getMonth()]} 
            ${selectedDay.getDate()}${getOrdinal(selectedDay.getDate())} 
            ${selectedDay.getFullYear()} 
            ${weekdayNames[selectedDay.getDay()]}
    `;
    groupDiv.className = "date-group";
    groupDiv.innerHTML = `<div class="log-date">${dateString}</div><hr>`;

    if (logsOfDay.length === 0) {
        groupDiv.innerHTML += `<div class="no-data">No Data Found</div>`
    }

    for (const log of logsOfDay) {
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
            sessionStorage.setItem("returnToPopup", "dayList");
            window.location.href = "../popup-detail-log/popup-detail-log.html";
        });

        groupDiv.appendChild(logItem);
    }
    
    container.appendChild(groupDiv);
}