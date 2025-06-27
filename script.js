async function fetchData() {
  try {
    const response = await fetch("https://btc-logger-trxi.onrender.com/data.csv");
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const text = await response.text();
    const rows = text.trim().split("\n").slice(1); // skip header
    return rows.map(row => {
      const [timestamp, price, bid, ask, spread, volume] = row.split(",");
      return {
        time: Math.floor(new Date(timestamp).getTime() / 1000),
        value: parseFloat(spread),
      };
    });
  } catch (err) {
    console.error("Failed to fetch CSV:", err);
    return [];
  }
}

async function drawChart() {
  const chart = LightweightCharts.createChart(document.getElementById("chart"), {
    layout: { textColor: '#fff', background: { type: 'solid', color: '#000' } },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'red', lineWidth: 2 });

  const data = await fetchData();
  if (data.length === 0) {
    document.body.innerHTML = "<h2 style='color:white; text-align:center;'>No data loaded. Check console.</h2>";
  } else {
    lineSeries.setData(data);
  }

  setInterval(async () => {
    const updatedData = await fetchData();
    if (updatedData.length > 0) {
      lineSeries.setData(updatedData);
    }
  }, 60000);
}

drawChart();