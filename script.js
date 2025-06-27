function loadDataAndDrawChart() {
  fetch('https://your-logger-url/render/path/to/data.csv')  // ← use your real CSV link
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split('\n').slice(1); // skip header
      const data = lines.map(line => {
        const [timestamp, , , , spread] = line.split(',');
        return {
          time: Math.floor(new Date(timestamp).getTime() / 1000),
          value: parseFloat(spread),
        };
      });

      const chart = LightweightCharts.createChart(document.getElementById('chart'), {
        width: window.innerWidth * 0.95,
        height: 500,
      });

      const series = chart.addLineSeries({
        color: 'purple',
        lineWidth: 2,
      });

      series.setData(data);
    });
}

loadDataAndDrawChart();

// Refresh every 30 seconds
setInterval(() => {
  document.getElementById('chart').innerHTML = '';
  loadDataAndDrawChart();
}, 30000);
