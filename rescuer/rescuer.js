/* ~~~~~~~~~~ Map ~~~~~~~~~~ */

// Map Initialization
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

// Change Position of Search
var searchControl = L.control({
  position: 'topright'
});

// Add the Search Bar Element
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

// Fetch Geolocation based on the Searched Route Name
function fetchGeoSearch() {
  const query = searchInput.value;
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=' + query + '&limit=1')
    .then(result => result.json())
    .then(parsedResult => {
      setResultList(parsedResult[0]);
    });
}

// Change the displayed location according to the Searched Route Name
function setResultList(parsedResult) {
  const latitude = parseFloat(parsedResult.lat);
  const longitude = parseFloat(parsedResult.lon);
  position = new L.LatLng(latitude, longitude);
  map.flyTo(position, 15);
}

// Markers Icons Initialization
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

// Fetch API to find the location of Every Task, Truck and Base
function fetchMarkersInfo() {
  fetch("fetch_BaseInfo.php", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(entry => {
        setMapMarkers(entry.lat, entry.lon, 'Base');
      })
      return fetch("fetch_TruckLoc.php", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
          data.forEach(entry => {
            setMapMarkers(entry.lat, entry.lon, 'Truck');
          });
          return fetch("fetch_TasksLoc.php", { method: "POST" })
            .then((response) => response.json())
            .then((data) => {
              data.forEach(entry => {
                setMapMarkers(entry.lat, entry.lon, entry.task_id);
              });
            });
        });
    });
}

// Function that Reverse Geocodes the Truck Location when updated by the Rescuer
function revGeocode(query) {
  var lng = query.lng;
  var lat = query.lat;
  fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&format=json')
    .then(result => result.json())
    .then(result => {
      updateTruckLoc(parseDisplayName(result.display_name), lat, lng);
    });
}

// Function that Formats the address correctly
function parseDisplayName(displayName) {
  const words = displayName.split(', ');
  const address = words.slice(0, 2).join(', ');
  return address;
}

// Function that Updates the Truck Location in the Database when updated by the Rescuer
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

// Function that places the Markers on the Map
const taskMarkers = [];
const truckMarkers = [];
const baseMarkers = [];
function setMapMarkers(lat, lon, task_id) {
  const latitude = lat;
  const longitude = lon;
  if (task_id == 'Truck') { // Markers for Trucks
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Truck'], draggable: true });
    marker.truckInfo = {
      vehId: veh_id,
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    // Make the Truck Icon Draggable
    marker.on('dragend', function (e) {
      removeAllPolylines();
      var position = marker.getLatLng();
      marker.setLatLng(position).update();
      map.panTo(position);
      revGeocode(position);
      drawLine();
    });
    truckMarkers.push(marker);
  } else if (task_id == 'Base') { // Markers for the Base
    const marker = new L.Marker([latitude, longitude], { icon: categoryIcons['Base'] });
    marker.baseInfo = {
      latitude: latitude,
      longitude: longitude
    };
    marker.addTo(map);
    baseMarkers.push(marker);
  } else {
    fetch("fetch_TasksInfo.php", { // Task Markers
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskID: task_id })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
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
              longitude: longitude,
              vehId: res.veh
            };
            marker.addTo(map);
            marker.on('click', function () { // Popup Info for each Task
              showTaskPopup(marker, res.status);
            });
            taskMarkers.push(marker);
          }
        });
      })
      .then(data => {
        drawLine();
      });
  }
}

// Show Tasks Popups
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
        popupContent += `<button class="task-button" onclick="handleButtonClick(event, ${marker.taskInfo.taskId})">Take on Task</button>`;
      }
      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    });
}

// Function that draws Lines from the Truck to its Active Tasks
const polylines = [];
function drawLine() {
  const pointA = [truckMarkers[0].getLatLng().lat, truckMarkers[0].getLatLng().lng];
  var activeTasksMarkers = [];
  taskMarkers.forEach(marker => {
    if (marker.options.icon == categoryIcons['Executing Request'] || marker.options.icon == categoryIcons['Executing Offer'] && marker.taskInfo.vehId == veh_id) {
      activeTasksMarkers.push(marker);
    }
  })
  activeTasksMarkers.forEach(marker => {
    const pointB = [marker.getLatLng().lat, marker.getLatLng().lng];
    const polyline = L.polyline([pointA, pointB], { color: '#350052' }).addTo(map);
    polyline.taskInfo = {
      task_id: marker.taskInfo.taskId
    };
    polylines.push(polyline);
  })
}

