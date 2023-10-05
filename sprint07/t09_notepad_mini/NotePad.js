const Note = require('./Note');

class NotePad {
	constructor() {
		this.notes = [];
	}

	addNote(name, importance, content) {
		const note = new Note(name, importance, content);
		this.notes.push(note);
	}

	deleteNote(name) {
		this.notes = this.notes.filter(note => note.name !== name);
	}

	getNotes() {
		return this.notes;
	}
}

module.exports = NotePad;