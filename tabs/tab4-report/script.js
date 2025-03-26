document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");

  // Ensure Chart.js is loaded
  if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded!");
      return;
  }

  // Get canvas elements (only if they exist)
  const ctx1 = document.getElementById("myChart")?.getContext("2d");
  const ctx2 = document.getElementById("myChart2")?.getContext("2d");
  const ctx3 = document.getElementById("myChart3")?.getContext("2d");

  if (!ctx1 && !ctx2 && !ctx3) {
      console.warn("No chart canvas elements found. Skipping chart initialization.");
      return;
  }

  if (ctx1) {
      new Chart(ctx1, {
          type: "bar",
          data: {
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                  {
                      label: "Spending",
                      data: [500, 700, 600, 650, 720, 800],
                      backgroundColor: "red",
                  },
              ],
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } },
      });
  }

  if (ctx2) {
      new Chart(ctx2, {
          type: "bar",
          data: {
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                  { label: "Spending", data: [500, 700, 600, 650, 720, 800], backgroundColor: "red" },
                  { label: "Income", data: [800, 900, 850, 870, 920, 950], backgroundColor: "blue" },
                  { label: "Average", data: [650, 800, 725, 760, 820, 875], type: "line", borderColor: "green", fill: false },
              ],
          },
          options: { responsive: true, scales: { y: { beginAtZero: true } } },
      });
  }

  if (ctx3) {
      new Chart(ctx3, {
          type: "pie",
          data: {
              labels: ["Gas", "Restaurant", "Film", "Groceries", "Utilities"],
              datasets: [{ label: "Spending", data: [200, 150, 50, 300, 100], backgroundColor: ["red", "green", "blue", "gray", "purple"] }],
          },
      });
  }
});