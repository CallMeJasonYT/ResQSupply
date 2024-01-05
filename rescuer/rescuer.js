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

  const mglassIcon = container.querySelector("#search-icon");
  mglassIcon.addEventListener("click", fetchGeoSearch);
  return container;
};

searchControl.addTo(map);

function fetchGeoSearch() {
  const query = searchInput.value;
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=' + query + '&limit=1')
    .then(result => result.json())
    .then(parsedResult => {
      setResultList(parsedResult[0]);
    });
}

function setResultList(parsedResult) {
  const latitude = parseFloat(parsedResult.lat);
  const longitude = parseFloat(parsedResult.lon);
  position = new L.LatLng(latitude, longitude);
  map.flyTo(position, 15);
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
  })
};

function fetchTasksLoc() {
  fetch("fetch_TasksLoc.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, entry.task_id);
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
        setMapMarkers(entry.lat, entry.lon, 'Base');
      });
    });
}

function fetchTruckLoc() {
  fetch("fetch_TruckLoc.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, 'Truck');
      });
    });
}

function revGeocode(query) {
  var lng = query.lng;
  var lat = query.lat;
  fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&format=json')
    .then(result => result.json())
    .then(result => {
      updateTruckLoc(parseDisplayName(result.display_name), lat, lng);
    });
}

function parseDisplayName(displayName) {
  const words = displayName.split(', ');
  const address = words.slice(0, 2).join(', ');
  return address;
}

function updateTruckLoc(position, lat, lon) {
  fetch('update_TruckLoc.php', {
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
function setMapMarkers(lat, lon, task_id) {
  const latitude = lat;
  const longitude = lon;
  if (task_id == 'Truck') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Truck'], draggable: true });
    marker.truckInfo = {
      vehId: veh_id,
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    truckMarkers.push(marker);
    drawLine();

    marker.on('dragend', function (e) {
      removeAllPolylines();
      var position = marker.getLatLng();
      marker.setLatLng(position).update();
      map.panTo(position);
      revGeocode(position);
      drawLine();
    });
  } else if (task_id == 'Base') {
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Base'] });
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
              drawLineOnce(task_id);
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

var activeTasks = document.querySelectorAll(".tasks-list li");
function handleButtonClick(event, taskId) {
  if (activeTasks.length < 4) {
    fetch("update_Task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: taskId })
    })
      .then((response) => response.json())
      .then((result) => {
        const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskId);
        var lat = marker.getLatLng().lat.toString();
        var lon = marker.getLatLng().lng.toString();
        removeTaskMarker(marker);
        setMapMarkers(lat, lon, taskId);
        removeAllPolylines();
        drawLine();
        fetchActiveTasks();
      });
  } else {
    event.stopPropagation();
    const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskId);
    const popupContent = `
      <p class="error activeTasks active"><b>Error:&nbsp;</b> You have reached the maximum number of active tasks.<p>
    `;
    marker.getPopup().setContent(marker.getPopup().getContent() + popupContent);
    marker.getPopup().update();
  }
}

function removeTaskMarker(marker) {
  map.removeLayer(marker);
  const index = taskMarkers.indexOf(marker);
  if (index !== -1) {
    taskMarkers.splice(index, 1);
  }
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
  'Truck': 'Truck Location'
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
  fetchResInfo();
  fetchTasksLoc();
  fetchBaseInfo();
  fetchTruckLoc();
  fetchActiveTasks();
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

//Activating all the tabs and NavBar Options
const burgerIcox = document.querySelector(".burgerx");
const burgerIco = document.querySelector(".burgeri");
const mapItem = document.querySelector("#map");
const mapCont = document.querySelector(".map-container");
function deskCustomization() {
  var activeTasksSect = document.querySelector('.active-tasks-sect');
  var mapSection = document.querySelector('.map-sect');
  var mainElement = document.querySelector('main');
  mainElement.removeChild(activeTasksSect);
  mainElement.insertBefore(activeTasksSect, mapSection);
  map.invalidateSize();
}

//Mobile Layout Changes
function mobileApply() {
  mobileCustomization();
  cnt--;
}

function mobileCustomization() {
  var activeTasksSect = document.querySelector('.active-tasks-sect');
  var mapSection = document.querySelector('.map-sect');
  var mainElement = document.querySelector('main');
  mainElement.removeChild(activeTasksSect);
  mainElement.insertBefore(activeTasksSect, mapSection.nextSibling);
  map.invalidateSize()
}

/* ~~~~~~~~~~ Truck Menu Functions ~~~~~~~~~~ */

const burgerSect = document.querySelector(".burger-sect");
const mapSection = document.querySelector(".map-sect");
const activeTasksSect = document.querySelector(".active-tasks-sect");
//Truck Open
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerSect.classList.add("active");
  mapSection.classList.remove("active");
  activeTasksSect.classList.remove("active");
});

//Truck Close
burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerSect.classList.remove("active");
  mapSection.classList.add("active");
  activeTasksSect.classList.add("active");
  map.invalidateSize();
});

