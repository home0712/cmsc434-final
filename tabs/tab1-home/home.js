/* MAIN - HOME TAB */
document.addEventListener("DOMContentLoaded", () => {
    loadDefaultData();
    bindButtons();
    renderCurrentMonth();
    renderSummary();
});

function bindButtons() {
    const leftButtons = document.querySelectorAll(".title-button");
    leftButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.id;
            if (id === "summary-button") {
                window.location.href = "../tab2-record/transaction/transaction.html";
            } else if (id === "account-button") {
                window.location.href = "../tab2-record/accounts/accounts.html";
            } else if (id === "spending-button") {
                window.location.href = "../tab4-report/category/category.html";
            }
        });
    })
}

// show the current month
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function renderCurrentMonth() {
    const titleText = document.getElementById("month-summary-title");
    const today = new Date();
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();

    titleText.textContent = `${currentMonth} ${currentYear} Summary`;
}

// 
function renderSummary() {
    const currentMonth = new Date().getMonth() + 1;
    const localLogs = JSON.parse(localStorage.getItem("transactions")) || [];

    let totalIncome = 0.00;
    let totalExpense = 0.00;

    localLogs.forEach(log => {
        if (currentMonth === Number(log.date.slice(5, 7))) {
            if (log.type === "INCOME") {
                totalIncome += Math.abs(log.amount);
            } else {
                totalExpense += Math.abs(log.amount);
            }
        }
    });

    const totalNet = totalIncome - totalExpense;
    document.getElementById("income-value").textContent = totalIncome.toLocaleString();
    document.getElementById("expense-value").textContent = totalExpense.toLocaleString();
    document.getElementById("net-container").innerHTML = 
        totalNet > 0 
        ?   `<span class="dollar-sign">+ $</span>
            <span class="amount-value">${Math.abs(totalNet)}</span>
            ` 
        : totalNet === 0 
        ?   `<span class="dollar-sign"> $</span>
            <span class="amount-value">0</span>
            ` 
        :
            `<span class="dollar-sign">- $</span>
            <span class="amount-value">${Math.abs(totalNet)}</span>
            ` 

                
}


