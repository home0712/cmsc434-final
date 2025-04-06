/* MANAGE CATEGORIES */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

/*
    return to previous page
*/
function returnToPage() {
    const returnPage = sessionStorage.getItem("returnTo");

    if (returnPage === "transaction") {
        window.location.href = "../../tab2-record/transaction/transaction.html";
    } else if (returnPage === "calendar") { 
        window.location.href = "../../tab2-record/calendar/calendar.html";
    } else if (returnPage === "category") {
        window.location.href = "../../tab4-report/category/category.html";
    }
}

/*
    open main category toggles
*/
const mainCategories = document.querySelectorAll(".category-header");
for (const main of mainCategories) {
    main.addEventListener("click", activeCategoryToggle);
}

function activeCategoryToggle(event) {
    const subList = event.target.nextElementSibling;
    subList.classList.toggle('open');
}

/**
 *
 */
