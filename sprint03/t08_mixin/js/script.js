// houseMixin
const houseMixin = {
  wordReplace(wordToReplace, newWord) {
    this.description = this.description.replace(wordToReplace, newWord);
  },
  wordInsertAfter(wordToFind, wordToInsert) {
    this.description = this.description.replace(
      wordToFind,
      wordToFind + " " + wordToInsert
    );
  },
  wordDelete(wordToDelete) {
    this.description = this.description.replace(wordToDelete, "");
  },
  wordEncrypt() {
    this.description = this.description.replace(/[A-Za-z]/g, (char) => {
      let encryptedChar = char.charCodeAt(0) + 13;
      if (
        (char <= "Z" && encryptedChar > "Z".charCodeAt(0)) ||
        (char <= "z" && encryptedChar > "z".charCodeAt(0))
      ) {
        encryptedChar -= 26;
      }
      return String.fromCharCode(encryptedChar);
    });
  },
  wordDecrypt() {
    this.description = this.description.replace(/[A-Za-z]/g, (char) => {
      let decryptedChar = char.charCodeAt(0) - 13;
      if (
        (char >= "A" && decryptedChar < "A".charCodeAt(0)) ||
        (char >= "a" && decryptedChar < "a".charCodeAt(0))
      ) {
        decryptedChar += 26;
      }
      return String.fromCharCode(decryptedChar);
    });
  },
};

/*// Example usage:
const house = new HouseBuilder(
  '88 Crescent Avenue',
  'Spacious town house with wood flooring, 2-car garage, and a back patio.',
  'J. Smith',
  110,
  5
);

Object.assign(house, houseMixin);

console.log(house.getDaysToBuild()); // 220
console.log(house.description); // Spacious town house with wood flooring, 2-car garage, and a back patio.

house.wordReplace("wood", "tile");
console.log(house.description); // Spacious town house with tile flooring, 2-car garage, and a back patio.

house.wordDelete("town ");
console.log(house.description); // Spacious house with tile flooring, 2-car garage, and a back patio.

house.wordInsertAfter("with", "marble");
console.log(house.description); // Spacious house with marble tile flooring, 2-car garage, and a back patio.

house.wordEncrypt();
console.log(house.description); // Fcnpvbhf ubhfr jvgu zneoyr gvyr sybbevat, 2-pne tnentr, naq n onpx cngvb.

house.wordDecrypt();
console.log(house.description); // Spacious house with marble tile flooring, 2-car garage, and a back patio.
*/