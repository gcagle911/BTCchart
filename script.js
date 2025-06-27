async function fetchData() {
  try {
    const response = await fetch("https://btc-logger-trxi.onrender.com/data.csv");
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const text = await response.text();
    const rows = text.trim().split("\n").slice(1);
    const parsedData = rows.map(row => {
      const [timestamp, price, bid, ask, spread, volume] = row.split(",");
      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        value: parseFloat(spread),
      };
    });

    console.log("✅ Data fetched:", parsedData.slice(0, 5)); // log first 5
    return parsedData;
  } catch (err) {
    const errorBox = document.getElementById("error");
    if (errorBox) {
      errorBox.textContent = "⚠️ Failed to load data: " + err.message;
    }
    console.error("❌ Fetch error:", err);
    return [];
  }
}

async function drawChart() {
  const chartContainer = document.getElementById("chart");
  if (!chartContainer) {
    document.body.innerHTML += "<div style='color:red'>❌ Chart container missing</div>";
    return;
  }

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { textColor: '#fff', background: { type: 'solid', color: '#000' } },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'red', lineWidth: 2 });

  const data = await fetchData();
  if (data.length === 0) {
    document.getElementById("error").textContent = "⚠️ No data to display.";
    console.warn("⚠️ No data returned.");
  } else {
    lineSeries.setData(data);
    console.log("📈 Chart rendered with data!");
  }

  setInterval(async () => {
    const updated = await fetchData();
    if (updated.length > 0) {
      lineSeries.setData(updated);
    }
  }, 60000);
}

console.log("📦 script.js loaded!");
drawChart();
