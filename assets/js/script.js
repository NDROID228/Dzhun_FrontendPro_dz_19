// user box
const $userList = document.querySelector("#user-list");

function createUserBox(list) {
  const id = list.id;
  const userBox = document.createElement("div");
  userBox.setAttribute("class", "user-box");
  userBox.setAttribute("id", id);
  $userList.appendChild(userBox);
  const $userBox = $userList.querySelector("#" + id);

  const userInfo = document.createElement("div");
  userInfo.setAttribute("class", "user-info d-flex align-items-center");
  userInfo.setAttribute("id", "heading-" + id);
  $userBox.appendChild(userInfo);
  const $headingBox = $userBox.querySelector("#heading-" + id);

  const heading = document.createElement("h5");
  heading.textContent = list.name + " " + list.surname;
  $headingBox.appendChild(heading);

  const buttonBox = document.createElement("div");
  buttonBox.setAttribute("class", "d-flex");
  buttonBox.setAttribute("id", "button-box" + id);
  $userBox.appendChild(buttonBox);
  const $buttonBox = $userBox.querySelector("#button-box" + id);

  const buttonMore = document.createElement("div");
  buttonMore.setAttribute("class", "bg-user-box");
  buttonMore.setAttribute("id", "more-" + id);
  $buttonBox.appendChild(buttonMore);
  const $buttonMore = document.querySelector("#more-" + id);
  const imgMore = document.createElement("img");
  imgMore.setAttribute("src", "./icons/more.png");
  imgMore.setAttribute("style", "width: 100%;");
  $buttonMore.appendChild(imgMore);
  $buttonMore.addEventListener("click", buttonMoreEvent);

  const buttonEdit = document.createElement("div");
  buttonEdit.setAttribute("class", "bg-user-box");
  buttonEdit.setAttribute("id", "edit-" + id);
  $buttonBox.appendChild(buttonEdit);
  const $buttonEdit = document.querySelector("#edit-" + id);
  const imgEdit = document.createElement("img");
  imgEdit.setAttribute("src", "./icons/edit.png");
  imgEdit.setAttribute("style", "width: 100%;");
  $buttonEdit.appendChild(imgEdit);
  $buttonEdit.addEventListener("click", buttonEditEvent);

  const buttonDelete = document.createElement("div");
  buttonDelete.setAttribute("class", "bg-user-box");
  buttonDelete.setAttribute("id", "delete-" + id);
  $buttonBox.appendChild(buttonDelete);
  const $buttonDelete = document.querySelector("#delete-" + id);
  const imgDelete = document.createElement("img");
  imgDelete.setAttribute("src", "./icons/delete.png");
  imgDelete.setAttribute("style", "width: 100%;");
  $buttonDelete.appendChild(imgDelete);
  $buttonDelete.addEventListener("click", buttonDeleteEvent);
}

function getUserById(id) {
  const currentData = JSON.parse(localStorage.getItem("data"));
  let userData;
  for (let i = 0; i < currentData.length; i++) {
    const element = currentData[i];
    if (element.id == id) {
      userData = element;
      break;
    }
  }

  return userData;
}

function buttonMoreEvent(event) {
  const $form = document.forms[0];
  const id = event.target.parentElement.id.match(/user\d+/)[0];
  const list = getUserById(id);

  for (let i = 0; i < $form.elements.length; i++) {
    const element = $form.elements[i];
    element.disabled = true;
    switch (element.id) {
      case "surname":
        element.value = list.surname;
        break;
      case "name":
        element.value = list.name;
        break;
      case "age":
        element.value = list.age;
        break;
      case "location":
        element.value = list.location;
        break;
      default:
        if (list.gender == "Чоловік") {
          if (i == 4) {
            element.checked = true;
          }
        } else {
          if (i == 5) {
            element.checked = true;
          }
        }
        break;
    }
  }

  showOrHideForm("Дані користувача " + list.name);
}

