/* SIDE SCREEN - SEARCH LOGS */

/* 
    click x button to close 
*/
const closeButton = document.getElementById("header-button");
closeButton.addEventListener("click", returnToPage);

/* 
    search logs based on the search fields used entered
*/
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", keywordSearch);

function keywordSearch() {
  const keyword = document.getElementById("keyword-input").value.trim().toLowerCase();
  const minAmount = parseFloat(document.getElementById("amount-min").value);
  const maxAmount = parseFloat(document.getElementById("amount-max").value);
  const startDate = document.getElementById("date-start").value;
  const endDate = document.getElementById("date-end").value;

  // no keyword entered
  if (!keyword) {
    alert("Please enter a keyword to search");
    return;
  }

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


/*
  show the results
*/
const toggleButton = document.getElementById("toggle-button");
const searchResults = document.getElementById("search-results");

toggleButton.addEventListener("click", () => {
  const optionalBox = document.getElementById("optional-search");
  optionalBox.style.display = optionalBox.style.display === "none" ? "block" : "none";
})

function renderSearchResults(logs) {
  const container = document.getElementById("search-results");
  container.innerHTML = "";

  // nothing searched 
  if (logs.length === 0) {
    container.innerHTML = `<p class="no-result">No results found.</p>`;
    return;
  }

  // sort logs in descending order 
  logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  const dateGrouped = groupLogsByDate(logs);

  // 최신 날짜부터 정렬해야 되니까 -> dateGroupedLogs의 키를 내림차순으로 정렬
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