//Load Button
const loadTab = document.querySelector(".load-tab");
const truckloadTab = document.querySelector(".truckload-tab");
const loadBtn = document.querySelector("#loadBtn");
const loadTruckBtn = document.querySelector(".add-load");
const loadItems = document.querySelector(".load-items-tab");
const loadItemsForm = document.querySelector(".load-items-form");
const unloadTab = document.querySelector(".unload-tab");
loadBtn.addEventListener("click", (e) => {
  distanceErrorUnload.classList.remove("active");
  truckloadErrorUnload.classList.remove("active");
  loadTab.classList.add("active");
  truckloadTab.classList.remove("active");
  unloadTab.classList.remove("active");
  unloadQuantity.classList.remove("active");
  unloadConfirm.classList.remove("active");
  unloadItemsTab.classList.remove("active");
  removeUnloadConfirm();
  if (!loadItems.classList.contains("active")) {
    loadTruckBtn.classList.add("active");
  }
});

const truckloadBtn = document.querySelector("#truckloadBtn");
//Truckload Button
truckloadBtn.addEventListener("click", (e) => {
  distanceErrorUnload.classList.remove("active");
  truckloadErrorUnload.classList.remove("active");
  distanceErrorLoad.classList.remove("active");
  truckloadTab.classList.add("active");
  loadTab.classList.remove("active");
  loadItems.classList.remove("active");
  loadItemsForm.classList.remove("active");
  loadQuantity.classList.remove("active");
  loadConfirm.classList.remove("active");
  unloadTab.classList.remove("active");
  unloadItemsTab.classList.remove("active");
  unloadQuantity.classList.remove("active");
  unloadConfirm.classList.remove("active");
  removeItemLoad();
  removeQuantityLoad();
  removeConfirmLoad();
  removeUnloadConfirm();
});

