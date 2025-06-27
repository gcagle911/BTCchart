async function drawChart() {
  const chartContainer = document.getElementById("chart");
  const chart = LightweightCharts.createChart(chartContainer, {
    layout: { textColor: '#fff', background: { type: 'solid', color: '#000' } },
    rightPriceScale: { visible: true },
    timeScale: { timeVisible: true, secondsVisible: true },
  });

  const lineSeries = chart.addLineSeries({ color: 'lime', lineWidth: 2 });

  // Hardcoded test data (just 5 points)
  const testData = [
    { time: 1719450000, value: 12 },
    { time: 1719450060, value: 20 },
    { time: 1719450120, value: 18 },
    { time: 1719450180, value: 25 },
    { time: 1719450240, value: 22 },
  ];

  lineSeries.setData(testData);
}

drawChart();
