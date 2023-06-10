function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function isValidName(name) {
  for (let i = 0; i < name.length; i++) {
    const code = name.charCodeAt(i);
    if ((code < 65 || code > 90) && (code < 97 || code > 122)) {
      return false;
    }
  }
  return true;
}

function greetUser() {
  let firstName = prompt("Enter your first name:");
  let lastName = prompt("Enter your last name:");

  if (!isValidName(firstName) || !isValidName(lastName)) {
    console.log("Wrong input!");
    alert("Wrong input!");
    return;
  }

  firstName = capitalize(firstName);
  lastName = capitalize(lastName);

  const fullName = `${firstName} ${lastName}`;
  console.log(`Hello, ${fullName}!`);
  alert(`Hello, ${fullName}!`);
}

greetUser();
