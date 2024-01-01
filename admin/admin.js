/* ~~~~~~~~~~ Map Creation ~~~~~~~~~~ */

var map = L.map('map').setView([38.246242, 21.7350847], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.zoomControl.remove();

const searchInput = document.querySelector('.address-search');
const mapContainer = document.getElementById('map-container');
const map_desktop = document.getElementById('map');
map_desktop.classList.add("map");
map_desktop.classList.add("active");

var searchControl = L.control({
  position: 'topright'
});

searchControl.onAdd = function (map) {
  var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar');
  container.innerHTML = '<div class="search active">' +
    `<input type="text" class="address-search" placeholder="Search...">` +
    `<i class="fa-solid fa-magnifying-glass mglass" id="search-icon"></i>` +
    '</div>';

  // Add event listener to the mglassIcon
  const mglassIcon = container.querySelector("#search-icon");
  mglassIcon.addEventListener("click", fetchGeoSearch);
  return container;
};

searchControl.addTo(map);

function fetchGeoSearch() {
  const query = document.querySelector(".address-search").value;
  fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query + '&limit=1')
    .then(result => result.json())
    .then(parsedResult => {
      setResultList(parsedResult[0]);
    });
}

function setResultList(parsedResult) {
  if (parsedResult && parsedResult.lat && parsedResult.lon) {
    const latitude = parseFloat(parsedResult.lat);
    const longitude = parseFloat(parsedResult.lon);
    const position = new L.LatLng(latitude, longitude);
    map.flyTo(position, 15);
  }
}

const categoryIcons = {
  'Pending Request': L.icon({
    iconUrl: '/ResQSupply/icons/requestsIconPending.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'Executing Request': L.icon({
    iconUrl: '/ResQSupply/icons/requestsIconExecuting.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'Pending Offer': L.icon({
    iconUrl: '/ResQSupply/icons/offersIconPending.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'Executing Offer': L.icon({
    iconUrl: '/ResQSupply/icons/offersIconExecuting.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'Base': L.icon({
    iconUrl: '/ResQSupply/icons/baseIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'NoTruck': L.icon({
    iconUrl: '/ResQSupply/icons/truckIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'YesTruck': L.icon({
    iconUrl: '/ResQSupply/icons/truckActiveIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
};

function fetchTasksLoc() {
  fetch("fetch_BaseInfo.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, 'Base', null);
      })
      return fetch("fetch_TrucksLoc.php", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          data.forEach(entry => {
            setMapMarkers(entry.lat, entry.lon, entry.category, entry.veh_id);
          });
          return fetch("fetch_TasksLoc.php", { method: "POST" })
            .then((response) => response.json())
            .then((data) => {
              data.forEach(entry => {
                setMapMarkers(entry.lat, entry.lon, entry.task_id, null);
              });
            });
        });
    });
}

function revGeocode(query) {
  var lng = query.lng;
  var lat = query.lat;
  fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&format=json')
    .then(result => result.json())
    .then(result => {
      updateBaseLoc(parseDisplayName(result.display_name), lat, lng);
    });
}

function parseDisplayName(displayName) {
  const words = displayName.split(', ');
  const address = words.slice(0, 2).join(', ');
  return address;
}

function updateBaseLoc(position, lat, lon) {
  fetch('update_BaseLoc.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address: position, latitude: lat, longitude: lon })
  })
    .then(response => response.json())
}

const taskMarkers = [];
const truckMarkers = [];
const baseMarkers = [];
function setMapMarkers(lat, lon, task_id, veh_id) {
  const latitude = lat;
  const longitude = lon;
  if (task_id == 'YesTruck') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['YesTruck'], draggable: false });
    marker.truckInfo = {
      vehId: veh_id,
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    marker.on('click', function () {
      showTruckPopup(marker);
    });
    truckMarkers.push(marker);
  } else if (task_id == 'NoTruck') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['NoTruck'], draggable: false });
    marker.truckInfo = {
      vehId: veh_id,
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    marker.on('click', function () {
      showTruckPopup(marker);
    });
    truckMarkers.push(marker);
  } else if (task_id == 'Base') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Base'], draggable: true });
    marker.baseInfo = {
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    baseMarkers.push(marker);

    marker.on('dragend', function (e) {
      var position = marker.getLatLng();
      marker.setLatLng(position).update();
      map.panTo(position);
      revGeocode(position);
    });
  } else {
    fetch("fetch_TasksInfo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskID: task_id })
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach(res => {
          var iconName = "";
          if (res.status != 'Completed') {
            iconName = "" + res.status + " " + res.category + "";
          }
          if (iconName != "") {
            const marker = new L.Marker([latitude, longitude], { icon: categoryIcons[iconName] });
            marker.taskInfo = {
              taskVeh: res.veh,
              taskId: task_id,
              latitude: latitude,
              longitude: longitude
            };
            marker.addTo(map);
            marker.on('click', function () {
              showTaskPopup(marker, res.status);
            });
            taskMarkers.push(marker);
          }
        });
        drawLine('HEY1234');
        drawLine('HEY1235');
      });
  }
}

function showTaskPopup(marker, status) {
  fetch("fetch_TasksPopup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskID: marker.taskInfo.taskId })
  })
    .then((response) => response.json())
    .then((taskDetails) => {
      var popupContent = `
        <b>Citizen Fullname:</b> ${taskDetails[0].fullname}<br>
        <b>Citizen Phone No.:</b> ${taskDetails[0].telephone}<br>
        <b>Creation Date:</b> ${taskDetails[0].creationDate}<br>
        <b>Good Name:</b> ${taskDetails[0].goodName}<br>
        <b>Quantity:</b> ${taskDetails[0].goodValue}<br>
        <b>Pickup Date:</b> ${taskDetails[0].pickupDate}<br>
        <b>Vehicle ID:</b> ${taskDetails[0].vehicle} <br>
      `;

      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    });
}

