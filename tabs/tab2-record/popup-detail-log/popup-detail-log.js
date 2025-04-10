/* SUB - DETAIL LOG */

// initial
// 초기화
document.addEventListener("DOMContentLoaded", () => {
    renderLogDetail();
    bindButtons();
});

// collection of buttons
// 버튼 모음
function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const editButton = document.getElementById("edit-button");

    closeButton.addEventListener("click", () => {
        const returnPage = sessionStorage.getItem("returnTo");
        const returnPopup = sessionStorage.getItem("returnToPopup") || null;

        if (returnPopup === "dayList" && returnPage === "calendar") {
            sessionStorage.setItem("returnToPopup", "");
            window.location.href = "../popup-detail-day/popup-detail-day.html";
        } else if (returnPage === "transaction") {
            window.location.href = "../transaction/transaction.html";
        } else if (returnPage === "calendar") { 
            window.location.href = "../calendar/calendar.html";
        } 
    });

    // edit button
    // 수정 버튼    
    editButton.addEventListener("click", () => {
        const logId = sessionStorage.getItem("selectedTransactionId");
        let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];

        // 해당 id를 가진 데이터 찾아서 보내기
        const editingLog = localLogs.find((log) => (log.id).toString() === logId);
        sessionStorage.setItem("editingLog", JSON.stringify(editingLog));
        window.location.href = "../popup-edit-log/popup-edit-log.html";
    });

    // delete button
    // 삭제 버튼
    const deleteButton = document.getElementById("delete-button-main");
    deleteButton.addEventListener("click", activeDeletePopup);
}

// delete popup
// 삭제 팝업
function activeDeletePopup() {
    const popup = document.querySelector(".delete-popup");
    popup.classList.remove("hidden");

    const confirmButton = popup.querySelector(".confirm-delete");
    const cancelButton = popup.querySelector(".cancel-delete");

    confirmButton.addEventListener("click", () => {
        const logId = sessionStorage.getItem("selectedTransactionId");
        let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
        selectedLog = localLogs.find(log => (log.id).toString() == logId);
        localLogs = localLogs.filter(log => (log.id).toString() !== logId);

        // 디테일로 들어오기 전에 보던 month view
        sessionStorage.setItem("prevMonthView", selectedLog.date);
        
        localStorage.setItem("transactions", JSON.stringify(localLogs));

        const returnPage = sessionStorage.getItem("returnTo");
        const returnPopup = sessionStorage.getItem("returnToPopup") || null;

        if (returnPopup === "dayList" && returnPage === "calendar") {
            window.location.href = "../popup-detail-day/popup-detail-day.html";
        } else if (returnPage === "transaction") {
            window.location.href = "../transaction/transaction.html";
        } else if (returnPage === "calendar") {
            window.location.href = "../calendar/calendar.html";
        }
    });

    cancelButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
}

// render details
function renderLogDetail() {
    const logId = sessionStorage.getItem("selectedTransactionId");
    const localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    const log = localLogs.find(log => (log.id).toString() === logId);

    // render values to the screen
    if (log) {
        document.getElementById("detail-amount").textContent = `$ ${Math.abs(log.amount).toLocaleString()}`;
        document.getElementById("detail-title").textContent = log.title;
        document.getElementById("detail-type").textContent = log.type === "EXPENSE" ? "Expense" : "Income";
        document.getElementById("detail-date").textContent = log.date;
        document.getElementById("detail-method").textContent = log.method;
        document.getElementById("detail-category").textContent = log.category.main;
        document.getElementById("detail-sub-category").textContent = log.category.sub;
        document.getElementById("detail-note").textContent = log.notes;

        // 해당 데이터가 있는 month 로 돌아가기 위한 값 저장
        sessionStorage.setItem("prevMonthView", log.date);
    }
}

