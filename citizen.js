//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  checkWidth();
  fetchAnnouncements();
  fetchOffers();
  fetchRequests();
  itemCatConn();
  loadGoods();
});
window.addEventListener("resize", (e) => {
  checkWidth();
});

/* ~~~~~~~~~~ Mobile/Desktop Layout ~~~~~~~~~~ */

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
const reqTab = document.querySelector(".requests-tab");
const annTab = document.querySelector(".announcements-tab");
const offTab = document.querySelector(".offers-tab");
function deskDivCreation() {
  var desktopViewDiv = document.createElement("div");
  desktopViewDiv.className = "desktop-view";
  var parentContainer = reqTab.parentNode;
  parentContainer.insertBefore(desktopViewDiv, reqTab);
  desktopViewDiv.appendChild(reqTab);
  desktopViewDiv.appendChild(annTab);
  desktopViewDiv.appendChild(offTab);
  cnt++;
}

//Activating all the tabs and NavBar Options
const burgerIcox = document.querySelector(".burgerx");
const burgerIco = document.querySelector(".burgeri");
const burgerCont = document.querySelector(".burger-container");
const moduleSel = document.querySelector(".module");
const navOpt = document.querySelector(".nav .nav-options");
function deskCustomization() {
  reqTab.classList.add("active");
  annTab.classList.add("active");
  offTab.classList.add("active");
  navOpt.classList.add("active");
  moduleSel.classList.add("active");
  burgerCont.classList.remove("active");
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
}

//Removing desktop-view Div
function deskDivDeletion() {
  var desktopViewDiv = document.querySelector(".desktop-view");
  var parentContainer = desktopViewDiv.parentNode;
  parentContainer.appendChild(reqTab);
  parentContainer.appendChild(annTab);
  parentContainer.appendChild(offTab);
  desktopViewDiv.remove();
  cnt--;
}

//Mobile Layout Changes
function mobileApply() {
  deskDivDeletion();
  mobileCustomization();
}

//Activating Announcements only and removes NavBar Options
const reqBtn = document.querySelector("#reqBtn");
const annBtn = document.querySelector("#annBtn");
const offBtn = document.querySelector("#offBtn");
function mobileCustomization() {
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
  annTab.classList.add("active");
  offBtn.classList.remove("selected");
  reqBtn.classList.remove("selected");
  annBtn.classList.add("selected");
  navOpt.classList.remove("active");
}

/* ~~~~~~~~~~ Tab Buttons ~~~~~~~~~~ */

//Requests Button
const createReq = document.querySelector(".add-req");
const reqForm = document.querySelector(".requests-form");
const offForm = document.querySelector(".offers-form");
const reqBox = document.querySelector(".requests-box");
reqBtn.addEventListener("click", (e) => {
  reqTab.classList.add("active");
  annTab.classList.remove("active");
  offTab.classList.remove("active");
  offForm.classList.remove("active");
  if (!reqForm.classList.contains("active")) {
    reqBox.classList.add("active");
    createReq.classList.add("active");
  }
});

//Announcements Button
annBtn.addEventListener("click", (e) => {
  annTab.classList.add("active");
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
  offForm.classList.remove("active");
  reqForm.classList.remove("active");
});

//Offers Button
const offBox = document.querySelector(".offers-box");
offBtn.addEventListener("click", (e) => {
  offTab.classList.add("active");
  reqTab.classList.remove("active");
  annTab.classList.remove("active");
  reqForm.classList.remove("active");
  if (!offForm.classList.contains("active")) {
    offBox.classList.add("active");
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

/* ~~~~~~~~~~ Burger and Options ~~~~~~~~~~ */

//Burger Icon
burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerCont.classList.add("active");
  moduleSel.classList.remove("active");
});

//Burger Icon Close
burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerCont.classList.remove("active");
  moduleSel.classList.add("active");
});

//Adding Click Event Listener to the Address Burger Button
var addressBtn = document.querySelector(".burger-item.address");
addressBtn.addEventListener("click", (e) => {
  addressFieldMob.classList.toggle("active");
});

