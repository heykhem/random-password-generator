window.addEventListener("DOMContentLoaded", () => {
  themeChecker();
  fieldActivitySet();
  randPassGen();
});

const capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const smAlpha = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbols = "~!@#$%^&()?/";
const display = document.querySelector(".pass-display-input");
let displayRange = document.querySelector(".display-range");

let capitalLetterCheck = document.querySelector("#capitalLet").checked;
let smallLetterCheck = document.querySelector("#smallLet").checked;
let numberCheck = document.querySelector("#numLet").checked;
let symbolCheck = document.querySelector("#symbolLet").checked;
let copyButton = document.querySelector(".pass-generate-btn");
let newPasswordGenerateBtn = document.body.querySelector("#new-pass-gen");

// THEME SETTING
let themeButton = document.querySelector(".mode-change");
function themeChecker() {
  const isDark = localStorage.getItem("theme");

  isDark == "dark"
    ? document.body.classList.add("dark-theme")
    : document.body.classList.remove("dark-theme");

  if (isDark == "dark") {
    themeButton.children[0].classList.toggle("hidden");
    themeButton.children[1].classList.toggle("hidden");
    themeButton.children[2].classList.toggle("hidden");
    themeButton.children[3].classList.toggle("hidden");
  }
}

themeButton.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  Array.from(themeButton.children).forEach((child) => {
    child.classList.toggle("hidden");
  });
});

// FUNCTION OPACITY DISABLE BUTTON
function disableButton(button) {
  button.disabled = true;
  button.classList.add("opacity-down");
}

function enableButton(button) {
  button.disabled = false;
  button.classList.remove("opacity-down");
}

// Save checkbox states to localStorage
function fieldActivity() {
  const capitalLetterCheck = document.querySelector("#capitalLet").checked;
  const smallLetterCheck = document.querySelector("#smallLet").checked;
  const numberCheck = document.querySelector("#numLet").checked;
  const symbolCheck = document.querySelector("#symbolLet").checked;
  let displayRange = document.querySelector("#range").value;

  const checkList = {
    capital: capitalLetterCheck,
    small: smallLetterCheck,
    number: numberCheck,
    symbol: symbolCheck,
    range: displayRange,
  };

  localStorage.setItem("fieldActivity", JSON.stringify(checkList));
}

// Load and apply saved checkbox states
function fieldActivitySet() {
  const activity = JSON.parse(localStorage.getItem("fieldActivity"));
  if (!(activity == null)) {
    const capitalLetterCheck = document.querySelector("#capitalLet");
    const smallLetterCheck = document.querySelector("#smallLet");
    const numberCheck = document.querySelector("#numLet");
    const symbolCheck = document.querySelector("#symbolLet");
    let displayRange = document.querySelector("#range");
    let showRange = document.querySelector(".display-range");

    capitalLetterCheck.checked = activity.capital;
    smallLetterCheck.checked = activity.small;
    numberCheck.checked = activity.number;
    symbolCheck.checked = activity.symbol;
    displayRange.value = activity.range;
    showRange.innerHTML = activity.range;
  }
}

// Save Acitivity after borwser close
window.addEventListener("beforeunload", () => {
  fieldActivity();
});

// clear Storage
const historyClearButton = document.querySelector(".clear-history-btn");
historyClearButton.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.clear();
  updateDisplay([]);
});

function storePassword(password) {
  // Load existing history or start new
  let passwordHistory =
    JSON.parse(localStorage.getItem("passwordHistory")) || [];

  passwordHistory.unshift(password);

  if (passwordHistory.length > 5) {
    passwordHistory.pop();
  }

  localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
  updateDisplay(passwordHistory);
}

async function copyText(element, copyButton) {
  const text = typeof element === "string" ? element : element.textContent;

  try {
    await navigator.clipboard.writeText(text);
    disableButton(copyButton);
    // Animate: scale up slightly and fade in
    gsap.to(copyButton, { scale: 1.1, duration: 0.2, ease: "power2.out" });
    gsap.to(copyButton, { opacity: 0.8, duration: 0.2 });

    copyButton.innerHTML = "Copied!";

    setTimeout(() => {
      copyButton.innerHTML = `Copy 
        <span class="material-symbols-outlined">content_copy</span>`;

      // Animate: reset scale and opacity
      gsap.to(copyButton, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.inOut",
      });
      enableButton(copyButton);
    }, 1000);
  } catch (err) {
    alert("Failed to copy!");
  }
}

copyButton.addEventListener("click", (e) => {
  const textElement = document.querySelector(".pass-display-input").textContent;
  copyText(textElement, copyButton);
});

let checkCollection = document.querySelectorAll(".check-checking");
let newPassBtn = document.querySelector("#new-pass-gen");