function showTruckPopup(marker) {
  fetch("fetch_TrucksPopup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicleID: marker.truckInfo.vehId })
  })
    .then((response) => response.json())
    .then((data) => {
      var popupContent = '';
      popupContent += `
        <b>Truck ID:</b> ${marker.truckInfo.vehId}<br>
        <b>Active Tasks:</b> ${data.taskCount}<br>
        `;

      const hasOtherProperties = Object.keys(data).some((key) => key != 'taskCount');
      if (hasOtherProperties) {
        popupContent += '<b>TruckLoad:</b><br>';
        for (let index in data) {
          if (index !== 'taskCount') {
            const load = data[index];
            popupContent += `<b>Item ${index}:</b> ${load.load_goodn} - ${load.load_goodv}<br>`;
          }
        }
      } else {
        popupContent += `<b>TruckLoad:</b> Empty<br>`;
      }

      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    })
}

const filters = L.control({ position: 'topleft' });
filters.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'filters');
  div.innerHTML += `<div class="filter-btn"><i class="fa-solid fa-filter filter-ico"></i>
  <p class="filter-text">Filters</p></div>`;

  const filterBtn = div.querySelector('.filter-btn');
  filterBtn.addEventListener('click', function () {
    replaceMapWithMenu();
  });
  return div;
};
filters.addTo(map);

//Replace the Map with the Filter Menu
const filtersmenu = document.querySelector(".filters-menu");
const search = document.querySelector(".map-container .search");
function replaceMapWithMenu() {
  map_desktop.classList.remove("active");
  filtersmenu.classList.add("active");
  search.classList.remove("active");
}

//Add or Remove Markers when the xmark is clicked
document.addEventListener("DOMContentLoaded", function () {
  const xmark = document.querySelector(".cancelf");
  xmark.addEventListener('click', () => {
    var checkboxes = document.querySelectorAll('.filters-list input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      var parentFilter = checkbox.closest('.filter');
      var filterName = parentFilter.querySelector('.name').textContent;

      switch (filterName) {
        case 'Pending Requests':
          if (!checkbox.checked) {
            removeMarkersByCategory('Pending Request');
          } else {
            addMarkersByCategory('Pending Request');
          }
          break;
        case 'Executing Requests':
          if (!checkbox.checked) {
            removeMarkersByCategory('Executing Request');
          } else {
            addMarkersByCategory('Executing Request');
          }
          break;
        case 'Pending Offers':
          if (!checkbox.checked) {
            removeMarkersByCategory('Pending Offer');
          } else {
            addMarkersByCategory('Pending Offer');
          }
          break;
        case 'Executing Offers':
          if (!checkbox.checked) {
            removeMarkersByCategory('Executing Offer');
          } else {
            addMarkersByCategory('Executing Offer');
          }
          break;
        case 'Trucks with Active Tasks':
          if (!checkbox.checked) {
            removeMarkersByCategory('YesTruck');
            hidePolylines();
          } else {
            addMarkersByCategory('YesTruck');
            showPolylines();
          }
          break;
        case 'Trucks without Active Tasks':
          if (!checkbox.checked) {
            removeMarkersByCategory('NoTruck');
          } else {
            addMarkersByCategory('NoTruck');
          }
          break;
        case 'Tasks Lines':
          if (!checkbox.checked) {
            hidePolylines();
          } else {
            showPolylines();
          }
          break;
      }
    });
    search.classList.add("active");
    filtersmenu.classList.remove("active");
    map_desktop.classList.add("active");
  });
});

function removeMarkersByCategory(category) {
  if (category == 'YesTruck' || category == 'NoTruck') {
    truckMarkers.forEach(marker => {
      const iconName = getIconName(marker);
      if (iconName.includes(category)) {
        map.removeLayer(marker);
      }
    });
  } else {
    taskMarkers.forEach(marker => {
      const iconName = getIconName(marker);
      if (iconName.includes(category)) {
        map.removeLayer(marker);
      }
    });
  }
}

function addMarkersByCategory(category) {
  if (category == 'YesTruck' || category == 'NoTruck') {
    truckMarkers.forEach(marker => {
      const iconName = getIconName(marker);
      if (iconName.includes(category)) {
        map.addLayer(marker);
      }
    });
  } else {
    taskMarkers.forEach(marker => {
      const iconName = getIconName(marker);
      if (iconName.includes(category)) {
        map.addLayer(marker);
      }
    });
  }
}

function getIconName(marker) {
  const iconUrl = marker.options.icon.options.iconUrl;
  const iconName = Object.keys(categoryIcons).find(key => categoryIcons[key].options.iconUrl == iconUrl);
  return iconName;
}

function hidePolylines() {
  polylines.forEach(polyline => {
    map.removeLayer(polyline);
  })
}

function showPolylines() {
  polylines.forEach(polyline => {
    map.addLayer(polyline);
  })
}

document.addEventListener("DOMContentLoaded", function () {
  var filterItems = document.querySelectorAll('.filters-list li .name');
  filterItems.forEach(function (item) {
    var checkbox = item.parentNode.querySelector('input[type="checkbox"]');
    item.addEventListener('click', function () {
      checkbox.checked = !checkbox.checked;
    });
  })
});

const legendContent = {
  'Pending Request': 'Pending Requests',
  'Executing Request': 'Executing Requests',
  'Pending Offer': 'Pending Offers',
  'Executing Offer': 'Executing Offers',
  'Base': 'Base Location',
  'YesTruck': 'Trucks with Active Tasks',
  'NoTruck': 'Trucks without Active Tasks'
};