//Adding Keystroke Event Listener to the Address field for both Desktop and Mobile
const addressInputDesk = document.getElementById("addressdesk");
const addressInputMob = document.getElementById("addressmob");
addressInputDesk.addEventListener("keyup", checkAddressDesk);
addressInputMob.addEventListener("keyup", checkAddressMob);

//Address Validation 
const addressPattern = /^[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/;
const addressFieldMob = document.getElementById("addressfieldmob");
function checkAddressMob() {
  if (!addressInputMob.value.match(addressPattern)) {
    return addressFieldMob.classList.add("invalid");
  }
  addressFieldMob.classList.remove("invalid");
}

const addressFieldDesk = document.getElementById("addressfielddesk");
function checkAddressDesk() {
  if (!addressInputDesk.value.match(addressPattern)) {
    return addressFieldDesk.classList.add("invalid");
  }
  addressFieldDesk.classList.remove("invalid");
}

//Adding Event Listener to the Emergency Numbers Button that toggles it
var emmBtn = document.querySelector(".burger-item.emergency");
emmBtn.addEventListener("click", (e) => {
  var emmField = document.querySelector(".emergency-num");
  emmField.classList.toggle("active");
});

/* ~~~~~~~~~~ Requests/Offers ~~~~~~~~~~ */

//Item Select Dropdowns
const itemSelButton = document.querySelectorAll(".item-btn");
const catSelButton = document.querySelectorAll(".cat-btn");
const itemList = document.querySelectorAll(".item-options");
const catList = document.querySelectorAll(".category-options");
const itemContent = document.querySelectorAll(".content");
itemSelButton.forEach(function (button) {
  button.addEventListener("click", function () {
    button.classList.toggle("selected");
    catSelButton.forEach(function (cSelButton) {
      cSelButton.classList.remove("selected");
    });
    itemContent.forEach(function (iContent) {
      iContent.classList.add("active");
    });
    itemList.forEach(function (iList) {
      iList.classList.toggle("active");
    });
    catList.forEach(function (cList) {
      cList.classList.remove("active");
    });
  });
});

//Category Select Dropdowns
catSelButton.forEach(function (button) {
  button.addEventListener("click", function () {
    button.classList.toggle("selected");
    itemSelButton.forEach(function (iSelButton) {
      iSelButton.classList.remove("selected");
    });
    itemContent.forEach(function (iContent) {
      iContent.classList.add("active");
    });
    itemList.forEach(function (iList) {
      iList.classList.remove("active");
    });
    catList.forEach(function (cList) {
      cList.classList.toggle("active");
    });
  });
});

/* ~~~~~~~~~~ Offers ~~~~~~~~~~ */

// Deleting the Items and the Categories from each Offer before the Fetch
function deleteOffersItems() {
  offerList = document.querySelectorAll(".offers-form .item");
  offerList.forEach(function (item) {
    item.remove();
  });
}

//Make Offer Button
var makeOffBtn = document.querySelectorAll(".offer");
function offerBtnListener() {
  makeOffBtn.forEach(function (button) {
    button.addEventListener("click", function () {
      offForm.classList.add("active");
      offBox.classList.remove("active");
      offBtn.classList.add("selected");
      offTab.classList.add("active");
      annBtn.classList.remove("selected");
      offID = button.parentNode.parentNode.id;
      deleteOffersItems();
      fetchOfferItems(offID);
      if (document.querySelector(".desktop-view") == null) {
        annTab.classList.remove("active");
      }
    });
  });
}

var itemsOffBtn = document.querySelectorAll(".offers-form .item-list .item");
var selCategory = null;
const itemsOffText = document.querySelector(".offers-form .item-btn .item-text");
function itemsOffBtnListener() {
  itemsOffBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      itemsOffText.textContent = item.textContent;

      const selectedItemText = item.textContent.toLowerCase();

      for (const category in catItemConnection.categories) {
        if (catItemConnection.categories.hasOwnProperty(category)) {
          var itemsInCat = catItemConnection.categories[category].items.map(item => item.toLowerCase());
          console.log(itemsInCat);
          if (itemsInCat.includes(selectedItemText)) {
            selCategory = category;
            break;
          }
        }
      }
      catOffText.textContent = selCategory;
    });
  });
}

