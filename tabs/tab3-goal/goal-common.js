// keyboard
function showKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const content = document.querySelector(".device-content");
    keyboard.style.display = "block";
    content.style.paddingBottom = "320px"; 
    keyboard.style.height = "350px";
}
  
function hideKeyboard() {
    const keyboard = document.getElementById("keyboard");
    const content = document.querySelector(".device-content");
    keyboard.style.display = "none";
    content.style.paddingBottom = "75px";
    keyboard.style.height = "0px";
}

document.querySelectorAll("input, textarea").forEach(field => {
    field.addEventListener("focus", () => {
      showKeyboard();
      setTimeout(() => {
        field.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    });
  
    field.addEventListener("blur", () => {
      hideKeyboard();
    });
});