const legend = L.control({ position: 'topleft' });

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'legend');
  for (const category in categoryIcons) {
    div.innerHTML += `<div><img src="${categoryIcons[category].options.iconUrl}" /> ${legendContent[category]}</div>`;
  }
  return div;
};

legend.addTo(map);

L.control.zoom({
  position: 'bottomright'
}).addTo(map);

const polylines = [];
function drawLine() {
  truckMarkers.forEach(function (tmarker) {
    const pointA = [tmarker.getLatLng().lat, tmarker.getLatLng().lng];
    const tasksToTruck = taskMarkers.filter(marker => marker.taskInfo.taskVeh == tmarker.truckInfo.vehId);
    tasksToTruck.forEach(function (task) {
      const pointB = [task.getLatLng().lat, task.getLatLng().lng];
      const polyline = L.polyline([pointA, pointB], { color: '#350052' }).addTo(map);
      polyline.taskInfo = {
        task_id: task.id
      };
      polylines.push(polyline);
    });
  })
}

function removeAllPolylines() {
  polylines.forEach(polyline => map.removeLayer(polyline));
  polylines.length = 0;
}

function removePolyline(task_id) {
  const polylineToRemove = polylines.find(polyline => polyline.taskInfo.task_id == task_id);
  map.removeLayer(polylineToRemove);
  const index = polylines.indexOf(polylineToRemove);
  if (index !== -1) {
    polylines.splice(index, 1);
  }
}

/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  map.invalidateSize();
  checkWidth();
  fetchTasksLoc();
  fetchStorageInfo();
});
window.addEventListener("resize", (e) => {
  checkWidth();
});

//Checking Viewport Width
var viewportW = window.innerWidth;
var cnt = 0;
function checkWidth() {
  let windowWidth = window.innerWidth;
  if (windowWidth < 960) {
    if (cnt == 1) {
      mobileApply();
    }
  } else {
    if (cnt == 0) {
      desktopApply();
    }
  }
}

//Desktop Layout Changes
function desktopApply() {
  deskCustomization();
  cnt++;
}

//Creating desktop-view Div
const burgerCont = document.querySelector(".burger-container");
const storageCont = document.querySelector(".storage-container");

//Activating all the tabs and NavBar Options
const burgerIcox = document.querySelector(".burgerx");
const burgerIco = document.querySelector(".burgeri");

function deskCustomization() {
  var storageSection = document.querySelector('.storage-sect');
  var mapSection = document.querySelector('.map-sect');
  var mainElement = document.querySelector('main');
  mainElement.removeChild(storageSection);
  mainElement.insertBefore(storageSection, mapSection);
  map.invalidateSize();
}

//Mobile Layout Changes
function mobileApply() {
  mobileCustomization();
  cnt--;
}

//Activating 
function mobileCustomization() {
  var storageSection = document.querySelector('.storage-sect');
  var mapSection = document.querySelector('.map-sect');
  var mainElement = document.querySelector('main');
  mainElement.removeChild(storageSection);
  mainElement.insertBefore(storageSection, mapSection.nextSibling);
  map.invalidateSize()
}

/* ~~~~~~~~~~ Burger Menu Functions ~~~~~~~~~~ */

//Burger Open
const burgerSect = document.querySelector(".burger-sect");
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerSect.classList.add("active");
});

//Burger Close
const statsTab = document.querySelector(".statistics-sect");
const rescAccSect = document.querySelector(".rescuer-acc-sect");
const annCreateSect = document.querySelector(".ann-create-sect");
const storageMngSect = document.querySelector(".storage-mngmt-sect");

burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerSect.classList.remove("active");
});

const burgerItems = document.querySelectorAll(".burger-item");
const mapSection = document.querySelector(".map-sect");
const storageSection = document.querySelector(".storage-sect");
burgerItems.forEach(function (item) {
  item.addEventListener("click", function () {
    switch (item.id) {
      case 'home':
        mapSection.classList.add("active");
        storageSection.classList.add("active");
        rescAccSect.classList.remove("active");
        annCreateSect.classList.remove("active");
        storageMngSect.classList.remove("active");
        statsTab.classList.remove("active");
        burgerSect.classList.remove("active");
        burgerIco.classList.add("active");
        burgerIcox.classList.remove("active");
        fetchStorageInfo();
        map.invalidateSize();
        break;
      case 'stats':
        statsTab.classList.add("active");
        burgerIco.classList.add("active");
        burgerIcox.classList.remove("active");
        mapSection.classList.remove("active");
        storageSection.classList.remove("active");
        burgerSect.classList.remove("active");
        annCreateSect.classList.remove("active");
        storageMngSect.classList.remove("active");
        rescAccSect.classList.remove("active");
        fetchAndRenderChart('2023-12-15', '2023-12-25');
        break;
      case 'resacc':
        rescAccSect.classList.add("active");
        burgerIco.classList.add("active");
        burgerIcox.classList.remove("active");
        mapSection.classList.remove("active");
        storageSection.classList.remove("active");
        burgerSect.classList.remove("active");
        annCreateSect.classList.remove("active");
        storageMngSect.classList.remove("active");
        statsTab.classList.remove("active");
        break;
      case 'announcement':
        annCreateSect.classList.add("active");
        rescAccSect.classList.remove("active");
        storageMngSect.classList.remove("active");
        burgerIco.classList.add("active");
        burgerIcox.classList.remove("active");
        mapSection.classList.remove("active");
        storageSection.classList.remove("active");
        burgerSect.classList.remove("active");
        statsTab.classList.remove("active");
        break;
      case 'storage':
        storageMngSect.classList.add("active");
        rescAccSect.classList.remove("active");
        annCreateSect.classList.remove("active");
        burgerIco.classList.add("active");
        burgerIcox.classList.remove("active");
        mapSection.classList.remove("active");
        storageSection.classList.remove("active");
        burgerSect.classList.remove("active");
        statsTab.classList.remove("active");
        fetchUpdateStorage()
        quantityChanges = [];
        break;
    }
  });
});


