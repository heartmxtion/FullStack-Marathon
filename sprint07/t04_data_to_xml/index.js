const express = require('express');
const session = require('express-session');
const expressThymeleaf = require('express-thymeleaf');
const path = require('path');
const { TemplateEngine } = require('thymeleaf');
const { ListAvengerQuotes } = require('./ListAvengerQuotes.js');
const { data } = require('./TestData.js');

const app = express();
const PORT = process.env.PORT || 3000;
const templateEngine = new TemplateEngine();
app.use('/js', express.static(path.resolve(__dirname)));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
	session({
		name: 'dataToXML',
		secret: 'secret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 6000000,
		},
	})
);

app.get('/', (req, res) => {
	res.render('index');
});

app.get('/script.js', (req, res) => {
	res.sendFile(__dirname + '/script.js');
});


app.get('/XML', (req, res) => {
	const com = new ListAvengerQuotes(data);
	const fromXML = com.fromXML();
	const toXML = com.toXML();
	res.send({ to: toXML, from: fromXML });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
