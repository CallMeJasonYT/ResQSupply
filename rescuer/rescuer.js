/* ~~~~~~~~~~ Map Creation ~~~~~~~~~~ */

var map = L.map('map').setView([38.246242, 21.7350847], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
map.zoomControl.remove();

const searchInput = document.querySelector('.address-search');
const mapContainer = document.getElementById('map-container');
const searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener("click", fetchGeoSearch);

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchGeoSearch();
  }
});

function fetchGeoSearch() {
  const query = searchInput.value;
  fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query + '&limit=1')
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

function fetchGeoTasks(query) {
  fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query.address + '&limit=1')
    .then(result => result.json())
    .then(result => {
      setMapMarkers(result[0], query.task_id);
    });
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
        fetchGeoTasks(entry);
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
        fetchGeoTasks(entry);
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
        fetchGeoTruck(entry);
      });
    });
}

function fetchGeoTruck(query) {
  fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query.address + '&limit=1')
    .then(result => result.json())
    .then(result => {
      setMapMarkers(result[0], query.category);
    });
}

function revGeocode(query){
  var lng = query.lng;
  var lat = query.lat;
  fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&format=json')
    .then(result => result.json())
    .then(result => {
      updateTruckLoc(parseDisplayName(result.display_name));
    });
}

function parseDisplayName(displayName) {
  const words = displayName.split(', ');
  const address = words.slice(0, 2).join(', ');
  return address;
}

function updateTruckLoc(position) {
  fetch('update_TruckLoc.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: position
    })
  })
    .then(response => response.json())
}

const taskMarkers = [];
const truckMarkers = [];
function setMapMarkers(result, task_id) {
  if(task_id == undefined){task_id = null;}
    fetch("fetch_TasksInfo.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskID: task_id })
    })
      .then((response) => response.json())
      .then((data) => {
        data.forEach(res => {
          if (res.status != undefined) {
            var iconName = "" + res.status + " " + res.category + "";
          } else {
            var iconName = res.category;
          };
          const latitude = parseFloat(result.lat);
          const longitude = parseFloat(result.lon);

          if(res.category != 'Truck' && res.category != 'Base'){
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
            if(res.veh == veh_id && truckMarkers.length != 0){
              drawLineOnce(task_id);
            }
          }else if(res.category == 'Truck'){
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
          }else{
            const marker = new L.Marker([latitude, longitude], { icon: categoryIcons[iconName] });
            marker.addTo(map);
          }
        });
      });
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
        popupContent += `<button class="custom-button" onclick="handleButtonClick(${marker.taskInfo.taskId})">Take on Task</button>`;
      }

      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    });
}

function handleButtonClick(taskId) {
  fetch("update_Task.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId: taskId })
  })
    .then((response) => response.json())
    .then((result) => {
    })
    const marker = taskMarkers.find((marker) => marker.taskInfo.taskId === taskId);
    var loc = { lat: marker.getLatLng().lat.toString(), lon: marker.getLatLng().lng.toString() };
    setMapMarkers(loc, taskId);
    removeAllPolylines();
    drawLine();
    removeTaskMarker(marker);
    fetchActiveTasks();
}

function removeTaskMarker(marker){
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
  });

  const filterText = div.querySelector('.filter-text');
  filterText.addEventListener('click', function () {
    
  });
  return div;
};

filters.addTo(map);

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
    const polyline = L.polyline([pointA, pointB], { color: '#0e505e' }).addTo(map);
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
  const polyline = L.polyline([pointA, pointB], { color: '#0e505e' }).addTo(map);
  polylines.push(polyline);
}

function removeAllPolylines() {
  polylines.forEach(polyline => map.removeLayer(polyline));
  polylines.length = 0;
}

/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
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
  deskDivCreation();
  deskCustomization();
}

//Creating desktop-view Div
const burgerCont = document.querySelector(".burger-container");
const moduleSel = document.querySelector(".module");
const tasksCont = document.querySelector(".tasks-container");
const unloadTab = document.querySelector(".unload-tab");
function deskDivCreation() {
  var desktopViewDiv = document.createElement("div");
  desktopViewDiv.className = "desktop-view";
  var parentContainer = document.querySelector(".rescuer-home");
  parentContainer.insertBefore(desktopViewDiv, burgerCont);
  desktopViewDiv.appendChild(burgerCont);
  desktopViewDiv.appendChild(moduleSel);
  burgerCont.insertAdjacentElement("afterbegin", tasksCont);
  cnt++;
}

