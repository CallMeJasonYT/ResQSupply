reqBtn = document.getElementById("reqBtn");
annBtn = document.getElementById("annBtn");
offBtn = document.getElementById("offBtn");
reqTab = document.querySelector(".requests-tab");
annTab = document.querySelector(".announcements-tab");
offTab = document.querySelector(".offers-tab");
burgerIcox = document.querySelector(".burgerx");
burgerIco = document.querySelector(".burgeri");
burgerCont = document.querySelector(".burger-container");
moduleSel = document.querySelector(".module");
itemSelButton = document.querySelectorAll(".item-btn");
catSelButton = document.querySelectorAll(".cat-btn");
itemList = document.querySelectorAll(".item-options");
catList = document.querySelectorAll(".category-options");
itemContent = document.querySelectorAll(".content");
createReq = document.querySelector(".add-req");
makeOffBtn = document.querySelectorAll(".offer");
reqForm = document.querySelector(".requests-form");
offForm = document.querySelector(".offers-form");
reqBox = document.querySelector(".requests-box");
offBox = document.querySelector(".offers-box");
cancelBtnR = document.querySelector(".cancelr");
cancelBtnO = document.querySelector(".cancelo")
plusR = document.querySelector(".plusr");
minusR = document.querySelector(".minusr");
numR = document.querySelector(".numr");
plusO = document.querySelector(".pluso");
minusO = document.querySelector(".minuso");
numO = document.querySelector(".numo");
navOpt = document.querySelector(".nav .nav-options");
addressFieldDesk = document.getElementById('addressfielddesk');
addressInputDesk = document.getElementById('addressdesk');
addressFieldMob = document.getElementById('addressfieldmob');
addressInputMob = document.getElementById('addressmob');
addressBtn = document.querySelector(".burger-item.address");
emmBtn = document.querySelector(".burger-item.emergency");
emmField = document.querySelector(".emergency-num")
viewportW = window.innerWidth;
let reqCount = 1;
let offCount = 1;
let cnt = 0;
let current_announcement = 0;

//When the window is resized or Loaded check the Viewport Width
document.addEventListener("DOMContentLoaded", function () {
  checkWidth();
  fetchAnnouncements();
});
window.addEventListener("resize", (e) => {
  checkWidth();
})

//Checking Viewport Width
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

