const express = require('express');
const session = require('express-session');
const expressThymeleaf = require('express-thymeleaf');
const { TemplateEngine } = require('thymeleaf');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const templateEngine = new TemplateEngine();
app.use('/js', express.static(path.resolve(__dirname)));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	})
)

app.get('/', async (req, res) => {
	const URL = req.query.url;
	let urlContent = 'Type a URL...';

	if (URL) {
		try {
			const got = await import('got');
			const response = await got.default(URL);
			const cheer = await import('cheerio');
			const cheerio = await cheer.default.load(response.body);
			urlContent = cheerio('body').html().trim();
		} catch (error) {
			console.error('Error fetching URL:', error.message);
		}
	}

	res.render('index', { url: urlContent, urlName: URL || '' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
