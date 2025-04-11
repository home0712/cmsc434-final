/* SUB - EDIT A GOAL */

// initial
// 초기화
document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    renderGoalInfo();
    setupUserAmountByGoalType();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveButton = document.getElementById("save-button");

    closeButton.addEventListener("click", () => {
        window.location.href = "../goal.html";
    });

    saveButton.addEventListener("click", editGoal);
}


const goalForm = document.getElementById("goal-edit-form");
function editGoal(event) {
    event.preventDefault();

    if (!goalForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // get "editingGoal" from the goal tab
    // 클릭한 editingGoal 데이터 세션에서 가져옴
    const selectedGoal = JSON.parse(sessionStorage.getItem("editingGoal")) || null;

    // user inputs (want to edit)
    // 사용자가 입력한 데이터 가져오기
    const goalTitle =  document.getElementById("goal-name-field").value;
    const type = document.getElementById("type-select").value;
    const goalAmount = document.getElementById("goal-amount-field").value;
    const currentAmount = document.getElementById("current-amount-field").value;
    const startDate = document.getElementById("start-date-field").value;
    const endDate = document.getElementById("end-date-field").value;
    const notes = document.getElementById("notes-field").value;

    // create JSON Object with user inputs
    // 사용자 입력 데이터로 json object 만들기
    const updatedGoal = {
        id: selectedGoal.id, 
        title: goalTitle,
        type: type,
        goalAmount: Number(goalAmount) || 0,
        startDate: startDate,
        endDate: endDate,
        notes: notes
    };

    if (type === "Saving") {
        updatedGoal.savedAmount = Number(currentAmount) || 0;;
    } else if (type === "Budget") {
        updatedGoal.usedAmount = Number(currentAmount) || 0;;
    }

    // 기존 데이터와 업데이트 값 비교해서 수정
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    localGoals = localGoals.map((goal) => {
        if (goal.id === updatedGoal.id) {
            return updatedGoal;
        } else {
            return goal;
        }
    });

    // update the updated to local storage
    // 새로운 값 추가하여 localStorage 업데이트
    localStorage.setItem("goals", JSON.stringify(localGoals));

    // back to the goal page
    // 수정 완료 후 goal 페이지로 돌아가기
    window.location.href = "../goal.html"; 
}

/* util functions */
function createId(type) {
    let id = "";
    if (type.toLowerCase() === "budget") {
        id += "budget-";
    } else if (type.toLowerCase() === "saving") {
        id += "saving-";
    } 

    id += Date.now().toString();
    return id;
}

/*
    render existing account info to the fields
*/
function renderGoalInfo() {
    // 수정할 데이터 가져오기 (sessionStorage)
    const goal = JSON.parse(sessionStorage.getItem("editingGoal")) || null;

    // 필드에 미리 채우기
    if (goal) {
        document.getElementById("goal-name-field").value = goal.title;
        document.getElementById("type-select").value = goal.type;
        document.getElementById("goal-amount-field").value = goal.goalAmount.toFixed(2);
        document.getElementById("current-amount-field").value = goal.type === "Budget" ? goal.usedAmount : goal.savedAmount;
        document.getElementById("start-date-field").value = goal.startDate;
        document.getElementById("end-date-field").value = goal.endDate;
        document.getElementById("notes-field").value = goal.notes;
    }
}

function setupUserAmountByGoalType() {
    const goalTypeSelect = document.getElementById("type-select");
    const label = document.querySelector("label[for='current-amount-field']");

    const type = goalTypeSelect.value;
    if (type === "Budget") {
        label.textContent = "USED AMOUNT";
    } else if (type === "Saving") {
        label.textContent = "SAVED AMOUNT";
    } else {
        label.textContent = "AMOUNT NOW";
    }

    goalTypeSelect.addEventListener("change", () => {
        const type = goalTypeSelect.value;
        if (type === "Budget") {
            label.textContent = "USED AMOUNT";
        } else if (type === "Saving") {
            label.textContent = "SAVED AMOUNT";
        } else {
            label.textContent = "AMOUNT NOW";
        }
    });
}

