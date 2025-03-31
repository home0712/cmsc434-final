/*
    draw pie chart
*/
const canvas = document.getElementById("pie-chart");
const ctx = canvas.getContext("2d");

// samples
const sampleCategories = [
    { label: "Food", value: 40, color: "#f39c12" },
    { label: "Transport", value: 20, color: "#27ae60" },
    { label: "Entertainment", value: 25, color: "#8e44ad" },
    { label: "Others", value: 15, color: "#e74c3c" },
];

const total = sampleCategories.reduce((sum, item) => sum + item.value, 0);

let startAngle = 0;

for (const category of sampleCategories) {
    const sliceAngle = (category.value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.moveTo(100, 100);

    ctx.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
    ctx.closePath();

    ctx.fillStyle = category.color;
    ctx.fill();

    startAngle += sliceAngle;
}