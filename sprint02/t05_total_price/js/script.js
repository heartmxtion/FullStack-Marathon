function total(addCount, addPrice, currentTotal = 0) {
  const newTotal = currentTotal + addCount * addPrice;
  return Number.parseFloat(newTotal.toFixed(2));
}