/* ~~~~~~~~~~ Statistics ~~~~~~~~~~ */
Chart.defaults.plugins.legend.position = 'top';
Chart.defaults.plugins.legend.align = 'start';

const config = {
  type: 'bar',
  data: {},
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    legend: {
      position: "top",
      align: "start"
    }
  }
};

// render init block
const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

const containerBody = document.querySelector('.containerBody');
const chartBox = document.querySelector('.chartBox');
function fetchAndRenderChart(startDate, endDate) {
  fetch('statistics.php')
    .then(response => response.json())
    .then(data => {

      // Transform fetched data to match the structure of the chart data
      var transformedData = [];
      for (let i = 0; i < 4; i++) {
        transformedData[i] = transformData(data.datasets[i], startDate, endDate);
      }

      // Check if myChart.data.datasets is an array, if not initialize it
      if (!Array.isArray(myChart.data.datasets)) {
        myChart.data.datasets = [];
      }

      // Adds Empty Datasets
      while (myChart.data.datasets.length < 4) {
        myChart.data.datasets.push({
          data: [],
        });
      }

      // Update chart data with transformed data
      myChart.data.labels = transformedData[0].labels;
      var legend = ['New Offers', 'New Requests', 'Completed Offers', 'Completed Requests'];
      for (let i = 0; i < 4; i++) {
        myChart.data.datasets[i].data = transformedData[i].data;
        myChart.data.datasets[i].label = legend[i];
      }

      // Update container width based on the number of labels
      const totalLabels = transformedData[0].labels.length;
      let newWidth;
      if (totalLabels > 7) {
        if (viewportW > 1000) {
          newWidth = 1000 + ((totalLabels - 7) * 150);
        } else {
          newWidth = 700 + ((totalLabels - 7) * 150);
        }
        containerBody.style.width = `${newWidth}px`;
      }

      // Update the chart
      myChart.update();
    });
}

function transformData(jsonData, startDate, endDate) {
  let dates = [];

  let currentDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDateObj <= endDateObj) {
    let month = currentDateObj.getMonth() + 1;
    let day = currentDateObj.getDate();

    if (day < 10) {
      day = '0' + day;
    }

    let date = `${currentDateObj.getFullYear()}-${month}-${day}`;
    dates.push(date);

    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }

  let finalLabels = [];
  let finalDatas = [];

  for (const [index, date] of dates.entries()) {
    if (jsonData.data.count[date]) {
      finalLabels.push(date);
      finalDatas.push(jsonData.data.count[date]);
    } else {
      finalLabels.push(date);
      finalDatas.push(0);
    }
  }

  return { labels: finalLabels, data: finalDatas };
}

const picker = new easepick.create({
  element: document.getElementById('datepicker'),
  css: [
    'custom_date_picker.css'
  ],
  plugins: ['RangePlugin'],
  RangePlugin: {
    tooltip: true,
  }
});

/* ~~~~~~~~~~ Announcement Creation Functions ~~~~~~~~~~ */

const annTextForm = document.querySelector(".ann-text-form");
const annItemsForm = document.querySelector(".ann-items-form");
const annConfirmForm = document.querySelector(".ann-confirm-form");
const annNextTextBtn = document.querySelector(".ann-next-text");
const annNextItemsBtn = document.querySelector(".ann-next-items");
const annSubmitBtn = document.querySelector(".ann-submit");
const cancelAnn = document.querySelectorAll(".cancela");
let selectedItems = [];

cancelAnn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    annTextForm.classList.add("active");
    annItemsForm.classList.remove("active");
    annConfirmForm.classList.remove("active");

  })
})

const titleInput = document.querySelector("#title");
const detailsInput = document.querySelector("#details");
var titleValue;
var detailsValue;
annNextTextBtn.addEventListener("click", function () {
  annTextForm.classList.remove("active");
  annItemsForm.classList.add("active");
  titleValue = titleInput.value;
  detailsValue = detailsInput.value;
  fetchStorageItems();
})

annNextItemsBtn.addEventListener("click", function () {
  selectedItems = [];
  annItemsForm.classList.remove("active");
  annConfirmForm.classList.add("active");
  selItems();
  showAnnouncement();
})

annSubmitBtn.addEventListener("click", function () {
  annSubmit();
  showSuccessMessageAnn();
})

const successMessageAnn = document.getElementById("successMessageAnn");
function showSuccessMessageAnn() {
  successMessageAnn.style.display = "block";
  setTimeout(() => {
    successMessageAnn.style.display = "none";
    annConfirmForm.classList.remove("active");
    annTextForm.classList.add("active");
  }, 3000);
}

const itemSelect = document.querySelector(".item-drop-sel");
function fetchStorageItems() {
  fetch("fetch_storageItems.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.length != 0) {
        itemSelect.classList.add("active");
        data.forEach((res) => {
          markup =
            `<li class="item">` +
            `<p class="item-text">${res.GoodName}</p>` +
            `</li>`;
          document.querySelector(".ann-items-form .item-list").insertAdjacentHTML("beforeend", markup);
        });
        itemsBtn = document.querySelectorAll(".ann-items-form .item-list .item");
        itemsBtnListener();
      } else {
        itemSelect.classList.remove("active");
        markup = `<p class="empty">There aren't any Goods in the Storage at the moment.</p>`;
        document.querySelector(".item-select").insertAdjacentHTML("beforeend", markup);
      }
    });
}