//Activating all the tabs and NavBar Options
const burgerIcox = document.querySelector(".burgerx");
const burgerIco = document.querySelector(".burgeri");
const mapItem = document.querySelector("#map");
const mapCont = document.querySelector(".map-container");
function deskCustomization() {
  mapItem.id = "map_desktop";
  mapCont.classList.add("desktop");
  tasksCont.classList.add("desktop");
  moduleSel.classList.add("desktop");
  burgerCont.classList.add("desktop");
  burgerIcox.classList.remove("active");
  burgerIco.classList.remove("active");
  map.invalidateSize()
}

//Mobile Layout Changes
function mobileApply() {
  deskDivDeletion();
  mobileCustomization();
}

//Removing desktop-view Div
function deskDivDeletion() {
  var desktopViewDiv = document.querySelector(".desktop-view");
  var parentContainer = desktopViewDiv.parentNode;
  parentContainer.appendChild(burgerCont);
  parentContainer.appendChild(moduleSel);
  moduleSel.appendChild(tasksCont);
  desktopViewDiv.remove();
  cnt--;
}

//Activating 
const loadTab = document.querySelector(".load-tab");
const truckloadTab = document.querySelector(".truckload-tab");
const loadBtn = document.querySelector("#loadBtn");
const truckloadBtn = document.querySelector("#truckloadBtn");
const unloadBtn = document.querySelector("#unloadBtn");
function mobileCustomization() {
  loadTab.classList.remove("active");
  unloadTab.classList.remove("active");
  truckloadTab.classList.add("active");
  unloadBtn.classList.remove("selected");
  loadBtn.classList.remove("selected");
  truckloadBtn.classList.add("selected");
  mapItem.id = "map";
  mapCont.classList.remove("desktop");
  tasksCont.classList.remove("desktop");
  moduleSel.classList.remove("desktop");
  burgerCont.classList.remove("desktop");
  burgerIco.classList.add("active");
  map.invalidateSize()
}

/* ~~~~~~~~~~ Truck Menu Functions ~~~~~~~~~~ */

//Truck Open
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerCont.classList.add("active");
  moduleSel.classList.remove("active");
});

//Truck Close
burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerCont.classList.remove("active");
  moduleSel.classList.add("active");
});

