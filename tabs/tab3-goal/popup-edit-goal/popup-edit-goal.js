/* ADD AN ACCOUNT */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

function returnToPage() {
    window.location.href = "../goal.html";
}

// click save button & add an account
const saveButton = document.getElementById("save-button");
const goalForm = document.getElementById("goal-edit-form");

saveButton.addEventListener("click", editGoal);

function editGoal(event) {
    event.preventDefault();

    if (!goalForm.checkValidity()) {
        alert("Please fill in all required fields.");
        return;
    }

    // 사용자가 입력한 데이터 가져오기
    const goalTitle =  document.getElementById("goal-name-field").value;
    const type = document.getElementById("type-select").value;
    const goalAmount = document.getElementById("goal-amount-field").value;
    const startDate = document.getElementById("start-date-field").value;
    const endDate = document.getElementById("end-date-field").value;
    const notes = document.getElementById("notes-field").value;
    

    // 사용자 입력 데이터로 json 포맷으로 만들기
    const newGoal = {
        id: createId(type), 
        title: goalTitle,
        type: type,
        goalAmount: Number(goalAmount),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes
    };

    // local storage 로그 리스트에 -> new log 추가하기
    let localGoals = JSON.parse(localStorage.getItem("goals")) || [];
    localGoals.push(newGoal);
    localStorage.setItem("goals", JSON.stringify(localGoals));

    // 추가하고 나면 다시 accounts 페이지로 돌아가기
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

    console.log(goal.type);
    // 필드에 미리 채우기
    if (goal) {
        document.getElementById("goal-name-field").value = goal.title;
        document.getElementById("type-select").value = goal.type;
        document.getElementById("goal-amount-field").value = goal.goalAmount.toFixed(2);
        document.getElementById("start-date-field").value = goal.startDate;
        document.getElementById("end-date-field").value = goal.endDate;
        document.getElementById("notes-field").value = goal.notes;
    }
}

renderGoalInfo();
