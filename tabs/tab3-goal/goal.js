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