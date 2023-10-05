const express = require('express');
const expressThymeleaf = require('express-thymeleaf');
const { TemplateEngine } = require('thymeleaf');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

const app = express();
const templateEngine = new TemplateEngine();

app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use(express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'secretKey', resave: true, saveUninitialized: true }));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
	const heroData = req.session.heroData || {};

	if (Object.keys(heroData).length === 0) {
		res.render('index');
	} else {
		res.render('heroData', { heroData });
	}
});

app.post('/', (req, res) => {
	const getValue = (key) => (req.body[key] === '' ? 'NONE' : req.body[key]);

	const heroData = {
		name: getValue('name'),
		email: getValue('email'),
		age: getValue('age'),
		description: getValue('description'),
		photo: getValue('photo'),
	};

	req.session.heroData = heroData;

	res.render('heroData', { heroData });
});

app.post('/clear', (req, res) => {
	req.session.heroData = {};
	res.redirect('/');
});
