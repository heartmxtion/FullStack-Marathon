const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const pool = require('./db');
const expressThymeleaf = require('express-thymeleaf');
const {TemplateEngine} = require('thymeleaf');
const templateEngine = new TemplateEngine();
const PORT = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const path = require('path');
const admins = [];
const app = express();
const User = require('./models/user');
const session = require('express-session');

app.use('/public', express.static(path.join(path.resolve(), '/public')));
app.use(express.static('public'));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve() + '/public');
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

app.post('/exit', (req, res) => {
	req.session.destroy();
	res.redirect('/');
});

app.post('/login', async (req, res) => {
	if (!req.body){
        res.redirect('/');
    }
	const { login, password } = req.body;
	try {
		await allLogin();
		let roles = 'User';
		const currentUser = new User();
		currentUser.find(login);
		setTimeout(() => {
			if (currentUser.login === login && isCorrectPass(password, currentUser.password)){
				if (admins.includes(login)){
					roles = 'Admin';
				}
				admins.length = 0;
				req.session.user = { login, roles };
				res.render('user-account', { login, roles });
				return;
			}
			res.render('index', {
				errorLogin: 'Login or password is incorrect',
				errorL: 'alert alert-danger'
			});
		}, 10);
    } catch (error) {
        console.error(error);
        return res.render('index', {
            error: 'An error occurred. Please try again later.',
            errorClass: 'alert alert-danger'
        });
    }
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const allLogin = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT user_login FROM admins', (err, res) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            res.map(({ user_login }) => admins.push(user_login));
            resolve();
        });
    });
};
const isCorrectPass = (pass, hash) => bcrypt.compareSync(pass, hash);