//Adding Event Listeners to the Item Elements and Displaying the Selected Items Correctly
var itemsBtn = document.querySelectorAll(".ann-items-form .item-list .item");
function itemsBtnListener() {
  itemsBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
      } else {
        item.classList.add("selected");
      }
    });
  });
}

//Loading the Selected Items on an Array
function selItems() {
  itemsBtn.forEach(function (item) {
    if (item.classList.contains("selected")) {
      selectedItems.push(item.innerText);
    }
  });
}

//Show the Final Announcement beore Submititng
function showAnnouncement() {
  markup =
    `<div class="item-title"><b>${titleValue}</b></div>` +
    `<div class="text">${detailsValue}</div>` +
    `<div class="needs"><p>Need for: ${selectedItems.join(', ')}</p></div>`;
  document.querySelector(".ann-text-confirm").insertAdjacentHTML("beforeend", markup);
}

function annSubmit() {
  fetch("announcement_Creation.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: titleValue, details: detailsValue, selectedItems: selectedItems }),
  })
    .then((response) => response.json())
}

/* ~~~~~~~~~~ Storage Management Functions ~~~~~~~~~~ */

function toggleBottomBorder(clickedButton) {
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function (button) {
    button.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

const storageBtn = document.querySelector("#storageBtn");
const storageUpdateTab = document.querySelector(".storage-update-tab");
const transferredItemsTab = document.querySelector(".transferred-items-tab");
const updateGoodsTab = document.querySelector(".update-goods-tab");
storageBtn.addEventListener("click", function () {
  storageUpdateTab.classList.add("active");
  transferredItemsTab.classList.remove("active");
  updateGoodsTab.classList.remove("active");
  quantityChanges = [];
  fetchUpdateStorage();
})

const transferredBtn = document.querySelector("#transferredBtn");
transferredBtn.addEventListener("click", function () {
  fetchtransferredItems();
  quantityChanges = [];
  transferredItemsTab.classList.add("active");
  storageUpdateTab.classList.remove("active");
  updateGoodsTab.classList.remove("active");
})

const updateBtn = document.querySelector("#updateBtn");
updateBtn.addEventListener("click", function () {
  quantityChanges = [];
  updateGoodsTab.classList.add("active");
  transferredItemsTab.classList.remove("active");
  storageUpdateTab.classList.remove("active");
})

/* ~~~~~~~~~~ transferred Items Functions ~~~~~~~~~~ */
var goodListItems = [];
var storageItemsNames = [];
var storageListItems = [];
const successMessagetransferred = document.getElementById("successMessagetransferred");
function showSuccessMessagetransferred() {
  successMessagetransferred.style.display = "block";
  setTimeout(() => {
    successMessagetransferred.style.display = "none";
  }, 3000);
}
function fetchtransferredItems() {
  // Fetch storage items
  fetch("fetch_storageItems.php")
    .then((response) => response.json())
    .then((data) => {
      emptyGoodStorageLists();
      if (data.length !== 0) {
        data.forEach((res) => {
          const markup = `<li class="item">` +
            `<p class="item-text">${res.GoodName}</p>` +
            `</li>`;
          document.querySelector(".storage-item-list").insertAdjacentHTML("beforeend", markup);
          storageItemsNames.push(res.GoodName);
        });

        const items = document.querySelectorAll(".storage-item-list .item");
        items.forEach((item) => {
          storageListItems.push(item);
        });
        storageItemsEventListener();
      } else {
        if (!document.querySelector(".storage-items-form .empty")) {
          const markup = `<p class="empty">There aren't any Goods in the Storage at the moment.</p>`;
          document.querySelector(".storage-items-form .item-options").insertAdjacentHTML("beforeend", markup);
        }
      }
      return fetch("fetch_GoodItems.php");
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.length !== 0) {
        data.forEach((res) => {
          if (!storageItemsNames.includes(res.GoodName)) {
            const markup = `<li class="item">` +
              `<p class="item-text">${res.GoodName}</p>` +
              `</li>`;
            document.querySelector(".good-item-list").insertAdjacentHTML("beforeend", markup);
          }
        });

        const items = document.querySelectorAll(".good-item-list .item");
        items.forEach((item) => {
          goodListItems.push(item);
        });
        goodsItemsEventListener();
      } else {
        if (!document.querySelector(".good-items-form .empty")) {
          const markup = `<p class="empty">There aren't any Available Goods at the moment</p>`;
          document.querySelector(".good-items-form .item-options").insertAdjacentHTML("beforeend", markup);
        }
      }
    });
}

var storageListenersAdded = [];
var goodListenersAdded = [];
function storageItemsEventListener() {
  storageListItems.forEach(function (item, index) {
    if (!storageListenersAdded[index]) {
      item.addEventListener("click", function () {
        const clonedItem = item.cloneNode(true);
        document.querySelector(".good-item-list").appendChild(clonedItem);
        goodListItems.push(clonedItem);
        storageListItems.splice(storageListItems.indexOf(item), 1);
        storageListenersAdded.splice(index, 1);
        sortItems(".storage-item-list");
        sortItems(".good-item-list");
        goodsItemsEventListener();
        item.remove();
      });
      storageListenersAdded[index] = true;
    }
  });
}

function goodsItemsEventListener() {
  goodListItems.forEach(function (item, index) {
    if (!goodListenersAdded[index]) {
      item.addEventListener("click", function () {
        const clonedItem = item.cloneNode(true);
        document.querySelector(".storage-item-list").appendChild(clonedItem);
        storageListItems.push(clonedItem);
        goodListItems.splice(goodListItems.indexOf(item), 1);
        goodListenersAdded.splice(index, 1);
        sortItems(".storage-item-list");
        sortItems(".good-item-list");
        storageItemsEventListener();
        item.remove();
      });
      goodListenersAdded[index] = true;
    }
  });
}

function emptyGoodStorageLists(){
  const goodsItems = document.querySelector(".good-item-list");
  const storageItems = document.querySelector(".storage-item-list");
  goodsItems.innerHTML = "";
  goodListItems = [];
  goodListenersAdded = [];
  storageItems.innerHTML = "";
  storageListItems = [];
  storageListenersAdded = [];
}

function sortItems(selector) {
  const list = document.querySelectorAll(selector + " .item");
  const sortedList = Array.from(list).sort((a, b) => {
    const textA = a.querySelector(".item-text").innerText.toLowerCase();
    const textB = b.querySelector(".item-text").innerText.toLowerCase();
    return textA.localeCompare(textB);
  });
  document.querySelector(selector).innerHTML = "";

  sortedList.forEach((item) => {
    document.querySelector(selector).appendChild(item);
  });
}

const submittransferredBtn = document.querySelector(".exchange-submit");
submittransferredBtn.addEventListener("click", submitTranferedItems);

function submitTranferedItems(){
  showSuccessMessagetransferred();
  var itemNames = [];
  storageListItems.forEach((item) => {
    itemNames.push(item.innerText);
  })

  fetch("submit_TranferedItems.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemNames)
  })
    .then((response) => response.json())
    .then((data) => {})
}


