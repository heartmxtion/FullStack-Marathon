const validator = {
  get(target, property) {
    console.log(`Trying to access the property '${property}'...`);
    if (property in target) {
      return target[property];
    } else {
      return false;
    }
  },
  set(target, property, value) {
    console.log(`Setting value '${value}' to '${property}'`);
    if (property === "age") {
      if (typeof value !== "number" || !Number.isInteger(value)) {
        throw new TypeError("The age is not an integer");
      }
      if (value < 0 || value > 200) {
        throw new RangeError("The age is invalid");
      }
    }
    target[property] = value;
    return true;
  }
};

/*let person = new Proxy({}, validator);
person.age = 100;
// Setting value '100' to 'age'
console.log(person.age);
// Trying to access the property 'age'...
// 100

person.gender = "male";
// Setting value 'male' to 'gender'

person.age = 'young';
// Uncaught TypeError: The age is not an integer

person.age = 300;
// Uncaught RangeError: The age is invalid
*/