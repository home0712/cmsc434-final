/* SIDE SCREEN - ADD A LOG */

document.addEventListener("DOMContentLoaded", () => {
    const saved = JSON.parse(sessionStorage.getItem("pendingLogData"));
    if (saved) {
        document.getElementById("amount-field").value = saved.amount;
        document.getElementById("title-field").value = saved.title;
        document.getElementById("type-value").value = saved.type;
        document.getElementById("date-field").value = saved.date;
        document.getElementById("method-select").value = saved.method;
        document.getElementById("notes-field").value = saved.notes;

        sessionStorage.removeItem("pendingLogData");
    }

    bindButtons();
    mainCategorySelector();
    subCategorySelector();
    clearRequiredError();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const typeButtons = document.querySelectorAll(".type-button");
    const saveButton = document.getElementById("save-button");

    closeButton.addEventListener("click", returnToPage);

    for (const button of typeButtons) {
        button.addEventListener("click", (event) => {
            for (const button of typeButtons) {
                button.classList.remove("selected");
            }
            event.target.classList.add("selected");
            document.getElementById("type-value").value = event.target.textContent;
        });
    }

    saveButton.addEventListener("click", addTransaction);

    document.getElementById("category-select").addEventListener("change", (event) => {
        if (event.target.value === "add-edit") {
            event.target.value = "";

            sessionStorage.setItem("pendingLogData", JSON.stringify({
                amount: document.getElementById("amount-field").value,
                title: document.getElementById("title-field").value,
                type: document.getElementById("type-value").value,
                date: document.getElementById("date-field").value,
                method: document.getElementById("method-select").value,
                notes: document.getElementById("notes-field").value
            }));

            sessionStorage.setItem("secondReturnTo", "add-log");

            window.location.href = "../../shared-popups/popup-manage-category/popup-manage-category.html";
        }
    });
}

const logAddForm = document.getElementById("add-log-container");
function addTransaction(event) {
    event.preventDefault();

    if (!logAddForm.checkValidity()) {
        showRequiredError();
        return;
    }

    clearRequiredError();

    const amount = document.getElementById("amount-field").value;
    const title = document.getElementById("title-field").value;
    const type = document.getElementById("type-value").value;
    const date = document.getElementById("date-field").value;
    const method = document.getElementById("method-select").value;
    const mainCategory = document.getElementById("category-select").value;
    const subCategory = document.getElementById("sub-category-select").value;
    const notes = document.getElementById("notes-field").value;

    // type 에 따라 +/- 부호 붙이기
    const amountNum = parseFloat(amount);
    const amountFinal = (type === "EXPENSE") ? -Math.abs(amountNum) : Math.abs(amountNum);

    const newLog = {
        id: Date.now(), 
        amount: amountFinal,
        title: title,
        type: type,
        date: date,     // YYYY-MM-DD format
        method: method,
        category: {
            main: mainCategory,
            sub: subCategory
        },
        notes: notes
    };

    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    localLogs.push(newLog);
    localStorage.setItem("transactions", JSON.stringify(localLogs));

    sessionStorage.removeItem("pendingLogData");
    // return to the prev page
    returnToPage();
}

// render the main-category selector
function mainCategorySelector() {
    const mainCategorySelect = document.getElementById("category-select");
    const localMainCategory = JSON.parse(localStorage.getItem("mainCategories"));

    localMainCategory.forEach(main => {
        const option = document.createElement("option");
        option.value = main;
        option.textContent = main;
        mainCategorySelect.appendChild(option);
    });
}

// render the sub-category selector
function subCategorySelector() {
    const mainCategorySelect = document.getElementById("category-select");
    const subCategorySelect = document.getElementById("sub-category-select");
    const subCategorySelectBox = document.getElementById("sub-category");
    const localSubCategory = JSON.parse(localStorage.getItem("subCategories"));

    mainCategorySelect.addEventListener("change", (event) => {
        const selectedMain = event.target.value;

        subCategorySelect.innerHTML = `<option value="">Choose...</option>`;

        if (localSubCategory[selectedMain]) {
            localSubCategory[selectedMain].forEach(sub => {
                const option = document.createElement("option");
                option.value = sub;
                option.textContent = sub;
                subCategorySelect.appendChild(option);
            });
            subCategorySelectBox.classList.remove("hidden");
        } else {
            subCategorySelectBox.classList.add("hidden");
        }
    });
}

// required field error
function showRequiredError() {
    const invalids = logAddForm.querySelectorAll(":invalid");
    
    invalids.forEach(item => {
        item.classList.add("input-error");
    });
}

function clearRequiredError() {
    const inputs = logAddForm.querySelectorAll("input, select, textarea");
    const eventList = ["input", "click", "focus"];

    inputs.forEach(field => {
        eventList.forEach(eventName => {
            field.addEventListener(eventName, () => {
                field.classList.remove("input-error");
            })
        });
    });
}