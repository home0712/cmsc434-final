/* MAIN - GOAL TAB */

// initially render the goal tab
document.addEventListener("DOMContentLoaded", () => {
    const selectedType = sessionStorage.getItem("selectedType") || "all";
    bindButtons();
    setupToggle();
    setupFilterPopup();

    isFilterActive = !!sessionStorage.getItem("goalFilters"); 
    updateFilterUI(isFilterActive);
    renderGoals(selectedType);
});

// buttons
function bindButtons() {
    const addButton = document.getElementById("header-button");
    const searchButton = document.getElementById("search");

    addButton.addEventListener("click", () => {
        window.location.href = "./popup-add-goal/popup-add-goal.html";
    });

    searchButton.addEventListener("click", () => {
        window.location.href = "./popup-search-goal/popup-search-goal.html";
    });
}

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("goals")) {
    localStorage.setItem("goals", JSON.stringify(defaultGoals));
}

// active a popup to delete
function activeDeletePopup(event) {
    const card = event.target.closest(".budget-card") || 
                 event.target.closest(".saving-card");
    const popup = card.querySelector(".delete-popup");

    popup.classList.remove("hidden");

    const confirmButton = popup.querySelector(".confirm-delete");
    const cancelButton = popup.querySelector(".cancel-delete");

    confirmButton.addEventListener("click", () => {
        const goalId = card.dataset.id;
        let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
        localGoals = localGoals.filter(goal => goal.id !== goalId);
        localStorage.setItem("goals", JSON.stringify(localGoals));

        const selectedType = sessionStorage.getItem("selectedType") || "all";
        renderGoals(selectedType);
    });

    cancelButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
}

let currentTypeFilter = "All";
function setupToggle() {
    const toggleButton = document.getElementById("dropdown-toggle");
    const toggleIcon = document.getElementById("dropdown-icon");
    const dropdown = document.getElementById("dropdown-list");
    const selectedText = document.getElementById("dropdown-selected");

    toggleButton.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
        toggleIcon.src = dropdown.classList.contains("hidden")
          ? "../../../assets/Arrow-up.png"
          : "../../../assets/Arrow-down.png";
    });

    const options = document.querySelectorAll(".dropdown-option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            currentTypeFilter = option.dataset.id;
            selectedText.textContent = currentTypeFilter;
            dropdown.classList.add("hidden");

            options.forEach(option => {
                option.classList.remove("selected");
            });
            option.classList.add("selected");

            renderGoals(currentTypeFilter.toLowerCase());
        });
    });
}

// rendering the goal lists
function renderGoals(selectedType = "all") {
    const budgetGoals = [];
    const savingGoals = [];

    const budgetDiv = document.getElementById("budget-container");
    budgetDiv.innerHTML = "";

    const savingDiv = document.getElementById("saving-container");
    savingDiv.innerHTML = "";

    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    localGoals = applyFilters(localGoals);
    localGoals.forEach(goal => {
        const type = goal.type?.toLowerCase();

        if (type === "budget") {
            budgetGoals.push(goal);
        } else if (type === "saving") {
            savingGoals.push(goal);
        } 
    });

    if (selectedType === "all") {
        addBudgetCard(budgetGoals, budgetDiv);
        addSavingCard(savingGoals, savingDiv);
        sessionStorage.setItem("selectedType", "all");
    } else if (selectedType === "budget") {
        addBudgetCard(budgetGoals, budgetDiv);
        sessionStorage.setItem("selectedType", "budget");
    } else if (selectedType === "saving") {
        addSavingCard(savingGoals, savingDiv);
        sessionStorage.setItem("selectedType", "saving");
    }

    // add event to the edit buttons
    const editButtons = document.querySelectorAll(".edit-button");
    for (const button of editButtons) {
        button.addEventListener("click", navigateToEditPage);
    }

    const deleteButtons = document.querySelectorAll(".delete-button");
    for (const button of deleteButtons) {
        button.addEventListener("click", activeDeletePopup);
    }
};

