formContainer = document.querySelector('.form_container'),
signupBtn = document.querySelector('#signup-btn'),
loginBtn = document.querySelector('#login'),
pwShowHide = document.querySelectorAll('.pw_hide');
passChecklist = document.querySelectorAll('.list-item');
signupForm = document.querySelector('.form.signup_form');
loginForm = document.querySelector('.form.login_form');
formAct = document.querySelector('#login-form');
passField = document.querySelector('.field.password');
passInput = document.querySelector('#pass');
passLoginField = document.querySelector('.field.passwordlogin');
passLoginInput = document.getElementById('pass-login');
usernameField = document.querySelector('.field.username');
usernameInput = document.getElementById('username');
usernameLoginInput = document.getElementById('username-login');
fullnameField = document.querySelector('.field.fullname');
fullnameInput = document.getElementById('fullname');
phoneField = document.querySelector('.field.phone');
phoneInput = document.getElementById('phone');
addressField = document.querySelector('.field.address');
addressInput = document.getElementById('address');

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
  for (var i = 0; i < passChecklist.length; i++) {
    if (!passChecklist[i].classList.contains('checked')) {
      passGood = false;
    } else passGood = true;
  }
}

//Username Validation
const usernamePattern = /^[a-zA-Z0-9]+\s?[a-zA-Z0-9]+$/
function checkUsername() {
  if (!usernameInput.value.match(usernamePattern)) {
    return usernameField.classList.add("invalid");
  }
  usernameField.classList.remove("invalid");
}

//Fullname Validation
const fullnamePattern = /[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/
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

//Address Validation
const addressPattern = /^[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+\s+[a-zA-Zα-ωΑ-ΩίϊΐόάέύϋΰήώΊΪΌΆΈΎΫΉΏ]+$/
function checkAddress() {
  if (!addressInput.value.match(addressPattern)) {
    return addressField.classList.add("invalid");
  }
  addressField.classList.remove("invalid");
}

// AJAX Request to check the Database for Username Similarity
function checkUsernameAvailability() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.message != 'False') {
        usernameField.classList.add("duplicate");
      } else {
        usernameField.classList.remove("duplicate");
      }
    }
  };
  xhr.open("GET", "check_username.php?username=" + usernameInput.value, true);
  xhr.send();
}

// AJAX Request to check the Database for Credentials
function checkCredentials() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var response = JSON.parse(xhr.responseText);
      if (response.message == "False") {
        passLoginField.classList.add("invalid");
      } else{
        passLoginField.classList.remove("invalid");
        formAct.submit();
      }
    }
  };
  xhr.open("GET", "check_credentials.php?username=" + usernameLoginInput.value + "&password=" + passLoginInput.value, true);
  xhr.send();
}

//Validation When Typing
usernameInput.addEventListener("keyup", checkUsername);
usernameInput.addEventListener("keyup", checkUsernameAvailability);
fullnameInput.addEventListener("keyup", checkFullname);
phoneInput.addEventListener("keyup", checkPhone);
addressInput.addEventListener("keyup", checkAddress);

//Submit Form Validation When Submiting
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
  ) { e.preventDefault(); }
});

//Login Form Validation When Submiting
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkCredentials();
});

