/**
 * sample data
 */
const sampleExpenseData = [
    { month: "October", expense: 2300, income: 3000 },
    { month: "November", expense: 2000, income: 3200 },
    { month: "December", expense: 3100, income: 2700 },
    { month: "January", expense: 2500, income: 1000 },
    { month: "Febuary", expense: 700, income: 2800 },
    { month: "March", expense: 2580, income: 2900 }, 
    { month: "April", expense: 1400, income: 3250 } // 👉 현재 월
];

/**
 * Spending Chart
 */
const currentIndex = sampleExpenseData.length - 1;

// 선택된 월의 텍스트를 업데이트하는 함수
function updateSelectedTrendText(value, month, type) {
    const spendingAmount = document.getElementById("spending-amount");
    const spendingText = document.getElementById("spending-header-text");
    const netAmount = document.getElementById("net-income-amount");
    const netText = document.getElementById("net-income-header-text");

    if (type === "spending") {
        spendingAmount.innerHTML = `$${value.toLocaleString()}`;
        spendingText.innerHTML = `Spent in ${month}`;
    } else if (type === "net") {
        netAmount.innerHTML = `$${value.toLocaleString()}`;
        netText.innerHTML = `in ${month}`;
    }
    
}

// find max expense
function findMaxExpense() {
    const values = sampleExpenseData.map(d => d.expense);
    const maxValue = Math.max(...values);

    return maxValue;
}

// Spending Chart 초기화 함수
function initSpendingChart() {
    const labels = sampleExpenseData.map(d => d.month);
    const data = sampleExpenseData.map(d => d.expense);
    const currentMonth = sampleExpenseData[currentIndex].month;

    const ctx = document.getElementById("spending-chart").getContext("2d");

    const maxValue = findMaxExpense();

    const spendingData = {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: "rgb(255, 65, 54, 0.7)",
          borderWidth: 1
        }]
    };

    const spendingOptions = {
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
                const selected = sampleExpenseData[index];
                updateSelectedTrendText(selected.expense, selected.month, "spending");
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
              ticks: { color: "white" }
            }
        },
    };

    const spendingChart = new Chart(ctx, {
        type: "bar",
        data: spendingData,
        options: spendingOptions
    });

    updateSelectedTrendText(sampleExpenseData[currentIndex].expense, currentMonth, "spending");
}

initSpendingChart();

/**
 * Net Worth Chart
 */
// compute net 
function computeNet(selectedMonth) {
    return selectedMonth.income - selectedMonth.expense;
}

// Net Chart 초기화 함수
function initNetChart() {
    const labels = sampleExpenseData.map(d => d.month);
    const data = sampleExpenseData.map(d => d.income - d.expense);
    const currentMonth = sampleExpenseData[currentIndex].month;
    const bgColors = data.map(v =>
        v >= 0 ? '#4CAF50' : '#FFA07A'
      );

    const ctx = document.getElementById("net-income-chart").getContext("2d");

    const netData = {
        labels: labels,
        datasets: [{
          data: data,
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
                const selected = sampleExpenseData[index];
                updateSelectedTrendText(computeNet(selected), selected.month, "net");
            }
        },
        scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#666" },
              ticks: { color: "white" }
            },
            x: {
              ticks: { color: "white" }
            }
        },
    };

    const netChart = new Chart(ctx, {
        type: "bar",
        data: netData,
        options: netOptions
    });

    updateSelectedTrendText(computeNet(sampleExpenseData[currentIndex]), currentMonth, "net");
}

initNetChart();