/* MANAGE CATEGORIES */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

/*
    return to previous page
*/
function returnToPage() {
    const returnPage = sessionStorage.getItem("returnTo");

    if (returnPage === "transaction") {
        window.location.href = "../../tab2-record/transaction/transaction.html";
    } else if (returnPage === "calendar") { 
        window.location.href = "../../tab2-record/calendar/calendar.html";
    } else if (returnPage === "category") {
        window.location.href = "../../tab4-report/category/category.html";
    }
}

// click save button & add an account
const saveButton = document.getElementById("save-button");
const accountForm = document.getElementById("account-add-form");

saveButton.addEventListener("click", addAccount);

function addAccount(event) {
    event.preventDefault();

    if (!accountForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // 사용자가 입력한 데이터 가져오기
    const accountName = document.getElementById("account-name-field").value;
    const balance = document.getElementById("balance-field").value;
    const type = document.getElementById("type-select").value;
    const accountNum = document.getElementById("account-number-field").value;
    const bank = document.getElementById("bank-name-field").value;
    const notes = document.getElementById("notes-field").value;

    // 사용자 입력 데이터로 json 포맷으로 만들기
    const newAccount = {
        id: createId(type), 
        name: accountName,
        balance: Number(balance),
        type: type,
        number: accountNum,
        bank: bank,
        notes: notes
    };

    // local storage 로그 리스트에 -> new log 추가하기
    let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    localAccounts.push(newAccount);
    localStorage.setItem("accounts", JSON.stringify(localAccounts));

    // 추가하고 나면 다시 accounts 페이지로 돌아가기
    window.location.href = "../accounts/accounts.html"; 
}

/* util functions */
function createId(type) {
    let id = "";
    if (type.toLowerCase() === "checking") {
        id += "ac-";
    } else if (type.toLowerCase() === "saving") {
        id += "as-";
    } else if (type.toLowerCase() === "investment") {
        id += "ai-";
    }

    id += Date.now().toString();
    return id;
}