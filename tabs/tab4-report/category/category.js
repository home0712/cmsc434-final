/*
    click the icon to open the category setting page
*/
const settingButton = document.getElementById("header-button");
settingButton.addEventListener("click", navigateToPage);

function navigateToPage(event) {
    const clickedButtonId = event.target.id;

    sessionStorage.setItem("returnTo", "category");
    if (clickedButtonId === "header-button") {
        window.location.href = "../../shared-popups/popup-manage-category/popup-manage-category.html";
    }
}

/*
    draw pie chart
*/
const canvas = document.getElementById("pie-chart");
const ctx = canvas.getContext("2d");

/* sample data */ 
const mainCategoryData = [
    { category: "Food", amount: 750 },
    { category: "Transport", amount: 160 },
    { category: "Entertainment", amount: 90 },
    { category: "Beverage", amount: 150 }
];

const subcategoryData = {
    Food: [
        { category: "Groceries", amount: 400 },
        { category: "Delivery", amount: 200 },
        { category: "Restaurants", amount: 150 }
    ],
    Transport: [
        { category: "Bus", amount: 100 },
        { category: "Taxi", amount: 60 }
    ],
    Beverage: [
        { category: "Coffee", amount: 150 }
    ]
};

const mainColors = ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"];

// sort in descending order
const sortedMainData = mainCategoryData.sort((a, b) => b.amount - a.amount);

const pieData = {
    labels: sortedMainData.map(item => item.category),
    datasets: [{
      data: sortedMainData.map(item => item.amount),
      backgroundColor: mainColors,
      borderWidth: 1
    }]
};

const pieOptions = {
    responsive: false,
    plugins: {
        legend: {
          display: false 
        },
        tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed;
                return ` $${value.toFixed(2)}`;
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
        if (elements.length === 0) {
            return;
        }
    
        const index = elements[0].index;
        const selectedCategory = pieChart.data.labels[index];
    
        if (subcategoryData[selectedCategory]) {
            updateToSubPieChart(selectedCategory);
        }
    }
};
  
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: pieData,
    options: pieOptions
});

/**
 * render ranked table (for both main and sub)
 */
const sortedRankMap = {};
const sortedColorMap = {};

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

// initially render the page
renderRankedTable(sortedMainData, mainColors);

/**
 * update from main pie chart to sub pie chart
 */
function updateToSubPieChart(category) {
    const subData = subcategoryData[category];
    const subLabels = subData.map(item => item.category);
    const subAmounts = subData.map(item => item.amount);

    const baseColor = getBaseColorForCategory(category); // main 카테고리 존재하지 않는 경우도 있나?
    const gradientColors = getGradientColors(baseColor, subData.length);
    console.log(gradientColors);

    pieChart.data.labels = subLabels;
    pieChart.data.datasets[0].data = subAmounts;
    pieChart.data.datasets[0].backgroundColor = gradientColors;
    pieChart.update();

    renderRankedTable(subData, gradientColors);

    document.getElementById("back-to-main").style.display = "block";
}

/**
 * back to main pie chart
 */
const backButton = document.getElementById("back-to-main");
backButton.addEventListener("click", () => {
    const mainLabels = mainCategoryData.map(item => item.category);
    const mainAmounts = mainCategoryData.map(item => item.amount);

    pieChart.data.labels = mainLabels;
    pieChart.data.datasets[0].data = mainAmounts;
    pieChart.data.datasets[0].backgroundColor = mainColors;

    pieChart.update();

    document.getElementById("back-to-main").style.display = "none";
    renderRankedTable(mainCategoryData, mainColors); 
});



/**** util functions ****/
/*
    sort the table
 */
function sortRankedTable(categoryData, order = "desc") {
    if (order === "desc") {
        return categoryData.sort((a, b) => b.amount - a.amount);
    } else if (order === "asc") {
        return categoryData.sort((a, b) => a.amount - b.amount);
    }
}

function getBaseColorForCategory(category) {
    return sortedColorMap[category];
}

/*
 * get gradient colors for sub categories pie chart
 */
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

/*
 * convert hex to rgb
 */
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