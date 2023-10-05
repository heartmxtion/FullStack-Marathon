const express = require('express');
const session = require('express-session');
const expressThymeleaf = require('express-thymeleaf');
const path = require('path');
const { TemplateEngine } = require('thymeleaf');
const { routPages } = require('./rout-page.js');

const PORT = process.env.PORT || 3000;

const app = express();
const templateEngine = new TemplateEngine();

app.use('/public', express.static(path.join(path.resolve(), '/public')));
app.use(express.static('public'));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve() + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		name: 'sprint09',
		secret: 'vchybirev',
		resave: false,
		saveUninitialized: true,
	})
);

routPages(app);
app.all('*', (req, res) => {
  	res.status(404).render('page-404');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

