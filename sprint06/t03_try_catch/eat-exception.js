class EatException extends Error {
	constructor(message) {
		super(message);
		this.name = 'EatException';
	}
}

module.exports = { EatException };