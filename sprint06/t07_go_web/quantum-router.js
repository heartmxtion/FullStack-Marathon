function calculateTime() {
	let startDate = new Date(1939, 0, 1);
	let now = new Date();

	let normalYears = now.getFullYear() - startDate.getFullYear();
	let normalMonths = now.getMonth() - startDate.getMonth();
	let normalDays = now.getDate() - startDate.getDate();

	let quantumYears = Math.floor(normalYears / 7);
	let quantumMonths = Math.floor(normalMonths / 7);
	let quantumDays = Math.floor(normalDays / 7);

	return [quantumYears, quantumMonths, quantumDays];
}

module.exports = {calculateTime};
