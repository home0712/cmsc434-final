/* MAIN - ACCOUNT TAB */

let currentTypeFilter = "All";
let currentSearchTerm = "";
// initially render the account tab
document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("returnTo", "account");
    sessionStorage.setItem("returnAccountTo", "All");
    loadDefaultData();
    bindButtons();
    setupToggle();

    if (sessionStorage.getItem("resultFor")) {
        currentTypeFilter = sessionStorage.getItem("resultFor");
    }
    renderAccounts();
    sessionStorage.removeItem("resultFor");
});

function bindButtons() {
    const addButton = document.getElementById("header-button");
    const searchButton = document.getElementById("search");

    addButton.addEventListener("click", () => {
        window.location.href = "../popup-add-account/popup-add-account.html";
    });

    searchButton.addEventListener("click", () => {
        window.location.href = "../popup-search-account/popup-search-account.html";
    })
}

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("accounts")) {
    localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
}

// toggle
function setupToggle() {
    const toggleButton = document.getElementById("dropdown-toggle");
    const toggleIcon = document.getElementById("toggle-icon");
    const dropdown = document.getElementById("dropdown-list");
    const selectedText = document.getElementById("dropdown-selected");

    toggleButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
        toggleIcon.src = dropdown.classList.contains("hidden")
          ? "../../../assets/Arrow-down.png"
          : "../../../assets/Arrow-up.png";
    });

    const options = document.querySelectorAll(".dropdown-option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            currentTypeFilter = option.dataset.id;
            selectedText.textContent = currentTypeFilter;
            dropdown.classList.add("hidden");
            toggleIcon.src = "../../../assets/Arrow-down.png";
            sessionStorage.setItem("returnAccountTo", currentTypeFilter);

            options.forEach(option => {
                option.classList.remove("selected");
            });
            option.classList.add("selected");

            renderAccounts();
        });
    });
}

// render accounts 
function renderAccounts() {
    const checkingAccounts = [];
    const savingAccounts = [];
    const investAccounts = [];

    // accounts data
    let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

    localAccounts = localAccounts.filter(account => {
        const matchesType = currentTypeFilter === "All" || account.type === currentTypeFilter;
        const matchesSearch = currentSearchTerm === "" ||
                            account.name.toLowerCase().includes(currentSearchTerm) ||
                            account.bank.toLowerCase().includes(currentSearchTerm) ||
                            account.number.includes(currentSearchTerm);
        return matchesType && matchesSearch;
    });

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

    checkingDiv.innerHTML = "";
    savingDiv.innerHTML = "";
    investmentDiv.innerHTML = "";

    if (currentTypeFilter === "All" &&
        checkingAccounts.length === 0 &&
        savingAccounts.length === 0 &&
        investAccounts.length === 0) {
        const container = document.getElementById("account-container");
        container.innerHTML = `<div class="no-data">No Data Existed</div>`;
    }

    addAccountCard(checkingAccounts, checkingDiv, "Checking");
    addAccountCard(savingAccounts, savingDiv, "Saving");
    addAccountCard(investAccounts, investmentDiv, "Investment");

    const selectedText = document.getElementById("dropdown-selected");
    const options = document.querySelectorAll(".dropdown-option");
    selectedText.textContent = currentTypeFilter;
    options.forEach(option => {
        option.classList.remove("selected");

        if (option.dataset.id === currentTypeFilter) {
            option.classList.add("selected");
        }
    });
    


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

    updateVisibleSections();
}

// add account cards (html) to the container
function addAccountCard(accountLists, parentDiv, type) {
    if (accountLists.length === 0) {
        if (currentTypeFilter !== "All" && currentTypeFilter === type) {
            const groupDiv = document.createElement("div");
            groupDiv.className = "no-data";
            groupDiv.textContent = "No Data Found";
            parentDiv.appendChild(groupDiv);
        }
        return;
    }

    for (const acc of accountLists) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "account-card";
        groupDiv.dataset.id = `${acc.id}`;

        const balance = acc.balance < 0 ? Math.abs(acc.balance) : acc.balance;
        
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
                    ${acc.balance < 0 ? "-" : ""}
                    $${balance.toLocaleString(undefined, {
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
    if (card) {
      const popup = card.querySelector(".adjust-popup");
      const input = popup.querySelector(".adjust-input");
      const value = parseFloat(input.value);
      const mode = popup.dataset.mode;

      input.classList.remove("input-error");

      if (event.target.classList.contains("confirm-adjust")) {
          if (isNaN(value)) {
            input.classList.add("input-error"); 
            return;
          }
          adjustBalance(card, mode, value);
      }

      if (event.target.classList.contains("cancel-adjust")) {
          popup.classList.add("hidden");
      }
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

//
function updateVisibleSections() {
    const sections = {
      Checking: document.getElementById("section-checking"),
      Saving: document.getElementById("section-saving"),
      Investment: document.getElementById("section-investment")
    };
  
    if (currentTypeFilter === "All") {
      Object.values(sections).forEach(sec => sec.style.display = "block");
    } else {
      Object.entries(sections).forEach(([key, sec]) => {
        sec.style.display = key === currentTypeFilter ? "block" : "none";
      });
    }
}