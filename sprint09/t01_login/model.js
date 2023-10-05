const mysql = require('./db.js');

module.exports = class Model {
	constructor(login, full_name, email, password) {
		this.id = 0;
		this.login = login;
		this.full_name = full_name;
		this.email = email;
		this.password = password;
	}

	async find(login) {
		const [result, _] = await mysql.promise().query('SELECT * FROM users WHERE login =?', login);
		try {
			this.id = result[0].id;
			this.login = result[0].login;
			this.full_name = result[0].full_name;
			this.email = result[0].email;
			this.password = result[0].password;
		} catch (err) {
			console.error('User not found.');
		}
	}

	async save() {
		await mysql.promise().query(
			'INSERT INTO users (login, full_name, email, password) VALUES (?, ?, ?, ?)',
			[this.login, this.full_name, this.email, this.password]
		);
		const [dataUser, _] = await mysql.promise().query('SELECT * FROM users WHERE login = ?', this.login);
		this.id = dataUser[0].id;
	}

	delete() {
		mysql.query('DELETE from users WHERE id=?)', this.id, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			else {
				console.log('User delete');
			}
		});
	}
}
