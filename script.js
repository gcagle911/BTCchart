async function drawChart() {
  const chartContainer = document.getElementById("chart");

  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: '#000' }, textColor: '#fff' },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'lime', lineWidth: 2 });

  const testData = [
    { time: 1719450000, value: 12 },
    { time: 1719450060, value: 20 },
    { time: 1719450120, value: 18 },
    { time: 1719450180, value: 25 },
    { time: 1719450240, value: 22 },
  ];

  lineSeries.setData(testData);

  // Confirmation message
  const msg = document.createElement("div");
  msg.innerHTML = "✅ Chart loaded with test data";
  msg.style.color = "yellow";
  msg.style.textAlign = "center";
  msg.style.padding = "10px";
  document.body.appendChild(msg);
}

drawChart();