function buttonEditEvent(event) {
  const $form = document.forms[0];
  const id = event.target.parentElement.id.match(/user\d+/)[0];
  const list = getUserById(id);

  for (let i = 0; i < $form.elements.length; i++) {
    const element = $form.elements[i];
    element.disabled = false;
    switch (element.id) {
      case "surname":
        element.value = list.surname;
        break;
      case "name":
        element.value = list.name;
        break;
      case "age":
        element.value = list.age;
        break;
      case "location":
        element.value = list.location;
        break;
      default:
        if (list.gender == "Чоловік") {
          if (i == 4) {
            element.checked = true;
          }
        } else {
          if (i == 5) {
            element.checked = true;
          }
        }
        break;
    }
  }

  const $btn = $form.elements[$form.elements.length - 1];
  $btn.textContent = "Редагувати";
  $btn.removeEventListener("click", formValidation);
  $btn.addEventListener("click", function changeUser() {
    const currentData = JSON.parse(localStorage.getItem("data"));
    const newInfoArr = validator();
    if (newInfoArr[0]) {
      for (let i = 0; i < currentData.length; i++) {
        const element = currentData[i];
        if (element.id == id) {
          currentData[i] = {
            id: id,
            surname: newInfoArr[1][0],
            name: newInfoArr[1][1],
            age: newInfoArr[1][2],
            location: newInfoArr[1][3],
            gender: newInfoArr[1][4],
          };
          break;
        }
      }
      localStorage.setItem("data", JSON.stringify(currentData));
      displayData();
      $form.setAttribute("hidden", "");
      clearForm();
    }
  });

  showOrHideForm("Редагувати дані користувача " + list.name);
}

function buttonDeleteEvent(event) {
  document.forms[0].setAttribute("hidden", "");
  clearForm();

  let userBox = event.target;
  while (userBox.className !== "user-box") {
    userBox = userBox.parentElement;
  }
  const userId = userBox.id;
  showDeleteAlert(userId);
}

function showDeleteAlert(userId) {
  const $deleteAlert = document.querySelector("#delete-alert");
  $deleteAlert.className = "delete-question-box";

  const textBoxId = "heading-" + userId;
  const $textBox = document.querySelector("#" + textBoxId);
  const headingText = $textBox.textContent;
  document.querySelector("#heading-delete").innerHTML =
    "Видалити користувача <br>" + headingText + "?";

  const $cancelAlert = document.querySelector("#cancel-alert");
  $cancelAlert.addEventListener("click", hideDeleteAlert);
  const $confirmAlert = document.querySelector("#confirm-alert");
  $confirmAlert.setAttribute("userId", userId);
  $confirmAlert.addEventListener("click", confirmAlertEvent);
}

function confirmAlertEvent(event) {
  const userId = event.target.getAttribute("userId");
  const $userBox = document.querySelector("#" + userId);
  $userBox.remove();
  const currentData = JSON.parse(localStorage.getItem("data"));
  for (let i = 0; i < currentData.length; i++) {
    const element = currentData[i];
    if (element.id == userId) {
      currentData.splice(i, 1);
      localStorage.setItem("data", JSON.stringify(currentData));
      break;
    }
  }
  displayData();
  hideDeleteAlert();
}

function hideDeleteAlert() {
  const $deleteAlert = document.querySelector("#delete-alert");
  $deleteAlert.className = "delete-question-box-hidden";

  const $confirmAlert = document.querySelector("#confirm-alert");
  $confirmAlert.removeAttribute("userId");
  $confirmAlert.removeEventListener("click", confirmAlertEvent);
}

// form validation

function formValidation() {
  const validArr = validator();

  if (validArr[0]) {
    return parseToLocalStorage(validArr[1]);
  }
}

function validator() {
  const $form = document.forms[0];
  const list = [];
  let isSelected = false;
  for (let i = 0; i < $form.elements.length - 1; i++) {
    const element = $form.elements[i];
    if (i == 4 || i == 5) {
      if (element.checked) {
        showSuccess(element);
        list.push(element.parentElement.querySelector("label").textContent);
      } else {
        if (isSelected) {
          showError(element, "Потрібно вибрати стать");
        } else {
          isSelected = true;
        }
      }
    } else if (i == 2) {
      let isValidated = checkNumber(element);
      if (isValidated) {
        list.push(element.value);
      }
    } else {
      let isValidated = checkLength(element, 3, 15);
      if (isValidated) {
        list.push(element.value);
      }
    }
  }
  if (list.length == 5) {
    return [true, list];
  } else {
    return [false];
  }
}

