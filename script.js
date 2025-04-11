document.addEventListener("DOMContentLoaded", () => {
    importNavBar();
    loadDefaultData();
});

function importNavBar() {
    const navbarContainer = document.getElementById("navbar");
    const currentPage = window.location.pathname.split("/").pop();

    if (navbarContainer) {
        let pathPrefix = "../";
        if (currentPage === "transaction.html" || 
            currentPage === "calendar.html" ||
            currentPage === "accounts.html" ||
            currentPage === "category.html" ||
            currentPage === "trend.html") {
                pathPrefix = "../../";
        }

        navbarContainer.innerHTML = `
        <div class="navbar">
            <a href="${pathPrefix}tab1-home/home.html"><img src="${pathPrefix}../assets/Home.png" alt="Tab1-Home" /><span>Home</span></a>
            <a href="${pathPrefix}tab2-record/transaction/transaction.html"><img src="${pathPrefix}../assets/Calendar.png" alt="Tab2-Logs" /><span>Log</span></a>
            <a href="${pathPrefix}tab3-goal/goal.html"><img src="${pathPrefix}../assets/Check-square.png" alt="Tab3-Goal" /><span>Goal</span></a>    
            <a href="${pathPrefix}tab4-report/category/category.html"><img src="${pathPrefix}../assets/Clipboard.png" alt="Tab4-Report" /><span>Report</span></a>
        </div>
        `;
    }

    // remove?
    const pages = document.querySelectorAll(".navbar a");
    for (const page of pages) {
        if (page.getAttribute("href").includes(currentPage)) {
            page.classList.add("active");
        } else if (page.getAttribute("href").includes("tab2-record")) {
            if (currentPage === "transaction.html" ||
                currentPage === "calendar.html" ||
                currentPage === "accounts.html") {
                    page.classList.add("active");
                }
        } else if (page.getAttribute("href").includes("tab4-report")) {
            if (currentPage === "category.html" ||
                currentPage === "trend.html") {
                page.classList.add("active");
            }
        }
    }
}

function loadDefaultData() {
    // transaction logs data -> localStorage
    if (!localStorage.getItem("transactions")) {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }

    // goals data -> localStorage
    if (!localStorage.getItem("goals")) {
        localStorage.setItem("goals", JSON.stringify(defaultGoals));
    }

    // accounts data -> localStorage
    if (!localStorage.getItem("accounts")) {
        localStorage.setItem("accounts", JSON.stringify(defaultAccounts));
    }

    // main-category data -> localStorage
    if (!localStorage.getItem("mainCategories")) {
        localStorage.setItem("mainCategories", JSON.stringify(mainCategories));
    }

    // sub-category data -> localStorage 
    if (!localStorage.getItem("subCategories")) {
        localStorage.setItem("subCategories", JSON.stringify(subCategories));
    }
}