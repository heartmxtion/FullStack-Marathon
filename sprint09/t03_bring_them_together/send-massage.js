const nodemailer = require('nodemailer');

async function sendMessage(email, { login, ..._ }, password) {
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

module.exports = sendMessage;