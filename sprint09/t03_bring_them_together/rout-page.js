const shortid = require('shortid');
const pool = require('./db.js');
const bcrypt = require('bcrypt');
const express = require('express');
const User = require('./models/user.js');
const sendMassage = require('./send-massage.js');

const admins = [];
const logins = [];
const emails = [];

function getAdmins() {
	pool.query('SELECT user_login FROM admins', (err, res) => {
		if (err) {
			return;
		}
		res.map(({ user_login }) => admins.push(user_login));
	});
};

function getAllData() {
	pool.query('SELECT login, email FROM users', (err, res) => {
		if (err) {
			console.error(err);
			return;
		}
		res.map(({ login }) => logins.push(login));
		res.map(({ email }) => emails.push(email));
	});
};

async function getEmails() {
	const [result, _] = await pool.promise().query('SELECT email FROM users;');
	result.map(({ email }) => emails.push(email));
};

function setHash(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(Math.floor(Math.random() * (10 - 1 + 1)) + 1));
};

const isCorrectPass = (pass, hash) => bcrypt.compareSync(pass, hash);

function mainPage(app) {
	app.get('/', (req, res) => {
		if (req.session.user) {
			res.render('user-account', {
				login: req.session.user.login,
				roles: req.session.user.roles,
			});
			return;
		}
		res.render('index');
	});
};

function registerPage(app) {
	app.get('/register', (req, res) => {
		if (req.session.user) {
			res.render('user-account', {
				login: req.session.user.login,
				roles: req.session.user.roles,
			});
			return;
		}
		getAllData();
		res.render('register');
	});

	app.post('/register', async (req, res) => {
		const { login, full_name, email, password, password_confirmation, admin } = req.body;

		if (logins.includes(login)) {
			res.render('register', {
				errorLogin: 'User with this login already exists',
				errorL: 'alert alert-danger',
			});
		} else if (emails.includes(email)) {
			res.render('register', {
				errorEmail: 'User with this email already exists',
				errorE: 'alert alert-danger',
			});
		} else if (password !== password_confirmation) {
			res.render('register', {
				errorPass: 'Incorrectly entered password!',
				errorP: 'alert alert-danger',
			});
		} else {
			const hashPass = setHash(password);
			const userCreate = new User(login, full_name, email, hashPass, admin);
			userCreate.save();
			setTimeout(() => {
				logins.length = 0;
				emails.length = 0;
				res.render('user-account', {
				login: userCreate.login,
				roles: userCreate.role,
				});
			}, 100);
		}
	});
};
function loginPage(app) {
	app.get('/login', (req, res) => {
		if (req.session.user) {
			res.render('user-account', {
				login: req.session.user.login,
				roles: req.session.user.roles,
			});
			return;
		}
		getAllData();
		res.render('login');
	});
	
	app.post('/login', async (req, res) => {
		getAdmins();
		const { login, password } = req.body;
		let roles = 'User';
		const currentUser = new User();
		currentUser.param = 'login';
		currentUser.find(login);
		setTimeout(() => {
			if (currentUser.login === login &&isCorrectPass(password, currentUser.password)) {
				if (admins.includes(login))
				{
					roles = 'Admin';
				}
				admins.length = 0;
				req.session.user = { login, roles };
				res.render('user-account', { login, roles });
				return;
			}
			res.render('login', {
				errorMass: 'Login or password is incorrect',
				errorM: 'alert alert-danger',
			});
		}, 10);
	});
};

function resetPage(app) {
	app.get('/reminder-password', (req, res) => {
		if (req.session.user) {
			res.render('user-account', {
				login: req.session.user.login,
				roles: req.session.user.roles,
			});
			return;
		}
		getEmails();
		res.render('reminder');
	});

	app.post('/push-message', async (req, res) => {
		const email = req.body.email;
		if (!emails.includes(email)) {
			res.render('reminder', {
				errorClass: 'alert alert-danger text-center',
				errorMass: 'Email not found',
			});
			return;
		}
		const newPass = shortid.generate();
		const currentUser = new User();
		currentUser.param = 'email';
		currentUser.find(email);
		setTimeout(() => {
			currentUser.password = setHash(newPass);
			currentUser.update = true;
			currentUser.save();
			sendMassage(email, currentUser, newPass).catch(console.error);
			res.render('index', {
				confirmClass: 'alert alert-success',
				confirmMass: 'Check your email',
			});
		}, 100);
	});
};

function userPage(app) {
	app.get('/account', (req, res) => {
		if (!req.session.user) {
			res.redirect('/');
		}
		res.render('user-account');
	});

	app.post('/exit', (req, res) => {
		req.session.destroy();
		res.render('index', {
			massageExit: 'End',
		});
	});
};


function routPages(app) {
	mainPage(app);
	registerPage(app);
	loginPage(app);
	resetPage(app);
	userPage(app);
};

module.exports = {routPages};