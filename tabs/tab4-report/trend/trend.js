/* MAIN - TREND */

document.addEventListener("DOMContentLoaded", () => {
    const monthlyData = getMonthlyTransactionData();

    initexpenseChart(monthlyData);
    initNetChart(monthlyData);
    setupTrendToggle();
    showExpenseView();
});

// expense/income Bar Chart
// 선택된 월의 텍스트를 업데이트하는 함수
function updateSelectedTrendText(value, month, type) {
    const expenseAmount = document.getElementById("expense-amount");
    const expenseText = document.getElementById("expense-header-text");
    const netAmount = document.getElementById("net-income-amount");
    const netText = document.getElementById("net-income-header-text");

    if (type === "expense") {
        expenseAmount.innerHTML = `$ ${value.toLocaleString()}`;
        expenseText.innerHTML = `Spent in ${month}`;
    } else if (type === "net") {
        let prefix = "";
        if (value > 0) {
            netAmount.style = "color: #4CAF50;";
            prefix = "+";
        } else if (value < 0) {
            netAmount.style = "color: #FFA07A;";
            prefix = "-";
        } else {
            netAmount.style = "color: #4CAF50;";
        }

        netAmount.innerHTML = `${prefix}$ ${Math.abs(value).toLocaleString()}`;
        netText.innerHTML = `in ${month}`;      
    }
    
}

// compute average expense & income
function computeAverageExpenseIncome(data) {
    const expenseTotal = data.reduce((sum, d) => sum + d.expense, 0);
    const incomeTotal = data.reduce((sum, d) => sum + d.income, 0);
    const averageExpense = Math.round(expenseTotal / data.length);
    const averageIncome = Math.round(incomeTotal / data.length);

    return [ averageExpense, averageIncome ];
}

// redner expense footer
function renderExpenseFooter(data) {
    const footer = document.getElementById("expense-footer");
    const [averageExpense, averageIncome]= computeAverageExpenseIncome(data);

    footer.innerHTML = `
        <div id="average-expense">
            <span>
                Average
                <span id="expense-text">Expense</span>
                in 6 months
            </span>
            <span id="expense-amount">-$ ${averageExpense.toLocaleString()}</span>
        </div>

        <div id="average-income">
            <span>
                Average 
                <span id="income-text">Income</span>
                in 6 months
            </span>
            <span id="income-amount">+$ ${averageIncome.toLocaleString()}</span>
        </div>
    `;
}

// get month abbr
function getMonthAbbr(data) {
    const labels = data.map(d => {
        const [month, year] = d.month.split(" ");
        const monthAbbr = month.slice(0, 3).toUpperCase();
        return year === new Date().getFullYear().toString() ? monthAbbr : [monthAbbr, year];
    });
    
    return labels;
}

// expense Bar Chart 
function initexpenseChart(data) {
    const labels = getMonthAbbr(data);
    const expenseData = data.map(d => d.expense);
    const incomeData = data.map(d => d.income);
    const currentMonth = data.at(-1).month;

    const ctx = document.getElementById("expense-chart").getContext("2d");

    const expenseMax = Math.max(...expenseData);
    const incomeMax = Math.max(...incomeData);

    const expenseBarData = {
        labels: labels,
        datasets: [{
          data: expenseData,
          backgroundColor: "rgb(255, 65, 54, 0.7)",
          borderWidth: 1
        }]
    };

    const incomeBarData = {
        label: "Income",
        data: incomeData,
        backgroundColor: "rgb(76, 175, 80, 0.7)",
        borderWidth: 1
    }

    const expenseBarOptions = {
        responsive: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selected = data[index];
                updateSelectedTrendText(selected.expense, selected.month, "expense");
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: expenseMax,
                grid: { color: "#666" },
                ticks: {
                    color: "white",
                    font:  {
                        size: 15
                    }
                }
            },
            x: {
                ticks: { 
                    color: "white",
                    font:  {
                        size: 15
                    }
                }
            }
        },
    };

    const expenseIncomeChart = new Chart(ctx, {
        type: "bar",
        data: expenseBarData,
        options: expenseBarOptions
    });

    updateSelectedTrendText(data.at(-1).expense, currentMonth, "expense");
    renderExpenseFooter(data);

    let isIncomeVisible = false;
    const incomeToggleButton = document.getElementById("income-toggle");
    incomeToggleButton.addEventListener("click", () => {
        if (!isIncomeVisible) {
            incomeToggleButton.src = "../../../assets/Toggle-right.png";
            expenseIncomeChart.data.datasets.push(incomeBarData);

            const newMax = Math.max(expenseMax, incomeMax);
            expenseIncomeChart.options.scales.y.max = newMax;
        } else {
            incomeToggleButton.src = "../../../assets/Toggle-left.png";
            expenseIncomeChart.data.datasets = expenseIncomeChart.data.datasets.filter(ds => ds.label !== "Income");
            expenseIncomeChart.options.scales.y.max = expenseMax;
        }
        isIncomeVisible = !isIncomeVisible;
        expenseIncomeChart.update();
    });
}