//Load Button
const loadTruckBtn = document.querySelector(".add-load");
const loadItems = document.querySelector(".load-items-tab");
const loadItemsForm = document.querySelector(".load-items-form");
loadBtn.addEventListener("click", (e) => {
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

//Truckload Button
truckloadBtn.addEventListener("click", (e) => {
  truckloadTab.classList.add("active");
  loadTab.classList.remove("active");
  unloadTab.classList.remove("active");
  loadItems.classList.remove("active");
  unloadItemsTab.classList.remove("active");
  loadItemsForm.classList.remove("active");
  loadQuantity.classList.remove("active");
  loadConfirm.classList.remove("active");
  unloadQuantity.classList.remove("active");
  unloadConfirm.classList.remove("active");
  removeItemLoad();
  removeQuantityLoad();
  removeConfirmLoad();
  removeUnloadConfirm();
});

//Unload Button
const unloadTruckBtn = document.querySelector(".remove-load");
const unloadQuantity = document.querySelector(".unload-quantity-form");
const unloadItemsTab = document.querySelector(".unload-items-tab");
unloadBtn.addEventListener("click", (e) => {
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

//Bottom Border for Tab Buttons
function toggleBottomBorder(clickedButton) {
  var buttons = document.querySelectorAll(".button");
  buttons.forEach(function (button) {
    button.classList.remove("selected");
  });
  clickedButton.classList.add("selected");
}

//Load Truck Plus Button
loadTruckBtn.addEventListener("click", (e) => {
  loadTruckBtn.classList.remove("active");
  loadItemsForm.classList.add("active");
  loadItems.classList.add("active");
  fetchLoadItems();
});

//Load Truck Items
const loadQuantity = document.querySelector(".load-quantity-form");
const nextButton1 = document.querySelector(".button.next1");
nextButton1.addEventListener("click", (e) => {
  noItemError();
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

//Unload Truck Plus Button
unloadTruckBtn.addEventListener("click", (e) => {
  unloadTruckBtn.classList.remove("active");
  unloadQuantity.classList.add("active");
  unloadItemsTab.classList.add("active");
  removeUnloadItems();
  quantityUnLoad();
  unloadEventListener();
  maxBtnEventListener();
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
    errorGreaterQ.classList.remove("active")
    removeItemLoad();
    removeQuantityLoad();
    removeConfirmLoad();
    loadDataArray = [];
  })
})

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
        `<input class="quantity-input" type="number" value="0">` +
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
function noItemError() {
  if (document.querySelector(".load-items-form .item-list .item.selected") == null) {
    errorNone.classList.add("active");
  } else {
    errorNone.classList.remove("active");
    notAvailable();
  }
}

const errorAvailable = document.querySelector(".error.available");
function notAvailable() {
  var selItems = document.querySelectorAll(".load-items-form .item-list .item.selected");
  let hasError = false;
  selItems.forEach(function (item) {
    if (item.querySelector(".item-available").textContent == "Available: 0") {
      hasError = true;
    }
  });

  if (hasError) {
    errorAvailable.classList.add("active");
  } else {
    loadItemsForm.classList.remove("active");
    loadQuantity.classList.add("active");
    errorAvailable.classList.remove("active");
    selItemsLoad();
  }
}

const errorZeroQ = document.querySelector(".error.zero-quantity");
function zeroQuantity() {
  let hasError = false;
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
    greaterQuantity();
  }
}

const errorGreaterQ = document.querySelector(".error.greater-quantity");
function greaterQuantity() {
  var selectedItems = document.querySelectorAll(".load-items-form .item-list .item.selected");
  let hasError = false;
  var availableNumbers = [];
  selectedItems.forEach(function (item) {
    var itemAvailable = item.querySelector(".item-available");
    var match = itemAvailable.textContent.match(/Available: (\d+)/);
    if (match) {
      var availableNumber = parseInt(match[1], 10);
      availableNumbers.push(availableNumber);
    }
  });

  itemsQuantityBtn.forEach(function (item, index) {
    var itemQ = parseInt(item.querySelector(".quantity-input").value, 10);
    if (itemQ > availableNumbers[index]) {
      hasError = true;
    }
  });

  if (hasError) {
    errorGreaterQ.classList.add("active");
  } else {
    loadQuantity.classList.remove("active");
    loadConfirm.classList.add("active");
    errorGreaterQ.classList.remove("active");
    submitLoad();
  }
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
      `<input class="quantity-input" type="number" value="0">` +
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
var unloadConfirmBtn = document.querySelectorAll(".unload-confirm-form .selected-items-confirm .item");
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
      unloadConfirmBtn = document.querySelectorAll(".unload-confirm-form .selected-items-confirm .item");
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
  unloadConfirmBtn.forEach(function (item) {
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
          `<div class="item-content">` +
          `<p class="item-text">${res.strGoodN}</p>` +
          `<p class="item-available">Available: ${res.strGoodV}</p>` +
          `</div>` +
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
function fetchTruckLoad() {
  fetch("fetch_TruckLoad.php", {
    method: "POST"
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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
    });
}

//Fetching the Username and Vehicle of the User and displaying the Welcome Message
function fetchResInfo() {
  fetch("fetch_ResInfo.php", {
    method: "POST"
  })
    .then((response) => response.json())
    .then((data) => {
      const userData = data.data[0];
      veh_id = userData.vehicle;
      if (userData) {
        const markupWelcome = `<div class="welcome">Welcome, ${userData.username}!</div>`;
        document.querySelector(".footer").insertAdjacentHTML("afterBegin", markupWelcome);

        const markupVehicle =
          `<p class="truckNum">Truck ID: ${userData.vehicle}</p>` +
          `<p class="truckOwner">Owner: ${userData.username}</p>`;

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
      if (data != "False") {
        data.forEach((res) => {
          markup =
            `<li class="list-item" id=${res.id}>`+
            `<div class="item-title"><b>${res.goodName}</b>`+
            `<div class="cancel">`+
            `<p> Cancel </p>`+
            `<i class="fa-solid fa-ban cancelt"></i>`+
            `</div>`+
            `</div>`+
            `<div class="information">Citizen Information: ${res.fullname}, ${res.telephone}</div>`+
            `<div class="quantity">Quantity: ${res.goodValue}</div>`+
            `<div class="datetime">Creation Date: ${res.creationDate}`+
            `<div class="complete-box">`+
            `<div class="complete">`+
            `<p> Complete </p>`+
            `<i class="fa-solid fa-check check"></i>`+
            `</div>`+
            `</div>`+
            `</div>`+
            `</li>`
          document.querySelector(".tasks-list").insertAdjacentHTML("beforeend", markup);
        });
        cancelBtn = document.querySelectorAll(".tasks-list .list-item .cancel");
        cancelBtnListener();
      } else {
        markup = `<p>There aren't any Active Tasks assigned to your Truck</p>`;
        document.querySelector(".tasks-list").insertAdjacentHTML("beforeend", markup);
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
    body: JSON.stringify({taskId: taskID }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
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