//Bottom Border for Tab Buttons
function toggleBottomBorder(clickedButton) {
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function (button) {
    button.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

//Load Truck Plus Button
const distanceErrorLoad = document.querySelector(".load-tab .error.distance")
loadTruckBtn.addEventListener("click", (e) => {
  const distance = calculateDistance(truckMarkers[0].getLatLng(), baseMarkers[0].getLatLng());
  if (distance <= 100) {
    distanceErrorLoad.classList.remove("active");
    loadTruckBtn.classList.remove("active");
    loadItemsForm.classList.add("active");
    loadItems.classList.add("active");
    fetchLoadItems();
  } else {
    distanceErrorLoad.classList.add("active");
  }
});

//Load Truck Items
const loadQuantity = document.querySelector(".load-quantity-form");
const nextButton1 = document.querySelector(".button.next1");
nextButton1.addEventListener("click", (e) => {
  noItemError();
  overQuantity();
});

//Load Truck Quantity
const loadConfirm = document.querySelector(".load-confirm-form");
const nextButton2 = document.querySelector(".button.next2");
nextButton2.addEventListener("click", (e) => {
  zeroQuantity();
});

//Load Truck Confirm
const submitButtonLoad = document.querySelector(".button.submit1");
submitButtonLoad.addEventListener("click", (e) => {
  loadConfirm.classList.remove("active");
  loadTruckBtn.classList.add("active");
  removeTruckLoad();
  loadTruck();
  removeItemLoad();
  removeQuantityLoad();
  removeConfirmLoad();
});

//Cancel Button Load
const cancelBtnL = document.querySelectorAll(".cancell");
cancelBtnL.forEach(function (button) {
  button.addEventListener("click", function () {
    loadTruckBtn.classList.add("active");
    loadItems.classList.remove("active");
    loadItemsForm.classList.remove("active");
    loadQuantity.classList.remove("active");
    loadConfirm.classList.remove("active");
    errorNone.classList.remove("active")
    errorAvailable.classList.remove("active")
    errorZeroQ.classList.remove("active")
    removeItemLoad();
    removeQuantityLoad();
    removeConfirmLoad();
    loadDataArray = [];
  })
})

//Clear Button Load
const clearBtnL = document.querySelector(".load-items-form .clrbtn");
clearBtnL.addEventListener("click", function () {
  loadDataArray = [];
  itemsLoadBtn.forEach(function (item) {
    item.classList.remove("selected");
  })
})

//Unload Button
const unloadBtn = document.querySelector("#unloadBtn");
const unloadTruckBtn = document.querySelector(".remove-load");
const unloadQuantity = document.querySelector(".unload-quantity-form");
const unloadItemsTab = document.querySelector(".unload-items-tab");
unloadBtn.addEventListener("click", (e) => {
  distanceErrorLoad.classList.remove("active");
  truckloadErrorUnload.classList.remove("active");
  unloadTab.classList.add("active");
  loadTab.classList.remove("active");
  truckloadTab.classList.remove("active");
  loadItems.classList.remove("active");
  loadItemsForm.classList.remove("active");
  loadQuantity.classList.remove("active");
  loadConfirm.classList.remove("active");
  removeItemLoad();
  removeQuantityLoad();
  removeConfirmLoad();
  if (!unloadItemsTab.classList.contains("active")) {
    unloadTruckBtn.classList.add("active");
  }
});

//Unload Truck Plus Button
const distanceErrorUnload = document.querySelector(".unload-tab .error.distance")
const truckloadErrorUnload = document.querySelector(".unload-tab .error.truckload")
unloadTruckBtn.addEventListener("click", (e) => {
  const distance = calculateDistance(truckMarkers[0].getLatLng(), baseMarkers[0].getLatLng());
  if (distance <= 100 && truckLoadArray.length != 0) {
    distanceErrorUnload.classList.remove("active");
    truckloadErrorUnload.classList.remove("active");
    unloadTruckBtn.classList.remove("active");
    unloadQuantity.classList.add("active");
    unloadItemsTab.classList.add("active");
    removeUnloadItems();
    quantityUnLoad();
    unloadEventListener();
    maxBtnEventListener();
  } else if(distance > 100){
    distanceErrorUnload.classList.add("active");
    truckloadErrorUnload.classList.remove("active");
  } else if(truckLoadArray.length == 0){
    truckloadErrorUnload.classList.add("active");
    distanceErrorUnload.classList.remove("active");
  }
});

//Unload Truck Quantity
const nextButton3 = document.querySelector(".button.next3");
const unloadConfirm = document.querySelector(".unload-confirm-form");
nextButton3.addEventListener("click", (e) => {
  unloadQuantity.classList.remove("active");
  unloadConfirm.classList.add("active");
  submitUnload();
});

//Unload Truck Confirm
const submitButtonUnload = document.querySelector(".button.submit2");
submitButtonUnload.addEventListener("click", (e) => {
  unloadConfirm.classList.remove("active");
  unloadTruckBtn.classList.add("active");
  removeTruckLoad();
  removeUnloadConfirm();
  unloadTruck();
});

//Cancel Button Unload
const cancelBtnU = document.querySelectorAll(".cancelu");
cancelBtnU.forEach(function (button) {
  button.addEventListener("click", function () {
    unloadTruckBtn.classList.add("active");
    unloadQuantity.classList.remove("active");
    unloadConfirm.classList.remove("active");
    removeUnloadConfirm();
    unloadDataArray = [];
  })
})

//Clear Button Unload
const clearBtnU = document.querySelector(".unload-quantity-form .clrbtn");
clearBtnU.addEventListener("click", function () {
  unloadDataArray = [];
  unloadItems.forEach(function (item) {
    item.querySelector(".quantity-input").value = 0;
  })
})

/* ~~~~~~~~~~ Load Functions ~~~~~~~~~~ */

//Item Select Dropdowns Load
const itemSelButton = document.querySelector(".item-btn");
const itemList = document.querySelector(".item-options");
const itemContent = document.querySelector(".content");
itemSelButton.addEventListener("click", (e) => {
  itemSelButton.classList.toggle("selected");
  itemContent.classList.add("active");
  itemList.classList.toggle("active");
});

//Adding Event Listeners to the Load Form List Item Elements and Displaying the Selected Items Correctly
var itemsLoadBtn = document.querySelectorAll(".load-items-form .item-list .item");
function itemsLoadBtnListener() {
  itemsLoadBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
      } else {
        item.classList.add("selected");
      }
    });
  });
}

