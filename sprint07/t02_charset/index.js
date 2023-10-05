const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
	res.sendFile('index.html');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
