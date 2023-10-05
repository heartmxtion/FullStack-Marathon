const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./'));

const storage = multer.diskStorage({
	destination: 'upload/',
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
	let results = [];
	const csvFilePath = `upload/${req.file.filename}`;
	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on('data', (row) => {
			results.push(row);
		})
		.on('end', () => {
			res.send(results);
		});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});