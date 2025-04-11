/* MAIN - GOAL TAB */

// global variables
// 전역 변수
let currentTypeFilter = "All";

// initially render the goal tab
// 초기화
document.addEventListener("DOMContentLoaded", () => {
    const selectedType = sessionStorage.getItem("selectedType") || "All";
    loadDefaultData();
    bindButtons();
    setupToggle();
    setupFilterPopup();

    isFilterActive = !!sessionStorage.getItem("goalFilters"); 
    updateFilterUI(isFilterActive);
    if (isFilterActive) {
        applyTypeFilterToToggle(); 
    } else {
        syncToggleToSelectedType();
        renderGoals(selectedType);
    }
});

// save the default accounts data to local storage 
// (처음 페이지 방문했을 때, 없다면) default goals -> local 
if (!localStorage.getItem("goals")) {
    localStorage.setItem("goals", JSON.stringify(defaultGoals));
}

// collection of buttons
// 버튼 모음
function bindButtons() {
    const addButton = document.getElementById("add");
    const searchButton = document.getElementById("search");

    addButton.addEventListener("click", () => {
        window.location.href = "./popup-add-goal/popup-add-goal.html";
    });

    searchButton.addEventListener("click", () => {
        window.location.href = "./popup-search-goal/popup-search-goal.html";
    });
}

// All/Budget/Saving toggle buttons
// All/Budget/Saving 토글 버튼
function setupToggle() {
    const toggleButton = document.getElementById("dropdown-toggle");
    const toggleIcon = document.getElementById("dropdown-icon");
    const dropdown = document.getElementById("dropdown-list");
    const selectedText = document.getElementById("dropdown-selected");

    toggleButton.addEventListener("click", () => {
        dropdown.classList.toggle("active");
        toggleIcon.src = dropdown.classList.contains("active")
                        ? "../../assets/Arrow-up.png"
                        : "../../assets/Arrow-down.png";
    });

    const options = document.querySelectorAll(".dropdown-option");
    options.forEach(option => {
        option.addEventListener("click", () => {
            // text + arrow direction
            // 텍스트 + 화살표 버튼 방향
            currentTypeFilter = option.dataset.id;
            selectedText.textContent = currentTypeFilter;
            dropdown.classList.remove("active");
            toggleIcon.src = "../../assets/Arrow-down.png";

            // selected button color
            // 선택된 버튼 하나만 테두리 색상 바꾸기
            options.forEach(option => {
                option.classList.remove("selected");
            });
            option.classList.add("selected");

            // conditional rendering
            // 조건부 리스트 렌더링
            renderGoals(currentTypeFilter);
        });
    });
}

// rendering goal lists 
// 목표 리스트 렌더링
function renderGoals(selectedType = "All") {
    const budgetDiv = document.getElementById("budget-container");
    const savingDiv = document.getElementById("saving-container");
    budgetDiv.innerHTML = "";
    savingDiv.innerHTML = "";

    // apply filter if "localGoals" exists
    // 필터 조건 세션에 있으면 -> 필터 적용해서 localGoals 필터링
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    if (sessionStorage.getItem("goalFilters")) {
        localGoals = applyFilters(localGoals);
    }
    
    const budgetGoals = [];
    const savingGoals = [];
    localGoals.forEach(goal => {
        const type = goal.type;
        if (type === "Budget") {
            budgetGoals.push(goal);
        } else if (type === "Saving") {
            savingGoals.push(goal);
        } 
    });

    if (selectedType === "All") {
        addBudgetCard(budgetGoals, budgetDiv);
        addSavingCard(savingGoals, savingDiv);
        sessionStorage.setItem("selectedType", "All");
    } else if (selectedType === "Budget") {
        addBudgetCard(budgetGoals, budgetDiv);
        sessionStorage.setItem("selectedType", "Budget");
    } else if (selectedType === "Saving") {
        addSavingCard(savingGoals, savingDiv);
        sessionStorage.setItem("selectedType", "Saving");
    }

    // edit buttons for each card
    // 모든 카드의 수정 버튼 이벤트 활성화
    const editButtons = document.querySelectorAll(".edit-button");
    for (const button of editButtons) {
        button.addEventListener("click", navigateToEdit);
    }

    // delete buttons for each card
    // 모든 카드의 삭제 버튼 이벤트 활성화
    const deleteButtons = document.querySelectorAll(".delete-button");
    for (const button of deleteButtons) {
        button.addEventListener("click", activeDeletePopup);
    }
};

// add each budget goal card
// budget goal 카드 추가 (html element)
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

// add each saving goal card
// budget goal 카드 추가 (html element)
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

// edit 버튼 이벤트
// event for edit buttons
function navigateToEdit(event) {
    const card = event.target.closest(".budget-card") || 
                 event.target.closest(".saving-card");
    const goalId = card.dataset.id;

    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    
    // find a matching goal in localGoals (with id) -> session 
    // id와 매칭되는 목표 한 개 찾기 -> 세션에 저장
    const editingGoal = localGoals.find((goal) => (goal.id).toString() === goalId);
    sessionStorage.setItem("editingGoal", JSON.stringify(editingGoal));
    window.location.href = "./popup-edit-goal/popup-edit-goal.html";
}

// delete popup
// 삭제 팝업
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

        let typeMatch = true;
        if (type === "Budget") {
            typeMatch = goal.type === "Budget";
        } else if (type === "Saving") {
            typeMatch = goal.type === "Saving";
        }

        if (!typeMatch) return false;

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
    renderGoals(currentTypeFilter);
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

function applyTypeFilterToToggle() {
    const filters = JSON.parse(sessionStorage.getItem("goalFilters"));
    if (!filters || !filters.type) return;
  
    const selectedType = filters.type; 
    const toggleOptions = document.querySelectorAll(".dropdown-option");
    const selectedText = document.getElementById("dropdown-selected");
  
    toggleOptions.forEach(option => {
        option.classList.remove("selected");
        if (option.dataset.id === selectedType) {
            option.classList.add("selected");
            selectedText.textContent = option.dataset.id;
        }
    });
  
    renderGoals(selectedType);
}

function syncToggleToSelectedType() {
    const selectedType = sessionStorage.getItem("selectedType") || "all";
    const toggleOptions = document.querySelectorAll(".dropdown-option");
    const selectedText = document.getElementById("dropdown-selected");
  
    selectedText.textContent = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
  
    toggleOptions.forEach(option => {
        option.classList.remove("selected");
        if (option.dataset.id === selectedText.textContent) {
            option.classList.add("selected");
        }
    });
  
    currentTypeFilter = selectedType;
}

/* util variables & functions */
// compute the used/saved percentage
// 퍼센트 계산
function computePercentage(goal) {
    const currentAmount = goal.type === "Budget" ? goal.usedAmount : goal.savedAmount;
    const goalAmount = goal.goalAmount;

    if (goalAmount > 0 && currentAmount != null) {
        if (goal.type === "Budget") {
            return Math.floor((currentAmount / goalAmount) * 100)
        } else if (goal.type === "Saving") {
            return Math.min(100, Math.floor((currentAmount / goalAmount) * 100))
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