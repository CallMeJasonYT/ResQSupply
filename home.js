formContainer = document.querySelector(".form_container"),
signupBtn = document.querySelector("#signup"),
loginBtn = document.querySelector("#login"),
pwShowHide = document.querySelectorAll(".pw_hide"),
passChecklist = document.querySelectorAll('.list-item');
passInput = document.querySelector('#pass');
form = document.querySelector('.form.signup_form');
passField = document.querySelector('.field.password');
usernameField = document.querySelector('.field.username');
usernameInput = document.getElementById("username");
fullnameField = document.querySelector('.field.fullname');
fullnameInput = document.getElementById("fullname");
phoneField = document.querySelector('.field.phone');
phoneInput = document.getElementById("phone");

//SignUp-Login Button
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

//Show-Hide Password Icon
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
  { regex: /^[a-zA-Z0-9!@#$%^&*()-_=+{}\[\]:;<>,.?\/\\|]+$/ }
]

//Password Requirements Checklist
passInput.addEventListener('keyup', () => {
  validationRegex.forEach((item, i) => {
    let isValid = item.regex.test(passInput.value)
    if (isValid) {
      passChecklist[i].classList.add('checked');
    } else {
      passChecklist[i].classList.remove('checked');
    }
  })
})

//Show-Hide Password Requirements
passInput.addEventListener("focus", (e) => {
  e.preventDefault();
  passField.classList.add("active");
})
passInput.addEventListener("blur", (e) => {
  e.preventDefault();
  passField.classList.remove("active");
})

//Password Validation
function checkPass() {
  for(var i=0; i<passChecklist.length; i++){
    if(!passChecklist[i].classList.contains('checked')){
      passGood = false;
    }else passGood = true;
  }
}

//Username Validation
const usernamePattern = /^[a-zA-Z0-9]+$/
function checkUsername() {
if (!usernameInput.value.match(usernamePattern)) {
  return usernameField.classList.add("invalid");
}
usernameField.classList.remove("invalid");
}

//Fullname Validation
const fullnamePattern = /[^0-9!@#$%^&*()-_=+{}\[\]:;<>,.?\/\\|]+\s+[^0-9!@#$%^&*()-_=+{}\[\]:;<>,.?\/\\]+$/
function checkFullname() {
  if (!fullnameInput.value.match(fullnamePattern)) {
    return fullnameField.classList.add("invalid");
  }
  fullnameField.classList.remove("invalid");
}

//Phone Number Validation
const phonePattern = /^[+0-9]+$/
function checkPhone() {
  if (!phoneInput.value.match(phonePattern)) {
    return phoneField.classList.add("invalid");
  }
  phoneField.classList.remove("invalid");
}

//Validation When Submiting
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkUsername();
  checkFullname();
  checkPhone();
  checkPass();

  usernameInput.addEventListener("keyup", checkUsername);
  fullnameInput.addEventListener("keyup", checkFullname);
  phoneInput.addEventListener("keyup", checkPhone);

  if (
    !usernameField.classList.contains("invalid") &&
    !fullnameField.classList.contains("invalid") &&
    !phoneField.classList.contains("invalid") &&
    passGood
  ) {
    location.href = form.getAttribute("action");
  }
});
