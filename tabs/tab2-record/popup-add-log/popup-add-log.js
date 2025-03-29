/* SIDE SCREEN - ADD A LOG */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

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
    click save button & add a log
*/
const saveButton = document.getElementById("save-button");
const logForm = document.getElementById("add-form");

saveButton.addEventListener("click", addTransaction);

function addTransaction(event) {
    event.preventDefault();

    if (!logForm.checkValidity()) {
        // (editing) -> 가장 첫번째 unfilled required field에 빨간색으로 표시 or popup?
        alert("Please fill in all required fields.");
        return;
    }

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

    // 사용자 입력 데이터로 json 포맷으로 만들기
    const newLog = {
        id: Date.now(), 
        amount: amountFinal,
        title: title,
        type: type,
        date: date,     // YYYY-MM-DD format
        method: method,
        category: category,
        notes: notes
    };

    /* 
        local storage: String
        localLogs: [] (Array<Object>)
        newLog: Object
        local storage 로그 리스트에 -> new log 추가하기 
     */
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    localLogs.push(newLog);
    localStorage.setItem("transactions", JSON.stringify(localLogs));

    // return to the prev page
    returnToPage();
}