/**
 * Net Worth Chart
 */
// compute net 
function computeNet(selectedMonth) {
    return selectedMonth.income - selectedMonth.expense;
}

// 
// redner net footer
function renderNetFooter(data) {
    const footer = document.getElementById("net-income-footer");
    const netData = data.map(d => d.income - d.expense);

    const totalNet = netData.reduce((sum, d) => sum + d, 0);
    const averageNet = Math.round(totalNet / data.length);
    const prefix = averageNet > 0 ? '+' : averageNet < 0 ? '-' : '';
    const color = averageNet > 0 ? '#4CAF50' : averageNet < 0 ? '#FFA07A' : 'white';

    footer.innerHTML = `
        <div id="average-net">
            <span>
                Average
                <span id="net-text">Net</span>
                in 6 months
            </span>
            <span id="net-amount" style="color: ${color}">${prefix}$ ${Math.abs(averageNet).toLocaleString()}</span>
        </div>
    `;
}

// Net Bar Chart 
function initNetChart(data) {
    const labels = getMonthAbbr(data);
    const netData = data.map(d => d.income - d.expense);
    const currentMonth = data.at(-1).month;
    const bgColors = netData.map(d=> d >= 0 ? '#4CAF50' : '#FFA07A');

    const min = Math.min(...netData);
    const max = Math.max(...netData);

    const ctx = document.getElementById("net-income-chart").getContext("2d");

    const netBarData = {
        labels: labels,
        datasets: [{
          data: netData,
          backgroundColor: bgColors,
          borderWidth: 1
        }]
    };

    const netOptions = {
        responsive: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selected = data[index];
                updateSelectedTrendText(computeNet(selected), selected.month, "net");
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: min,
                max: max,
                ticks: {
                    callback: function(value) {
                        return `$${value.toLocaleString()}`;
                    },
                    maxTicksLimit: 5,
                    color: 'white',
                },
                grid: { color: "#666" },
            },
            x: {
                ticks: { 
                    color: "white",
                    font:  {
                        size: 15
                    }
                }
            }
        },
    };

    const netChart = new Chart(ctx, {
        type: "bar",
        data: netBarData,
        options: netOptions
    });

    updateSelectedTrendText(computeNet(data.at(-1)), currentMonth, "net");
    renderNetFooter(data);
}

//
function getMonthlyTransactionData() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    // 최근 6개월 기준으로 정리
    const now = new Date();
    const monthMap = new Map();

    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthMap.set(key, {
            month: date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear(),
            expense: 0,
            income: 0
        });
    }

    transactions.forEach(log => {
        const [year, month] = log.date.split("-");
        const key = `${year}-${month}`;
        if (monthMap.has(key)) {
            const data = monthMap.get(key);
            if (log.type === "EXPENSE") {
                data.expense += Math.abs(log.amount);
            } else if (log.type === "INCOME") {
                data.income += log.amount;
            }
        }
    });

    return Array.from(monthMap.values());
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