async function fetchData() {
  try {
    const response = await fetch("https://btc-logger-trxi.onrender.com/data.csv");
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const text = await response.text();

    const rows = text.trim().split("\n").slice(1);
    if (rows.length === 0) throw new Error("CSV is empty");

    return rows.map(row => {
      const [timestamp, price, bid, ask, spread, volume] = row.split(",");
      if (!timestamp || isNaN(parseFloat(spread))) return null;
      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        value: parseFloat(spread),
      };
    }).filter(Boolean);
  } catch (err) {
    const errorBox = document.getElementById("error");
    if (errorBox) {
      errorBox.textContent = "⚠️ Error loading data: " + err.message;
    }
    console.error("Fetch error:", err);
    return [];
  }
}

async function drawChart() {
  const chartContainer = document.getElementById("chart");
  const errorBox = document.getElementById("error");

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { textColor: '#fff', background: { type: 'solid', color: '#000' } },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'red', lineWidth: 2 });

  const data = await fetchData();
  if (data.length === 0) {
    errorBox.textContent = "⚠️ No valid data found in CSV.";
  } else {
    lineSeries.setData(data);
  }

  setInterval(async () => {
    const updated = await fetchData();
    if (updated.length > 0) {
      lineSeries.setData(updated);
    }
  }, 60000);
}

drawChart();
