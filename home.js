//SignUp-Login Button
const formContainer = document.querySelector(".form_container");
const signupBtn = document.querySelector("#signup-btn");
const loginBtn = document.querySelector("#login");
signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.add("active");
});
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.classList.remove("active");
});

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
const passChecklist = document.querySelectorAll(".list-item");
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
  errorAddress.classList.remove("active");
  if (!addressInput.value.match(addressPattern)) {
    return addressField.classList.add("invalid");
  }
  addressField.classList.remove("invalid");
}

// Fetch API to check the Database for Username Similarity
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

// Fetch API to check the Database for Credentials
const formAct = document.querySelector("#login-form");
const passLoginField = document.querySelector(".field.passwordlogin");
const passLoginInput = document.querySelector("#pass-login");
const usernameLoginInput = document.querySelector("#username-login");
function checkCredentials() {
  var data = {
    username: usernameLoginInput.value,
    password: passLoginInput.value,
  };
  fetch("check_credentials.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result == "False") {
        passLoginField.classList.add("invalid");
      } else {
        passLoginField.classList.remove("invalid");
        formAct.action = result + "/" + result + ".html";
        formAct.submit();
      }
    });
}

//Validation When Typing
usernameInput.addEventListener("keyup", checkUsername);
fullnameInput.addEventListener("keyup", checkFullname);
phoneInput.addEventListener("keyup", checkPhone);
addressInput.addEventListener("keyup", checkAddress);

//Submit Form Validation When Submiting
const submitBtn = document.querySelector("#submit");
const emailInput = document.querySelector("#emailInput");
const errorAddress = document.querySelector(".error.address")
submitBtn.addEventListener("click", (e) => {
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
    //If at least one of the Fields is Incorrectly filled, don't Submit
    e.preventDefault();
  } else {
    e.preventDefault();
    var lat;
    var lon;

    fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&polygon_geojson=1&addressdetails=1&q=' + addressInput.value + '&limit=1') //Get the lat and lon of the Address that was typed.
      .then(result => {
        if (!result.ok) {
          throw new Error("Network response was not ok");
        }
        return result.json();
      })
      .then(result => {
        if (result.length > 0 && result[0].lat && result[0].lon) {
          lat = result[0].lat;
          lon = result[0].lon;
          submit(lat, lon);
        } else {
          errorAddress.classList.add("active");
        }
      })
  }
});

//Submit Sign-Up Form
function submit(lat, lon) {
  fetch("home.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      fullname: fullnameInput.value,
      phone: phoneInput.value,
      address: addressInput.value,
      password: passInput.value,
      email: emailInput.value,
      latitude: lat,
      longitude: lon
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      window.location.href = "citizen/citizen.html";
    })
    .catch(error => {
      console.error("Error during form submission:", error.message);
    });
}

//Login Form Validation When Submiting
const loginForm = document.querySelector(".form.login_form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkCredentials();
});