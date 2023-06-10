function checkBrackets(str) {
  if (typeof str !== 'string' || !str.includes('(') || !str.includes(')')) {
    return -1;
  }

  let count = 0;
  let openBrackets = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') {
      openBrackets++;
    } else if (str[i] === ')') {
      if (openBrackets === 0) {
        count++;
      } else {
        openBrackets--;
      }
    }
  }

  return count + openBrackets;
}

// Export the checkBrackets function for testing purposes
if (typeof module !== 'undefined') {
  module.exports = {
    checkBrackets
  };
}