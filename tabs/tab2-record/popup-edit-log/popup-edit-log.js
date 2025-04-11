/* SIDE SCREEN - EDIT A LOG */

// initially render
document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    mainCategorySelector();
    subCategorySelector();
    clearRequiredError();
    renderLogInfo();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const typeButtons = document.querySelectorAll(".type-button");
    const saveButton = document.getElementById("save-button");

    closeButton.addEventListener("click", () => {
        window.location.href = "../popup-detail-log/popup-detail-log.html";
    });

    for (const button of typeButtons) {
        button.addEventListener("click", (event) => {
            for (const button of typeButtons) {
                button.classList.remove("selected");
            }
        
            event.target.classList.add("selected");
            document.getElementById("type-value").value = event.target.textContent;
        });
    }

    saveButton.addEventListener("click", editLog);
}

// click save button & edit an log
const logEditForm = document.getElementById("log-edit-form");
function editLog(event) {
    event.preventDefault();

    if (!logEditForm.checkValidity()) {
        showRequiredError();
        return;
    }

    clearRequiredError();

    // 수정할 데이터 가져오기 (sessionStorage)
    const log = JSON.parse(sessionStorage.getItem("editingLog")) || null;

    // 사용자가 입력한 데이터 가져오기
    const amount = document.getElementById("amount-field").value;
    const title = document.getElementById("title-field").value;
    const type = document.getElementById("type-value").value;
    const date = document.getElementById("date-field").value;
    const method = document.getElementById("method-select").value;
    const mainCategory = document.getElementById("category-select").value;
    const subCategory = document.getElementById("sub-category-select").value;
    const notes = document.getElementById("notes-field").value;

    const amountNum = parseFloat(amount);
    const amountFinal = (type === "EXPENSE") ? -Math.abs(amountNum) : Math.abs(amountNum);

    const updated = {
        id: log.id, 
        amount: amountFinal,
        title: title,
        type: type,
        date: date,
        method: method,
        category: {
            main: mainCategory,
            sub: subCategory
        },
        notes: notes
    };

    // 기존 데이터와 업데이트 값 비교해서 수정
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    localLogs = localLogs.map(log => {
        if (log.id === updated.id) {
            return updated;
        } else {
            return log;
        }
    });

    localStorage.setItem("transactions", JSON.stringify(localLogs));

    // 수정하고 나면 다시 detail 페이지로 돌아가기
    window.location.href = "../popup-detail-log/popup-detail-log.html"; 
}

// render existing log info to the fields
function renderLogInfo() {
    const log = JSON.parse(sessionStorage.getItem("editingLog")) || null;

    if (log) {
        document.getElementById("amount-field").value = `${Math.abs(log.amount)}`;
        document.getElementById("title-field").value = log.title;
        document.getElementById("type-value").value = log.type;
        document.getElementById("date-field").value = log.date;
        document.getElementById("method-select").value = log.method;
        document.getElementById("category-select").value = log.category.main;
        document.getElementById("notes-field").value = log.notes;

        // sub category
        const subCategorySelect = document.getElementById("sub-category-select");
        const subCategoryBox = document.getElementById("sub-category");
        const localSubCategory = JSON.parse(localStorage.getItem("subCategories"));

        subCategorySelect.innerHTML = `<option value="">Choose...</option>`;
        const subs = localSubCategory[log.category.main];

        if (subs && subs.length > 0) {
            subs.forEach(sub => {
                const option = document.createElement("option");
                option.value = sub;
                option.textContent = sub;
                subCategorySelect.appendChild(option);
            });
            subCategoryBox.classList.remove("hidden");
            subCategorySelect.value = log.category.sub;
        } else {
            subCategoryBox.classList.add("hidden");
        }

        if (log.type === "EXPENSE") {
            document.getElementById("expense-button").classList.add("selected");
        } else if (log.type === "INCOME") {
            document.getElementById("income-button").classList.add("selected");
        }
    }
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
    const invalids = logEditForm.querySelectorAll(":invalid");
    
    invalids.forEach(item => {
        item.classList.add("input-error");
    });
}

function clearRequiredError() {
    const inputs = logEditForm.querySelectorAll("input, select, textarea");
    const eventList = ["input", "click", "focus"];

    inputs.forEach(field => {
        eventList.forEach(eventName => {
            field.addEventListener(eventName, () => {
                field.classList.remove("input-error");
            })
        });
    });
}
