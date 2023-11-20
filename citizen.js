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

reqBtn.addEventListener("click", (e)=> {
  reqTab.classList.add("active");
  annTab.classList.remove("active");
  offTab.classList.remove("active");
});

annBtn.addEventListener("click", (e)=> {
  annTab.classList.add("active");
  reqTab.classList.remove("active");
  offTab.classList.remove("active");
});

offBtn.addEventListener("click", (e)=> {
  offTab.classList.add("active");
  reqTab.classList.remove("active");
  annTab.classList.remove("active");
});

burgerIco.addEventListener("click", (e)=> {
  burgerIco.classList.remove("active");
  burgerIcox.classList.add("active");
  burgerCont.classList.add("active");
  mobileSel.classList.remove("active");
});

burgerIcox.addEventListener("click", (e)=> {
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