// Function that handles the Task Assignment to the Rescuer
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
        removeAllPolylines();
        setMapMarkers(lat, lon, taskId);
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

// Function that removes a Task Marker from the Map and the TaskMarkers Array
function removeTaskMarker(marker) {
  map.removeLayer(marker);
  const index = taskMarkers.indexOf(marker);
  if (index !== -1) {
    taskMarkers.splice(index, 1);
  }
}

// Function that Adds the filters on the Map
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

// Function that Adds Event Listener on each Filter Menu Item
document.addEventListener("DOMContentLoaded", function () {
  var filterItems = document.querySelectorAll('.filters-list li .name');
  filterItems.forEach(function (item) {
    var checkbox = item.parentNode.querySelector('input[type="checkbox"]');
    item.addEventListener('click', function () {
      checkbox.checked = !checkbox.checked;
    });
  })
});

// Replace the Map with the Filter Menu
const filtersmenu = document.querySelector(".filters-menu");
const search = document.querySelector(".map-container .search");
function replaceMapWithMenu() {
  map_desktop.classList.remove("active");
  filtersmenu.classList.add("active");
  search.classList.remove("active");
}

// Add or Remove Markers when the xmark is clicked
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

// Hide Markers based on their Category
function removeMarkersByCategory(category) {
  taskMarkers.forEach(marker => {
    const iconName = getIconName(marker);
    if (iconName.includes(category)) {
      map.removeLayer(marker);
    }
  });
}

// Show Markers based on their Category
function addMarkersByCategory(category) {
  taskMarkers.forEach(marker => {
    const iconName = getIconName(marker);
    if (iconName.includes(category)) {
      map.addLayer(marker);
    }
  });
}

// Function that returns the Icon Name that has been Assigned to a Marker
function getIconName(marker) {
  const iconUrl = marker.options.icon.options.iconUrl;
  const iconName = Object.keys(categoryIcons).find(key => categoryIcons[key].options.iconUrl == iconUrl);
  return iconName;
}

// Function that Hides all the Polylines
function hidePolylines() {
  polylines.forEach(polyline => {
    map.removeLayer(polyline);
  })
}

// Function that Shows all the Polylines
function showPolylines() {
  polylines.forEach(polyline => {
    map.addLayer(polyline);
  })
}

// Map Legend Creation
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

// Zoom Buttons Location
L.control.zoom({
  position: 'bottomright'
}).addTo(map);

// Function that Removes all the Polylines
function removeAllPolylines() {
  polylines.forEach(polyline => map.removeLayer(polyline));
  polylines.length = 0;
}

// Function that Removes a Polyline based on the Task id
function removePolyline(task_id) {
  const polylineToRemove = polylines.find(polyline => polyline.taskInfo.task_id == task_id);
  map.removeLayer(polylineToRemove);
  const index = polylines.indexOf(polylineToRemove);
  if (index !== -1) {
    polylines.splice(index, 1);
  }
}

/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

// When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  map.invalidateSize();
  checkWidth();
  fetchResInfo();
  fetchMarkersInfo();
  fetchActiveTasks();
});
window.addEventListener("resize", (e) => {
  checkWidth();
});

// Checking Viewport Width
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

// Desktop Layout Changes
function desktopApply() {
  deskCustomization();
  cnt++;
}

// Function that Customizes the DOM for Desktop-like Viewports
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

// Mobile Layout Changes
function mobileApply() {
  mobileCustomization();
  cnt--;
}

// Function that Customizes the DOM for Mobile-like Viewports
function mobileCustomization() {
  var activeTasksSect = document.querySelector('.active-tasks-sect');
  var mapSection = document.querySelector('.map-sect');
  var mainElement = document.querySelector('main');
  mainElement.removeChild(activeTasksSect);
  mainElement.insertBefore(activeTasksSect, mapSection.nextSibling);
  map.invalidateSize();
}

/* ~~~~~~~~~~ Burger Menu Functions ~~~~~~~~~~ */

// Burger Menu Event Listener (Open)
const burgerSect = document.querySelector(".burger-sect");
const mapSection = document.querySelector(".map-sect");
const activeTasksSect = document.querySelector(".active-tasks-sect");
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerSect.classList.add("active");
  mapSection.classList.remove("active");
  activeTasksSect.classList.remove("active");
});

