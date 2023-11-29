/* ~~~~~~~~~~ General Functions ~~~~~~~~~~ */

//When the window is resized or Loaded do the following
document.addEventListener("DOMContentLoaded", function () {
  checkWidth();
  fetchUserInfo();
  fetchAnnouncements();
  fetchOffers();
  fetchRequests();
  itemCatConn();
  loadGoods();
});
window.addEventListener("resize", (e) => {
  checkWidth();
});

//Fetching the Connection between Categories and Items
var catItemConnection;
function itemCatConn() {
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

//Loading Goods into the database
function loadGoods() {
  fetch("load_goods.php", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
}

//Logging out Actions
const logoutButton = document.querySelector(".button.logout");
logoutButton.addEventListener("click", logoutUser);
function logoutUser() {
  fetch("logout_User.php", {
    method: "POST",
    credentials: 'include'
  });
  location.href = "home.html";
}

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
const mobAdd = document.querySelector(".burger-menu .field.address");
function deskCustomization() {
  reqTab.classList.add("active");
  annTab.classList.add("active");
  offTab.classList.add("active");
  navOpt.classList.add("active");
  moduleSel.classList.add("active");
  burgerCont.classList.remove("active");
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  deskAdd.classList.add("active");
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
const deskAdd = document.querySelector(".nav-options .field.address");
function mobileCustomization() {
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
  annTab.classList.add("active");
  offBtn.classList.remove("selected");
  reqBtn.classList.remove("selected");
  annBtn.classList.add("selected");
  navOpt.classList.remove("active");
  deskAdd.classList.remove("active");
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

//Address Mobile Validation 
const addressPattern = /^[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/;
const addressFieldMob = document.getElementById("addressfieldmob");
function checkAddressMob() {
  if (!addressInputMob.value.match(addressPattern)) {
    return addressFieldMob.classList.add("invalid");
  }
  addressFieldMob.classList.remove("invalid");
}

//Address Desktop Validation 
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

//Adding Listeners to the trash Buttons in the two Forms
function trashBtnListener() {
  trashBtn.forEach(function (btn) {
    // Check if the listener has already been added
    if (!btn.dataset.listenerAdded) {
      btn.addEventListener("click", function () {
        var type = "requests";
        var id = btn.parentNode.parentNode.id;
        if (btn.parentNode.parentNode.parentNode.className == "offers-list") {
          type = "offers";
        }
        deleteOffReq(type, id);
      });
      // Set the flag to indicate that the listener has been added
      btn.dataset.listenerAdded = true;
    }
  });
}

//Function that removes an Offer or Request
function deleteOffReq(type, reqOffID) {
  fetch("delete_OffReq.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: reqOffID })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        if (type == "requests") {
          removeRequests();
          fetchRequests();
        } else {
          removeOffers();
          fetchOffers();
        }
      } else {
        var statusElement = document.getElementById(reqOffID).querySelector(".status");
        if (statusElement.innerText == "Status: Pending") {
          if (type == "requests" && document.getElementById(reqOffID).querySelector(".error") == null) {
            markup = `<p class=error style="color:red">The Status of the Request has changed. Please refresh the Page</p>`;
            document.getElementById(reqOffID).insertAdjacentHTML("beforeend", markup);
          } else if (type == "offers" && document.getElementById(reqOffID).querySelector(".error") == null) {
            markup = `<p class=error style="color:red">The Status of the Offer has changed. Please refresh the Page</p>`;
            document.getElementById(reqOffID).insertAdjacentHTML("beforeend", markup);
          }
        } else {
          if (type == "requests" && document.getElementById(reqOffID).querySelector(".error") == null) {
            markup = `<p class=error style="color:red">You cannot delete this request</p>`;
            document.getElementById(reqOffID).insertAdjacentHTML("beforeend", markup);
          } else if (type == "offers" && document.getElementById(reqOffID).querySelector(".error") == null) {
            markup = `<p class=error style="color:red">You cannot delete this request</p>`;
            document.getElementById(reqOffID).insertAdjacentHTML("beforeend", markup);
          }
        }
      }
    });
}

//Function that removes all requests from Requests List
function removeRequests() {
  reqList.forEach(function (reqListItem) {
    reqListItem.remove();
  })
  reqList = document.querySelectorAll(".requests-list .list-item");
}

//Function that removes all offers from Offers List
function removeOffers() {
  offList.forEach(function (offListItem) {
    offListItem.remove();
  })
  offList = document.querySelectorAll(".offers-list .list-item");
}

//Submission of the Forms
function formSubmission(type, goodn, goodv) {
  fetch("form_Submission.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goodn: goodn, goodv: goodv, type: type })
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (type == "Request") {
        removeRequests();
        fetchRequests();
      } else {
        removeOffers();
        fetchOffers();
      }
    });
}

/* ~~~~~~~~~~ Offers ~~~~~~~~~~ */

//Deleting the Items and the Categories from each Offer before the Fetch
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

//Adding Event Listeners to the Offers Form List Item Elements and Displaying the Selected Items Correctly
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

//Adding Event Listeners to the Offers Form List Category Elements and Displaying the Selected Categories Correctly
var catOffBtn = document.querySelectorAll(".offers-form .category-list .item");
const catOffText = document.querySelector(".offers-form .cat-btn .item-text");
function catOffBtnListener() {
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

//Adding Event Listner to the Item Search Input Field of the Offers Form
const itemOffSearch = document.querySelector("#itemOffSearch");
let itemOffArray;
let itemOffSearchListenerAdded = false;
function itemOffSearchListener() {
  itemOffArray = [];
  let sorteditem = Array.from(itemsOffBtn).map(item => item.textContent).sort();

  // Check if the listener has not been added
  if (!itemOffSearchListenerAdded) {
    itemOffSearch.addEventListener("keyup", function () {
      removeItemOff();
      for (let i of sorteditem) {
        if (i.toLowerCase().startsWith(itemOffSearch.value.toLowerCase()) && itemOffSearch.value !== '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".offers-form .item-list").insertAdjacentHTML("beforeend", markup);
        } else if (itemOffSearch.value == '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".offers-form .item-list").insertAdjacentHTML("beforeend", markup);
        }
      }
      itemsOffBtn = document.querySelectorAll(".offers-form .item-list .item");
      itemsOffBtnListener();
    });
    // Set the flag to indicate that the listener has been added
    itemOffSearchListenerAdded = true;
  }
}

//Adding Event Listner to the Category Search Input Field of the Offers Form
const catOffSearch = document.querySelector("#catOffSearch");
let catOffArray;
let catOffSearchListenerAdded = false;
function catOffSearchListener() {
  catOffArray = [];
  let sortedCat = Array.from(catOffBtn).map(item => item.textContent).sort();

  // Check if the listener has not been added
  if (!catOffSearchListenerAdded) {
    catOffSearch.addEventListener("keyup", function () {
      removeCatOff();
      for (let i of sortedCat) {
        if (i.toLowerCase().startsWith(catOffSearch.value.toLowerCase()) && catOffSearch.value !== '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".offers-form .category-list").insertAdjacentHTML("beforeend", markup);
        } else if (catOffSearch.value == '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".offers-form .category-list").insertAdjacentHTML("beforeend", markup);
        }
      }
      catOffBtn = document.querySelectorAll(".offers-form .category-list .item");
      catOffBtnListener();
    });
    // Set the flag to indicate that the listener has been added
    catOffSearchListenerAdded = true;
  }
}

//Remove Items from Offers Form
function removeItemOff() {
  itemsOffBtn.forEach(function (item) {
    item.remove();
  });
}

//Remove Categories from Offers Form
function removeCatOff() {
  catOffBtn.forEach(function (item) {
    item.remove();
  });
}

//Clear Offers Form Selections Button
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
  offForm.classList.remove("invalid");
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
  catOffSearch.innerText = '';
  itemOffSearch.innerText = '';
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

//Adding Event Listner to the Submit Button of the Offers Form
const submitOffForm = document.querySelector(".offers-form .button");
submitOffForm.addEventListener("click", function () {
  goodn = document.querySelector(".offers-form .item-btn .item-text").innerText;
  goodv = document.querySelector(".numo").innerText;
  formType = "Offer";
  if (itemsOffText.innerText == "Select Item") {
    offForm.classList.add("invalid");
  } else {
    formSubmission(formType, goodn, goodv);
    offForm.classList.remove("invalid");
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
    catOffSearch.value = '';
    itemOffSearch.value = '';
  }
})

/* ~~~~~~~~~~ Requests ~~~~~~~~~~ */

//Create Request Button
createReq.addEventListener("click", () => {
  reqForm.classList.add("active");
  reqBox.classList.remove("active");
  createReq.classList.remove("active");
  removeItemReq();
  fetchGoods();
});

//Adding Event Listeners to the Requests Form List Item Elements and Displaying the Selected Items Correctly
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

//Adding Event Listeners to the Requests Form List Category Elements and Displaying the Selected Categories Correctly
var catReqBtn = document.querySelectorAll(".requests-form .category-list .item");
const catReqText = document.querySelector(".requests-form .cat-btn .item-text");
function catReqBtnListener() {
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

//Adding Event Listner to the Category Search Input Field of the Requirements Form
const catReqSearch = document.querySelector("#catReqSearch");
let catReqArray;
let catReqSearchListenerAdded = false;
function catReqSearchListener() {
  catReqArray = [];
  let sortedCat = Array.from(catReqBtn).map(item => item.textContent).sort();

  // Check if the listener has not been added
  if (!catReqSearchListenerAdded) {
    catReqSearch.addEventListener("keyup", function () {
      removeCatReq();
      for (let i of sortedCat) {
        if (i.toLowerCase().startsWith(catReqSearch.value.toLowerCase()) && catReqSearch.value !== '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".requests-form .category-list").insertAdjacentHTML("beforeend", markup);
        } else if (catReqSearch.value == '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".requests-form .category-list").insertAdjacentHTML("beforeend", markup);
        }
      }
      catReqBtn = document.querySelectorAll(".requests-form .category-list .item");
      catReqBtnListener();
    });
    // Set the flag to indicate that the listener has been added
    catReqSearchListenerAdded = true;
  }
}

//Adding Event Listner to the Items Search Input Field of the Requirements Form
const itemReqSearch = document.querySelector("#itemReqSearch");
let itemReqArray;
let itemReqSearchListenerAdded = false;
function itemReqSearchListener() {
  itemReqArray = [];
  let sortedItem = Array.from(itemsReqBtn).map(item => item.textContent).sort();

  // Check if the listener has not been added
  if (!itemReqSearchListenerAdded) {
    itemReqSearch.addEventListener("keyup", function () {
      removeItemReq();
      for (let i of sortedItem) {
        if (i.toLowerCase().startsWith(itemReqSearch.value.toLowerCase()) && itemReqSearch.value !== '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".requests-form .item-list").insertAdjacentHTML("beforeend", markup);
        } else if (itemReqSearch.value == '') {
          markup = `<li class="item">${i}</li>`;
          document.querySelector(".requests-form .item-list").insertAdjacentHTML("beforeend", markup);
        }
      }
      itemsReqBtn = document.querySelectorAll(".requests-form .item-list .item");
      itemsReqBtnListener();
    });
    // Set the flag to indicate that the listener has been added
    itemReqSearchListenerAdded = true;
  }
}

//Clear Requests Form Selections Button
const broomR = document.querySelector(".broomr")
broomR.addEventListener("click", (e) => {
  catReqText.textContent = "Select Category";
  itemsReqText.textContent = "Select Item";
  removeItemReq();
  removeCatReq();
  fetchGoods();
});

//Remove Items from Requests Form
function removeItemReq() {
  itemsReqBtn.forEach(function (item) {
    item.remove();
  });
}

//Remove Categories from Requests Form
function removeCatReq() {
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
  reqForm.classList.remove("invalid");
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
  removeCatReq();
  removeItemReq();
  catReqSearch.innerText = '';
  itemReqSearch.innerText = '';
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

//Adding Event Listner to the Submit Button of the Requirements Form
var formType;
const submitReqForm = document.querySelector(".requests-form .button");
submitReqForm.addEventListener("click", function () {
  goodn = document.querySelector(".requests-form .item-btn .item-text").innerText;
  goodv = document.querySelector(".numr").innerText;
  formType = "Request";
  if (itemsReqText.innerText == "Select Item") {
    reqForm.classList.add("invalid");
  } else {
    formSubmission(formType, goodn, goodv);
    reqForm.classList.remove("invalid");
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
    catReqSearch.value = '';
    itemReqSearch.value = '';
  }
})

/* ~~~~~~~~~~ Data Fetching ~~~~~~~~~~ */

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

//Fetching Offers from the Database with FetchAPI
var trashBtn = document.querySelectorAll(".trash");
var offList = document.querySelectorAll(".offers-list .list-item");
var emptyOffMessage = document.querySelector(".offers-list p");
function fetchOffers() {
  fetch("fetch_Offers.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        data.forEach((res) => {
          if (res.task_date_pickup = "null") {
            res.task_date_pickup = "Not Available";
          }
          markup =
            `<li class="list-item" id=${res.task_id}>` +
            `<div class="item-title"><b>${res.task_goodn}</b>` +
            `<i class="fa-regular fa-trash-can trash"></i>` +
            `</div>` +
            `<div class="quantity">Quantity: ${res.task_goodv}</div>` +
            `<div class="datetime">Creation Date: ${res.task_date_create}</div>` +
            `<div class="datetime">Pickup Date: ${res.task_date_pickup}</div>` +
            `<div class="status">Status: ${res.task_status}</div>` +
            `</li>`
          document.querySelector(".offers-list").insertAdjacentHTML("beforeend", markup);
        });
        trashBtn = document.querySelectorAll(".trash");
        offList = document.querySelectorAll(".offers-list .list-item");
        if (emptyOffMessage) {
          emptyOffMessage.remove();
        }
        trashBtnListener();
      } else {
        //If there aren't any Offers Display the following Paragraph
        markup = `<p>There aren't any Offers Currently</p>`;
        document.querySelector(".offers-list").insertAdjacentHTML("beforeend", markup);
        emptyOffMessage = document.querySelector(".offers-list p");
      }
    });
}

