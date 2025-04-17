/* SIDE SCREEN - SEARCH accountS */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    toggleOption();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const searchButton = document.getElementById("search-button");
    const keywordInput = document.getElementById("keyword-input");

    closeButton.addEventListener("click", () => {
      window.location.href = "../accounts/accounts.html";
    });

    searchButton.addEventListener("click", () => {
        keywordSearch();   
    });

    keywordInput.addEventListener("input", () => {
        clearKeywordError();
    });

    keywordInput.addEventListener("focus", () => {
        clearKeywordError();
    });
}

function keywordSearch() {
  const keyword = document.getElementById("keyword-input").value.trim().toLowerCase();
  const minAmount = parseFloat(document.getElementById("min-balance").value);
  const maxAmount = parseFloat(document.getElementById("max-balance").value);
  const type = document.getElementById("type-select").value;

  // no keyword entered
  if (!keyword) {
    showKeywordError();
    return;
  }

  clearKeywordError();
  let localAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const result = localAccounts.filter(account => {
      const keywordMatch =
        keyword === "" ||
        (account.name?.toLowerCase().includes(keyword)) || 
        (account.notes?.toLowerCase().includes(keyword)) ||
        (account.bank?.toLowerCase().includes(keyword));

      let amountMatch = true;

      if (!isNaN(minAmount) && !isNaN(maxAmount)) {
        amountMatch = account.balance >= minAmount && account.balance <= maxAmount;
      } else if (isNaN(maxAmount) && !isNaN(minAmount)) {
        amountMatch = account.balance >= minAmount;
      } else if (isNaN(minAmount) && !isNaN(maxAmount)) {
        amountMatch = account.balance <= maxAmount;
      } 

      const typeMatch = type === "All" || account.type === type;

    return (
        keywordMatch &&
        amountMatch &&
        typeMatch );
  });

  document.getElementById("optional-search").classList.remove("open");
  document.getElementById("toggle-button").src = "../../../assets/Arrow-down.png";

  renderSearchResults(result);
}

function toggleOption() {
  const toggleButton = document.getElementById("toggle-button");
  const optionalBox = document.getElementById("optional-search");

  toggleButton.addEventListener("click", () => {
      optionalBox.classList.toggle("open");

      const isOpen = optionalBox.classList.contains("open");
      toggleButton.src = isOpen
        ? "../../../assets/Arrow-up.png"
        : "../../../assets/Arrow-down.png";
  });
}

function renderSearchResults(accounts) {
  const container = document.getElementById("account-container");
  container.innerHTML = "";

  // nothing searched 
  if (accounts.length === 0) {
    container.innerHTML = `<p class="no-result">No results found.</p>`;
    return;
  }

  accounts.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

  for (const account of accounts) {
      const groupDiv = document.createElement("div");
      groupDiv.className = "account-card";
      groupDiv.dataset.id = `${account.id}`;

      const balance = account.balance < 0 ? Math.abs(account.balance) : account.balance;

      const accountCard = `
          <div class="account-header">
                <span class="account-title">
                    ${account.name} 
                    <span class="account-num"> 
                        (...${(account.number).slice(-4)}) 
                    </span>
                </span>
                <img src="../../../assets/Edit.png" class="edit-button">
            </div>

            <div class="balance-row">
                <img src="../../../assets/Subtract.png" class="balance-button decrease">
                <div class="account-balance">
                    ${account.balance < 0 ? "-" : ""}
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
      container.appendChild(groupDiv);
  }

  const editButtons = document.querySelectorAll(".edit-button");
  editButtons.forEach(btn => btn.addEventListener("click", navigateToEditPage));

  const deleteButtons = document.querySelectorAll(".delete-button");
  deleteButtons.forEach(btn => btn.addEventListener("click", activeDeletePopup));

  document.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", e => adjustPopup(e, "subtract"))
  );

  document.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", e => adjustPopup(e, "add"))
  );
}

// 
function showKeywordError() {
  const errorMessage = document.getElementById("keyword-error");
  const keywordInput = document.getElementById("keyword-input");
  keywordInput.classList.add("input-error");

  if (!document.getElementById("keyword-error-content")) {
      const message = document.createElement("div");
      message.id = "keyword-error-content";
      message.className = "error-message";
      message.textContent = "Please enter a keyword";
      errorMessage.appendChild(message);
  }
}

function clearKeywordError() {
  const keywordInput = document.getElementById("keyword-input");
  const message = document.getElementById("keyword-error-content");

  keywordInput.classList.remove("input-error");
  if (message) {
      message.remove();
  }
}

//
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
  keywordSearch();
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

      keywordSearch();
  });

  cancelButton.addEventListener("click", () => {
      popup.classList.add("hidden");
  });
}