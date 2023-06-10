function concat(string1, string2) {
  let count = 0;

  function func1() {
    count++;
    let input = prompt("Enter the second string:");
    return string1 + " " + input;
  }

  func1.count = function() {
    return count;
  };

  return typeof string2 === 'undefined' ? func1 : string1 + " " + string2;
}