/* ~~~~~~~~~~ Update Storage Functions ~~~~~~~~~~ */
var errorNoChange
const cancelUpdate = document.querySelector(".cancelupd");
const strgQuantityForm = document.querySelector(".storage-quantity-form");
const strgConfirmForm = document.querySelector(".storage-confirm-form");
let quantityChanges = [];

cancelUpdate.addEventListener("click", function () {
  strgQuantityForm.classList.add("active");
  strgConfirmForm.classList.remove("active");
  document.querySelector(".storage-confirm-form .items-list").innerHTML = "";
  errorNoChange.classList.remove("active");
  fetchUpdateStorage();
})

function storageNextEventListener() {
  const strgNextQuantityBtn = document.querySelector(".strg-next-quantity");
  strgNextQuantityBtn.addEventListener("click", function () {
    displayFinalChanges();
    if (Object.keys(quantityChanges).length == 0) {
      errorNoChange.classList.add("active");
    }else{
      strgQuantityForm.classList.remove("active");
      strgConfirmForm.classList.add("active");
    }
  })
}

const successMessageStorage = document.getElementById("successMessageStorage");
const strgSubmitBtn = document.querySelector(".storage-submit");
strgSubmitBtn.addEventListener("click", function () {
  submitChanges();
  showSuccessMessageStorage();
})

function showSuccessMessageStorage() {
  successMessageStorage.style.display = "block";
  setTimeout(() => {
    errorNoChange.classList.remove("active");
    successMessageStorage.style.display = "none";
    strgConfirmForm.classList.remove("active");
    strgQuantityForm.classList.add("active");
    quantityChanges = [];
    fetchUpdateStorage();
  }, 3000);
}

function fetchUpdateStorage() {
  fetch("fetch_storageItems.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const storageForm = document.querySelector(".storage-quantity-form");
      document.querySelector(".storage-confirm-form .items-list").innerHTML = "";
      if (data.length != 0) {
        if (!storageForm.querySelector(".item-select")) {
          markup1 =
            `<div class="item-select">` +
            `<ul class="items-list">` +
            `</ul>` +
            `</div>`;
          storageForm.insertAdjacentHTML("beforeend", markup1);
        }
        data.forEach((res) => {
          const existingItem = storageForm.querySelector(`.item-text[data-goodname="${res.GoodName}"]`);
          if (!existingItem) {
            markup =
              `<li class="item">` +
              `<div class="item-count">` +
              `<p class="item-text" data-goodname="${res.GoodName}">${res.GoodName}</p>` +
              `<div class="item-quantity">` +
              `<p class="quantity-text">Quantity:</p>` +
              `<input class="quantity-input" type="number" value="${res.GoodValue}" oninput="validity.valid||(value='0');" onchange="updateQuantity(this, '${res.GoodName}')">` +
              `<p class="reset-button" onclick="resetQuantity(this, ${res.GoodValue})"> Reset </p>` +
              `</div>` +
              `</div>` +
              `</li>`;
            storageForm.querySelector(".items-list").insertAdjacentHTML("beforeend", markup);
          }
        });
        if (!storageForm.querySelector(".strg-next-quantity")) {
          markup2 = `<button type="button" class="button strg-next-quantity"> Next </button>`;
          storageForm.insertAdjacentHTML("beforeend", markup2);
          storageNextEventListener();
        }
        if (!storageForm.querySelector(".error.nochange")) {
          markup3 =
           `<div class="error nochange">`+
            `<p><b>Error:&nbsp;</b> No changes were made.</p>`+
            `</div>`;
          storageForm.insertAdjacentHTML("beforeend", markup3);
          errorNoChange = document.querySelector(".error.nochange");
        }
      } else {
        if (!storageForm.querySelector(".storage-quantity-form .empty")) {
          markup = `<p class="empty">There aren't any Goods in the Storage at the moment.</p>`;
          storageForm.insertAdjacentHTML("beforeend", markup);
        }
      }
    });
}

function resetQuantity(button, initialValue) {
  const inputElement = button.parentElement.querySelector('.quantity-input');
  inputElement.value = initialValue;
  const goodName = inputElement.parentElement.parentElement.querySelector('.item-text').getAttribute('data-goodname');
  delete quantityChanges[goodName];
}

function updateQuantity(inputElement, goodName) {
  quantityChanges[goodName] = parseInt(inputElement.value);
}

