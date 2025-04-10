/**
 * sample data
 */
const sampleData = [
    { month: "October 2024", expense: 2300, income: 3000 },
    { month: "November 2024", expense: 2000, income: 3200 },
    { month: "December 2024", expense: 3100, income: 2700 },
    { month: "January 2025", expense: 2500, income: 1000 },
    { month: "Febuary 2025", expense: 700, income: 2800 },
    { month: "March 2025", expense: 2580, income: 2900 }, 
    { month: "April 2025", expense: 1400, income: 3250 } // 👉 현재 월
];

/**
 * expense/income Bar Chart
 */
const currentIndex = sampleData.length - 1;

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

// find max expense
function findMaxExpense() {
    const values = sampleData.map(d => d.expense);
    const maxValue = Math.max(...values);

    return maxValue;
}

// compute average expense & income
function computeAverageExpenseIncome() {
    const expenseTotal = sampleData.reduce((sum, d) => sum + d.expense, 0);
    const incomeTotal = sampleData.reduce((sum, d) => sum + d.income, 0);
    const averageExpense = Math.round(expenseTotal / sampleData.length);
    const averageIncome = Math.round(incomeTotal / sampleData.length);

    return [ averageExpense, averageIncome ];
}

// redner expense footer
function renderExpenseFooter() {
    const footer = document.getElementById("expense-footer");
    const [averageExpense, averageIncome]= computeAverageExpenseIncome();

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
function getMonthAbbr(sampleData) {
    const labels = sampleData.map(d => {
        const [month, year] = d.month.split(" ");
        const monthAbbr = month.slice(0, 3).toUpperCase();
        return year === new Date().getFullYear().toString() ? monthAbbr : [monthAbbr, year];
    });
    
    return labels;
}

// expense Bar Chart 
function initexpenseChart() {
    const labels = getMonthAbbr(sampleData);
    const expenseData = sampleData.map(d => d.expense);
    const incomeData = sampleData.map(d => d.income);
    const currentMonth = sampleData[currentIndex].month;

    const ctx = document.getElementById("expense-chart").getContext("2d");

    const maxValue = findMaxExpense();

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
            legend: {
              display: false 
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return ` $${value.toLocaleString()}`;
                    }
                },
                titleFont: {
                    size: 22
                },
                bodyFont: {
                    size: 22
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selected = sampleData[index];
                updateSelectedTrendText(selected.expense, selected.month, "expense");
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: maxValue,
                ticks: {
                    callback: function(value) {
                        if (value === 0 || 
                            value === maxValue || 
                            value === maxValue / 2) {
                                return `$${value.toLocaleString()}`;
                        }
                        return '';  
                    },
                    color: 'white',
                    stepSize: Math.round(maxValue / 2),
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

    const expenseIncomeChart = new Chart(ctx, {
        type: "bar",
        data: expenseBarData,
        options: expenseBarOptions
    });

    updateSelectedTrendText(sampleData[currentIndex].expense, currentMonth, "expense");
    renderExpenseFooter();

    let isIncomeVisible = false;
    const incomeToggleButton = document.getElementById("income-toggle");
    incomeToggleButton.addEventListener("click", () => {
        if (!isIncomeVisible) {
            incomeToggleButton.src = "../../../assets/Toggle-right.png";
            expenseIncomeChart.data.datasets.push(incomeBarData);
        } else {
            incomeToggleButton.src = "../../../assets/Toggle-left.png";
            expenseIncomeChart.data.datasets = expenseIncomeChart.data.datasets.filter(ds => ds.label !== "Income");
        }
        isIncomeVisible = !isIncomeVisible;
        expenseIncomeChart.update();
    });
}

initexpenseChart();

/**
 * Net Worth Chart
 */
// compute net 
function computeNet(selectedMonth) {
    return selectedMonth.income - selectedMonth.expense;
}

// 
// redner net footer
function renderNetFooter() {
    const footer = document.getElementById("net-income-footer");
    const netData = sampleData.map(d => d.income - d.expense);

    const totalNet = netData.reduce((sum, d) => sum + d, 0);
    const averageNet = Math.round(totalNet / sampleData.length);
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
function initNetChart() {
    const labels = getMonthAbbr(sampleData);
    const netData = sampleData.map(d => d.income - d.expense);
    const currentMonth = sampleData[currentIndex].month;
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
            legend: {
              display: false 
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const prefix = value < 0 ? '⬇' : '⬆';
                        return `${prefix} $${value.toLocaleString()}`;
                    }
                },
                titleFont: {
                    size: 22
                },
                bodyFont: {
                    size: 22
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const selected = sampleData[index];
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

    updateSelectedTrendText(computeNet(sampleData[currentIndex]), currentMonth, "net");
    renderNetFooter();
}

initNetChart();