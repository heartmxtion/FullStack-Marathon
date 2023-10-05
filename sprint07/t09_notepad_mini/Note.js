class Note {
	constructor(name, importance, content) {
		this.name = name;
		this.importance = importance;
		this.content = content;
		this.date = new Date();
	}
}

module.exports = Note;