function displayFinalChanges(){
   for (const goodName in quantityChanges) {
    const newQuantity = quantityChanges[goodName];
    markup =
      `<li class="item">`+
      `<div class="item-count">`+
      `<p class="item-text"> ${goodName} </p>`+
      `<div class="item-quantity">`+
      `<p class="quantity-text">Quantity: ${newQuantity}</p>`+
      `</div>`+
      `</li>`;
    document.querySelector(".storage-confirm-form .items-list").insertAdjacentHTML("beforeend", markup);
   }
}

function submitChanges(){
  const itemsToSend = {};
  for (const goodName in quantityChanges) {
    itemsToSend[goodName] = quantityChanges[goodName];
  }
  fetch("update_Quantity.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemsToSend)
  })
    .then((response) => response.json())
    .then((data) => {document.querySelector(".storage-quantity-form .items-list").innerHTML = "";})
}
  
/* ~~~~~~~~~~ Update Goods Functions ~~~~~~~~~~ */

let fileInput = document.querySelector(".file-input");
let fileList = document.getElementById("files-list");
let numOfFiles = document.getElementById("num-of-files");
const fileLabel = document.querySelector(".file-label");
const errorFiletype = document.querySelector(".error.filetype");
fileInput.addEventListener("change", () => {
  fileList.innerHTML = "";
  numOfFiles.textContent = ``;
  for (i of fileInput.files) {
    let reader = new FileReader();
    if (i.type != "application/json") {
      errorFiletype.classList.add("active");
      numOfFiles.textContent = 'No Files Selected';
    } else {
      errorFiletype.classList.remove("active");
      let fileName = i.name;
      let fileSize = (i.size / 1024).toFixed(1);
      var markup =
        `<li>` +
        `<p>${fileName}</p>` +
        `<div class="details">` +
        `<p>${fileSize}KB</p>` +
        `<i class="fa-solid fa-xmark cancelu" aria-hidden="true"></i>` +
        `</div>` +
        `</li>`;
      if (fileSize >= 1024) {
        fileSize = (fileSize / 1024).toFixed(1);
        markup =
          `<li>` +
          `<p>${fileName}</p>` +
          `<div class="details">` +
          `<p>${fileSize}MB</p>` +
          `<i class="fa-solid fa-xmark cancelu" aria-hidden="true"></i>` +
          `</div>` +
          `</li>`;
      }
      fileList.insertAdjacentHTML("beforeend", markup);
      fileInput.classList.remove("active");
      fileLabel.classList.remove("active");
      var markup =
        `<div class="upload-files">` +
        `<i class="fa-solid fa-arrow-up-from-bracket"></i> Upload Selected File` +
        `</div>`;
      const uploadForm = document.querySelector(".upload-form");
      uploadForm.insertAdjacentHTML("afterbegin", markup);

      uploadFileBtn = document.querySelector(".upload-files");
      uploadFileListener();
      const cancelUpload = document.querySelector(".cancelu");
      cancelUpload.addEventListener("click", function () {
        fileInput.value = '';
        fileList.innerHTML = '';
        document.querySelector(".upload-files").remove();
        fileInput.classList.add("active");
        fileLabel.classList.add("active");
        numOfFiles.textContent = 'No Files Selected';
      })
    }
  }
});

