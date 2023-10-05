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

const app = express();
const User = require('./models/user');

const logins = [];
const emails = [];

app.use('/public', express.static(path.join(path.resolve(), '/public')));
app.use(express.static('public'));
app.engine('html', expressThymeleaf(templateEngine));
app.set('view engine', 'html');
app.set('views', path.resolve() + '/public');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
    if (!req.body){
        res.redirect('/');
    }
    const { login, full_name, email, password, password_confirmation } = req.body;
    try {
        await allLogin();
        if (logins.includes(login)){
            return res.render('index', {
                errorLogin: 'User with this login already exists',
                errorL: 'alert alert-danger'
            });
        } else if (emails.includes(email)){
            return res.render('index', {
                errorEmail: 'User with this email already exists',
                errorE: 'alert alert-danger'
            });
        } else if (password !== password_confirmation){
            return res.render('index', {
                errorPass: 'Incorrectly entered password!',
                errorP: 'alert alert-danger'
            });
        }

        const hashPass = setHash(password);
        const userCreate = new User(login, full_name, email, hashPass);
        userCreate.save();
        logins.length = 0;
        emails.length = 0;

        return res.render('index', {
            completeClass: 'alert alert-success',
            completeMess: 'Registration complete!'
        });
    } catch (error) {
        console.error(error);
        return res.render('index', {
            error: 'An error occurred. Please try again later.',
            errorClass: 'alert alert-danger'
        });
    }
});

const allLogin = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT login, email FROM users', (err, res) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            res.map(({ login }) => logins.push(login));
            res.map(({ email }) => emails.push(email));
            resolve();
        });
    });
};


const setHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(Math.floor(Math.random() * (10 - 1 + 1)) + 1));
};

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