// Burger Menu Event Listener (Close)
burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerSect.classList.remove("active");
  mapSection.classList.add("active");
  activeTasksSect.classList.add("active");
  map.invalidateSize();
});

/* ~~~~~~~~~~ Burger Menu Options ~~~~~~~~~~ */

// Load Tab Button Event Listener
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

// Truckload Tab Button Event Listener
const truckloadBtn = document.querySelector("#truckloadBtn");
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

// Unload Tab Button Event Listener
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

// Function that adds a Bottom Border for the Tab Buttons
function toggleBottomBorder(clickedButton) {
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function (button) {
    button.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

/* ~~~~~~~~~~ Load Functions ~~~~~~~~~~ */

// Load Truck Plus Button Event Listener
const distanceErrorLoad = document.querySelector(".load-tab .error.distance")
loadTruckBtn.addEventListener("click", (e) => {
  const distance = calculateDistance(truckMarkers[0].getLatLng(), baseMarkers[0].getLatLng());
  if (distance <= 100) {
    distanceErrorLoad.classList.remove("active");
    loadTruckBtn.classList.remove("active");
    loadItemsForm.classList.add("active");
    loadItems.classList.add("active");
    fetchLoadItems();
    loadDataArray = [];
  } else {
    distanceErrorLoad.classList.add("active");
  }
});

// Next Button After Selecting Items Event Listener
const loadQuantity = document.querySelector(".load-quantity-form");
const selectItemsLoadBtn = document.querySelector(".button.selectItemsLoad");
selectItemsLoadBtn.addEventListener("click", (e) => {
  noItemError();
  overQuantity();
});

// Next Button After Quantity Input Event Listener
const loadConfirm = document.querySelector(".load-confirm-form");
const selectQuantityLoadBtn = document.querySelector(".button.selectQuantityLoad");
selectQuantityLoadBtn.addEventListener("click", (e) => {
  zeroQuantity();
});

// Submit Load Button Event Listener
const submitButtonLoad = document.querySelector(".button.submitLoad");
submitButtonLoad.addEventListener("click", (e) => {
  showSuccessMessageLoad();
});

// Function that Shows a Success Message and prepares the Webpage for a new load
const successMessageLoad = document.getElementById("successMessageLoad");
function showSuccessMessageLoad() {
  successMessageLoad.style.display = "block";
  setTimeout(() => {
    successMessageLoad.style.display = "none";
    loadConfirm.classList.remove("active");
    loadTruckBtn.classList.add("active");
    removeTruckLoad();
    loadTruck();
    removeItemLoad();
    removeQuantityLoad();
    removeConfirmLoad();
  }, 3000);
}

// Cancel Load Button Event Listener
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

// Clear Load Button Event Listener
const clearBtnL = document.querySelector(".load-items-form .clrbtn");
clearBtnL.addEventListener("click", function () {
  loadDataArray = [];
  itemsLoadBtn.forEach(function (item) {
    item.classList.remove("selected");
  })
})

// Item Select Load Dropdown
const itemSelButton = document.querySelector(".item-btn");
const itemList = document.querySelector(".item-options");
const itemContent = document.querySelector(".content");
itemSelButton.addEventListener("click", (e) => {
  itemSelButton.classList.toggle("selected");
  itemContent.classList.add("active");
  itemList.classList.toggle("active");
});

// Adding Event Listeners to the Load Form List Item Elements and Displaying the Selected Items Correctly
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

// Function that adds the Quantity page Elements for Load
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

// Function that adds the Submit Load Form page Elements
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

// Function that Removes Items from the Load Items Form
function removeItemLoad() {
  itemsLoadBtn.forEach(function (item) {
    item.remove();
  });
}

// Function that Removes Items from the Load Quantity Form
var itemsQuantityBtn = document.querySelectorAll(".load-quantity-form .selected-items-list .item");
function removeQuantityLoad() {
  itemsQuantityBtn.forEach(function (item) {
    item.remove();
  });
}

// Function that Removes Items from the Load Confirm Form
var itemsConfirmBtn = document.querySelectorAll(".load-confirm-form .selected-items-confirm .item");
function removeConfirmLoad() {
  itemsConfirmBtn.forEach(function (item) {
    item.remove();
  });
}

// Function that checks If there is aren't any items selected
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

// Function that checks If the item that's selected has 0 Quantity
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

// Function that checks If Input Quantity value is 0
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

// Function that auto-fills the Max Available Quantity if the Input Value is greater than the Max Available Quantity
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

// Function that removes all the items from TruckLoad
var truckLoadItems = document.querySelectorAll(".truckload-list .list-item");
function removeTruckLoad() {
  truckLoadItems.forEach(function (item) {
    item.remove();
  });
}

/* ~~~~~~~~~~ Unload Functions ~~~~~~~~~~ */

// Unload Truck Plus Button Event Listener
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
    unloadDataArray = [];
  } else if (distance > 100) {
    distanceErrorUnload.classList.add("active");
    truckloadErrorUnload.classList.remove("active");
  } else if (truckLoadArray.length == 0) {
    truckloadErrorUnload.classList.add("active");
    distanceErrorUnload.classList.remove("active");
  }
});

