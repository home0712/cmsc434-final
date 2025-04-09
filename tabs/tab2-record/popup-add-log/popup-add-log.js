/* SIDE SCREEN - ADD A LOG */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    mainCategorySelector();
    subCategorySelector();
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
}



const logForm = document.getElementById("add-form");
function addTransaction(event) {
    event.preventDefault();

    if (!logForm.checkValidity()) {
        // (editing) -> 가장 첫번째 unfilled required field에 빨간색으로 표시 or popup?
        alert("Please fill in all required fields.");
        return;
    }

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