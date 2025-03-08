document.addEventListener("DOMContentLoaded", importNavBar);

function importNavBar() {
    const navbarContainer = document.getElementById("navbar");

    if (navbarContainer) {
        const currentPage = window.location.pathname.split("/").pop();

        navbarContainer.innerHTML = `
            <div class="navbar">
                <a href="../tab1-home/tab1-home.html"><img src="../../assets/Home.png" alt="Tab1-Home" /><span>Home</span></a>
                <a href="../tab2-record/tab2-record.html"><img src="../../assets/Calendar.png" alt="Tab2-Record" /><span>Record</span></a>
                <a href="../tab3-goal/tab3-goal.html"><img src="../../assets/Check-square.png" alt="Tab3-Goal" /><span>Goal</span></a>    
                <a href="../tab4-report/tab4-report.html"><img src="../../assets/Clipboard.png" alt="Tab4-Report" /><span>Report</span></a>
                <a href="../tab5-profile/tab5-profile.html"> <img src="../../assets/User.png" alt="Tab5-Profile" /><span>Profile</span></a>
            </div>
            `;
    }

    const currentPage = window.location.pathname.split("/").pop();
    const pages = document.querySelectorAll(".navbar a");
    for (const page of pages) {
        if (page.getAttribute("href").includes(currentPage)) {
            page.classList.add("active");
        }
    }
}