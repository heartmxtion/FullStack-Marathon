const express = require('express');
const session = require('express-session');
const expressThymeleaf = require('express-thymeleaf');
const { TemplateEngine } = require('thymeleaf');
const path = require ('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const templateEngine = new TemplateEngine();
app.use(express.static(path.resolve() + '/'));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		name: 'marvelAPI',
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
	})
);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/api', async (req, res) => {
	const PRIVATE_KEY = process.env.PRIVATE_KEY || '1ce90d19357a7fd9661c581d425bbb4685318902';
	const PUBLIC_KEY = process.env.PUBLIC_KEY || '2a8bbc74512533cdd1f1f3dbdd545abc';
	const ts = Date.now();
	const hashKey = crypto.createHash('md5').update(ts + PRIVATE_KEY + PUBLIC_KEY).digest('hex');
	const response = await import('node-fetch');
	const data = await response.default(`http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hashKey}`).then((response) => response.json());
	res.json(data);
});