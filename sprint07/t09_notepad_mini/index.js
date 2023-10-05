const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.'));

let notes = [];

app.get('/notes', (req, res) => {
	res.json(notes);
});

app.post('/notes', (req, res) => {
	const note = {
		id: uuidv4(),
		name: req.body.name,
		importance: req.body.importance,
		content: req.body.content,
		date: new Date()
	};
	notes.push(note);
	fs.writeFileSync('package.json', JSON.stringify(notes));
	res.json(note);
});

app.delete('/notes/:id', (req, res) => {
	notes = notes.filter(note => note.id !== req.params.id);
	fs.writeFileSync('package.json', JSON.stringify(notes));
	res.json({ message: 'Note deleted' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
