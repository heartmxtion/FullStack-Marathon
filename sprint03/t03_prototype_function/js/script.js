String.prototype.removeDuplicates = function() {
  // Remove extra spaces between and around words
  let trimmedStr = this.replace(/\s+/g, ' ').trim();

  // Split the string into an array of words
  let words = trimmedStr.split(' ');

  // Remove duplicates
  let uniqueWords = [];
  for (let i = 0; i < words.length; i++) {
    if (uniqueWords.indexOf(words[i]) === -1) {
      uniqueWords.push(words[i]);
    }
  }

  // Join the unique words back into a string
  let result = uniqueWords.join(' ');

  return result;
};


/*let str = "Giant Spiders?   What’s next? Giant Snakes?";
console.log(str); // Giant Spiders?   What’s next? Giant Snakes?

str = str.removeDuplicates();
console.log(str); // Giant Spiders? What’s next? Snakes?

str = str.removeDuplicates();
console.log(str); // Giant Spiders? What’s next? Snakes?

str = ". . . . ? . . . . . . . . . . . ";
console.log(str); // . . . . ? . . . . . . . . . . .

str = str.removeDuplicates();
console.log(str); // . ?
*/