function parseToLocalStorage(list) {
  const count = parseInt(localStorage.getItem("count"));

  const reList = {
    id: "user" + count,
    surname: list[0],
    name: list[1],
    age: list[2],
    location: list[3],
    gender: list[4],
  };
  const readData = JSON.parse(localStorage.getItem("data"));
  readData.push(reList);
  data = readData;
  localStorage.setItem("data", JSON.stringify(readData));
  localStorage.setItem("count", count + 1);
  displayData();
  showOrHideForm("");
  clearForm();
  return reList;
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, "Поле повинно містити як мінімум " + min + " символи");
    return false;
  } else if (input.value.length > max) {
    showError(input, "Поле повинно містити не більше " + max + " символів");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

function checkNumber(input) {
  const value = input.valueAsNumber;
  if (isNaN(value)) {
    showError(input, "Потрібно ввести вік");
    return false;
  } else if (value <= 17) {
    showError(input, "Потрібно ввести коректний вік");
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

function showError(input, message) {
  let parent = input.parentElement;
  while (parent.className !== "col") {
    parent = parent.parentElement;
  }
  const $parent = parent;

  const $span = $parent.querySelector("span");
  $span.className = "text-light text-bg-danger";
  $span.textContent = message;
  if (input.classList.contains("form-control")) {
    if (input.classList.contains("is-valid")) {
      input.classList.replace("is-valid", "is-invalid");
    } else {
      input.classList.add("is-invalid");
    }
  }
}

function showSuccess(input) {
  let parent = input.parentElement;
  while (parent.className !== "col") {
    parent = parent.parentElement;
  }
  const $parent = parent;

  const $span = $parent.querySelector("span");
  $span.className = "d-none";

  if (input.classList.contains("form-control")) {
    if (input.classList.contains("is-invalid")) {
      input.classList.replace("is-invalid", "is-valid");
    } else {
      input.classList.add("is-valid");
    }
  }
}

function showOrHideForm(headingText) {
  const $form = document.forms[0];
  if ($form.hasAttribute("hidden")) {
    document.querySelector("#form-heading").textContent = headingText;
    $form.removeAttribute("hidden");
  } else {
    $form.setAttribute("hidden", "");
    clearForm();
  }
}

function clearForm() {
  const $form = document.forms[0];
  document.querySelector("#form-heading").textContent = "Немає";

  $form.elements[$form.elements.length - 1].remove();

  const newBtn = document.createElement("button");
  newBtn.setAttribute("type", "button");
  newBtn.setAttribute("class", "btn btn-outline-light");
  newBtn.textContent = "Додати";
  document.querySelector("#submit-box").appendChild(newBtn);
  $form.elements[$form.elements.length - 1].addEventListener(
    "click",
    formValidation
  );

  for (let i = 0; i < $form.elements.length - 1; i++) {
    const element = $form.elements[i];
    element.disabled = false;
    if (i == 4 || i == 5) {
      element.checked = false;
      showSuccess(element);
    } else if (i == 2) {
      element.value = 0;
      showSuccess(element);
      element.className = "form-control";
    } else {
      element.value = "";
      showSuccess(element);
      element.className = "form-control";
    }
  }
}

// main
(function () {
  initLocalStorage();

  displayData();

  //adding form submit button event
  const $form = document.forms[0];
  $form.elements[$form.elements.length - 1].addEventListener(
    "click",
    formValidation
  );

  //adding cancel-alert button event
  const $cancelAlert = document.querySelector("#cancel-alert");
  $cancelAlert.addEventListener("click", hideDeleteAlert);

  const $buttonAdd = document.querySelector("#add-user");
  $buttonAdd.addEventListener("click", function (event) {
    $form.elements[$form.elements.length - 1].disabled = false;
    showOrHideForm("Додати користувача");
  });
})();

function clearUserList() {
  document.querySelector("#user-list").innerHTML = "";
}

function initLocalStorage() {
  const localCount = localStorage.getItem("count");
  const localData = localStorage.getItem("data");
  if(localStorage.length == 0){
    localStorage.setItem("count", "1");
    localStorage.setItem("data", JSON.stringify(data));
  } else if(localCount === null || localData === null) {
    localStorage.clear();
    localStorage.setItem("count", "1");
    localStorage.setItem("data", JSON.stringify(data));
  }
}

//display info on site from localStorage
function displayData() {
  clearUserList();
  const currentData = JSON.parse(localStorage.getItem("data"));
  currentData.forEach((element) => {
    createUserBox(element);
  });
}