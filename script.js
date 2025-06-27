function logToPage(message, color = 'yellow') {
  const box = document.getElementById("error");
  if (box) {
    box.innerHTML += `<div style="color:${color}">${message}</div>`;
  }
}

async function fetchData() {
  try {
    logToPage("📡 Fetching CSV...", "lightblue");

    const response = await fetch("https://btc-logger-trxi.onrender.com/data.csv");
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const text = await response.text();
    const rows = text.trim().split("\n").slice(1);
    const data = rows.map(row => {
      const [timestamp, price, bid, ask, spread, volume] = row.split(",");
      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        value: parseFloat(spread),
      };
    });

    logToPage(`✅ Loaded ${data.length} points`, "lightgreen");
    return data;

  } catch (err) {
    logToPage("❌ Fetch failed: " + err.message, "red");
    console.error(err);
    return [];
  }
}

async function drawChart() {
  const chartContainer = document.getElementById("chart");
  if (!chartContainer) {
    logToPage("❌ Chart container missing", "red");
    return;
  }

  logToPage("📊 Creating chart...", "orange");

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { textColor: '#fff', background: { type: 'solid', color: '#000' } },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'red', lineWidth: 2 });

  const data = await fetchData();
  if (data.length === 0) {
    logToPage("⚠️ No data to display", "yellow");
  } else {
    lineSeries.setData(data);
    logToPage("✅ Chart data plotted", "lightgreen");
  }

  setInterval(async () => {
    const updated = await fetchData();
    if (updated.length > 0) {
      lineSeries.setData(updated);
      logToPage("🔄 Chart updated", "lightblue");
    }
  }, 60000);
}

drawChart();
