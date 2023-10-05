function firstUpper(inputString) {
  if (inputString === null || inputString === "") {
    return "";
  }

  const trimmedString = inputString.trim();

  const resultString = trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1).toLowerCase();

  return resultString;
}

module.exports = { firstUpper };
