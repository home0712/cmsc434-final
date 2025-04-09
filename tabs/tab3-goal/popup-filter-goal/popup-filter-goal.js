/* SIDE SCREEN - SEARCH GOALS */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    setupStatusOptionsByGoalType();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    closeButton.addEventListener("click", () => {
      window.location.href = "../goal.html";
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

    document.getElementById("optional-filter").style.display = "none";

    renderSearchResults(result);
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
    message.remove();
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