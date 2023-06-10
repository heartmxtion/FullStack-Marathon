function checkDivision(beginRange = "1", endRange = "100") {
  for (let i = beginRange; i <= endRange; i++) {
    let description = "";
    if (i % 2 === 0) {
      description += "even";
      if (i % 3 === 0 || i % 10 === 0) {
        description += ", ";
      }
    }
    if (i % 3 === 0) {
      description += "a multiple of 3";
      if (i % 10 === 0) {
        description += ", ";
      }
    }
    if (i % 10 === 0) {
      description += "a multiple of 10";
    }
    console.log(i + " - " + (description || "-"));
  }
}

const beginRange = prompt("Enter the beginning of the range:", "1");
const endRange = prompt("Enter the end of the range:", "100");

checkDivision(beginRange, endRange);