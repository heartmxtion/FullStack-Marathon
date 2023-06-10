// Initialize guestList
const guestList = new Set();

// Add guests to the list
guestList.add("John");
guestList.add("Alice");
guestList.add("Emily");
guestList.add("David");

// Check if a guest is on the list
console.log(guestList.has("Alice")); // Output: true
console.log(guestList.has("Mark")); // Output: false

// Remove a guest from the list
guestList.delete("David");

// Iterate over the guestList
guestList.forEach(guest => console.log(guest));

// Get the size of the guestList
console.log(guestList.size); // Output: 3

// Initialize menu
const menu = new Map();

// Add dishes to the menu
menu.set("Pizza", 10);
menu.set("Burger", 8);
menu.set("Salad", 6);
menu.set("Pasta", 12);
menu.set("Steak", 20);

// Get the price of a specific dish
console.log(menu.get("Pizza")); // Output: 10

// Iterate over the menu
menu.forEach((price, dish) => console.log(`${dish}: $${price}`));

// Get the size of the menu
console.log(menu.size); // Output: 5

// Initialize bankVault
const bankVault = new WeakMap();

// Create credentials for a box
const box1Credentials = { pin: "1234", code: "heartmxtion" };

// Add box and its contents to the vault
bankVault.set(box1Credentials, "Diamonds");

// Retrieve contents of a box by providing correct credentials
console.log(bankVault.get(box1Credentials)); // Output: Diamonds

// Remove the reference to the credentials
// No need for null assignment in the case of WeakMap

// Wait for garbage collection to occur
setTimeout(() => {
  // Retrieve contents of a box (should be undefined since the box has been garbage collected)
  console.log(bankVault.get(box1Credentials)); // Output: undefined
}, 1000);

const coinCollection = new WeakSet();
const coins = {
  coin1: { name: "Quarter", year: 1965 },
  coin2: { name: "Dime", year: 1978 },
  coin3: { name: "Penny", year: 2000 },
  coin4: { name: "Nickel", year: 1992 },
  coin5: { name: "Half Dollar", year: 2010 }
};

// Добавление элементов в коллекцию
Object.values(coins).forEach((coin) => coinCollection.add(coin));

// Использование методов коллекции
console.log(coinCollection.has(coins.coin2)); // true
console.log(coinCollection.has({ name: "Quarter", year: 1965 })); // false

Object.keys(coins).forEach((key) => {
  const coin = coins[key];
  console.log(coin);
});

console.log(coinCollection.size); // undefined