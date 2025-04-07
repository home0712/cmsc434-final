/* MAIN - ACCOUNT TAB */

/* 
    click the icon to add
*/
const addButton = document.getElementById("header-button");
addButton.addEventListener("click", navigateToAddPage);

function navigateToAddPage() {
    window.location.href = "../popup-add-account/popup-add-account.html";
}

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("accounts")) {
    localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
}

/* 
    render accounts 
*/
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
}

// initially load the account page 
renderAccounts();

/* 
    add account cards (html) to the container
*/
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

            <div class="account-balance">
                $${acc.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
            </div>
            
            <div class="account-footer">
                <img src="../../../assets/Trash.png" class="delete-button">
            </div>
        `;
        groupDiv.innerHTML += accountCard;
        parentDiv.appendChild(groupDiv);
    }
}

/*
    navigate to the edit page
    with an account info to edit (sessionStorage)
*/
const editButtons = document.querySelectorAll(".edit-button");
for (const button of editButtons) {
    button.addEventListener("click", navigateToEditPage);
}

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