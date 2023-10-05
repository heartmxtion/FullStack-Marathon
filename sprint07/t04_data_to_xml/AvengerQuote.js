class AvengerQuote {
	constructor({ id, author, quote, photo, publishDate, comments }) {
		this.id = id;
		this.author = author;
		this.quote = quote;
		this.photo = photo;
		this.publishDate = publishDate;
		this.comments = comments;
	}
}

module.exports = {AvengerQuote};
