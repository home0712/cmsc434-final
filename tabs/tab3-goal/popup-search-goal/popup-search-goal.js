/* SIDE SCREEN - SEARCH GOALS */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setupStatusOptionsByGoalType();
    toggleOption();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const searchForm = document.getElementById("search-form");
    const searchButton = document.getElementById("search-button");
    const keywordInput = document.getElementById("keyword-input");

    closeButton.addEventListener("click", () => {
      window.location.href = "../goal.html";
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
    const minAmount = parseFloat(document.getElementById("amount-min").value);
    const maxAmount = parseFloat(document.getElementById("amount-max").value);
    const startDate = document.getElementById("date-start").value;
    const endDate = document.getElementById("date-end").value;
    const type = document.getElementById("type-select").value;
    const status = document.getElementById("status-select").value;
    const minProgress = parseFloat(document.getElementById("min-progress").value);
    const maxProgress = parseFloat(document.getElementById("max-progress").value);

    // no keyword entered
    if (!keyword) {
      showKeywordError();
      return;
    }

    clearKeywordError();
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];

    const result = localGoals.filter(goal => {
        const keywordMatch =
          keyword === "" ||
          (goal.title?.toLowerCase().includes(keyword)) || 
          (goal.notes?.toLowerCase().includes(keyword));

        const amountMatch =
          (isNaN(minAmount) || goal.amount >= minAmount) &&
          (isNaN(maxAmount) || goal.amount <= maxAmount);

        const dateMatch =
          (startDate === "" || goal.date >= startDate) &&
          (endDate === "" || goal.date <= endDate);

        const typeMatch = type === "All" || goal.type === type;
        const progressAmount = goal.type === "Budget" ? goal.usedAmount : goal.savedAmount;

        const progressMatch =
          (isNaN(minProgress) || progressAmount >= minProgress) &&
          (isNaN(maxProgress) || progressAmount <= maxProgress);

        let statusMatch = true;
        if (status === "Completed") {
            statusMatch = goal.type === "Saving" && goal.savedAmount >= goal.goalAmount;
        } else if (status === "Exceeded") {
            statusMatch = goal.type === "Budget" && goal.usedAmount >= goal.goalAmount;
        } else if (status === "Inprogress") {
            const isDone = goal.type === "Saving" 
            ? goal.savedAmount >= goal.goalAmount
            : goal.usedAmount >= goal.goalAmount;
            statusMatch = !isDone;
        } else if (status === "ExceededCompleted") {
            if (goal.type === "Saving") {
                statusMatch = goal.savedAmount >= goal.goalAmount;
            } else if (goal.type === "Budget") {
                statusMatch = goal.usedAmount >= goal.goalAmount;
            }
        }

      return (
          keywordMatch &&
          amountMatch &&
          dateMatch &&
          typeMatch &&
          progressMatch &&
          statusMatch);
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

function renderSearchResults(goals) {
    const container = document.getElementById("search-results");
    container.innerHTML = "";

    // nothing searched 
    if (goals.length === 0) {
      container.innerHTML = `<p class="no-result">No results found.</p>`;
      return;
    }

    goals.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    for (const goal of goals) {
        const percent = computePercentage(goal);

        const card = document.createElement("div");
        card.className = goal.type === "Budget" ? "budget-card" : "saving-card";
        card.dataset.id = goal.id;

        card.innerHTML = `
            <div class="${goal.type.toLowerCase()}-header">
                <div class="${goal.type.toLowerCase()}-title">
                    ${goal.title} 
                    ${getStatusIcon(goal.type, percent)}
                </div>
            </div>

            <div class="${goal.type.toLowerCase()}-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;"></div>
                    <span class="progress-percent">${percent}%</span>
                </div>
                <div class="progress-text">
                    <span class="used-amount">$${goal.type === "Budget" ? goal.usedAmount : goal.savedAmount}</span>
                    <span class="used-text">${goal.type === "Budget" ? "USED" : "SAVED"}</span>
                    <span class="out-of">OUT OF</span>
                    <span class="goal-amount">$${goal.goalAmount}</span>
                </div>
            </div>

            <div class="${goal.type.toLowerCase()}-date">
                <div class="date-row">
                    <span>START</span>
                    <span class="start-date">${getDateString(goal.startDate)}</span>
                </div>
                <div class="date-row">
                    <span>END</span>
                    <span class="end-date">${getDateString(goal.endDate)}</span>
                </div>
            </div>
        `;

        card.addEventListener("click", () => {
            sessionStorage.setItem("editingGoal", JSON.stringify(goal));
            window.location.href = "../popup-edit-goal/popup-edit-goal.html";
        });
      
        container.appendChild(card);
    }
}

// status selector option
function setupStatusOptionsByGoalType() {
    const goalTypeSelect = document.getElementById("type-select");
    const statusSelect = document.getElementById("status-select");

    goalTypeSelect.addEventListener("change", () => {
        const type = goalTypeSelect.value;
        statusSelect.innerHTML = "";

        if (type === "Budget") {
            statusSelect.innerHTML = `
                <option value="All">All</option>
                <option value="Exceeded">Exceeded</option>
                <option value="Inprogress">In Progress</option>
            `;
        } else if (type === "Saving") {
            statusSelect.innerHTML = `
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Inprogress">In Progress</option>
            `;
        } else {
            statusSelect.innerHTML = `
                <option value="ALL">All</option>
                <option value="ExceededCompleted">Exceeded/Completed</option>
                <option value="Inprogress">In Progress</option>
            `;
        }
    });
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


/* util functions */
// compute the used/saved percentage
function computePercentage(goal) {
  const amount = goal.type === "Budget" ? goal.usedAmount : goal.savedAmount;
  const goalAmount = goal.goalAmount;

  if (goalAmount > 0 && amount != null) {
      if (goal.type === "Budget") {
          return Math.floor((amount / goalAmount) * 100)
      } else if (goal.type === "Saving") {
          return Math.min(100, Math.floor((amount / goalAmount) * 100))
      }
  }

  if (goalAmount === 0) {
      return 0;
  }
}

function getStatusIcon(type, percent) {
  if (type === "Budget" && percent >= 100) {
      return '<img src="../../../assets/Warning.png" class="status-icon" alt="Exceeded">';
  } else if (type === "Saving" && percent >= 100) {
      return '<img src="../../../assets/Checked.png" class="status-icon" alt="Completed">';
  } else {
      return ''
  }
}

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function getDateString(goalDate) {
  const [year, month, day] = goalDate.split("-");
  const date = new Date(year, month - 1, day);
  const dateString = `
          ${monthNames[date.getMonth()]} 
          ${date.getDate()}${getOrdinal(date.getDate())} 
          ${date.getFullYear()} 
      `;

  return dateString;
};

function getOrdinal(day) {
  if (day > 3 && day < 21) {
      return "th";
  }

  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};