var catOffBtn = document.querySelectorAll(".offers-form .category-list .item");
const catOffText = document.querySelector(".offers-form .cat-btn .item-text");
function catOffBtnListener(){
  catOffBtn.forEach(function (cat) {
    cat.addEventListener("click", function () {
      catOffText.textContent = cat.textContent;
      itemsOffText.textContent = 'Select Item';
      removeItemOff();
      filteredItems = offItemCat.filter(item => item.goodCatName === cat.textContent);
      filteredItems.forEach(item => {
        const markupItem = `<li class="item">${item.goodName}</li>`;
        document.querySelector(".offers-form .item-list").insertAdjacentHTML('beforeend', markupItem);
      });
      itemsOffBtn = document.querySelectorAll(".offers-form .item-list .item");
      itemsOffBtnListener();
    });
  });
}

function removeItemOff(){
  itemsOffBtn.forEach(function (item) {
    item.remove();
  });
}

function removeCatOff(){
  catOffBtn.forEach(function (item) {
    item.remove();
  });
}

const broomO = document.querySelector(".broomo")
broomO.addEventListener("click", (e) => {
  catOffText.textContent = "Select Category";
  itemsOffText.textContent = "Select Item";
  removeItemOff();
  removeCatOff();
  fetchOfferItems(offID);
});

//Cancel Offer Button
const cancelBtnO = document.querySelector(".cancelo");
cancelBtnO.addEventListener("click", () => {
  offForm.classList.remove("active");
  offBox.classList.add("active");
  annTab.classList.add("active");
  itemsOffText.textContent = "Select Item";
  catOffText.textContent = "Select Category";
  if (document.querySelector(".desktop-view") == null) {
    offTab.classList.remove("active");
  }
  annBtn.classList.add("selected");
  offBtn.classList.remove("selected");
  itemSelButton.forEach(function (iSelButton) {
    iSelButton.classList.remove("selected");
  });
  catSelButton.forEach(function (cSelButton) {
    cSelButton.classList.remove("selected");
  });
  itemList.forEach(function (iList) {
    iList.classList.remove("active");
  });
  catList.forEach(function (cList) {
    cList.classList.remove("active");
  });
  offCount = 1;
  numO.innerText = offCount;
});

//Plus Offer Button
const plusO = document.querySelector(".pluso");
const numO = document.querySelector(".numo");
let offCount = 1;
plusO.addEventListener("click", () => {
  if (offCount < 100) {
    offCount++;
    numO.innerText = offCount;
  }
});

//Minus Offer Button
const minusO = document.querySelector(".minuso");
minusO.addEventListener("click", () => {
  if (offCount > 1) {
    offCount--;
    numO.innerText = offCount;
  }
});

// Fetching the Categories and the Items that each Offer requires
var offItemCat;
function fetchOfferItems(offID) {
  fetch("fetch_OfferItems.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: offID })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const uniqueCategories = [...new Set(data.map(item => item.goodCatName))];
      offItemCat = data;

      data.forEach((res) => {
        const markupItem = `<li class="item">${res.goodName}</li>`;
        document.querySelector(".offers-form .item-list").insertAdjacentHTML("beforeend", markupItem);
      });

      uniqueCategories.forEach((category) => {
        const markupCategory = `<li class="item">${category}</li>`;
        document.querySelector(".offers-form .category-list").insertAdjacentHTML("beforeend", markupCategory);
      });

      itemsOffBtn = document.querySelectorAll(".offers-form .item-list .item");
      itemsOffBtnListener();
      catOffBtn = document.querySelectorAll(".offers-form .category-list .item");
      catOffBtnListener();
    });
}

/* ~~~~~~~~~~ Requests ~~~~~~~~~~ */