//Fetching Requests from the Database with FetchAPI
var reqList = document.querySelectorAll(".requests-list .list-item");
var emptyReqMessage = document.querySelector(".requests-list p");
function fetchRequests() {
  fetch("fetch_Requests.php")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data != "False") {
        data.forEach((res) => {
          if (res.task_date_pickup = "null") {
            res.task_date_pickup = "Not Available";
          }
          markup =
            `<li class="list-item" id=${res.task_id}>` +
            `<div class="item-title"><b>${res.task_goodn}</b>` +
            `<i class="fa-regular fa-trash-can trash"></i>` +
            `</div>` +
            `<div class="people">People: ${res.task_goodv}</div>` +
            `<div class="datetime">Creation Date: ${res.task_date_create}</div>` +
            `<div class="datetime">Pickup Date: ${res.task_date_pickup}</div>` +
            `<div class="status">Status: ${res.task_status}</div>` +
            `</li>`
          document.querySelector(".requests-list").insertAdjacentHTML("beforeend", markup);
        });
        trashBtn = document.querySelectorAll(".trash");
        reqList = document.querySelectorAll(".requests-list .list-item");
        if (emptyReqMessage) {
          emptyReqMessage.remove();
        }
        trashBtnListener();
      } else {
        //If there aren't any Requests Display the following Paragraph
        markup = `<p>There aren't any Requests Currently</p>`;
        document.querySelector(".requests-list").insertAdjacentHTML("beforeend", markup);
        emptyReqMessage = document.querySelector(".requests-list p");
      }
    });
}

