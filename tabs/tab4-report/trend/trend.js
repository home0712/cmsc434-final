/* MAIN - TREND REPORT */

// global variable
let currentTrendView = "EXPENSE"; 

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultData();
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const monthlyData = mergeWithActualTransactions(transactions);
  
    renderExpenseChart(monthlyData);
    renderNetChart(monthlyData);
    setupTrendToggle();
    showExpenseView();
});

function updateSelectedTrendText(value, month, type) {
    const expenseAmount = document.getElementById("expense-amount");
    const expenseText = document.getElementById("expense-header-text");
    const netAmount = document.getElementById("net-income-amount");
    const netText = document.getElementById("net-income-header-text");

    if (type === "expense") {
      expenseAmount.innerHTML = `$ ${value.toLocaleString()}`;
      expenseText.innerHTML = `Spent in ${month}`;
    } else {
      const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
      const color = value > 0 ? "#4CAF50" : value < 0 ? "#FFA07A" : "white";

      netAmount.style.color = color;
      netAmount.innerHTML = `${prefix}$ ${Math.abs(value).toLocaleString()}`;
      netText.innerHTML = `in ${month}`;
    }
}

function renderExpenseFooter(data) {
    const expenseAvg = computeAverage(data.map(d => d.expense));
    const incomeAvg = computeAverage(data.map(d => d.income));

    document.getElementById("expense-footer").innerHTML = `
      <div id="average-expense">
        <span>Average <span id="expense-text">Expense</span> in ${data.length} months</span>
        <span id="expense-amount">-$ ${expenseAvg.toLocaleString()}</span>
      </div>
      <div id="average-income">
        <span>Average <span id="income-text">Income</span> in ${data.length} months</span>
        <span id="income-amount">+$ ${incomeAvg.toLocaleString()}</span>
      </div>
    `;
}

function renderNetFooter(data) {
    const netList = data.map(d => d.income - d.expense);
    const netAvg = computeAverage(netList);
    const prefix = netAvg > 0 ? "+" : netAvg < 0 ? "-" : "";
    const color = netAvg > 0 ? "#4CAF50" : netAvg < 0 ? "#FFA07A" : "white";

    document.getElementById("net-income-footer").innerHTML = `
      <div id="average-net">
        <span>Average <span id="net-text">Net</span> in ${data.length} months</span>
        <span id="net-amount" style="color: ${color}">${prefix}$ ${Math.abs(netAvg).toLocaleString()}</span>
      </div>
    `;
}

function renderExpenseChart(data) {
    const ctx = document.getElementById("expense-chart").getContext("2d");
    const labels = data.map(d => d.month);
    const expenses = data.map(d => d.expense);
    const incomes = data.map(d => d.income);

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Expense",
          data: expenses,
          backgroundColor: "rgba(255, 65, 54, 0.7)"
        }]
      },
      options: {
        responsive: false,
        plugins: { 
            legend: { display: false },
            tooltip: { enabled: false }
        },
        hover: { mode: null },
        onClick: (e, elements) => {
          if (elements.length > 0) {
            const i = elements[0].index;
            updateSelectedTrendText(data[i].expense, data[i].month, "expense");
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "white" },
            grid: { color: "#666" }
          },
          x: { ticks: { color: "white" } }
        }
      }
    });

    const incomeToggle = document.getElementById("income-toggle")

    incomeToggle.addEventListener("click", () => {
        const hasIncome = chart.data.datasets.length > 1;

        if (hasIncome) {
            chart.data.datasets = chart.data.datasets.filter(d => d.label !== "Income");
            incomeToggle.src = "../../../assets/Toggle-left.png";
        } else {
            chart.data.datasets.push({
              label: "Income",
              data: incomes,
              backgroundColor: "rgba(76, 175, 80, 0.7)"
            });
            incomeToggle.src = "../../../assets/Toggle-right.png"; 
        }
    });

    updateSelectedTrendText(data[data.length - 1].expense, data[data.length - 1].month, "expense");
    renderExpenseFooter(data);
}

function renderNetChart(data) {
  const ctx = document.getElementById("net-income-chart").getContext("2d");
  const labels = data.map(d => d.month);
  const netData = data.map(d => d.income - d.expense);
  const colors = netData.map(v => v >= 0 ? "#4CAF50" : "#FFA07A");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: netData,
        backgroundColor: colors
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false }},
      onClick: (e, elements) => {
        if (elements.length > 0) {
          const i = elements[0].index;
          updateSelectedTrendText(netData[i], data[i].month, "net");
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "white" },
          grid: { color: "#666" }
        },
        x: { ticks: { color: "white" } }
      }
    }
  });

  updateSelectedTrendText(netData[netData.length - 1], data[data.length - 1].month, "net");
  renderNetFooter(data);
}


function showExpenseView() {
    document.getElementById("expense-section").style.display = "block";
    document.getElementById("net-section").style.display = "none";
}

function showNetView() {
    document.getElementById("expense-section").style.display = "none";
    document.getElementById("net-section").style.display = "block";
}

function setupTrendToggle() {
    const expensebutton = document.getElementById("toggle-expense");
    const netButton = document.getElementById("toggle-net");

    expensebutton.addEventListener("click", () => {
        expensebutton.classList.add("selected");
        netButton.classList.remove("selected");
        showExpenseView();
    });

    netButton.addEventListener("click", () => {
        netButton.classList.add("selected");
        expensebutton.classList.remove("selected");
        showNetView();
    });
}

/* util functions */
function getMonthKey(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth();
    return `${year}-${month + 1}`;
}
  
function getMonthLabel(dateStr) {
    const date = new Date(dateStr);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
  
function computeNet(log) {
    return log.income - log.expense;
}
  
function computeAverage(values) {
    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round(sum / values.length);
}
  
function groupTransactionsByMonth(transactions) {
    const map = {};
    transactions.forEach(tx => {
      const key = getMonthKey(tx.date);
      if (!map[key]) map[key] = { expense: 0, income: 0, date: tx.date };
  
      if (tx.type === "EXPENSE") {
        map[key].expense += Math.abs(tx.amount);
      } else if (tx.type === "INCOME") {
        map[key].income += tx.amount;
      }
    });
  
    return Object.entries(map)
      .sort((a, b) => new Date(a[1].date) - new Date(b[1].date))
      .map(([_, v]) => ({ ...v, month: getMonthLabel(v.date) }));
}

function getRecentSixMonthsLabels() {
    const result = [];
    const now = new Date();
    const currentYear = now.getFullYear();
  
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthAbbr = d.toLocaleString('default', { month: 'short' }).toUpperCase(); 
  
      const key = `${year}-${d.getMonth() + 1}`;
      const label = (year === currentYear) ? `${monthAbbr}` : `${monthAbbr} ${year}`;
  
      result.push({ key, month: label, income: 0, expense: 0 });
    }
  
    return result;
}

function mergeWithActualTransactions(transactions) {
    const base = getRecentSixMonthsLabels();
    const grouped = {};
  
    transactions.forEach(tx => {
      const key = getMonthKey(tx.date);
      if (!grouped[key]) grouped[key] = { income: 0, expense: 0 };
      if (tx.type === "EXPENSE") grouped[key].expense += Math.abs(tx.amount);
      else if (tx.type === "INCOME") grouped[key].income += tx.amount;
    });
  
    return base.map(monthObj => {
      const real = grouped[monthObj.key] || {};
      return {
        month: monthObj.month,
        income: real.income || 0,
        expense: real.expense || 0
      };
    });
}