//Create Request Button
createReq.addEventListener("click", () => {
  reqForm.classList.add("active");
  reqBox.classList.remove("active");
  createReq.classList.remove("active");
  deleteRequestsItems();
  fetchGoods();
});

function deleteRequestsItems() {
  offerList = document.querySelectorAll(".requests-form .item");
  offerList.forEach(function (item) {
    item.remove();
  });
}

var itemsReqBtn = document.querySelectorAll(".requests-form .item-list .item");
var selCategory = null;
const itemsReqText = document.querySelector(".requests-form .item-btn .item-text");
function itemsReqBtnListener() {
  itemsReqBtn.forEach(function (item) {
    item.addEventListener("click", function () {
      itemsReqText.textContent = item.textContent;

      const selectedItemText = item.textContent.toLowerCase();

      for (const category in catItemConnection.categories) {
        if (catItemConnection.categories.hasOwnProperty(category)) {
          var itemsInCat = catItemConnection.categories[category].items.map(item => item.toLowerCase());
          if (itemsInCat.includes(selectedItemText)) {
            selCategory = category;
            break;
          }
        }
      }
      catReqText.textContent = selCategory;
    });
  });
}

var catReqBtn = document.querySelectorAll(".requests-form .category-list .item");
const catReqText = document.querySelector(".requests-form .cat-btn .item-text");
function catReqBtnListener(){
  catReqBtn.forEach(function (cat) {
    cat.addEventListener("click", function () {
      catReqText.textContent = cat.textContent;
      itemsReqText.textContent = 'Select Item';
      removeItemReq();
      if (catItemConnection.categories.hasOwnProperty(cat.textContent)) {
        var itemsSelCategory = catItemConnection.categories[cat.textContent].items;
        itemsSelCategory.forEach(item => {
          const markupItem = `<li class="item">${item}</li>`;
          document.querySelector(".requests-form .item-list").insertAdjacentHTML('beforeend', markupItem);
        });
        itemsReqBtn = document.querySelectorAll(".requests-form .item-list .item");
        itemsReqBtnListener();
      }
    });
  });
}

const broomR = document.querySelector(".broomr")
broomR.addEventListener("click", (e) => {
  catReqText.textContent = "Select Category";
  itemsReqText.textContent = "Select Item";
  removeItemReq();
  removeCatReq();
  fetchGoods();
});

function removeItemReq(){
  itemsReqBtn.forEach(function (item) {
    item.remove();
  });
}

function removeCatReq(){
  catReqBtn.forEach(function (item) {
    item.remove();
  });
}

//Cancel Request Button
let reqCount = 1;
const cancelBtnR = document.querySelector(".cancelr");
const numR = document.querySelector(".numr");
cancelBtnR.addEventListener("click", () => {
  reqForm.classList.remove("active");
  reqBox.classList.add("active");
  createReq.classList.add("active");
  itemsReqText.textContent = "Select Item";
  catReqText.textContent = "Select Category";
  itemSelButton.forEach(function (iSelButton) {
    iSelButton.classList.remove("selected");
  });
  catSelButton.forEach(function (cSelButton) {
    cSelButton.classList.remove("selected");
  });
  itemList.forEach(function (iList) {
    iList.classList.remove("active");
  });
  catList.forEach(function (cList) {
    cList.classList.remove("active");
  });
  reqCount = 1;
  numR.innerText = reqCount;
});

//Plus OfferRequest Button
const plusR = document.querySelector(".plusr");
plusR.addEventListener("click", () => {
  if (reqCount < 100) {
    reqCount++;
    numR.innerText = reqCount;
  }
});

//Minus Request Button
const minusR = document.querySelector(".minusr");
minusR.addEventListener("click", () => {
  if (reqCount > 1) {
    reqCount--;
    numR.innerText = reqCount;
  }
});

