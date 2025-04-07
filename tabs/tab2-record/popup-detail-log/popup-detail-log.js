// click x button to close 
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

// edit button
const editButton = document.getElementById("edit-button");
editButton.addEventListener("click", () => {
    sessionStorage.setItem("editingTransactionId", id);
    window.location.href = "../popup-edit-log/popup-edit-log.html";
});

/**
 *  render details
 */
const id = sessionStorage.getItem("selectedTransactionId");
const logs = JSON.parse(localStorage.getItem("transactions")) || [];
const log = logs.find(l => l.id === id);

if (log) {
    document.getElementById("detail-amount").textContent = `$ ${Math.abs(log.amount).toLocaleString()}`;
    document.getElementById("detail-title").textContent = log.title;
    document.getElementById("detail-type").textContent = log.type;
    document.getElementById("detail-date").textContent = log.date;
    document.getElementById("detail-method").textContent = log.method;
    document.getElementById("detail-category").textContent = log.category;
    document.getElementById("detail-note").textContent = log.notes;
}