
//Creating the map 
var map = L.map('map').setView([38.246242, 21.7350847], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Search Only when pressing Enter or the Magnifing Glass Icon
const searchInput = document.querySelector('.address-search');
const resultList = document.getElementById('result-list');
const mapContainer = document.getElementById('map-container');
const currentMarkers = [];
const searchIcon = document.getElementById('search-icon');

searchInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        fetchGeo();
    }
});

searchIcon.addEventListener("click", fetchGeo);

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

//Activating all the tabs and NavBar Options
const burgerIcox = document.querySelector(".burgerx");
const burgerIco = document.querySelector(".burgeri");
const burgerCont = document.querySelector(".burger-container");
const moduleSel = document.querySelector(".module");
const mobAdd = document.querySelector(".burger-menu .field.address");
function deskCustomization() {
  reqTab.classList.add("active");
  annTab.classList.add("active");
  offTab.classList.add("active");
  moduleSel.classList.add("active");
  burgerCont.classList.remove("active");
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
}

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

//Activating starting with Contents
const loadTab = document.querySelector(".load-tab");
const contentsTab = document.querySelector(".contents-tab");
const unloadTab = document.querySelector(".unload-tab");
const loadBtn = document.querySelector("#loadBtn");
const contentsBtn = document.querySelector("#contentsBtn");
const unloadBtn = document.querySelector("#unloadBtn");
function mobileCustomization() {
  load-Tab.classList.remove("active");
  unload-Tab.classList.remove("active");
  contents-Tab.classList.add("active");
  unloadBtn.classList.remove("selected");
  loadBtn.classList.remove("selected");
  contentsBtn.classList.add("selected");
}


//Load Button
loadBtn.addEventListener("click", (e) => {
  loadTab.classList.add("active");
  contentsTab.classList.remove("active");
  unloadTab.classList.remove("active");
});

//contents Button
contentsBtn.addEventListener("click", (e) => {
  contentsTab.classList.add("active");
  loadTab.classList.remove("active");
  unloadTab.classList.remove("active");
});

//Unload Button
unloadBtn.addEventListener("click", (e) => {
  unloadTab.classList.add("active");
  loadTab.classList.remove("active");
  contentsTab.classList.remove("active");

});

//Bottom Border for Tab Buttons
function toggleBottomBorder(clickedButton) {
    var buttons = document.querySelectorAll(".button");
    buttons.forEach(function (button) {
      button.classList.remove("selected");
    });
    clickedButton.classList.add("selected");
  }
