document.addEventListener("DOMContentLoaded", importNavBar);

function importNavBar() {
    const navbarContainer = document.getElementById("navbar");
    const currentPage = window.location.pathname.split("/").pop();

    if (navbarContainer) {
        let pathPrefix = "../";
        if (currentPage === "transaction.html" || 
            currentPage === "calendar.html" ||
            currentPage === "accounts.html") {
                pathPrefix = "../../";
        }

        navbarContainer.innerHTML = `
        <div class="navbar">
            <a href="${pathPrefix}tab1-home/home.html"><img src="${pathPrefix}../assets/Home.png" alt="Tab1-Home" /><span>Home</span></a>
            <a href="${pathPrefix}tab2-record/transaction/transaction.html"><img src="${pathPrefix}../assets/Calendar.png" alt="Tab2-Record" /><span>Record</span></a>
            <a href="${pathPrefix}tab3-goal/tab3-goal.html"><img src="${pathPrefix}../assets/Check-square.png" alt="Tab3-Goal" /><span>Goal</span></a>    
            <a href="${pathPrefix}tab4-report/tab4-report.html"><img src="${pathPrefix}../assets/Clipboard.png" alt="Tab4-Report" /><span>Report</span></a>
            <a href="${pathPrefix}tab5-game/tab5-game.html"> <img src="${pathPrefix}../assets/Dribble.png" alt="Tab5-Game" /><span>Game</span></a>
        </div>
        `;
    }

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
            if (currentPage === "trends.html") {
                page.classList.add("active");
            }
        }
    }
}