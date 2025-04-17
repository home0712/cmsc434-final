/* ADD AN ACCOUNT */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    clearRequiredError();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveButton = document.getElementById("save-button");

    closeButton.addEventListener("click", () => {
        window.location.href = "../accounts/accounts.html";
    });

    saveButton.addEventListener("click", addAccount);
}

const accountForm = document.getElementById("account-add-form");
function addAccount(event) {
    event.preventDefault();

    if (!accountForm.checkValidity()) {
        showRequiredError();
        return;
    }

    clearRequiredError();

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
    sessionStorage.setItem("resultFor", type);
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

    id += Math.floor(Math.random() * 101).toString();
    return id;
}

// required field error
function showRequiredError() {
    const invalids = accountForm.querySelectorAll(":invalid");
    
    invalids.forEach(item => {
        item.classList.add("input-error");
    });
}

function clearRequiredError() {
    const inputs = accountForm.querySelectorAll("input, select, textarea");
    const eventList = ["input", "click", "focus"];

    inputs.forEach(field => {
        eventList.forEach(eventName => {
            field.addEventListener(eventName, () => {
                field.classList.remove("input-error");
            })
        });
    });
}