//Fetching and Inserting Goods into the Requests Form
function fetchGoods() {
  fetch("fetch_Goods.php", {
    method: "POST"
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
      itemReqSearchListener();
      itemsReqBtnListener();
      categories.forEach((category) => {
        markupCategory = `<li class="item">${category}</li>`;
        document.querySelector(".requests-form .category-list").insertAdjacentHTML("beforeend", markupCategory);
      });
      catReqBtn = document.querySelectorAll(".requests-form .category-list .item");
      catReqSearchListener();
      catReqBtnListener();
    });
}

//Fetching the Categories and the Items that each Offer requires
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
      itemOffSearchListener();
      itemsOffBtnListener();
      catOffBtn = document.querySelectorAll(".offers-form .category-list .item");
      catOffSearchListener();
      catOffBtnListener();
    });
}

//Fetching the Username of the User and displaying the Welcome Message
function fetchUserInfo() {
  fetch("fetch_UserInfo.php", {
    method: "POST"
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      markup =
        `<div class="welcome">` +
        `Welcome, ${data}!` +
        `</div>`

      document.querySelector(".footer").insertAdjacentHTML("afterBegin", markup);
    });
}

var nAddressButtons = document.querySelectorAll(".field.address .button");
nAddressButtons.forEach(function (nAddressButton) {
  nAddressButton.addEventListener("click", function () {
    var nAddress = document.querySelector(".field.address.active .address-text");
    changeAddress(nAddress.value);
  })
});

function changeAddress(newAddress) {
  fetch("update_Location.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newAddress: newAddress })
  })
    .then((response) => {
      return response.json();
    })
}