const express = require('express');
const app = express();
const Jimp = require('jimp');
const path = require('path');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/process', async (req, res) => {
	const imageUrl = req.body.imageUrl;
	const image = await Jimp.read(imageUrl);
	const { width, height } = image.bitmap;
	const size = Math.min(width, height);
	const x = width > size ? (width - size) / 2 : 0;
	const y = height > size ? (height - size) / 2 : 0;

	image.crop(x, y, size, size);

	const rImage = image.clone().greyscale().contrast(1);
	const gImage = image.clone().greyscale().contrast(1);
	const bImage = image.clone().greyscale().contrast(1);

	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, i) {
		rImage.bitmap.data[i + 1] = 0;
		rImage.bitmap.data[i + 2] = 0;

		gImage.bitmap.data[i] = 0;
		gImage.bitmap.data[i + 2] = 0;

		bImage.bitmap.data[i] = 0;
		bImage.bitmap.data[i + 1] = 0;
	});

	const finalImage = new Jimp(size * 2, size * 2);
	finalImage.composite(image, 0, 0);
	finalImage.composite(rImage, size, 0);
	finalImage.composite(gImage, 0, size);
	finalImage.composite(bImage, size, size);

	const MAX_SIZE = 900;
	if (finalImage.bitmap.width > MAX_SIZE || finalImage.bitmap.height > MAX_SIZE) {
		finalImage.scaleToFit(MAX_SIZE, MAX_SIZE);
	}

	finalImage.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
		if (err) throw err;
		res.send(buffer.toString('base64'));
	});
});

app.get('/style.css', (req, res) => {
	res.sendFile(__dirname + '/style.css');
});

app.get('/script.js', (req, res) => {
	res.sendFile(__dirname + '/script.js');
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});