//Choosing Quantity for Load
function selItemsLoad() {
  itemsLoadBtn.forEach(function (item) {
    if (item.classList.contains("selected")) {
      var itemText = item.querySelector(".item-text").textContent;
      markup =
        `<li class="item">` +
        `<div class="item-count">` +
        `<p class="item-text">${itemText}</p>` +
        `<div class="item-quantity">` +
        `<p class="quantity-text">Quantity: </p>` +
        `<input class="quantity-input" type="number" value="0" oninput="validity.valid||(value='');">` +
        `</div>` +
        `</div>` +
        `</li>`;
      document.querySelector(".load-quantity-form .selected-items-list").insertAdjacentHTML("beforeend", markup);
      itemsQuantityBtn = document.querySelectorAll(".load-quantity-form .selected-items-list .item");
    }
  });
}

//Remove Items from Load Items Form
function removeItemLoad() {
  itemsLoadBtn.forEach(function (item) {
    item.remove();
  });
}

//Remove Items from Load Quantity Form
var itemsQuantityBtn = document.querySelectorAll(".load-quantity-form .selected-items-list .item");
function removeQuantityLoad() {
  itemsQuantityBtn.forEach(function (item) {
    item.remove();
  });
}

//Remove Items from Load Confirm Form
var itemsConfirmBtn = document.querySelectorAll(".load-confirm-form .selected-items-confirm .item");
function removeConfirmLoad() {
  itemsConfirmBtn.forEach(function (item) {
    item.remove();
  });
}

//Adding the Items to Submit Form Load
var loadDataArray = [];
function submitLoad() {
  itemsQuantityBtn.forEach(function (item) {
    var itemText = item.querySelector(".item-text").textContent;
    var itemQ = item.querySelector(".quantity-input").value;
    markup =
      `<li class="item">` +
      `<div class="item-count">` +
      `<p class="item-text"> ${itemText} </p>` +
      `<div class="item-quantity">` +
      `<p class="quantity-text">Quantity: ${itemQ}</p>` +
      `</div>` +
      `</div>` +
      `</li>`
    document.querySelector(".load-confirm-form .selected-items-confirm").insertAdjacentHTML("beforeend", markup);
    itemsConfirmBtn = document.querySelectorAll(".load-confirm-form .selected-items-confirm .item");
    var itemData = {
      "itemText": itemText,
      "itemQ": itemQ
    };
    loadDataArray.push(itemData);
  });
}

const errorNone = document.querySelector(".error.none");
var errorSel = 'none';
function noItemError() {
  errorSel = 'none';
  if (document.querySelector(".load-items-form .item-list .item.selected") == null) {
    errorSel = 'item';
    notAvailable();
  } else {
    notAvailable();
  }
}

const errorAvailable = document.querySelector(".error.available");
function notAvailable() {
  var selItems = document.querySelectorAll(".load-items-form .item-list .item.selected");
  selItems.forEach(function (item) {
    if (item.querySelector(".item-available").textContent == "Available: 0" && errorSel != 'item') {
      errorSel = 'available';
    }
  });

  if (errorSel == 'available') {
    errorAvailable.classList.add("active");
    errorNone.classList.remove("active");
  } else if (errorSel == 'item') {
    errorNone.classList.add("active");
    errorAvailable.classList.remove("active");
  } else {
    loadItemsForm.classList.remove("active");
    loadQuantity.classList.add("active");
    errorNone.classList.remove("active");
    errorAvailable.classList.remove("active");
    selItemsLoad();
  }
}

