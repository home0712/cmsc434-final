// initially render the detail log page
document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", returnToPage);
});

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

// delete button
const deleteButton = document.getElementById("delete-button-main");
deleteButton.addEventListener("click", activeDeletePopup);
function activeDeletePopup() {
    const popup = document.querySelector(".delete-popup");
    popup.classList.remove("hidden");

    const confirmButton = popup.querySelector(".confirm-delete");
    const cancelButton = popup.querySelector(".cancel-delete");

    confirmButton.addEventListener("click", () => {
        const logId = sessionStorage.getItem("selectedTransactionId");
        let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
        localLogs = localLogs.filter(log => log.id !== logId);
        localStorage.setItem("transactions", JSON.stringify(localLogs));

        window.location.href = "../transaction/transaction.html";
    });

    cancelButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
}

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