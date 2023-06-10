// Prompt the user to enter input
var animal = prompt("What animal is the superhero most similar to?");
var gender = prompt("Is the superhero male or female? Leave blank if unknown or other.");
var age = prompt("How old is the superhero?");

// Define regular expressions for input validation
var animalRegex = /^[a-zA-Z]{1,20}$/;
var genderRegex = /^(male|female|)$/i;
var ageRegex = /^([1-9]\d{0,4})$/;

// Check input for validity using regular expressions
if (!animalRegex.test(animal) || !genderRegex.test(gender) || !ageRegex.test(age)) {
  alert("Invalid input. Please try again.");
} else {
// Generate superhero description based on gender and age
  var description;
  if (gender.toLowerCase() === "male") {
    if (age < 18) {
      description = "boy";
    } else {
      description = "man";
    }
  } else if (gender.toLowerCase() === "female") {
      if (age < 18) {
        description = "girl";
      } else {
        description = "woman";
      }
    } else {
    if (age < 18) {
      description = "kid";
    } else {
      description = "hero";
    }
  }

// Display superhero name
  var superheroName = animal + "-" + description;
  alert("The superhero name is: " + superheroName + "!");
}