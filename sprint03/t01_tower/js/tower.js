'use strict';

class Building {
  constructor(floors, material, address) {
    this.floors = floors;
    this.material = material;
    this.address = address;
    this.hasElevator = false;
    this.arcCapacity = 0;
    this.height = 0;
  }

  toString() {
    return `
      Floors: ${this.floors}
      Material: ${this.material}
      Address: ${this.address}
      Elevator: ${this.hasElevator ? '+' : '-'}
      Arc reactor capacity: ${this.arcCapacity}
      Height: ${this.height}
      Floor height: ${this.getFloor()}
    `;
  }

  getFloor() {
    return this.height / this.floors;
  }
}

class Tower extends Building {
  constructor(floors, material, address) {
    super(floors, material, address);
  }
}

/*
const starkTower = new Tower(93, 'Different', 'Manhattan, NY');
starkTower.hasElevator = true;
starkTower.arcCapacity = 70;
starkTower.height = 1130;
console.log(starkTower.toString());
*/