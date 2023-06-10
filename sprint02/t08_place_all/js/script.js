function sortEvenOdd(arr) {
  // Separate even and odd numbers
  const evens = arr.filter(num => num % 2 === 0);
  const odds = arr.filter(num => num % 2 === 1);

  // Sort even and odd numbers separately
  evens.sort((a, b) => a - b);
  odds.sort((a, b) => a - b);

  // Combine the sorted even and odd numbers
  arr.length = 0;
  arr.push(...evens, ...odds);
}