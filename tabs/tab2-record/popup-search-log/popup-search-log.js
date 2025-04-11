/* SIDE SCREEN - SEARCH LOGS */

document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    toggleOption();
});

function bindButtons() {
    const closeButton = document.getElementById("header-button");
    const searchButton = document.getElementById("search-button");
    const keywordInput = document.getElementById("keyword-input");

    closeButton.addEventListener("click", () => {
        const prevPage = sessionStorage.getItem("returnTo");
        if (prevPage === "transaction") {
            window.location.href = "../transaction/transaction.html";
        } else if (prevPage === "calendar") {
            window.location.href = "../calendar/calendar.html";
        }
    });

    searchButton.addEventListener("click", keywordSearch);

    keywordInput.addEventListener("input", () => {
        clearKeywordError();
    });

    keywordInput.addEventListener("focus", () => {
        clearKeywordError();
    });
}

// search logs based on the search fields used entered
const searchForm = document.getElementById("search-form");
function keywordSearch() {
    const keyword = document.getElementById("keyword-input").value.trim().toLowerCase();
    const minAmount = parseFloat(document.getElementById("amount-min").value);
    const maxAmount = parseFloat(document.getElementById("amount-max").value);
    const startDate = document.getElementById("date-start").value;
    const endDate = document.getElementById("date-end").value;

    // no keyword entered
    if (!keyword) {
      showKeywordError();
      return;
    }

    clearKeywordError();
    let localLogs = JSON.parse(localStorage.getItem("transactions")) || [];

    const result = localLogs.filter(log => {
      const keywordMatch =
        keyword === "" ||
        (log.title?.toLowerCase().includes(keyword)) || 
        (log.notes?.toLowerCase().includes(keyword));

      const amountMatch =
        (isNaN(minAmount) || log.amount >= minAmount) &&
        (isNaN(maxAmount) || log.amount <= maxAmount);

      const dateMatch =
        (startDate === "" || log.date >= startDate) &&
        (endDate === "" || log.date <= endDate);

      return keywordMatch && amountMatch && dateMatch;
    });

    document.getElementById("optional-search").style.display = "none";

    // show the results
    renderSearchResults(result);
}

function renderSearchResults(logs) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  // nothing searched 
  if (logs.length === 0) {
    container.innerHTML = `<p class="no-result">No results found.</p>`;
    return;
  }

  logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  const dateGrouped = groupLogsByDate(logs);
  const dateGroupedKeys = Object.keys(dateGrouped).sort((a, b) => new Date(b.date) - new Date(a.date));

  for (const dateKey of dateGroupedKeys) {
    const [year, month, day] = dateKey.split("-");
    const date = new Date(year, month - 1, day);
    const dateString = `
      ${monthNames[date.getMonth()]} 
      ${date.getDate()}${getOrdinal(date.getDate())} 
      ${date.getFullYear()} 
      ${weekdayNames[date.getDay()]}
    `;

    appendLogsByDate(dateGrouped, container, dateKey, dateString);
  }
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
  if (message) {
      message.remove();
  }
}

// 
function toggleOption() {
  const toggleButton = document.getElementById("toggle-button");
  const optionalBox = document.getElementById("optional-search");

  toggleButton.addEventListener("click", () => {
      optionalBox.classList.toggle("open");

      const isOpen = optionalBox.classList.contains("open");
      toggleButton.src = isOpen
        ? "../../../assets/Arrow-up.png"
        : "../../../assets/Arrow-down.png";
  });
}