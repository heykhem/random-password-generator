const capAlpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const smAlpha = "abcdefghijklmnopqrstuvwxyz";
const number = "0123456789";
const symbols = "~!@#$%^&()?/";
const display = document.querySelector(".pass-dis-input");
let displayRange = document.querySelector(".display-range");

let capitalLetterCheck = document.querySelector("#capitalLet").checked;
let smallLetterCheck = document.querySelector("#smallLet").checked;
let numberCheck = document.querySelector("#numLet").checked;
let symbolCheck = document.querySelector("#symbolLet").checked;
let copyButton = document.querySelector(".pass-generate-btn");

async function copyText() {
  const text = document.querySelector(".pass-dis-input").textContent;
  try {
    await navigator.clipboard.writeText(text);
    alert("Copied: " + text);
  } catch (err) {
    alert("Failed to copy!");
  }
}

copyButton.addEventListener("click", (e) => {
  copyText();
});

let checkCollection = document.querySelectorAll(".check-checking");

// shows password length
let limit = document.querySelector("#range").value;
displayRange.innerHTML = limit;

let newPassBtn = document.querySelector("#new-pass-gen");

let passGen = "";
function randPassGen() {
  capitalLetterCheck = document.querySelector("#capitalLet").checked;
  smallLetterCheck = document.querySelector("#smallLet").checked;
  numberCheck = document.querySelector("#numLet").checked;
  symbolCheck = document.querySelector("#symbolLet").checked;

  if (capitalLetterCheck || smallLetterCheck || numberCheck || symbolCheck) {
    limit = document.querySelector("#range").value;
    displayRange.innerHTML = limit;

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
      display.innerHTML = colorPassword(passGen);
    } else {
      randPassGen();
    }
  }
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
});

document.querySelector("#range").addEventListener("input", (e) => {
  e.preventDefault();
  randPassGen();
});

checkCollection.forEach((value) => {
  value.addEventListener("change", (e) => {
    randPassGen();
  });
});

randPassGen();