const errorZeroQ = document.querySelector(".error.zero-quantity");
function zeroQuantity() {
  var hasError = false;
  itemsQuantityBtn.forEach(function (item) {
    var itemQ = item.querySelector(".quantity-input").value;
    if (itemQ == 0) {
      hasError = true;
    }
  });

  if (hasError) {
    errorZeroQ.classList.add("active");
  } else {
    errorZeroQ.classList.remove("active");
    loadQuantity.classList.remove("active");
    loadConfirm.classList.add("active");
    submitLoad();
  }
}

function overQuantity() {
  var itemsQuantityBtn = document.querySelectorAll(".load-quantity-form .selected-items-list .item .quantity-input");
  var availableNumbers = [];
  var selectedItems = document.querySelectorAll(".load-items-form .item-list .item.selected");
  selectedItems.forEach(function (item) {
    var itemAvailable = item.querySelector(".item-available");
    var match = itemAvailable.textContent.match(/Available: (\d+)/);

    if (match) {
      var availableNumber = parseInt(match[1], 10);
      availableNumbers.push(availableNumber);
    }
  });

  itemsQuantityBtn.forEach(function (item) {
    item.addEventListener("input", function () {
      var enteredQuantity = parseInt(item.value, 10);
      var itemIndex = Array.from(itemsQuantityBtn).indexOf(item);

      if (enteredQuantity > availableNumbers[itemIndex]) {
        item.value = availableNumbers[itemIndex];
      }
    });
  });
}
/* ~~~~~~~~~~ TruckLoad Functions ~~~~~~~~~~ */

var truckLoadItems = document.querySelectorAll(".truckload-list .list-item");
function removeTruckLoad() {
  truckLoadItems.forEach(function (item) {
    item.remove();
  });
}

/* ~~~~~~~~~~ UnLoad Functions ~~~~~~~~~~ */
//Choosing the Quantity of the Items you want to Unload
var truckLoadArray = [];
var unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");
function quantityUnLoad() {
  truckLoadArray.forEach((item) => {
    markup =
      `<li class="item">` +
      `<div class="item-count">` +
      `<p class="item-text">${item.itemText}</p>` +
      `<div class="item-quantity">` +
      `<p class="quantity-text">Quantity:</p>` +
      `<input class="quantity-input" type="number" value="0" oninput="validity.valid||(value='');">` +
      `<p class="max-button"> Max </p>` +
      `</div>` +
      `</div>` +
      `</li>`;
    document.querySelector(".unload-quantity-form .selected-items-list").insertAdjacentHTML("beforeend", markup);
  })
  unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");
}

//Adding the Items to Submit Form Unload
var unloadDataArray = [];
var unloadItemsConf = document.querySelectorAll(".unload-confirm-form .selected-items-confirm .item");
function submitUnload() {
  unloadItems.forEach(function (item) {
    var itemText = item.querySelector(".item-text").textContent;
    var itemQ = item.querySelector(".quantity-input").value;
    if (itemQ != 0) {
      markup =
        `<li class="item">` +
        `<div class="item-count">` +
        `<p class="item-text"> ${itemText} </p>` +
        `<div class="item-quantity">` +
        `<p class="quantity-text">Quantity: ${itemQ}</p>` +
        `</div>` +
        `</div>` +
        `</li>`
      document.querySelector(".unload-confirm-form .selected-items-confirm").insertAdjacentHTML("beforeend", markup);
      unloadItemsConf = document.querySelectorAll(".unload-confirm-form .selected-items-confirm .item");
      var itemData = {
        "itemText": itemText,
        "itemQ": itemQ
      };
      unloadDataArray.push(itemData);
    }
  });
}

function removeUnloadItems() {
  unloadItems.forEach(function (item) {
    item.remove();
  });
}

function removeUnloadConfirm() {
  unloadItemsConf.forEach(function (item) {
    item.remove();
  });
}

function unloadEventListener() {
  var unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");

  unloadItems.forEach(function (item, index) {
    var itemInput = item.querySelector(".quantity-input");

    itemInput.addEventListener("input", function () {
      var itemQ = parseInt(itemInput.value, 10);
      if (index < truckLoadArray.length) {
        var maxAllowedQuantity = truckLoadArray[index].itemQ;
        if (itemQ > maxAllowedQuantity) {
          itemInput.value = maxAllowedQuantity;
        }
      }
    });
  });
}