//Requests Button
reqBtn.addEventListener("click", (e) => {
  reqTab.classList.add("active");
  annTab.classList.remove("active");
  offTab.classList.remove("active");
  offForm.classList.remove("active");
  if(!reqForm.classList.contains("active")){
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
offBtn.addEventListener("click", (e) => {
  offTab.classList.add("active");
  reqTab.classList.remove("active");
  annTab.classList.remove("active");
  reqForm.classList.remove("active");
  if(!offForm.classList.contains("active")){
    offBox.classList.add("active");
  }
});

//Bottom Border for Tab Buttons
function toggleBottomBorder(clickedButton) {
  var buttons = document.querySelectorAll('.button');
  buttons.forEach(function (button) {
    button.classList.remove('selected');
  });
  clickedButton.classList.add('selected');
}

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

//Create Request Button
createReq.addEventListener("click", () => {
  reqForm.classList.add("active");
  reqBox.classList.remove("active");
  createReq.classList.remove("active");
});

//Make Offer Button
function offerBtnListener(){
  makeOffBtn.forEach(function(button) {
    button.addEventListener('click', function() {
        offForm.classList.add("active");
        offBox.classList.remove("active");
        offBtn.classList.add("selected");
        offTab.classList.add("active");
        annBtn.classList.remove("selected");
      if((document.querySelector(".desktop-view")) == null){
        annTab.classList.remove("active");
      }
    });
  });
}

//Item Select Dropdowns
itemSelButton.forEach(function(button){
  button.addEventListener('click', function() {
    button.classList.toggle("selected");
    catSelButton.forEach(function(cSelButton){cSelButton.classList.remove("selected");})
    itemContent.forEach(function(iContent){iContent.classList.add("active");})
    itemList.forEach(function(iList){iList.classList.toggle("active");})
    catList.forEach(function(cList){cList.classList.remove("active");})
  });
});

//Category Select Dropdowns
catSelButton.forEach(function(button){
  button.addEventListener('click', function() {
    button.classList.toggle("selected");
    itemSelButton.forEach(function(iSelButton){iSelButton.classList.remove("selected");})
    itemContent.forEach(function(iContent){iContent.classList.add("active");})
    itemList.forEach(function(iList){iList.classList.remove("active");})
    catList.forEach(function(cList){cList.classList.toggle("active");})
  });
});

//Cancel Request Button
cancelBtnR.addEventListener("click", () => {
  reqForm.classList.remove("active");
  reqBox.classList.add("active");
  createReq.classList.add("active");
  itemSelButton.forEach(function(iSelButton){iSelButton.classList.remove("selected");})
  catSelButton.forEach(function(cSelButton){cSelButton.classList.remove("selected");})
  itemList.forEach(function(iList){iList.classList.remove("active");})
  catList.forEach(function(cList){cList.classList.remove("active");})
  reqCount = 1;
  numR.innerText = reqCount;
});

//Cancel Offer Button
cancelBtnO.addEventListener("click", () => {
  offForm.classList.remove("active");
  offBox.classList.add("active");
  annTab.classList.add("active");
  if(document.querySelector(".desktop-view")==null){
    offTab.classList.remove("active");
  }
  annBtn.classList.add("selected");
  offBtn.classList.remove("selected");
  itemSelButton.forEach(function(iSelButton){iSelButton.classList.remove("selected");})
  catSelButton.forEach(function(cSelButton){cSelButton.classList.remove("selected");})
  itemList.forEach(function(iList){iList.classList.remove("active");})
  catList.forEach(function(cList){cList.classList.remove("active");})
  offCount = 1;
  numO.innerText = offCount;
});

//Plus Request Button
plusR.addEventListener("click", () => {
  if (reqCount < 100) {
    reqCount++;
    numR.innerText = reqCount;
  }
});

//Minus Request Button
minusR.addEventListener("click", () => {
  if (reqCount > 1) {
    reqCount--;
    numR.innerText = reqCount;
  }
});

//Plus Offer Button
plusO.addEventListener("click", () => {
  if (offCount < 100) {
    offCount++;
    numO.innerText = offCount;
  }
});

//Minus Offer Button
minusO.addEventListener("click", () => {
  if (offCount > 1) {
    offCount--;
    numO.innerText = offCount;
  }
});

//Desktop Layout Changes
function desktopApply() {
  deskDivCreation();
  deskCustomization();
}

function deskDivCreation() { //Creating desktop-view Div
  var desktopViewDiv = document.createElement("div");
  desktopViewDiv.className = "desktop-view";
  var parentContainer = reqTab.parentNode;
  parentContainer.insertBefore(desktopViewDiv, reqTab);
  desktopViewDiv.appendChild(reqTab);
  desktopViewDiv.appendChild(annTab);
  desktopViewDiv.appendChild(offTab);
  cnt++;
}

function deskCustomization() { //Activating all the tabs and NavBar Options
  reqTab.classList.add("active");
  annTab.classList.add("active");
  offTab.classList.add("active");
  navOpt.classList.add("active");
  moduleSel.classList.add("active");
  burgerCont.classList.remove("active");
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
}

//Mobile Layout Changes
function mobileApply() {
  deskDivDeletion();
  mobileCustomization();
}

function deskDivDeletion() { //Removing desktop-view Div
  var desktopViewDiv = document.querySelector(".desktop-view");
  var parentContainer = desktopViewDiv.parentNode;
  parentContainer.appendChild(reqTab);
  parentContainer.appendChild(annTab);
  parentContainer.appendChild(offTab);
  desktopViewDiv.remove();
  cnt--;
}

function mobileCustomization() { //Activating Announcements only and removes NavBar Options
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
  annTab.classList.add("active");
  offBtn.classList.remove("selected");
  reqBtn.classList.remove("selected");
  annBtn.classList.add("selected");
  navOpt.classList.remove("active");
}

addressBtn.addEventListener("click",(e)=>{
  addressFieldMob.classList.toggle("active");
})

addressInputDesk.addEventListener("keyup", checkAddressDesk);
addressInputMob.addEventListener("keyup", checkAddressMob);

//Address Validation
const addressPattern = /^[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/
function checkAddressMob() {
  if (!addressInputMob.value.match(addressPattern)) {
    return addressFieldMob.classList.add("invalid");
  }
  addressFieldMob.classList.remove("invalid");
}
function checkAddressDesk() {
  if (!addressInputDesk.value.match(addressPattern)) {
    return addressFieldDesk.classList.add("invalid");
  }
  addressFieldDesk.classList.remove("invalid");
}

emmBtn.addEventListener("click",(e)=>{
  emmField.classList.toggle("active");
})

function fetchAnnouncements(){
  fetch('fetch_announcements.php')
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    data.forEach(res =>{
    markup = `<li class="list-item" id=${res.ann_id}> <div class="item-title"><b>${res.ann_title}</b></div>` +
    `<div class="datetime">${res.ann_date}</div>`+
    `<div class="text">${res.ann_text}</div>`+
    `<div class="make-offer"><p>Make Offer</p><i class="fa-solid fa-hand-holding-hand offer"></i></div>`+
    `</li>`;
    document.querySelector(".announcements-list").insertAdjacentHTML('beforeend', markup);
    makeOffBtn = document.querySelectorAll(".offer");
    offerBtnListener();
    });
  });
}