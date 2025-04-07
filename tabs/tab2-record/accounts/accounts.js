/* MAIN - ACCOUNT TAB */

// initially render the account tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "account");
    const addButton = document.getElementById("header-button");
    addButton.addEventListener("click", () => {
        window.location.href = "../popup-add-account/popup-add-account.html";
    });

    renderAccounts();
});

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("accounts")) {
    localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
}

// render accounts 
function renderAccounts() {
    const checkingAccounts = [];
    const savingAccounts = [];
    const investAccounts = [];

    // accounts data
    let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    localAccounts.forEach(account => {
        const type = account.type?.toLowerCase();

        if (type === "checking") {
            checkingAccounts.push(account);
        } else if (type === "saving") {
            savingAccounts.push(account);
        } else if (type === "investment") {
            investAccounts.push(account);
        }
    });

    const checkingDiv = document.getElementById("checking");
    const savingDiv = document.getElementById("savings");
    const investmentDiv = document.getElementById("investments");

    checkingDiv.innerHTML = "<h2>Checkings</h2>";
    savingDiv.innerHTML = "<h2>Savings</h2>";
    investmentDiv.innerHTML = "<h2>Investments</h2>";

    // (editing) 정렬은 어떤 순서로? sorting?

    // checking
    addAccountCard(checkingAccounts, checkingDiv);

    // savings
    addAccountCard(savingAccounts, savingDiv);
    
    // investments
    addAccountCard(investAccounts, investmentDiv);

    const editButtons = document.querySelectorAll(".edit-button");
    for (const button of editButtons) {
        button.addEventListener("click", navigateToEditPage);
    }

    const deleteButtons = document.querySelectorAll(".delete-button");
    for (const button of deleteButtons) {
        button.addEventListener("click", activeDeletePopup);
    }

    const subtractBalanceButtons = document.querySelectorAll(".decrease");
    const addBalanceButtons = document.querySelectorAll(".increase");
    for (const button of subtractBalanceButtons) {
        button.addEventListener("click", (event) => adjustPopup(event, "subtract"));
    }
    
    for (const button of addBalanceButtons) {
        button.addEventListener("click", (event) => adjustPopup(event, "add"));
    }
}

// add account cards (html) to the container
function addAccountCard(accountLists, parentDiv) {
    // accounts 없을 때
    if (accountLists.length == 0) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "no-data";
        groupDiv.textContent = "No Data Existed";
        parentDiv.appendChild(groupDiv);
    }

    for (const acc of accountLists) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "account-card";
        groupDiv.dataset.id = `${acc.id}`;
        
        const accountCard = `
            <div class="account-header">
                <span class="account-title">
                    ${acc.name} 
                    <span class="account-num"> 
                        (...${(acc.number).slice(-4)}) 
                    </span>
                </span>
                <img src="../../../assets/Edit.png" class="edit-button">
            </div>

            <div class="balance-row">
                <img src="../../../assets/Subtract.png" class="balance-button decrease">
                <div class="account-balance">
                    $${acc.balance.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
                <img src="../../../assets/Add.png" class="balance-button increase">
            </div>

            <div class="adjust-popup hidden">
                <div class="adjust-text">
                    How much to 
                    <span class="mode-text">add</span>
                    ?
                </div>
                <input type="number" class="adjust-input" step="0.01" placeholder="0.00"/>
                <div class="adjust-buttons">
                    <button class="cancel-adjust">Cancel</button>
                    <button class="confirm-adjust">Confirm</button>
                </div>
            </div>
            
            <div class="account-footer">
                <img src="../../../assets/Trash.png" class="delete-button">
            </div>

            <div class="delete-popup hidden">
                <img src="../../../assets/Alert-circle.png" class="alert"> 
                <div class="delete-text">Delete this account?</div>
                <div class="delete-buttons">
                    <button class="cancel-delete">Cancel</button>
                    <button class="confirm-delete">Delete</button>
                </div>
            </div>
        `;
        groupDiv.innerHTML += accountCard;
        parentDiv.appendChild(groupDiv);
    }
}

// to the editing page
function navigateToEditPage(event) {
    const card = event.target.closest(".account-card");
    const accountId = card.dataset.id;

    // default + local data
    let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];
    
    // 해당 id를 가진 데이터 찾아서 보내기
    const editingAccount = localAccounts.find((account) => account.id === accountId);
    sessionStorage.setItem("editingAccount", JSON.stringify(editingAccount));

    window.location.href = "../popup-edit-account/popup-edit-account.html";
}

// open adjusting popup
function adjustPopup(event, mode) {
    const card = event.target.closest(".account-card");
    const popup = card.querySelector(".adjust-popup");
    const modeText = popup.querySelector(".mode-text");
    const input = popup.querySelector(".adjust-input");

    popup.dataset.mode = mode;
    modeText.textContent = mode === "add" ? "add" : "subtract";
    input.value = ""; 
    popup.classList.remove("hidden");
}

// decrease/increase balance
function adjustBalance(card, mode, value) {
    const accountId = card.dataset.id;
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
    const target = accounts.find(acc => acc.id === accountId);

    if (!target) return;

    if (mode === "add") {
        target.balance += value;
    } else if (mode === "subtract") {
        target.balance -= value;
    }

    localStorage.setItem("accounts", JSON.stringify(accounts));
    renderAccounts();
}

const accountsContainer = document.getElementById("account-container");
accountsContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".account-card");
    const popup = card.querySelector(".adjust-popup");
    const input = popup.querySelector(".adjust-input");
    const value = parseFloat(input.value);
    const mode = popup.dataset.mode;

    if (event.target.classList.contains("confirm-adjust")) {
        if (isNaN(value)) {
            alert("Invalid amount"); // 
            return;
        }
        adjustBalance(card, mode, value);
    }

    if (event.target.classList.contains("cancel-adjust")) {
        popup.classList.add("hidden");
    }
});

// active a popup to delete
function activeDeletePopup(event) {
    const card = event.target.closest(".account-card");
    const popup = card.querySelector(".delete-popup");

    popup.classList.remove("hidden");

    const confirmButton = popup.querySelector(".confirm-delete");
    const cancelButton = popup.querySelector(".cancel-delete");

    confirmButton.addEventListener("click", () => {
        const accountId = card.dataset.id;
        let localAccouts = JSON.parse(localStorage.getItem("accounts")) || [];
        localAccouts = localAccouts.filter(acc => acc.id !== accountId);
        localStorage.setItem("accounts", JSON.stringify(localAccouts));

        renderAccounts();
    });

    cancelButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
}