var uploadFileBtn = document.querySelector(".upload-files");
function uploadFileListener() {
  uploadFileBtn.addEventListener("click", function () {
    const formData = new FormData();
    formData.append('files[]', fileInput.files[0]);

    fetch('uploadFile.php', {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
  })
}
const urlBtn = document.querySelector(".url-button");

urlBtn.addEventListener("click", function () {
  const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
  const targetUrl = 'http://usidas.ceid.upatras.gr/web/2023/export.php';

  fetch(`${corsAnywhereUrl}${targetUrl}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost',
      'X-Requested-With': 'XMLHttpRequest'
    },
  })
    .then(response => response.json())
    .then(data => {
      fetch('uploadUrl.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(result => { })
    })
})

/* ~~~~~~~~~~ Rescuer Signup Form ~~~~~~~~~~ */

//Show-Hide Password Icon
const pwShowHide = document.querySelectorAll(".pw_hide");
pwShowHide.forEach((icon) => {
  icon.addEventListener("click", () => {
    let getPwInput = icon.parentElement.querySelector("input");
    if (getPwInput.type === "password") {
      getPwInput.type = "text";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    } else {
      getPwInput.type = "password";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    }
  });
});

//Password Requirements
let validationRegex = [
  { regex: /.{8,}/ },
  { regex: /[A-Z]/ },
  { regex: /[^A-Za-z0-9]/ },
  { regex: /^[a-zA-Z0-9!@#$%^&*()-_=+{}\[\]:;<>,.?\/\\|]+$/ },
];

//Password Requirements Checklist
const passChecklist = document.querySelectorAll(".checklist-item");
const passInput = document.querySelector("#pass");
passInput.addEventListener("keyup", () => {
  validationRegex.forEach((item, i) => {
    let isValid = item.regex.test(passInput.value);
    if (isValid) {
      passChecklist[i].classList.add("checked");
    } else {
      passChecklist[i].classList.remove("checked");
    }
  });
});

//Show-Hide Password Requirements
const passField = document.querySelector(".field.password");
passInput.addEventListener("focus", (e) => {
  e.preventDefault();
  passField.classList.add("active");
});
passInput.addEventListener("blur", (e) => {
  e.preventDefault();
  passField.classList.remove("active");
});

//Password Validation
function checkPass() {
  for (var i = 0; i < passChecklist.length; i++) {
    if (!passChecklist[i].classList.contains("checked")) {
      passGood = false;
    } else passGood = true;
  }
}

//Username Validation
const usernamePattern = /^[a-zA-Z0-9]+\s?[a-zA-Z0-9]+$/;
const usernameField = document.querySelector(".field.username");
const usernameInput = document.querySelector("#username");
function checkUsername() {
  if (!usernameInput.value.match(usernamePattern)) {
    usernameField.classList.add("invalid");
    usernameField.classList.remove("duplicate");
  } else {
    usernameField.classList.remove("invalid");
    checkUsernameAvailability();
  }
}

// TruckId Validation
const truckidPattern = /^[A-Z]{3}\d{4}$/;
const truckidField = document.querySelector(".field.truck-id");
const truckidInput = document.querySelector("#truckid");
function checkTruckId() {
  if (!truckidInput.value.match(truckidPattern)) {
    truckidField.classList.add("invalid");
    truckidField.classList.remove("duplicate");
  } else {
    truckidField.classList.remove("invalid");
    checktruckidAvailability();
  }
}

//Fullname Validation
const fullnamePattern = /[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/;
const fullnameField = document.querySelector(".field.fullname");
const fullnameInput = document.querySelector("#fullname");
function checkFullname() {
  if (!fullnameInput.value.match(fullnamePattern)) {
    return fullnameField.classList.add("invalid");
  }
  fullnameField.classList.remove("invalid");
}

//Phone Number Validation
const phonePattern = /^[+0-9]+$/;
const phoneField = document.querySelector(".field.phone");
const phoneInput = document.querySelector("#phone");
function checkPhone() {
  if (!phoneInput.value.match(phonePattern)) {
    return phoneField.classList.add("invalid");
  }
  phoneField.classList.remove("invalid");
}

//Address Validation
const addressPattern = /^[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/;
const addressField = document.querySelector(".field.address");
const addressInput = document.querySelector("#address");
function checkAddress() {
  if (!addressInput.value.match(addressPattern)) {
    return addressField.classList.add("invalid");
  }
  addressField.classList.remove("invalid");
}

// AJAX Request to check the Database for Username Similarity
function checkUsernameAvailability() {
  var data = { username: usernameInput.value };
  fetch("/ResQSupply/check_username.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result != "False") {
        usernameField.classList.add("duplicate");
      } else {
        usernameField.classList.remove("duplicate");
      }
    });
}

// AJAX Request to check the Database for TruckID Similarity
function checktruckidAvailability() {
  var data = { truckid: truckidInput.value };
  fetch("check_truckid.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result != "False") {
        truckidField.classList.add("duplicate");
      } else {
        truckidField.classList.remove("duplicate");
      }
    });
}

//Validation When Typing
usernameInput.addEventListener("keyup", checkUsername);
fullnameInput.addEventListener("keyup", checkFullname);
phoneInput.addEventListener("keyup", checkPhone);
addressInput.addEventListener("keyup", checkAddress);
truckidInput.addEventListener("keyup", checkTruckId);

//Submit Form Validation When Submiting
const successMessage = document.getElementById("successMessage");
const signupBtn = document.querySelector(".signup");
signupBtn.addEventListener("click", (e) => {
  checkUsername();
  checkFullname();
  checkPhone();
  checkAddress();
  checkPass();
  checkTruckId()
  if (
    usernameField.classList.contains("invalid") ||
    usernameField.classList.contains("duplicate") ||
    fullnameField.classList.contains("invalid") ||
    phoneField.classList.contains("invalid") ||
    addressField.classList.contains("invalid") ||
    !passGood
  ) {
    e.preventDefault();
  } else {
    e.preventDefault();
    var lat;
    var lon;
    fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=' + addressInput.value + '&limit=1')
      .then(result => result.json())
      .then(result => {
        lat = result[0].lat;
        lon = result[0].lon;
        submit(lat, lon);
      });
    showSuccessMessage();
  }
});

function showSuccessMessage() {
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
}

function submit(lat, lon) {
  fetch("rescuer_Creation.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameInput.value, fullname: fullnameInput.value, phone: phoneInput.value, truckid: truckidInput.value, address: addressInput.value, password: passInput.value, latitude: lat, longitude: lon }),
  })
    .then((response) => response.json())
}

//---------- Storage Info -----------//
function fetchStorageInfo() {
  fetch("fetch_StorageInfo.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const storageTable = document.querySelector(".storage-table");
      if (data.length != 0) {
        storageTable.classList.add("active");
        data.forEach((res) => {
          markup1 =
            `<tr>` +
            `<td> ${res.GoodName} </td>` +
            `<td> ${res.GoodCategory} </td>` +
            `<td> ${res.location} </td>` +
            `<td> ${res.GoodValue} </td>` +
            `</tr>`;
          document.querySelector(".storage-tbody").insertAdjacentHTML("beforeend", markup1);

          categories = [];
          if (!categories.includes(res.GoodCategory)) {
            markup2 =
              `<li class="category-item">` +
              `<input type="checkbox" checked></input>` +
              `<p> ${res.GoodCategory} </p>` +
              `</li>`;
            categories.push(res.GoodCategory);
            document.querySelector(".category-list").insertAdjacentHTML("beforeend", markup2);
          }
        });
      } else {
        //If there aren't any goods, display the following paragraph
        storageTable.classList.remove("active");
        markup = `<p class="empty">There aren't any Goods in the Storage at the moment.</p>`;
        document.querySelector(".storage-container").insertAdjacentHTML("beforeend", markup);
      }
    });
}

//Logging out Actions
const logoutButton = document.querySelector(".button.logout");
logoutButton.addEventListener("click", logoutUser);
function logoutUser() {
  fetch("/ResQSupply/logout_User.php", {
    method: "POST",
    credentials: 'include'
  });
  location.href = "/" + "ResQSupply/home.html";
}