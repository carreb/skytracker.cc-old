const effGraph = document.getElementById('efficiencyGraph');

  const labels = [
    'start'
  ];

  const data = {
    labels: labels,
    datasets: [{
      label: 'EfficiencyDataGraph',
      borderColor: '#FFBF00AA',
      data: [0],
      pointRadius: 0,
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false,
            },
            x: {
                display: false
            }
        }
    }
  };

    const chart = new Chart(
    effGraph,
    config
  );
