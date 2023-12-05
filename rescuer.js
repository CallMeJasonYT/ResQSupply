/* ~~~~~~~~~~ Map Creation ~~~~~~~~~~ */

var map = L.map('map').setView([38.246242, 21.7350847], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Search Only when pressing Enter or the Magnifing Glass Icon
const searchInput = document.querySelector('.address-search');
const mapContainer = document.getElementById('map-container');
const searchIcon = document.getElementById('search-icon');
searchIcon.addEventListener("click", fetchGeo);

searchInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    fetchGeo();
  }
});

function fetchGeo() {
  const query = searchInput.value;
  fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + query + '&limit=1')
    .then(result => result.json())
    .then(parsedResult => {
      console.log(parsedResult[0]);
      setResultList(parsedResult[0]);
    });
}

function setResultList(parsedResult) {
  for (const marker of currentMarkers) {
    map.removeLayer(marker);
  }
  const latitude = parseFloat(parsedResult.lat);
  const longitude = parseFloat(parsedResult.lon);
  position = new L.LatLng(latitude, longitude);
  map.flyTo(position, 15);
}

/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  checkWidth();
  fetchResInfo();
  fetchTruckLoad();
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
  if (!loadItems.classList.contains("active") ) {
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
  loadItemsForm.classList.remove("active");
  loadQuantity.classList.add("active");
  selItemsLoad();
});

//Load Truck Quantity
const loadConfirm = document.querySelector(".load-confirm-form");
const nextButton2 = document.querySelector(".button.next2");
nextButton2.addEventListener("click", (e) => {
  loadQuantity.classList.remove("active");
  loadConfirm.classList.add("active");
  submitLoad();
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
  button.addEventListener("click", function() {
    loadTruckBtn.classList.add("active");
    loadItems.classList.remove("active");
    loadItemsForm.classList.remove("active");
    loadQuantity.classList.remove("active");
    loadConfirm.classList.remove("active");
    removeItemLoad();
    removeQuantityLoad();
    removeConfirmLoad();
    loadDataArray = [];
  })
})

//Cancel Button Unload
const cancelBtnU = document.querySelectorAll(".cancelu");
cancelBtnU.forEach(function (button) {
  button.addEventListener("click", function() {
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
function selItemsLoad(){
  itemsLoadBtn.forEach(function (item) {
      if (item.classList.contains("selected")) {
        var itemText = item.querySelector(".item-text").textContent;
        markup = 
        `<li class="item">`+
        `<div class="item-count">`+
        `<p class="item-text">${itemText}</p>`+
        `<div class="item-quantity">`+
        `<p class="quantity-text">Quantity: </p>`+
        `<input class="quantity-input" type="text" value="0">`+
        `</div>`+
        `</div>`+
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
function submitLoad(){
  itemsQuantityBtn.forEach(function (item) {
    var itemText = item.querySelector(".item-text").textContent;
    var itemQ = item.querySelector(".quantity-input").value;
    markup = 
    `<li class="item">`+
    `<div class="item-count">`+
    `<p class="item-text"> ${itemText} </p>`+
    `<div class="item-quantity">`+
    `<p class="quantity-text">Quantity: ${itemQ}</p>`+
    `</div>`+
    `</div>`+
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

/* ~~~~~~~~~~ TruckLoad Functions ~~~~~~~~~~ */
var truckLoadItems = document.querySelectorAll(".truckload-list .list-item");
function removeTruckLoad(){
  truckLoadItems.forEach(function (item) {
    item.remove();
  });
}

/* ~~~~~~~~~~ UnLoad Functions ~~~~~~~~~~ */
//Choosing the Quantity of the Items you want to Unload
var truckLoadArray = [];
var unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");
function quantityUnLoad(){
  truckLoadArray.forEach((item) => {
    markup =
    `<li class="item">`+
    `<div class="item-count">`+
    `<p class="item-text">${item.itemText}</p>`+
    `<div class="item-quantity">`+
    `<p class="quantity-text">Quantity:</p>`+
    `<input class="quantity-input" type="text" value="0">`+
    `<p class="max-button"> Max </p>`+
    `</div>`+
    `</div>`+
    `</li>`;
    document.querySelector(".unload-quantity-form .selected-items-list").insertAdjacentHTML("beforeend", markup);
  })
  unloadItems = document.querySelectorAll(".unload-quantity-form .selected-items-list .item");
}

//Adding the Items to Submit Form Unload
var unloadDataArray = [];
var unloadConfirmBtn = document.querySelectorAll(".unload-confirm-form .selected-items-confirm .item");
function submitUnload(){
  unloadItems.forEach(function (item) {
    var itemText = item.querySelector(".item-text").textContent;
    var itemQ = item.querySelector(".quantity-input").value;
    if(itemQ != 0){
      markup =
      `<li class="item">`+
      `<div class="item-count">`+
      `<p class="item-text"> ${itemText} </p>`+
      `<div class="item-quantity">`+
      `<p class="quantity-text">Quantity: ${itemQ}</p>`+
      `</div>`+
      `</div>`+
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

function removeUnloadItems(){
  unloadItems.forEach(function (item) {
    item.remove();
  });
}

function removeUnloadConfirm(){
  unloadConfirmBtn.forEach(function (item) {
    item.remove();
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
        `<li class="item">`+
        `<div class="item-content">`+
        `<p class="item-text">${res.strGoodN}</p>`+
        `<p class="item-available">Available: ${res.strGoodV}</p>`+
        `</div>`+
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
    .then((data) =>{
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
    .then((data) =>{
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
        `<li class="list-item">`+
        `<div class="item-title"><b>${res.loadGoodN}</b>`+
        `<p class="quantity"> Quantity: ${res.loadGoodV}</p>`+
        `</div>`+
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
      if (userData) {
          const markupWelcome = `<div class="welcome">Welcome, ${userData.username}!</div>`;
          document.querySelector(".footer").insertAdjacentHTML("afterBegin", markupWelcome);

          const markupVehicle = 
          `<p class="truckNum">Truck ID: ${userData.vehicle}</p>`+
          `<p class="truckOwner">Owner: ${userData.username}</p>`;

          document.querySelector(".truck-info").insertAdjacentHTML("beforeEnd", markupVehicle);
      }
  });
}
