// click x button to close 
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

// edit button
const editButton = document.getElementById("edit-button");
editButton.addEventListener("click", () => {
    // get data
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    
    // 해당 id를 가진 데이터 찾아서 보내기
    const editingLog = localLogs.find((log) => log.id === logId);
    sessionStorage.setItem("editingLog", JSON.stringify(editingLog));

    window.location.href = "../popup-edit-log/popup-edit-log.html";
});

/**
 *  render details
 */
const logId = sessionStorage.getItem("selectedTransactionId");
const localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
const log = localLogs.find((log) => log.id === logId);

if (log) {
    document.getElementById("detail-amount").textContent = `$ ${Math.abs(log.amount).toLocaleString()}`;
    document.getElementById("detail-title").textContent = log.title;
    document.getElementById("detail-type").textContent = log.type === "EXPENSE" ? "Expense" : "Income";
    document.getElementById("detail-date").textContent = log.date;
    document.getElementById("detail-method").textContent = log.method;
    document.getElementById("detail-category").textContent = log.category;
    document.getElementById("detail-note").textContent = log.notes;
}