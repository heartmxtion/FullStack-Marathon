function checkDivision(num1 = 1, num2 = 60) {
  for (let i = num1; i <= num2; i++) {
    let message = `The number ${i} is`;
    
    if (i % 2 === 0) {
      message += " divisible by 2";
    }
    
    if (i % 3 === 0) {
      if (message !== `The number ${i} is`) {
        message += ",";
      }
      message += " divisible by 3";
    }
    
    if (i % 10 === 0) {
      if (message !== `The number ${i} is`) {
        message += ",";
      }
      message += " divisible by 10";
    }

    if (message === `The number ${i} is`) {
      message += " -";
    }

    console.log(message);
  }
}

module.exports = { checkDivision };
