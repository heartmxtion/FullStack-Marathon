const LLData = require('./LLData');

class LList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	add(value) {
		const newData = new LLData(value);

		if (!this.head) {
			this.head = newData;
			this.tail = newData;
		} else {
			this.tail.next = newData;
			this.tail = newData;
		}
	}

	addFromArray(arrayOfData) {
		arrayOfData.forEach(value => this.add(value));
	}

	remove(value) {
		if (!this.head) return;

		if (this.head.data === value) {
			this.head = this.head.next;
			if (!this.head) this.tail = null;
			return;
		}

		let current = this.head;
		while (current.next) {
			if (current.next.data === value) {
				current.next = current.next.next;
				if (!current.next) this.tail = current;
				return;
			}
			current = current.next;
		}
	}

	removeAll(value) {
		while (this.head && this.head.data === value) {
			this.head = this.head.next;
			if (!this.head) this.tail = null;
		}

		if (!this.head) return;

		let current = this.head;
		while (current.next) {
			if (current.next.data === value) {
				current.next = current.next.next;
				if (!current.next) this.tail = current;
			} else {
				current = current.next;
			}
		}
	}

	contains(value) {
		let current = this.head;
		while (current) {
			if (current.data === value) {
				return true;
			}
			current = current.next;
		}
		return false;
	}

	clear() {
		this.head = null;
		this.tail = null;
	}

	count() {
		let count = 0;
		let current = this.head;
		while (current) {
			count++;
			current = current.next;
		}
		return count;
	}

	toString() {
		const result = [];
		let current = this.head;
		while (current) {
			result.push(current.data);
			current = current.next;
		}
		return result.join(', ');
	}

	*[Symbol.iterator]() {
		let current = this.head;
		while (current) {
			yield current.data;
			current = current.next;
		}
	}

	filter(callback) {
		const newList = new LList();
		let current = this.head;
		while (current) {
			if (callback(current.data)) {
				newList.add(current.data);
			}
			current = current.next;
		}
		return newList;
	}
}

module.exports = {LList};
