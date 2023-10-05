const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const { Comment } = require('./Comment.js');
const { AvengerQuote } = require('./AvengerQuote.js');

class ListAvengerQuotes {
	constructor(data) {
		this.data = this.init(data);
	}

	init(data) {
		return data.map(value => new Comment(new AvengerQuote(value)));
	}

	toXML() {
		const pathFile = path.resolve(__dirname, 'avenger_quote.xml');
		if (fs.existsSync(pathFile)) {
			return fs.readFileSync(pathFile, 'utf-8');
		}
		const builder = new xml2js.Builder();
		const toXML = builder.buildObject({ quotes: this.data });
		fs.writeFileSync(pathFile, toXML);
		return toXML;
	}

	fromXML() {
		const pathFile = path.resolve(__dirname, 'avenger_quote.xml');
		return fs.readFileSync(pathFile, 'utf-8');
	}

}

module.exports = {ListAvengerQuotes};
