const ctx = document.getElementById('myChart');
const ctx2 = document.getElementById('myChart2');    
const myChart = new Chart(ctx, {
    type: 'bar', // Chart type (e.g., 'bar', 'line', 'pie')
    data: {
        labels: ['Label 1', 'Label 2', 'Label 3'], // X-axis labels
        datasets: [{
            label: 'Dataset Label',
            data: [10, 20, 15], // Data values
            backgroundColor: ['red', 'blue', 'green'] // Bar colors
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const xValues = [100,200,300,400,500,600,700,800,900,1000];

new Chart(ctx2, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{ 
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
      borderColor: "red",
      fill: false
    }, { 
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
      borderColor: "green",
      fill: false
    }, { 
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    legend: {display: false}
  }
});