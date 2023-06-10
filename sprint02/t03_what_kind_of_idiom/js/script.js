let inputNum;
let isValidInput = false;

do {
  inputNum = prompt("Please enter a number from 1 to 10:");
  
  if (inputNum !== null && Number(inputNum) >= 1 && Number(inputNum) <= 10) {
    isValidInput = true;
  }
} while (!isValidInput);

switch(Number(inputNum)) {
  case 1:
    alert("Back to square 1");
    break;
  case 2:
    alert("Goody two-shoes");
    break;
  case 3:
  case 6:
    alert("Two's company, three's a crowd");
    break;
  case 4:
  case 9:
    alert("Counting sheep");
    break;
  case 5:
    alert("Take five");
    break;
  case 7:
    alert("Seventh heaven");
    break;
  case 8:
    alert("Behind the eight-ball");
    break;
  case 10:
    alert("Cheaper by the dozen");
    break;
}
