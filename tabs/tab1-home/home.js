/* MAIN - HOME TAB */

/* 
    click the icons to navigate to dedicated screens 
    (filter, add, search)
*/
const leftButtons = document.querySelectorAll(".left-button");

for (const button of leftButtons) {
    button.addEventListener("click", () => {
        const id = button.id;
        if (id === "summary-button") {
            window.location.href = "../tab2-record/transaction/transaction.html";
        } else if (id === "account-button") {
            window.location.href = "../tab2-record/accounts/accounts.html";
        } else if (id === "spending-button") {
            window.location.href = "../tab4-report/report.html";
        }
    });
}

/*
    show the current month
 */
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

function renderCurrentMonth() {
    const titleText = document.getElementById("month-summary-title");
    const today = new Date();
    const currentMonth = monthNames[today.getMonth()];
    const currentYear = today.getFullYear();

    titleText.textContent = `${currentMonth} ${currentYear} Summary`;
}

renderCurrentMonth();