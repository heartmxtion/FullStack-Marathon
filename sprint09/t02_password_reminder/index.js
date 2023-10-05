const express = require('express');
const session = require('express-session');
const expressThymeleaf = require('express-thymeleaf');
const nodemailer = require('nodemailer');
const path = require('path');
const { TemplateEngine } = require('thymeleaf');
const pool = require('./db.js');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const User = require('./models/user.js');
const PORT = process.env.PORT || 3000;

const app = express();
const templateEngine = new TemplateEngine();
const emails = [];
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

app.get('/', (req, res) => {
  	res.render('index');
});

app.post('/exit', (req, res) => {
  	res.redirect('/');
});

app.get('/reminder-password', (_, res) => {
  	getEmails();
  	res.render('form-reminder');
});

app.post('/push-message', async (req, res) => {
	const email = req.body.email;
	if (!emails.includes(email))
	{
		res.render('form-reminder', {
			errorClass: 'alert alert-danger text-center',
			errorMass: 'Email not found'
		});
		return;
	}
	const newPass = shortid.generate();
	const currentUser = new User();
	currentUser.find(email);
	setTimeout(() => {
		currentUser.password = setHash(newPass);
		currentUser.update = true;
		currentUser.save();
		main(email, currentUser, newPass).catch(console.error);
		res.render('index', {
		confirmClass: 'alert alert-success',
		confirmMass: 'Password has been sent by email',
		});
	}, 100);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});


const getEmails = async () => {
	const [result, _] = await pool.promise().query('SELECT email FROM users;');
	result.map(({ email }) => emails.push(email));
};

const main = async (email, { login, ..._ }, password) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		auth: {
		user: 'hassan.spinka69@ethereal.email',
		pass: 'sV8mHmBzw4DqABRRE6'
		},
	});

	let info = await transporter.sendMail({
		from: '"vchybirev" <vchybirev@gmail.com>',
		to: email,
		subject: 'Reset password',
		html:
			`<h1>Reset password</h1>
			<br>
			<p>Login: ${login}</p>
			<p>Password: ${password}</p>`
	});
};

const setHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(Math.floor(Math.random() * (10 - 1 + 1)) + 1));
};
