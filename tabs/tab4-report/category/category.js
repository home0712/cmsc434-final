/* MAIN - CATEGORY REPORT */

// global variables
let pieChart = null;
let isSubChart = false;
let sortedRankMap = {};
let sortedColorMap = {};

document.addEventListener("DOMContentLoaded", () => {
    loadDefaultData();
    bindButtons();
    setupToggle();
    renderMainPieChart("EXPENSE");
});

// collection of buttons
// 버튼 모음
function bindButtons() {
    const settingButton = document.getElementById("header-button");
    const backButton = document.getElementById("back-to-main");

    settingButton.addEventListener("click", () => {
        sessionStorage.setItem("returnTo", "category");
        window.location.href = "../../shared-popups/popup-manage-category/popup-manage-category.html";
    });

    backButton.addEventListener("click", () => {
        if (pieChart) {
            pieChart.destroy();
        }
        renderMainPieChart(getCurrentType());
    });
}

// Expense/Income setup toggle
// Expense/Income 토글 버튼
function setupToggle() {
    const expenseButton = document.getElementById("show-expense");
    const incomeButton = document.getElementById("show-income");

    expenseButton.addEventListener("click", () => {
        expenseButton.classList.add("active");
        incomeButton.classList.remove("active");
        renderMainPieChart("EXPENSE");
    });

    incomeButton.addEventListener("click", () => {
        incomeButton.classList.add("active");
        expenseButton.classList.remove("active");
        renderMainPieChart("INCOME");
    });
}

// render pie chart
// 파이차트 렌더링
function renderMainPieChart(type) {
    isSubChart = false;
    // localLogs 갖고와서 각 카테고리의 총합 계산
    const localLogs = JSON.parse(localStorage.getItem("transactions")) || [];
    if (localLogs.length === 0) {
        const container = document.getElementById("pie-chart-area");
        container.innerHTML = "<div>No Data Found</div>";
        return
    }; // 로그 아무것도 없을 경우 -> 파이차트 안 그림 -> no data found 보여줘야 할 듯

    const mainTotals = calculateCategoryTotals(localLogs, type);
    const sortedMain = mainTotals.sort((a, b) => b.amount - a.amount);
    const mainColors = generateColorPalette(sortedMain.length);

    // draw pie chart
    // 파이 차트 그리기 시작
    const canvas = document.getElementById("pie-chart");
    const ctx = canvas.getContext("2d");

    if (pieChart) {
        pieChart.destroy();
    }

    const chartData = {
        labels: sortedMain.map(d => d.category),
        datasets: [{
            data: sortedMain.map(d => d.amount),
            backgroundColor: mainColors,
            borderWidth: 1
        }]
    };

    pieChart = new Chart(ctx, {
        type: "pie",
        data: chartData,
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            return ` $${value.toFixed(2)}`;
                        }
                    },
                    titleFont: { size: 22 },
                    bodyFont: { size: 22 }
                }
            },
            onClick: (event, elements) => {
                if (isSubChart) return;
                if (elements.length === 0) return;
                const index = elements[0].index;
                const category = chartData.labels[index];

                updateToSubPieChart(category); 
            }
        },
    });

    renderRankedTable(sortedMain, mainColors);
    document.getElementById("back-to-main").style.display = "none";
}

//
function updateToSubPieChart(mainCategory) {
    isSubChart = true;
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const subData = calculateSubcategoryTotals(transactions, getCurrentType(), mainCategory);

    const baseColor = sortedColorMap[mainCategory] || "#999";
    const gradientColors = getGradientColors(baseColor, subData.length);
    
    const canvas = document.getElementById("pie-chart");
    const ctx = canvas.getContext("2d");

    // update chart
    pieChart.data.labels = subData.map(item => item.category);
    pieChart.data.datasets[0].data = subData.map(item => item.amount);
    pieChart.data.datasets[0].backgroundColor = gradientColors;
    pieChart.update();

    renderRankedTable(subData, gradientColors);
    document.getElementById("back-to-main").style.display = "block";
}

//
function getCurrentType() {
    return document.getElementById("show-income").classList.contains("active") ? "INCOME" : "EXPENSE";
}