//Fetching Announcements from the Database with FetchAPI
function fetchAnnouncements() {
  fetch("fetch_Announcements.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        data.forEach((res) => {
          needsList = res.needs_goodn.join(", ");
          markup =
            `<li class="list-item" id=${res.ann_id}> <div class="item-title"><b>${res.ann_title}</b></div>` +
            `<div class="datetime">${res.ann_date}</div>` +
            `<div class="text">${res.ann_text}</div>` +
            `<div class="needs"><p>Need for: ${needsList}</p></div>` +
            `<div class="make-offer"><p>Make Offer</p><i class="fa-solid fa-hand-holding-hand offer"></i></div>` +
            `</li>`;
          document.querySelector(".announcements-list").insertAdjacentHTML("beforeend", markup);
        });
        makeOffBtn = document.querySelectorAll(".offer");
        offerBtnListener();
      } else {
        //If there aren't any Announcements Display the following Paragraph
        markup = `<p>There aren't any Announcements Currently</p>`;
        document.querySelector(".announcements-list").insertAdjacentHTML("beforeend", markup);
      }
    });
}

function fetchOffers() {
  fetch("fetch_Offers.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        data.forEach((res) => {
          if (res.task_date_pickup = "null"){
            res.task_date_pickup = "Not Available";
          }
          markup =
            `<li class="list-item" id=${res.task_id}>`+
            `<div class="item-title"><b>${res.task_goodn}</b>`+
            `<i class="fa-regular fa-trash-can trash"></i>`+
            `</div>`+
            `<div class="quantity">Quantity: ${res.task_goodv}</div>`+
            `<div class="datetime">Creation Date: ${res.task_date_create}</div>`+
            `<div class="datetime">Pickup Date: ${res.task_date_pickup}</div>`+
            `<div class="status">Status: ${res.task_status}</div>`+
            `</li>`
          document.querySelector(".offers-list").insertAdjacentHTML("beforeend", markup);
        });
      } else {
        //If there aren't any Offers Display the following Paragraph
        markup = `<p>There aren't any Offers Currently</p>`;
        document.querySelector(".offers-list").insertAdjacentHTML("beforeend", markup);
      }
    });
}

function fetchRequests() {
  fetch("fetch_Requests.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        data.forEach((res) => {
          if (res.task_date_pickup = "null"){
            res.task_date_pickup = "Not Available";
          }
          markup =
            `<li class="list-item" id=${res.task_id}>`+
            `<div class="item-title"><b>${res.task_goodn}</b>`+
            `<i class="fa-regular fa-trash-can trash"></i>`+
            `</div>`+
            `<div class="people">People: ${res.task_goodv}</div>`+
            `<div class="datetime">Creation Date: ${res.task_date_create}</div>`+
            `<div class="datetime">Pickup Date: ${res.task_date_pickup}</div>`+
            `<div class="status">Status: ${res.task_status}</div>`+
            `</li>`
          document.querySelector(".requests-list").insertAdjacentHTML("beforeend", markup);
        });
      } else {
        //If there aren't any Requests Display the following Paragraph
        markup = `<p>There aren't any Requests Currently</p>`;
        document.querySelector(".requests-list").insertAdjacentHTML("beforeend", markup);
      }
    });
}

//Loading Goods into the database
function loadGoods() {
  fetch("load_goods.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function fetchGoods() {
  fetch("fetch_Goods.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      var items = data.items;
      var categories = data.categories;
      items.forEach((item) => {
        markupItem = `<li class="item">${item}</li>`;
        document.querySelector(".requests-form .item-list").insertAdjacentHTML("beforeend", markupItem);
      });
      itemsReqBtn = document.querySelectorAll(".requests-form .item-list .item");
      itemsReqBtnListener();
      categories.forEach((category) => {
        markupCategory = `<li class="item">${category}</li>`;
        document.querySelector(".requests-form .category-list").insertAdjacentHTML("beforeend", markupCategory);
      });
      catReqBtn = document.querySelectorAll(".requests-form .category-list .item");
      catReqBtnListener();
    });
}

var catItemConnection;
function itemCatConn(){
  fetch("itemCatConn.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      catItemConnection = data;
    });
}