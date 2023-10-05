const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.use(cookieParser());

app.get('/', (req, res) => {
	let pageLoadCount = parseInt(req.cookies.pageLoadCount) || 0;
	pageLoadCount++;
	res.cookie('pageLoadCount', pageLoadCount, { maxAge: 60000 });

	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