// render ranked table (for both main and sub)
function renderRankedTable(categoryData, colors, order = "desc") {
    const tableContainer = document.getElementById("category-rank-body");
    tableContainer.innerHTML = `
        <div class="category-row" data-id="title">
            <span class="category-color">●</span>
            <span class="category-rank"">#</span>
            <span class="category-name">Category</span>
            <span class="category-amount">Amount</span>
        </div>
    `;

    // sorting the category data
    const sortedCategoryData = sortRankedTable(categoryData, order);

    if (order === "asc") {
        sortedCategoryData.forEach((item, idx) => {
            sortedRankMap[item.category] = sortedCategoryData.length - idx; 
        });
        sortedCategoryData.forEach((item, idx) => {
            sortedColorMap[item.category] = colors[sortedCategoryData.length - idx - 1];
        });
    } else {
        sortedCategoryData.forEach((item, idx) => {
            sortedRankMap[item.category] = idx + 1; 
        });
        sortedCategoryData.forEach((item, idx) => {
            sortedColorMap[item.category] = colors[idx];
        });
    }

    sortedCategoryData.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "category-row";

        const rank = sortedRankMap[item.category];
        row.dataset.id = `rank-${rank}`;
    
        row.innerHTML = `
          <span class="category-color" style="background-color: ${sortedColorMap[item.category]}"></span>
          <span class="category-rank">${rank}</span>
          <span class="category-name">${item.category}</span>
          <span class="category-amount">$${item.amount.toFixed(2)}</span>
        `;
    
        tableContainer.appendChild(row);
    });

    // buttons for sorting
    const sortDown = document.getElementById("sort-down");
    const sortUp = document.getElementById("sort-up");

    sortDown.addEventListener("click", () => {
        renderRankedTable(sortedCategoryData, colors);
    });
    sortUp.addEventListener("click", () => {
        renderRankedTable(sortedCategoryData, colors, "asc");
    });
}

/**** util functions ****/
// sort the table
function sortRankedTable(categoryData, order = "desc") {
    const copy = [...categoryData];
    if (order === "desc") {
        return copy.sort((a, b) => b.amount - a.amount);
    } else if (order === "asc") {
        return copy.sort((a, b) => a.amount - b.amount);
    }
}

function calculateCategoryTotals(transactions, targetType) {
    const map = {};

    transactions.forEach(log => {
        if (log.type !== targetType) return;

        const main = log.category.main;
        if (!map[main]) {
            map[main] = 0;
        }
        map[main] += Math.abs(log.amount);
    });

    return Object.entries(map).map(([category, amount]) => ({ category, amount }));
}

function calculateSubcategoryTotals(transactions, type, mainCategory) {
    const map = {};

    const allSubcategories = getAllSubcategories(mainCategory);
    allSubcategories.forEach(sub => {
        map[sub] = 0;
    });

    transactions.forEach(log => {
        if (log.type !== type) return;
        if (log.category.main !== mainCategory) return;

        const sub = log.category.sub || "Uncategorized";
        if (!map[sub]) {
            map[sub] = 0;
        }
        map[sub] += Math.abs(log.amount);
    });

    return Object.entries(map).map(([category, amount]) => ({ category, amount }));
}

function getAllSubcategories(mainCategory) {
    const subCategories = JSON.parse(localStorage.getItem("subCategories"));
    return subCategories[mainCategory] || [];
}

function generateColorPalette(count) {
    const baseColors = [
        "#FF6384", 
        "#36A2EB", 
        "#FFCE56",
        "#66BB6A", 
        "#BA68C8", 
        "#FF7043",
        "#26C6DA", 
        "#9575CD",
        "#D4E157", 
        "#8D6E63", 
        "#F06292",
        "#4DB6AC", 
        "#7986CB",
        "#AED581", 
        "#FFD54F", 
        "#90A4AE", 
        "#FF8A65", 
        "#A1887F", 
        "#81D4FA", 
        "#CE93D8"  
      ];
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(baseColors[i % baseColors.length]);
    }
    return result;
  }

function getGradientColors(baseColor, count) {
    const rgb = hexToRgb(baseColor); 
    const result = [];
    
    if (count === 1) {
        result.push(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
        return result;
    }
  
    for (let i = 0; i < count; i++) {
      const factor = 0.2 + (0.8 * (1 - i / (count - 1))); 
      const r = Math.floor(rgb[0] * factor + 255 * (1 - factor));
      const g = Math.floor(rgb[1] * factor + 255 * (1 - factor));
      const b = Math.floor(rgb[2] * factor + 255 * (1 - factor));
      result.push(`rgb(${r}, ${g}, ${b})`);
    }
  
    return result;
}

// convert hex to rgb
function hexToRgb(hex) {
    if (hex.charAt(0) === '#') {
        hex = hex.slice(1);
    }
  
    if (hex.length === 3) {
      hex = hex.split('').map(ch => ch + ch).join('');
    }
  
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    return [ r, g, b ];
}

// month selector

