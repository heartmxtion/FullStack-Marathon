class Access {
	constructor() {
		this._mark_LXXXV = undefined;
	}

	get mark_LXXXV() {
		if (this._mark_LXXXV === undefined) {
			return 'undefined';
		} else if (this._mark_LXXXV === null) {
			return 'null';
		} else {
			return this._mark_LXXXV;
		}
	}

	set mark_LXXXV(value) {
		this._mark_LXXXV = value;
	}
}

module.exports = Access;
