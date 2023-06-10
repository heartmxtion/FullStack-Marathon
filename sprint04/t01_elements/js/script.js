var charactersList = document.getElementById("characters");

var characters = charactersList.getElementsByTagName("li");

for (var i = 0; i < characters.length; i++) {
  var character = characters[i];

  if (!character.hasAttribute("class") || (character.getAttribute("class") !== "good" && character.getAttribute("class") !== "evil")) {
    character.setAttribute("class", "unknown");
  }

  if (!character.hasAttribute("data-element")) {
    character.setAttribute("data-element", "none");
  }

  var nameContainer = document.createElement("div");
  nameContainer.className = "name-container";
  nameContainer.textContent = character.textContent;
  character.textContent = '';
  character.appendChild(nameContainer);

  var circlesContainer = document.createElement("div");
  circlesContainer.className = "circles-container";

  var dataElements = character.getAttribute("data-element").split(" ");
  for (var j = 0; j < dataElements.length; j++) {
    var circle = document.createElement("div");
    circle.className = "elem " + dataElements[j];
    circlesContainer.appendChild(circle);

    if (dataElements[j] === "none") {
      var line = document.createElement("div");
      line.className = "line";
      circle.appendChild(line);
    }
  }

  character.appendChild(circlesContainer);
}
