// houseBlueprint prototype
const houseBlueprint = {
  address: '',
  date: new Date(),
  description: '',
  owner: '',
  size: 0,
  getDaysToBuild() {
    return this.size * 2;
  },
};

// houseBuilder constructor
function HouseBuilder(address, description, owner, size, roomCount) {
  this.address = address;
  this.description = description;
  this.owner = owner;
  this.size = size;
  this.roomCount = roomCount;
}

// Set houseBlueprint as the prototype for houseBuilder
HouseBuilder.prototype = houseBlueprint;

/*// Example usage:
const house = new HouseBuilder(
  '88 Crescent Avenue',
  'Spacious town house with wood flooring, 2-car garage, and a back patio.',
  'J. Smith',
  110,
  5
);

console.log(house.address);
console.log(house.description);
console.log(house.size);
console.log(house.date.toDateString());
console.log(house.owner);
console.log(house.getDaysToBuild());
console.log(house.roomCount);
*/