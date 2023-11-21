reqBtn = document.getElementById("reqBtn");
annBtn = document.getElementById("annBtn");
offBtn = document.getElementById("offBtn");
reqTab = document.querySelector(".requests-tab");
annTab = document.querySelector(".announcements-tab");
offTab = document.querySelector(".offers-tab");
burgerBtn = document.querySelector(".button.burger");
burgerIcox = document.querySelector(".burgerx");
burgerIco = document.querySelector(".burgeri");
burgerCont = document.querySelector(".burger-container");
mobileSel = document.querySelector(".mobile-selections");
itemSelButton = document.querySelector(".item-btn");
catSelButton = document.querySelector(".cat-btn");
itemList = document.querySelector(".item-options");
catList = document.querySelector(".category-options");
itemContent = document.querySelector(".content");
createReq = document.querySelector(".add-req");
reqForm = document.querySelector(".requests-form");
reqBox = document.querySelector(".requests-box");
cancelBtn = document.querySelector(".cancel");
plus = document.querySelector(".plus"),
minus = document.querySelector(".minus"),
num = document.querySelector(".num");

reqBtn.addEventListener("click", (e) => {
  reqTab.classList.add("active");
  annTab.classList.remove("active");
  offTab.classList.remove("active");
});

annBtn.addEventListener("click", (e) => {
  annTab.classList.add("active");
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
});

offBtn.addEventListener("click", (e) => {
  offTab.classList.add("active");
  reqTab.classList.remove("active");
  annTab.classList.remove("active");
});

burgerIco.addEventListener("click", (e) => {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerCont.classList.add("active");
  mobileSel.classList.remove("active");
});

burgerIcox.addEventListener("click", (e) => {
  burgerIcox.classList.remove("active");
  burgerIco.classList.add("active");
  burgerCont.classList.remove("active");
  mobileSel.classList.add("active");
});

function toggleBottomBorder(clickedButton) {
  // Remove 'active' class from all buttons
  var buttons = document.querySelectorAll('.button');
  buttons.forEach(function (button) {
    button.classList.remove('selected');
  });

  // Add 'active' class to the clicked button
  clickedButton.classList.add('selected');
}

createReq.addEventListener("click", () => {
  reqForm.classList.add("active");
  reqBox.classList.remove("active");
  createReq.classList.remove("active");
}
);

itemSelButton.addEventListener("click", () => {
  itemSelButton.classList.toggle("selected");
  catSelButton.classList.remove("selected");
  itemContent.classList.add("active");
  itemList.classList.toggle("active");
  catList.classList.remove("active");
});

catSelButton.addEventListener("click", () => {
  catSelButton.classList.toggle("selected");
  itemSelButton.classList.remove("selected");
  itemContent.classList.add("active");
  itemList.classList.remove("active");
  catList.classList.toggle("active");
});

cancelBtn.addEventListener("click", () => {
  reqForm.classList.remove("active");
  reqBox.classList.add("active");
  createReq.classList.add("active");
});

let a = 1;
plus.addEventListener("click", () => {
  if (a < 100) {
    a++;
    num.innerText = a;
  }
});

minus.addEventListener("click", () => {
  if (a > 1) {
    a--;
    num.innerText = a;
  }
});