// add budget goal div cards
function addBudgetCard(budgetLists, parentDiv) {
    for (const goal of budgetLists) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "budget-card";
        groupDiv.dataset.id = `${goal.id}`;

        const percent = computePercentage(goal);

        const goalCard = `
            <div class="budget-header">
                <div class="budget-title">
                    ${goal.title} 
                    ${getStatusIcon(goal.type, percent)}
                </div>
                <div class="budget-icons">
                    <img src="../../assets/Edit.png" class="edit-button">
                    <img src="../../assets/Trash.png" class="delete-button">
                </div>
            </div>

            <div class="delete-popup hidden">
                <img src="../../assets/Alert-circle.png" class="alert"> 
                <div class="delete-text">Delete this goal?</div>
                <div class="delete-buttons">
                    <button class="cancel-delete">Cancel</button>
                    <button class="confirm-delete">Delete</button>
                </div>
            </div>

            <div class="budget-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;"></div>
                    <span class="progress-percent">${percent}%</span>
                </div>
                <div class="progress-text">
                    <span class="used-amount">$${goal.usedAmount}</span>
                    <span class="used-text">USED</span>
                    <span class="out-of">OUT OF</span>
                    <span class="goal-amount">$${goal.goalAmount}</span>
                </div>
            </div>

            <div class="budget-date">
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
        groupDiv.innerHTML += goalCard;
        parentDiv.appendChild(groupDiv);
    }
};

// add saving goal div cards
function addSavingCard(savingLists, parentDiv) {
    for (const goal of savingLists) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "saving-card";
        groupDiv.dataset.id = `${goal.id}`;

        const percent = computePercentage(goal);

        const goalCard = `
            <div class="saving-header">
                <div class="saving-title">
                    ${goal.title} 
                    ${getStatusIcon(goal.type, percent)}
                </div>
                <div class="saving-icons">
                    <img src="../../assets/Edit.png" class="edit-button">
                    <img src="../../assets/Trash.png" class="delete-button">
                </div>
            </div>

            <div class="delete-popup hidden">
                <img src="../../assets/Alert-circle.png" class="alert"> 
                <div class="delete-text">Delete this goal?</div>
                <div class="delete-buttons">
                    <button class="cancel-delete">Cancel</button>
                    <button class="confirm-delete">Delete</button>
                </div>
            </div>

            <div class="saving-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;"></div>
                    <span class="progress-percent">${percent}%</span>
                </div>
                <div class="progress-text">
                    <span class="used-amount">$${goal.savedAmount}</span>
                    <span class="used-text">SAVED</span>
                    <span class="out-of">OUT OF</span>
                    <span class="goal-amount">$${goal.goalAmount}</span>
                </div>
            </div>

            <div class="saving-date">
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
        groupDiv.innerHTML += goalCard;
        parentDiv.appendChild(groupDiv);
    }
};

// apply the filters
function applyFilters(goals) {
    const filters = JSON.parse(sessionStorage.getItem("goalFilters"));
    if (!filters) {
        return goals; 
    }

    return goals.filter((goal) => {
        const {
            type,
            status,
            minGoalAmount,
            maxGoalAmount,
            minProgress,
            maxProgress,
            startDate,
            endDate,    
        } = filters;

        const goalAmount = goal.goalAmount;
        const progressAmount = goal.type === "Budget" ? goal.usedAmount : goal.savedAmount;

        if (minGoalAmount != null && goalAmount < minGoalAmount) return false;
        if (maxGoalAmount != null && goalAmount > maxGoalAmount) return false;

        if (minProgress != null && progressAmount < minProgress) return false;
        if (maxProgress != null && progressAmount > maxProgress) return false;

        if (startDate && goal.startDate < startDate) return false;
        if (endDate && goal.endDate > endDate) return false;

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
      
        if (!statusMatch) return false;

        return true;
    });
}

// filtering functions 
let isFilterActive = !!sessionStorage.getItem("goalFilters");
function updateFilterUI(isActive) {
    const filterButton = document.getElementById("filter");
    if (isActive) {
        filterButton.classList.add("active"); 
    } else {
        filterButton.classList.remove("active"); 
    }
}

function clearGoalFilters() {
    sessionStorage.removeItem("goalFilters");
    isFilterActive = false;
    updateFilterUI(false);
    renderGoals(currentTypeFilter.toLowerCase());
}

function setupFilterPopup() {
    const filterButton = document.getElementById("filter");
    const popup = document.getElementById("clear-filter-popup");
    const confirmButton = document.getElementById("confirm-clear-filter");
    const cancelButton = document.getElementById("cancel-clear-filter");
  
    filterButton.addEventListener("click", () => {
      if (isFilterActive) {
        popup.classList.remove("hidden"); 
      } else {
        window.location.href = "./popup-filter-goal/popup-filter-goal.html"; 
      }
    });
  
    confirmButton.addEventListener("click", () => {
      clearGoalFilters();
      popup.classList.add("hidden");
    });

    cancelButton.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
}

/* util variables & functions */
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

/*
    add icon when
    - budget goal is exceeded
    - saving goal is completed
*/
function getStatusIcon(type, percent) {
    if (type === "Budget" && percent >= 100) {
        return '<img src="../../assets/Warning.png" class="status-icon" alt="Exceeded">';
    } else if (type === "Saving" && percent >= 100) {
        return '<img src="../../assets/Checked.png" class="status-icon" alt="Completed">';
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


/*
    navigate to the edit page
    with an account info to edit (sessionStorage)
*/
function navigateToEditPage(event) {
    const card = event.target.closest(".budget-card") || event.target.closest(".saving-card");
    const goalId = card.dataset.id;

    // default + local data
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    
    // 해당 id를 가진 데이터 찾아서 보내기
    const editingGoal = localGoals.find((goal) => goal.id === goalId);
    sessionStorage.setItem("editingGoal", JSON.stringify(editingGoal));

    window.location.href = "./popup-edit-goal/popup-edit-goal.html";
}