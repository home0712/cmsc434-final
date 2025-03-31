/* MAIN - GOAL TAB */

/* 
    click the icon to add
*/
const addButton = document.getElementById("header-button");
addButton.addEventListener("click", navigateToAddPage);

function navigateToAddPage() {
    window.location.href = "./popup-add-goal/popup-add-goal.html";
}

// save the default accounts data to local storage (처음 페이지 1회 방문했을 때만)
if (!localStorage.getItem("goals")) {
    localStorage.setItem("goals", JSON.stringify(defaultGoals));
}

/*
    rendering the goal lists
*/
function renderGoals() {
    const budgetGoals = [];
    const savingGoals = [];

    const budgetDiv = document.getElementById("budget-container");
    budgetDiv.innerHTML = "";

    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    localGoals.forEach(goal => {
        const type = goal.type?.toLowerCase();

        if (type === "budget") {
            budgetGoals.push(goal);
        } else if (type === "saving") {
            savingGoals.push(goal);
        } 
    });

    addGoalCard(budgetGoals, budgetDiv);
};

/* 
    add goal div cards
*/
function addGoalCard(goalLists, parentDiv) {
    for (const goal of goalLists) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "budget-card";
        groupDiv.dataset.id = `${goal.id}`;

        const goalCard = `
            <div class="budget-header">
                <div class="budget-title">
                    ${goal.title} 
                </div>
                <div class="budget-icons">
                    <img src="../../assets/Edit.png" class="edit-button">
                    <img src="../../assets/Trash.png" class="delete-button">
                </div>
            </div>

            <div class="budget-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${goal.percent}%;"></div>
                    <span class="progress-percent">${goal.percent}%</span>
                </div>
                <div class="progress-text">
                    <span class="used-amount">$200</span>
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
    compute the used/saved percentage
*/

/*
    compute the total used/saved amount based on the data
*/


/* util variables */
const monthNames = [
    "Jan", 
    "Feb", 
    "Mar", 
    "Apr", 
    "May", 
    "Jun",
    "Jul", 
    "Aug", 
    "Sep", 
    "Oct", 
    "Nov", 
    "Dec"
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

renderGoals();

/*
    navigate to the edit page
    with an account info to edit (sessionStorage)
*/
const editButtons = document.querySelectorAll(".edit-button");
for (const button of editButtons) {
    button.addEventListener("click", navigateToEditPage);
}

function navigateToEditPage(event) {
    const card = event.target.closest(".budget-card");
    const goalId = card.dataset.id;

    // default + local data
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    
    // 해당 id를 가진 데이터 찾아서 보내기
    const editingGoal = localGoals.find((goal) => goal.id === goalId);
    sessionStorage.setItem("editingGoal", JSON.stringify(editingGoal));

    window.location.href = "./popup-edit-goal/popup-edit-goal.html";
}