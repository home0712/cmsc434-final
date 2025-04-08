/* MAIN - GOAL TAB */

// initially render the goal tab
document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.getElementById("header-button");
    addButton.addEventListener("click", () => {
        window.location.href = "./popup-add-goal/popup-add-goal.html";
    });

    const selectedType = sessionStorage.getItem("selectedType") || "all";
    renderGoals(selectedType);
    restoreToggleUI(selectedType);
});

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("goals")) {
    localStorage.setItem("goals", JSON.stringify(defaultGoals));
}

// restore the toggle 
function restoreToggleUI(selectedType) {
    const options = document.querySelectorAll(".dropdown-option");
    const selectedText = document.getElementById("dropdown-selected");

    for (const option of options) {
        option.classList.remove("selected");
        if (selectedType === option.dataset.id) {
            option.classList.add("selected");
        }
    }

    if (selectedType === "budget") {
        selectedText.textContent = "Budget";
    } else if (selectedType === "saving") {
        selectedText.textContent = "Saving";
    } else {
        selectedText.textContent = "All";
    }
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

// open/close toggle for all/budget/saving buttons
function activeToggle() {
    const toggle = document.getElementById("dropdown-toggle");
    const icon = document.getElementById("dropdown-icon");
    const dropdown = document.getElementById("dropdown-list");
    toggle.addEventListener("click", () => {
        dropdown.classList.toggle("active");
    
        if (dropdown.classList.contains("active")) { // to close
            icon.src = "../../assets/Arrow-up.png";
        } else { // to open
            icon.src = "../../assets/Arrow-down.png";
        } 
    });
}

// activate a button in toggle and render the matched list
function selectedToggle() {
    const options = document.querySelectorAll(".dropdown-option");
    const selectedText = document.getElementById("dropdown-selected");
    for (const option of options) {
        option.addEventListener("click", (event) => {
            for (const option of options) {
                option.classList.remove("selected");
            }
        
            event.target.classList.add("selected");
            selectedText.textContent = event.target.textContent;
        
            activeToggle();
        
            const selectedId = event.target.dataset.id;
            renderGoals(selectedId);
    });
}
}


/*
    rendering the goal lists
*/
function renderGoals(selectedType = "all") {
    const budgetGoals = [];
    const savingGoals = [];

    const budgetDiv = document.getElementById("budget-container");
    budgetDiv.innerHTML = "";

    const savingDiv = document.getElementById("saving-container");
    savingDiv.innerHTML = "";

    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
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

    activeToggle();
    selectedToggle();
};

/* 
    add budget goal div cards
*/
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

/* 
    add saving goal div cards
*/
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

/*
    compute the used/saved percentage
*/
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

/*
    compute the total used/saved amount based on the data
*/


/* util variables */
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