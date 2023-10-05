const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', (req, res) => {
	const answers = req.body;

	let correctCount = 0;

	if (answers.q1 === 'correct') {
		correctCount++;
	}

	if (answers.q2 === 'correct') {
		correctCount++;
	}

	if (correctCount === 2) {
		res.send('Congratulations! You answered all questions correctly!');
	} else {
		res.send(`You got ${correctCount} out of 2 questions correct. Keep trying!`);
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
