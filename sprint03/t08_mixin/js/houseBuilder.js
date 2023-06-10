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