// Next Button After Quantity Input Event Listener
const selectItemsUnloadBtn = document.querySelector(".button.selectItemsUnload");
const unloadConfirm = document.querySelector(".unload-confirm-form");
selectItemsUnloadBtn.addEventListener("click", (e) => {
  unloadQuantity.classList.remove("active");
  unloadConfirm.classList.add("active");
  submitUnload();
});

// Submit Unload Button Event Listener
const submitButtonUnload = document.querySelector(".button.submitUnload");
submitButtonUnload.addEventListener("click", (e) => {
  showSuccessMessageUnload();
});

// Function that Shows a Success Message and prepares the Webpage for a new unload
const successMessageUnload = document.getElementById("successMessageUnload");
function showSuccessMessageUnload() {
  successMessageUnload.style.display = "block";
  setTimeout(() => {
    successMessageUnload.style.display = "none";
    unloadConfirm.classList.remove("active");
    unloadTruckBtn.classList.add("active");
    removeTruckLoad();
    removeUnloadConfirm();
    unloadTruck();
  }, 3000);
}

// Cancel Unload Button Event Listener
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

// Clear Unload Button Event Listener
const clearBtnU = document.querySelector(".unload-quantity-form .clrbtn");
clearBtnU.addEventListener("click", function () {
  unloadDataArray = [];
  unloadItems.forEach(function (item) {
    item.querySelector(".quantity-input").value = 0;
  })
})

// Function that adds the Quantity page Elements for Unload
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

// Function that adds the Submit Unload Form page Elements
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

// Function that Removes Items from the Unload Quantity Form
function removeUnloadItems() {
  unloadItems.forEach(function (item) {
    item.remove();
  });
}

// Function that Removes Items from the Unload Confirm Form
function removeUnloadConfirm() {
  unloadItemsConf.forEach(function (item) {
    item.remove();
  });
}

// Function that auto-fills the Max Available Quantity if the Input Value is greater than the Truckload
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

// Event Listener for the Max Button that auto-fills the Max Available Quantity from Truckload
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

// Function that fetches a list of the items and their Quantity from the Base Storage
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

// Function that Loads the truck with items from Base Storage
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

// Function that unloads the truck into the Base Storage
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

// Function that fetches the Truckload
var empty = false;
function fetchTruckLoad() {
  fetch("fetch_TruckLoad.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.querySelector(".truckload-tab .truckload-list").innerHTML = "";
      if (empty) {
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
      } else {
        empty = true;
        markup = `<p class="empty">The TruckLoad is Empty.</p>`;
        document.querySelector(".truckload-tab").insertAdjacentHTML("beforeend", markup);
      }
    });
}

// Function that Fetches the User's Username and Vehicle and displays the Welcome Message
function fetchResInfo() {
  fetch("fetch_ResInfo.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      veh_id = data[0].vehicle;
      if (data == "False") {
        location.href = "/ResQSupply/home.html";
      }
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

// Function that Fetches the Active Tasks
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

// Functions that Adds Event Listeners to the complete Buttons
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

// Function that calculates the distance between the truck and the task
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

// Function that handles the completion of a Task
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

// Function that adds Event Listeners to the Active Tasks cancel Buttons
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

// Function that handles the cancelation of a Task
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
      removeAllPolylines();
      fetchActiveTasks();
    });
}

// Function that handles the Logout of the User
const logoutButton = document.querySelector(".button.logout");
logoutButton.addEventListener("click", logoutUser);
function logoutUser() {
  fetch("/ResQSupply/logout_User.php", {
    method: "POST",
    credentials: 'include'
  });
  location.href = "/" + "ResQSupply/home.html";
}