let passGen = "";
function randPassGen() {
  capitalLetterCheck = document.querySelector("#capitalLet").checked;
  smallLetterCheck = document.querySelector("#smallLet").checked;
  numberCheck = document.querySelector("#numLet").checked;
  symbolCheck = document.querySelector("#symbolLet").checked;

  if (capitalLetterCheck || smallLetterCheck || numberCheck || symbolCheck) {
    limit = document.querySelector("#range").value;
    displayRange.innerHTML = `(${limit})`;

    passGen = "";
    let characters = "";
    if (capitalLetterCheck) characters += capAlpha;
    if (smallLetterCheck) characters += smAlpha;
    if (numberCheck) characters += number;
    if (symbolCheck) characters += symbols;

    for (let i = 0; i < limit; i++) {
      passGen += characters[Math.floor(Math.random() * characters.length)];
    }

    if (
      isValidPassword(
        passGen,
        capitalLetterCheck,
        smallLetterCheck,
        numberCheck,
        symbolCheck
      )
    ) {
      enableButton(newPasswordGenerateBtn);
      display.innerHTML = colorPassword(passGen);
      if (capitalLetterCheck || smallLetterCheck || numberCheck || symbCheck) {
        updateDisplay(
          JSON.parse(localStorage.getItem("passwordHistory")) || []
        );
      }
    } else {
      randPassGen();
    }
  } else {
    display.innerHTML = "Choose any field";
    display.style.color = "#9f9f9f";
    disableButton(newPasswordGenerateBtn);
    console.log("error");
  }
}

function updateDisplay(passwordArray) {
  let passwordContainer = document.querySelector(".password-list-box");
  let result = passwordArray.map(
    (pw) => `<div class="password-list">
            <span>${pw}</span>
            <div class="password-edit-options">
              <button class="password-copy-btn">
                Copy
                <span class="material-symbols-outlined" > content_copy </span>
              </button>
              <button class="password-delete-btn">
                Delete
                <span class="material-symbols-outlined"> delete </span>
              </button>
            </div>
          </div>`
  );

  passwordContainer.innerHTML = result.join("");

  if (passwordContainer.hasChildNodes()) {
    historyPasswordSingleCopy();
    historyPasswordSingleDelete();
    enableButton(historyClearButton);
  } else {
    disableButton(historyClearButton);
  }
}

function historyPasswordSingleCopy() {
  let copyButtons = document.querySelectorAll(".password-copy-btn");
  copyButtons.forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      copyText(element.parentElement.parentElement.firstElementChild, element);
    });
  });
}

function historyPasswordSingleDelete() {
  let deleteButtons = document.querySelectorAll(".password-delete-btn");
  let passwordHistory =
    JSON.parse(localStorage.getItem("passwordHistory")) || [];

  deleteButtons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const passwordListItem = button.closest(".password-list");

      // Get current X position and window width
      const offsetRight =
        window.innerWidth - passwordListItem.getBoundingClientRect().left;

      // Animate: slide fully to the right and fade out
      gsap.to(passwordListItem, {
        x: offsetRight,
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // Remove item from array and update UI
          passwordHistory.splice(index, 1);
          localStorage.setItem(
            "passwordHistory",
            JSON.stringify(passwordHistory)
          );
          updateDisplay(passwordHistory);
        },
      });
    });
  });
}

function isValidPassword(str, capCheck, lowCheck, numCheck, symbCheck) {
  const hasUpper = /[A-Z]/.test(str);
  const hasLower = /[a-z]/.test(str);
  const hasNumber = /[0-9]/.test(str);
  const hasSymbol = /[~!@#$%^&()?/]/.test(str);
  if (
    capCheck === hasUpper &&
    lowCheck === hasLower &&
    numCheck === hasNumber &&
    symbCheck === hasSymbol
  )
    return true;
  else return false;
}

function colorPassword(str) {
  let passwordArray = Array.from(str);
  passwordArray.forEach((value, index) => {
    const hasLower = /[a-z]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[~!@#$%^&()?/]/.test(value);
    if (hasUpper) {
      passwordArray[index] = `<span class="capital-letter">${value}</span>`;
    }
    if (hasLower) {
      passwordArray[index] = `<span class="small-letter">${value}</span>`;
    }
    if (hasNumber) {
      passwordArray[index] = `<span class="password-number">${value}</span>`;
    }
    if (hasSymbol) {
      passwordArray[index] = `<span class="password-symbols">${value}</span>`;
    }
  });
  return passwordArray.join("");
}

newPassBtn.addEventListener("click", (e) => {
  e.preventDefault();
  randPassGen();
  storePassword(passGen);
});

document.querySelector("#range").addEventListener("input", (e) => {
  e.preventDefault();
  randPassGen();
});

document.querySelector("#range").addEventListener("change", (e) => {
  e.preventDefault();
  storePassword(passGen);
});

checkCollection.forEach((value) => {
  value.addEventListener("change", (e) => {
    randPassGen();
    storePassword(passGen);
  });
});
