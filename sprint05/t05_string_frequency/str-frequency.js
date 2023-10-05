class StrFrequency {
	constructor(inputStr) {
		this.inputStr = inputStr;
	}

	letterFrequencies() {
		const letterFreq = {};

		for (const char of this.inputStr) {
			const upperCaseChar = char.toUpperCase();
			if (char.match(/[a-zA-Z]/)) {
				if (letterFreq[upperCaseChar]) {
					letterFreq[upperCaseChar]++;
				} else {
				letterFreq[upperCaseChar] = 1;
			}
		}
	}

		return letterFreq;
	}

	wordFrequencies() {
		const wordFreq = {};
		const words = this.inputStr.toUpperCase().match(/\b(?![0-9]+\b)\w+\b/g);

		if (words) {
			for (const word of words) {
				if (wordFreq[word]) {
					wordFreq[word]++;
				} else {
					wordFreq[word] = 1;
				}
			}
		} else {
			if (this.inputStr.trim() === "") {
				wordFreq[""] = 1;
			} else {
				wordFreq[this.inputStr.trim()] = 1;
			}
		}

		return wordFreq;
	}
	reverseString() {
		return this.inputStr.split('').reverse().join('');
	}
}

module.exports = StrFrequency;
