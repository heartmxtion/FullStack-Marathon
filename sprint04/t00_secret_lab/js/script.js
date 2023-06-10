function transformation() {
  var heroElement = document.getElementById("hero");
  var labElement = document.getElementById("lab");

  if (heroElement.textContent === "Bruce Banner") {
    heroElement.textContent = "Hulk";
    heroElement.style.fontSize = "130px";
    heroElement.style.letterSpacing = "6px";
    labElement.style.backgroundColor = "#70964b";
  }
  else {
    heroElement.textContent = "Bruce Banner";
    heroElement.style.fontSize = "60px";
    heroElement.style.letterSpacing = "2px";
    labElement.style.backgroundColor = "#ffb300";
  }
}