function maxBtnEventListener() {
  var unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");
  unloadItems.forEach(function (item, index) {
    var maxBtn = item.querySelector(".max-button");
    var itemInput = item.querySelector(".quantity-input");

    maxBtn.addEventListener("click", function () {
      var maxAllowedQuantity = truckLoadArray[index].itemQ;
      itemInput.value = maxAllowedQuantity;
    });
  });
}

/* ~~~~~~~~~~ Fetch Functions ~~~~~~~~~~ */
//Fetching the Items that each Load requires
var loadItemCat;
function fetchLoadItems() {
  fetch("fetch_BaseItems.php", {
    method: "POST"
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((res) => {
        const markupItem =
          `<li class="item">` +
          `<p class="item-text">${res.strGoodN}</p>` +
          `<p class="item-available">Available: ${res.strGoodV}</p>` +
          `</li>`;
        document.querySelector(".load-items-form .item-list").insertAdjacentHTML("beforeend", markupItem);
      });
      itemsLoadBtn = document.querySelectorAll(".load-items-form .item-list .item");
      itemsLoadBtnListener();
    });
}

function loadTruck() {
  fetch("load_Truck.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: loadDataArray })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      loadDataArray = [];
      truckLoadArray = [];
      fetchTruckLoad();
    })
}

function unloadTruck() {
  fetch("unload_Truck.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: unloadDataArray })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      unloadDataArray = [];
      truckLoadArray = [];
      fetchTruckLoad();
    })
}

//Fetching the Items of the Truck
var empty = false;
function fetchTruckLoad() {
  fetch("fetch_TruckLoad.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.querySelector(".truckload-tab .truckload-list").innerHTML = "";
      if(empty){
        document.querySelector(".truckload-tab .empty").remove();
      }
      if (data.length != 0) {
        empty = false;
        data.forEach((res) => {
          const markupItem =
            `<li class="list-item">` +
            `<div class="item-title"><b>${res.loadGoodN}</b>` +
            `<p class="quantity"> Quantity: ${res.loadGoodV}</p>` +
            `</div>` +
            `</li>`
          document.querySelector(".truckload-tab .truckload-list").insertAdjacentHTML("beforeend", markupItem);
          var itemData = {
            "itemText": res.loadGoodN,
            "itemQ": res.loadGoodV
          };
        truckLoadArray.push(itemData);
        });
        truckLoadItems = document.querySelectorAll(".truckload-list .list-item");
      }else{
        empty = true;
        markup = `<p class="empty">The TruckLoad is Empty.</p>`;
        document.querySelector(".truckload-tab").insertAdjacentHTML("beforeend", markup);
      }
    });
}

//Fetching the Username and Vehicle of the User and displaying the Welcome Message
function fetchResInfo() {
  fetch("fetch_ResInfo.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      veh_id = data[0].vehicle;
      if (data[0]) {
        const markupWelcome = `<div class="welcome">Welcome, ${data[0].username}!</div>`;
        document.querySelector(".footer").insertAdjacentHTML("afterBegin", markupWelcome);
        const markupVehicle =
          `<p class="truckNum">Truck ID: ${data[0].vehicle}</p>` +
          `<p class="truckOwner">Owner: ${data[0].username}</p>`;
        document.querySelector(".truck-info").insertAdjacentHTML("beforeEnd", markupVehicle);
      }
      fetchTruckLoad();
    });
}

