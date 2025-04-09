/* ADD a GOAL */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setupUserAmountByGoalType();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const saveButton = document.getElementById("save-button");
    closeButton.addEventListener("click", () => {
        window.location.href = "../goal.html";
    });
    saveButton.addEventListener("click", addGoal);
}

const goalForm = document.getElementById("goal-add-form");

function addGoal(event) {
    event.preventDefault();

    if (!goalForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // 사용자가 입력한 데이터 가져오기
    const goalTitle =  document.getElementById("goal-name-field").value;
    const type = document.getElementById("type-select").value;
    const goalAmount = document.getElementById("goal-amount-field").value;
    const currentAmount = document.getElementById("user-amount-field").value;
    const startDate = document.getElementById("start-date-field").value;
    const endDate = document.getElementById("end-date-field").value;
    const notes = document.getElementById("notes-field").value;

    // 사용자 입력 데이터로 json 포맷으로 만들기
    const newGoal = {
        id: createId(type), 
        title: goalTitle,
        type: type,
        percent: Math.floor(Math.random() * 100),
        goalAmount: Number(goalAmount) || 0,
        startDate: startDate,
        endDate: endDate,
        notes: notes
    };

    if (type === "Saving") {
        newGoal.savedAmount = Number(currentAmount) || 0;;
    } else if (type === "Budget") {
        newGoal.usedAmount = Number(currentAmount) || 0;;
    }

    // local storage 로그 리스트에 -> new log 추가하기
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    localGoals.push(newGoal);
    localStorage.setItem("goals", JSON.stringify(localGoals));

    // 추가하고 나면 다시 accounts 페이지로 돌아가기
    window.location.href = "../goal.html";  
} 

// 
function setupUserAmountByGoalType() {
    const goalTypeSelect = document.getElementById("type-select");
    const label = document.querySelector("label[for='user-amount-field']");

    goalTypeSelect.addEventListener("change", () => {
        const type = goalTypeSelect.value;
        if (type === "Budget") {
            label.textContent = "USED AMOUNT";
        } else if (type === "Saving") {
            label.textContent = "SAVED AMOUNT";
        } else {
            label.textContent = "CURRENT AMOUNT";
        }
    });
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
