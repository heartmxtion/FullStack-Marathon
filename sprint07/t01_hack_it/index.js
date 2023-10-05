const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/checkPassword', (req, res) => {
	const guess = req.body.guess;
	const originalPassword = req.body.savedData.password;
	if (guess === originalPassword) {
		res.json({ authenticated: true });
	} else {
		res.json({ authenticated: false });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});