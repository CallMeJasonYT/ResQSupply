const data = {
    labels: ['01/11', '02/11', '03/11', '04/11', '05/11', '06/11', '07/11','08/11', '09/11', '10/11', '11/11', '12/11', '13/11', '14/11'],
    datasets: [{
      label: 'New Offers',
      data: [100, 5, 29, 78, 48, 98, 37, 87, 29, 78, 39, 20, 3, 34],
      backgroundColor: [
        'rgba(200, 0, 71, 0.2)'
      ],
      borderColor: [
        'rgba(200, 0, 71, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'New Requests',
      data: [21, 45, 54, 78, 65, 32, 54, 0, 2, 1, 4, 5, 8, 78],
      backgroundColor: [
        'rgba(200, 219, 255, 0.2)'
      ],
      borderColor: [
        'rgba(200, 219, 255, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'Completed Offers',
      data: [48, 98, 37, 87, 29, 100, 5, 29, 78, 48, 45, 54, 2, 7],
      backgroundColor: [
        'rgba(149, 95, 255, 0.2)'
      ],
      borderColor: [
        'rgba(149, 95, 255, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'Completed Requests',
      data: [32, 54, 0, 2, 1, 4, 100, 5, 29, 78, 48, 98, 37, 0],
      backgroundColor: [
        'rgba(136, 255, 133, 0.2)'
      ],
      borderColor: [
        'rgba(136, 255, 133, 1)'
      ],
      borderWidth: 1
    }]
  };

  // config 
  const config = {
    type: 'bar',
    data,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: { //Remove Legends
          legend: {
              display: false
          }
      }
    }
  };

  // render init block
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );

  const containerBody = document.querySelector('.containerBody');
  const totalLabels = myChart.data.labels.length;
  if(totalLabels > 7){
      const newWidth = 700 + ((totalLabels - 7) * 30);
      containerBody.style.width = `${newWidth}px`;
  }

  //Legend Functions
  function generateLegend(){
      const chartBox = document.querySelector('.chartBox')

      const div = document.createElement('DIV');
      div.setAttribute('id', 'customLegend');

      const ul = document.createElement('UL');

      myChart.legend.legendItems.forEach((dataset, index) => {
          const text = dataset.text;
          const datasetIndex = dataset.datasetIndex;
          const bgColor = dataset.fillStyle;
          const bColor = dataset.strokeStyle;
          const fontColor = dataset.fontColor;

          const li = document.createElement('LI');

          const spanBox = document.createElement('SPAN');
          spanBox.style.borderColor = bColor;
          spanBox.style.backgroundColor = bgColor;

          const p = document.createElement('P');
          const textNode = document.createTextNode(text);

          li.onclick = (click) => {
              const isHidden = !myChart.isDatasetVisible(datasetIndex);
              myChart.setDatasetVisibility(datasetIndex, isHidden);
              updateLegend(click);
          }

          ul.appendChild(li);
          li.appendChild(spanBox);
          li.appendChild(p);
          p.appendChild(textNode);

      })
      chartBox.appendChild(div);
      div.appendChild(ul);
  };

  function updateLegend(click){
      const element = click.target.parentNode;
      element.classList.toggle('fade');
      myChart.update();
  }

  generateLegend();