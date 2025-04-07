/* SIDE SCREEN - EDIT A LOG */

/* 
    click x button to go back to detail page
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", () => {
    window.location.href = "../popup-detail-log/popup-detail-log.html";
});

/* 
    income/expense type button selector
*/
const typeButtons = document.querySelectorAll(".type-button");
for (const button of typeButtons) {
    button.addEventListener("click", clickTypeButton);
}

function clickTypeButton(event) {
    for (const button of typeButtons) {
        button.classList.remove("selected");
    }

    event.target.classList.add("selected");
    document.getElementById("type-value").value = event.target.textContent;
}

/*
    click save button & edit an log
*/
const saveButton = document.getElementById("save-button");
const logForm = document.getElementById("log-edit-form");
saveButton.addEventListener("click", editLog);

function editLog(event) {
    event.preventDefault();

    if (!logForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // 수정할 데이터 가져오기 (sessionStorage)
    const log = JSON.parse(sessionStorage.getItem("editingLog")) || null;

    // 사용자가 입력한 데이터 가져오기
    const amount = document.getElementById("amount-field").value;
    const title = document.getElementById("title-field").value;
    const type = document.getElementById("type-value").value;
    const date = document.getElementById("date-field").value;
    const method = document.getElementById("method-select").value;
    const category = document.getElementById("category-select").value;
    const notes = document.getElementById("notes-field").value;

    // type 에 따라 +/- 부호 붙이기
    const amountNum = parseFloat(amount);
    const amountFinal = (type === "EXPENSE") ? -Math.abs(amountNum) : Math.abs(amountNum);

    const updated = {
        id: log.id, 
        amount: amountFinal,
        title: title,
        type: type,
        date: date,
        method: method,
        category: [category],
        notes: notes
    };

    // 기존 데이터와 업데이트 값 비교해서 수정
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    localLogs = localAccounts.map((lg) => {
        if (lg.id === updated.id) {
            return updated;
        } else {
            return lg;
        }
    });

    localStorage.setItem("transactions", JSON.stringify(localLogs));

    // 수정하고 나면 다시 detail 페이지로 돌아가기
    window.location.href = "../popup-detail-log/popup-detail-log.html"; 
}

/*
    render existing log info to the fields
*/
function renderAccountInfo() {
    // 수정할 데이터 가져오기 (sessionStorage)
    const log = JSON.parse(sessionStorage.getItem("editingLog")) || null;

    // 필드에 미리 채우기
    if (log) {
        document.getElementById("amount-field").value = `${Math.abs(log.amount).toLocaleString()}`;
        document.getElementById("title-field").value = log.title;
        document.getElementById("type-value").value = log.type;
        document.getElementById("date-field").value = log.date;
        document.getElementById("method-select").value = log.method;
        document.getElementById("category-select").value = log.category;
        document.getElementById("notes-field").value = log.notes;

        if (log.type === "EXPENSE") {
            document.getElementById("expense-button").classList.add("selected");
        } else if (log.type === "INCOME") {
            document.getElementById("income-button").classList.add("selected");
        }
    }
}

renderAccountInfo();