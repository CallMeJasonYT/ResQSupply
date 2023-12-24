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
  'Truck': L.icon({
    iconUrl: '/ResQSupply/icons/truckIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  'Active Truck': L.icon({
    iconUrl: '/ResQSupply/icons/truckActiveIcon.svg',
    iconSize: [25, 25],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
};

function fetchTasksLoc() {
  fetch("fetch_TasksLoc.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, entry.task_id, null);
      });
    });
}

function fetchBaseInfo() {
  fetch("fetch_BaseInfo.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, 'Base', null);
      });
    });
}

function fetchTrucksLoc() {
  fetch("fetch_TrucksLoc.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, entry.category, entry.veh_id);
      });
    });
}

/*function revGeocode(query) {
  var lng = query.lng;
  var lat = query.lat;
  fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&format=json')
    .then(result => result.json())
    .then(result => {
      updateTruckLoc(parseDisplayName(result.display_name), lat, lng);
    });
}*/

function parseDisplayName(displayName) {
  const words = displayName.split(', ');
  const address = words.slice(0, 2).join(', ');
  return address;
}

/*function updateTruckLoc(position, lat, lon) {
  fetch('update_TruckLoc.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({address: position, latitude: lat, longitude: lon})
  })
    .then(response => response.json())
}*/

const taskMarkers = [];
const truckMarkers = [];
const baseMarkers = [];
function setMapMarkers(lat, lon, task_id, veh_id) {
  const latitude = lat;
  const longitude = lon;
  if (task_id == 'Active Truck') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Active Truck'], draggable: false });
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
    //drawLine();
  } else if (task_id == 'Truck') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Truck'], draggable: false });
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
              taskId: task_id,
              latitude: latitude,
              longitude: longitude
            };
            marker.addTo(map);
            marker.on('click', function () {
              showTaskPopup(marker, res.status);
            });
            taskMarkers.push(marker);
            if (res.veh == veh_id && truckMarkers.length != 0) {
              //drawLineOnce(task_id);
            }
          }
        });
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
        <b>Vehicle ID:</b> ${taskDetails[0].vehicle}<br>
      `;

      if (status !== "Executing") {
        popupContent += `<button class="custom-button" onclick="handleButtonClick(event, ${marker.taskInfo.taskId})">Take on Task</button>`;
      }

      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    });
}

function showTruckPopup(marker) {
  fetch("fetch_TrucksPopup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicleIDs: marker.truckInfo.vehId })
  })
    .then((response) => response.json())
    .then((truckDetails) => {
      if (truckDetails != null) {
        var popupContent = '';

        for (const [vehicleID, details] of Object.entries(truckDetails)) {
          popupContent += `
            <b>Truck ID:</b> ${vehicleID}<br>
            <b>TruckLoad:</b><br>
          `;

          details.forEach((load, index) => {
            popupContent += `<b>Item ${index + 1}:</b> ${load.load_goodn} - ${load.load_goodv}<br>`;
          });

          popupContent += '<br>';
        }

        var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
        marker.bindPopup(popup).openPopup();
      } else {
        var popupContent = '';

        for (const [vehicleID, details] of Object.entries(truckDetails)) {
          popupContent += `
                <b>Truck ID:</b> ${vehicleID}<br>
                <b>TruckLoad: Empty</b><br>
              `;
        }

        var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
        marker.bindPopup(popup).openPopup();
      }
    });
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
        case 'Trucks With Active Tasks':
          if (!checkbox.checked) {
            removeMarkersByCategory('Active Truck');
            hidePolylines();
          } else {
            addMarkersByCategory('Active Truck');
            showPolylines();
          }
          break;
        case 'Trucks Without Active Tasks':
          if (!checkbox.checked) {
            removeMarkersByCategory('Truck');
          } else {
            addMarkersByCategory('Truck');
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
  taskMarkers.forEach(marker => {
    const iconName = getIconName(marker);
    if (iconName.includes(category)) {
      map.removeLayer(marker);
    }
  });
}

function addMarkersByCategory(category) {
  taskMarkers.forEach(marker => {
    const iconName = getIconName(marker);
    if (iconName.includes(category)) {
      map.addLayer(marker);
    }
  });
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
  'Active Truck': 'Trucks with Active Tasks',
  'Truck': 'Trucks without Active Tasks'
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
var veh_id;
function drawLine() {
  const truckMarker = truckMarkers.find((marker) => marker.truckInfo.vehId == veh_id);
  const truckLat = truckMarker.getLatLng().lat;
  const truckLon = truckMarker.getLatLng().lng;
  const pointA = [truckLat, truckLon];
  const activeTasks = document.querySelectorAll(".tasks-list .list-item");
  activeTasks.forEach(function (task) {
    const taskMarker = taskMarkers.find((marker) => marker.taskInfo.taskId == task.id);
    if (!taskMarker) {
      return;
    }
    const taskLat = taskMarker.getLatLng().lat;
    const taskLon = taskMarker.getLatLng().lng;
    const pointB = [taskLat, taskLon];
    const polyline = L.polyline([pointA, pointB], { color: '#350052' }).addTo(map);
    polyline.taskInfo = {
      task_id: task.id
    };
    polylines.push(polyline);
  });
}

function drawLineOnce(task_id) {
  const truckMarker = truckMarkers.find((marker) => marker.truckInfo.vehId == veh_id);
  const truckLat = truckMarker.getLatLng().lat;
  const truckLon = truckMarker.getLatLng().lng;
  const pointA = [truckLat, truckLon];
  const taskMarker = taskMarkers.find((marker) => marker.taskInfo.taskId == task_id);
  const taskLat = taskMarker.getLatLng().lat;
  const taskLon = taskMarker.getLatLng().lng;
  const pointB = [taskLat, taskLon];
  const polyline = L.polyline([pointA, pointB], { color: '#350052' }).addTo(map);
  polyline.taskInfo = {
    task_id: task_id
  };
  polylines.push(polyline);
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
  fetchBaseInfo();
  fetchTrucksLoc();
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
        fetch_statistics();
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
        break;
    }
  });
});

/* ~~~~~~~~~~ Announcement Creation Functions ~~~~~~~~~~ */

const annTextForm = document.querySelector(".ann-text-form");
const annItemsForm = document.querySelector(".ann-items-form");
const annConfirmForm = document.querySelector(".ann-confirm-form");
const annNextTextBtn = document.querySelector(".ann-next-text");
const annNextItemsBtn = document.querySelector(".ann-next-items");
const annSubmitBtn = document.querySelector(".ann-submit");
const cancelAnn = document.querySelectorAll(".cancela");
cancelAnn.forEach(function (btn) {
  btn.addEventListener("click", function () {
    annTextForm.classList.add("active");
    annItemsForm.classList.remove("active");
    annConfirmForm.classList.remove("active");
  })
})

annNextTextBtn.addEventListener("click", function () {
  annTextForm.classList.remove("active");
  annItemsForm.classList.add("active");
})

annNextItemsBtn.addEventListener("click", function () {
  annItemsForm.classList.remove("active");
  annConfirmForm.classList.add("active");
})

annSubmitBtn.addEventListener("click", function () {
  annConfirmForm.classList.remove("active");
  annTextForm.classList.add("active");
})

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
const transferedItemsTab = document.querySelector(".transfered-items-tab");
const updateGoodsTab = document.querySelector(".update-goods-tab");
storageBtn.addEventListener("click", function () {
  storageUpdateTab.classList.add("active");
  transferedItemsTab.classList.remove("active");
  updateGoodsTab.classList.remove("active");
})

const transferedBtn = document.querySelector("#transferedBtn");
transferedBtn.addEventListener("click", function () {
  transferedItemsTab.classList.add("active");
  storageUpdateTab.classList.remove("active");
  updateGoodsTab.classList.remove("active");
})

const updateBtn = document.querySelector("#updateBtn");
updateBtn.addEventListener("click", function () {
  updateGoodsTab.classList.add("active");
  transferedItemsTab.classList.remove("active");
  storageUpdateTab.classList.remove("active");
})

/* ~~~~~~~~~~ Transfered Items Functions ~~~~~~~~~~ */

/* ~~~~~~~~~~ Update Storage Functions ~~~~~~~~~~ */

const cancelUpdate = document.querySelector(".cancelupd");
const strgQuantityForm = document.querySelector(".storage-quantity-form");
const strgConfirmForm = document.querySelector(".storage-confirm-form");
cancelUpdate.addEventListener("click", function () {
  strgQuantityForm.classList.add("active");
  strgConfirmForm.classList.remove("active");
})

const strgNextQuantityBtn = document.querySelector(".strg-next-quantity");
strgNextQuantityBtn.addEventListener("click", function () {
  strgQuantityForm.classList.remove("active");
  strgConfirmForm.classList.add("active");
})

const strgSubmitBtn = document.querySelector(".storage-submit");
strgSubmitBtn.addEventListener("click", function () {
  strgConfirmForm.classList.remove("active");
  strgQuantityForm.classList.add("active");
})

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
      const uploadForm = document.querySelector(".upload-form")
      uploadForm.insertAdjacentHTML("afterbegin", markup);

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

//Validation When Typing
usernameInput.addEventListener("keyup", checkUsername);
fullnameInput.addEventListener("keyup", checkFullname);
phoneInput.addEventListener("keyup", checkPhone);
addressInput.addEventListener("keyup", checkAddress);

//Submit Form Validation When Submiting
const signupBtn = document.querySelector(".signup");
signupBtn.addEventListener("click", (e) => {
  checkUsername();
  checkFullname();
  checkPhone();
  checkAddress();
  checkPass();
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
  }
});

const regFormAct = document.querySelector("#signup-form");
function submit(lat, lon) {
  fetch("home.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameInput.value, fullname: fullnameInput.value, phone: phoneInput.value, address: addressInput.value, password: passInput.value, latitude: lat, longitude: lon }),
  })
    .then((response) => response.json())
    .then((result) => {

    });
}

//Statistics
const config = {
  type: 'bar',
  data: {}, // Empty data initially
  options: {
      maintainAspectRatio: false,
      scales: {
          y: {
              beginAtZero: true
          }
      },
      plugins: {
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
const chartBox = document.querySelector('.chartBox');

function fetch_statistics(){
  fetch('statistics.php')
  .then(response => response.json())
  .then(data => {
      // Update chart data with fetched data
      myChart.data = data;

      // Update container width based on the number of labels
      const totalLabels = myChart.data.labels.length;
      if (totalLabels > 7) {
          const newWidth = 700 + ((totalLabels - 7) * 30);
          containerBody.style.width = `${newWidth}px`;
      }

      // Update legend
      generateLegend();
  })
  .catch(error => console.error('Error fetching data:', error));
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



