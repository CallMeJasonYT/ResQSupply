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
const map_desktop = document.getElementById('map');
map_desktop.classList.add("map");
map_desktop.classList.add("active");
/*searchIcon.addEventListener("click", fetchGeoSearch);

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
}*/

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

/*function fetchTasksLoc() {
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

function revGeocode(query) {
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
const baseMarkers = [];
function setMapMarkers(result, task_id) {
  if (task_id == undefined) { task_id = null; }
  fetch("fetch_TasksInfo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskID: task_id })
  })
    .then((response) => response.json())
    .then((data) => {
      data.forEach(res => {
        var iconName = "";
        if (res.status != undefined && res.status != 'Completed') {
          iconName = "" + res.status + " " + res.category + "";
        } else if (res.status != 'Completed') {
          iconName = res.category;
        };
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);

        if (iconName != "") {
          if (res.category != 'Truck' && res.category != 'Base') {
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
          } else if (res.category == 'Truck') {
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
          } else {
            const marker = new L.Marker([latitude, longitude], { icon: categoryIcons[iconName] });
            marker.baseInfo = {
              latitude: latitude,
              longitude: longitude
            };
            marker.addTo(map);
            baseMarkers.push(marker);
          }
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
        popupContent += `<button class="custom-button" onclick="handleButtonClick(event, ${marker.taskInfo.taskId})">Take on Task</button>`;
      }

      var popup = L.popup().setLatLng(marker.getLatLng()).setContent(popupContent);
      marker.bindPopup(popup).openPopup();
    });
}

var activeTasks = document.querySelectorAll(".tasks-list li");
function handleButtonClick(event, taskId) {
  if (activeTasks.length + 1 < 4) {
    console.log(activeTasks.length)
    fetch("update_Task.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: taskId })
    })
      .then((response) => response.json())
      .then((result) => {
        const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskId);
        var loc = { lat: marker.getLatLng().lat.toString(), lon: marker.getLatLng().lng.toString() };
        removeTaskMarker(marker);
        setMapMarkers(loc, taskId);
        removeAllPolylines();
        drawLine();
        fetchActiveTasks();
      });
  } else {
    event.stopPropagation();
    console.log(activeTasks.length)
    const marker = taskMarkers.find((marker) => marker.taskInfo.taskId == taskId);
    console.log(marker);
    const popupContent = `
      <p class="error activeTasks active"><b>Error:&nbsp;</b> You have reached the maximum number of active tasks.<p>
    `;
    marker.getPopup().setContent(marker.getPopup().getContent() + popupContent);
    marker.getPopup().update();
    console.log(marker.getPopup().getContent());
  }
}

function removeTaskMarker(marker) {
  map.removeLayer(marker);
  const index = taskMarkers.indexOf(marker);
  if (index !== -1) {
    taskMarkers.splice(index, 1);
  }
}*/

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
  const xmark = document.querySelector(".cancelr");
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

/*const polylines = [];
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
}*/

/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  map.invalidateSize();
  checkWidth();
  /*fetchResInfo();
  fetchTasksLoc();
  fetchBaseInfo();
  fetchTruckLoc();
  fetchActiveTasks();*/
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
  map.invalidateSize();
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

/* ~~~~~~~~~~ Burger Menu Functions ~~~~~~~~~~ */

//Burger Open
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerCont.classList.add("active");
  burgerMenu.classList.add("active");
  moduleSel.classList.remove("active");
});

//Burger Close
const statsTab = document.querySelector(".statistics");
const rescAccTab = document.querySelector(".rescuer-account");
const annCreationTab = document.querySelector(".announcement-creation");
const storageMngTab = document.querySelector(".storage-mngmt");
burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerCont.classList.remove("active");
  statsTab.classList.remove("active");
  rescAccTab.classList.remove("active");
  annCreationTab.classList.remove("active");
  storageMngTab.classList.remove("active");
  moduleSel.classList.add("active");
});

const burgerItems = document.querySelectorAll(".burger-item");
const burgerMenu = document.querySelector(".burger-menu");
burgerItems.forEach(function (item) {
    item.addEventListener("click", function () {
        burgerMenu.classList.remove("active");
        switch (item.id) {
            case 'stats':
                statsTab.classList.add("active");
                rescAccTab.classList.remove("active");
                annCreationTab.classList.remove("active");
                storageMngTab.classList.remove("active");
                break;
            case "resacc":
                rescAccTab.classList.add("active");
                statsTab.classList.remove("active");
                annCreationTab.classList.remove("active");
                storageMngTab.classList.remove("active");
                break;
            case "announcement":
                annCreationTab.classList.add("active");
                statsTab.classList.remove("active");
                rescAccTab.classList.remove("active");
                storageMngTab.classList.remove("active");
                break;
            case "storage":
                storageMngTab.classList.add("active");
                statsTab.classList.remove("active");
                rescAccTab.classList.remove("active");
                annCreationTab.classList.remove("active");
                break;
        }
    });
});

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
      var loc = { lat: marker.getLatLng().lat.toString(), lon: marker.getLatLng().lng.toString() };
      removeTaskMarker(marker);
      setMapMarkers(loc, taskID);
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

//Form Validation

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
  fetch("check_username.php", {
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
const signupForm = document.querySelector(".form.signup_form");
const emailInput = document.querySelector("#emailInput");
signupForm.addEventListener("submit", (e) => {
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
    fetch("home.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput.value, fullname: fullnameInput.value, phone: phoneInput.value, address: addressInput.value, password: passInput.value, email: emailInput.value }),
    })
      .then((response) => response.json())
      .then((result) => {
        formAct.action = "citizen/citizen.html";
        formAct.submit();
      });
  }
});