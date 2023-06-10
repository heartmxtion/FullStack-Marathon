class Human {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.calories = 0;
	
	setInterval(() => {
      if (this.calories >= 200) {
        this.calories -= 200;
		document.getElementById('calories').innerText = 'Calories:' + this.calories;
      }
    }, 60000);
	
	setTimeout(() => {
      showMessage("I'm getting hungry...", 3);
    }, 5000);
  }

  sleepFor() {
    const seconds = prompt('Enter the number of seconds to sleep:');
    showMessage(`I'm sleeping for ${seconds} seconds.`, seconds);
    setTimeout(() => {
      showMessage(`I'm awake now after waking up for ${seconds} seconds.`, 3);
    }, seconds * 1000);
  }

  feed() {
    if (this.calories > 500) {
      showMessage("I'm not hungry.", 3);
    } else {
      showMessage("Nom nom nom", 10);
      setTimeout(() => {
        this.calories += 200;
		document.getElementById('calories').innerText = 'Calories:' + this.calories;
		if (this.calories < 500) {
          showMessage("I'm still hungry.", 3);
		}
      }, 10000);
    }
  }
}

class Superhero extends Human {
  constructor(firstName, lastName, gender, age) {
    super(firstName, lastName, gender, age);
	this.calories = 0;
	this.canRaiseThorsHammer = true;
  }

  fly() {
    showMessage("I'm flying!", 10);
  }

  fightWithEvil() {
    showMessage("Khhhh-chh... Bang-g-g-g... Evil is defeated!", 3);
  }
}

let human = new Human('John', 'Doe', 'Male', 25);
document.getElementById('firstName').innerText += human.firstName;
document.getElementById('lastName').innerText += human.lastName;
document.getElementById('gender').innerText += human.gender;
document.getElementById('age').innerText += human.age;
document.getElementById('calories').innerText += human.calories;

function sleepFor() {
  human.sleepFor();
}

function feed() {
  human.feed();
}

function showMessage(message, seconds) {
  const messageContainer = document.getElementById('messageContainer');
  const newMessage = document.createElement('p');
  newMessage.textContent = message;
  messageContainer.appendChild(newMessage);

  setTimeout(() => {
    messageContainer.removeChild(newMessage);
  }, seconds * 1000);
}

function turnIntoSuperhero() {
  if (human.calories > 500) {
    human = new Superhero(human.firstName, human.lastName, human.gender, human.age);
    document.getElementById('container').innerHTML = `
	<img src="assets/images/superhero.png" alt="Superhero Image">
	 <div id="properties">
      <h2>Superhero</h2>
      <ul>
        <li id="firstName">First Name: ${human.firstName}</li>
        <li id="lastName">Last Name: ${human.lastName}</li>
        <li id="gender">Gender: ${human.gender}</li>
        <li id="age">Age: ${human.age}</li>
        <li id="calories">Calories: ${human.calories}</li>
		<li>Can Raise Thor's Hammer: ${human.canRaiseThorsHammer}</li>
      </ul>
      <button onclick="sleepFor()">Sleep</button>
      <button onclick="feed()">Feed</button>
      <button onclick="human.fly()">Fly</button>
      <button onclick="human.fightWithEvil()">Fight with Evil</button>
	  </div>
    `;
  }
}