//Fetching Active Tasks
function fetchActiveTasks() {
  document.querySelector(".tasks-list").innerHTML = "";
  fetch("fetch_ActiveTasks.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.length != 0) {
        data.forEach((res) => {
          markup =
            `<li class="list-item" id=${res.id}>` +
            `<div class="item-title"><b>${res.goodName}</b>` +
            `<div class="cancel">` +
            `<p> Cancel </p>` +
            `<i class="fa-solid fa-ban cancelt"></i>` +
            `</div>` +
            `</div>` +
            `<div class="information">Citizen Information: ${res.fullname}, ${res.telephone}</div>` +
            `<div class="quantity">Quantity: ${res.goodValue}</div>` +
            `<div class="datetime">Creation Date: ${res.creationDate}</div>` +
            `<div class="type">Type: ${res.category}` +
            `<div class="complete-box">` +
            `<div class="complete">` +
            `<p> Complete </p>` +
            `<i class="fa-solid fa-check check"></i>` +
            `</div>` +
            `</div>` +
            `</div>` +
            `</li>`
          document.querySelector(".tasks-list").insertAdjacentHTML("beforeend", markup);
        });
        cancelBtn = document.querySelectorAll(".tasks-list .list-item .cancel");
        cancelBtnListener();
        completeBtn = document.querySelectorAll(".tasks-list .list-item .complete");
        completeBtnListener();
        activeTasks = document.querySelectorAll(".tasks-list li");
      } else {
        markup = `<p>There aren't any Active Tasks assigned to your Truck</p>`;
        document.querySelector(".tasks-list").insertAdjacentHTML("beforeend", markup);
      }
    });
}

//Adding Listeners to the complete Buttons
var completeBtn = document.querySelectorAll(".tasks-list .list-item .complete");
function completeBtnListener() {
  completeBtn.forEach(function (btn) {
    if (!btn.dataset.listenerAdded) {
      btn.addEventListener("click", function () {
        var id = btn.parentNode.parentNode.parentNode.id;
        const taskMarker = taskMarkers.find((marker) => marker.taskInfo.taskId == id);

        if (truckMarkers.length > 0 && taskMarker) {
          const truckMarker = truckMarkers[0];
          const distance = calculateDistance(truckMarker.getLatLng(), taskMarker.getLatLng());

          const taskToBeCompleted = document.getElementById("" + id + "");
          const existingDistanceError = taskToBeCompleted.querySelector('.error.distance');
          const existingLoadError = taskToBeCompleted.querySelector('.error.load');

          if (distance <= 50) {
            completeTask(id);
            if (existingDistanceError) {
              existingDistanceError.remove();
            }
          } else {
            if (existingLoadError) {
              existingLoadError.remove();
            }
            if (!existingDistanceError) {
              const markup =
                `<div class="error distance active">` +
                `<p><b>Error:&nbsp;</b>Your truck must be 50m away or closer to the Task Location.</p>` +
                `</div>`;
              taskToBeCompleted.insertAdjacentHTML("beforeend", markup);
            }
          }
        }
      });
      btn.dataset.listenerAdded = true;
    }
  });
}

//Calculate the distance between the truck and the task
function calculateDistance(point1, point2) {
  const R = 6371000;
  const lat1 = (point1.lat * Math.PI) / 180;
  const lon1 = (point1.lng * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const lon2 = (point2.lng * Math.PI) / 180;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Function that completes a Task
function completeTask(taskID) {
  fetch("complete_Task.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId: taskID })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const taskToBeCompleted = document.getElementById("" + taskID + "");
      const existingError = taskToBeCompleted.querySelector('.error');

      if (data != false) {
        const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskID);
        removeTaskMarker(marker);
        removePolyline(taskID);
        fetchActiveTasks();
        removeTruckLoad();
        truckLoadArray = [];
        fetchTruckLoad();

        if (existingError) {
          existingError.remove();
        }
      } else {
        if (!existingError) {
          const markup =
            `<div class="error load active">` +
            `<p><b>Error:&nbsp;</b> There aren't enough resources in your Truck to Complete this Task.</p>` +
            `</div>`;
          taskToBeCompleted.insertAdjacentHTML("beforeend", markup);
        }
      }
    });
}

//Adding Listeners to the cancel Buttons
var cancelBtn = document.querySelectorAll(".tasks-list .list-item .cancel");
function cancelBtnListener() {
  cancelBtn.forEach(function (btn) {
    if (!btn.dataset.listenerAdded) {
      btn.addEventListener("click", function () {
        var id = btn.parentNode.parentNode.id;
        cancelTask(id);
      });
      btn.dataset.listenerAdded = true;
    }
  });
}

//Function that cancels a Task
function cancelTask(taskID) {
  fetch("cancel_Task.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taskId: taskID }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskID);
      var lat = marker.getLatLng().lat.toString();
      var lon = marker.getLatLng().lng.toString();
      removeTaskMarker(marker);
      setMapMarkers(lat, lon, taskID);
      removePolyline(taskID);
      fetchActiveTasks();
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