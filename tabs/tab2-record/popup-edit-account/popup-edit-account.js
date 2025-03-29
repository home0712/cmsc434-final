/* EDIT AN ACCOUNT */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

function returnToPage() {
    window.location.href = "../accounts/accounts.html";
}

/*
    click save button & edit an account
*/
const saveButton = document.getElementById("save-button");
const accountForm = document.getElementById("account-edit-form");
saveButton.addEventListener("click", editAccount);

function editAccount(event) {
    event.preventDefault();

    if (!accountForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // 수정할 데이터 가져오기 (sessionStorage)
    const account = JSON.parse(sessionStorage.getItem("editingAccount")) || null;

    // 사용자가 입력한 데이터 가져오기
    const accountName = document.getElementById("account-name-field").value;
    const balance = document.getElementById("balance-field").value;
    const type = document.getElementById("type-select").value;
    const accountNum = document.getElementById("account-number-field").value;
    const bank = document.getElementById("bank-name-field").value;
    const notes = document.getElementById("notes-field").value;

    const updated = {
        id: account.id, 
        name: accountName,
        balance: Number(balance),
        type: type,
        number: accountNum,
        bank: bank,
        notes: notes
    };

    // 기존 데이터와 업데이트 값 비교해서 수정
    let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    localAccounts = localAccounts.map((acc) => {
        if (acc.id === updated.id) {
            return updated;
        } else {
            return acc;
        }
    });

    localStorage.setItem("accounts", JSON.stringify(localAccounts));

    // 추가하고 나면 다시 accounts 페이지로 돌아가기
    window.location.href = "../accounts/accounts.html"; 
}

/*
    render existing account info to the fields
*/
function renderAccountInfo() {
    // 수정할 데이터 가져오기 (sessionStorage)
    const account = JSON.parse(sessionStorage.getItem("editingAccount")) || null;

    // 필드에 미리 채우기
    if (account) {
        document.getElementById("account-name-field").value = account.name;
        document.getElementById("balance-field").value = account.balance.toFixed(2);
        document.getElementById("type-select").value = account.type;
        document.getElementById("account-number-field").value = account.number;
        document.getElementById("bank-name-field").value = account.bank;
        document.getElementById("notes-field").value = account.notes;
    }
}

renderAccountInfo();