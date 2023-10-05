const mysql = require('./db.js');

module.exports = class Model {
	constructor(login, full_name, email, password) {
		this.id = 0;
		this.login = login;
		this.full_name = full_name;
		this.email = email;
		this.password = password;
	}

	async find(email) {
		const [result, _] = await mysql.promise().query('SELECT * FROM users WHERE email =?', email);
		try{
			this.id = result[0].id;
			this.login = result[0].login;
			this.userName = result[0].username;
			this.email = result[0].email;
			this.password = result[0].password;
		}
		catch (err){
			console.error('not user');
		}
	}


	async save() {
		if (this.update){
			await mysql.promise().query(`UPDATE users SET password = '${this.password}' WHERE id = ${this.id}`);
			this.update = false;
			return;
		}
		await mysql.promise().query(
			'INSERT INTO users (login, username, email, password) VALUES (?, ?, ?, ?)',
			[this.login, this.userName, this.email, this.password]
		);
		const [dataUser, _] = await mysql.promise().query('SELECT * FROM users WHERE LOGIN = ?', this.login);
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
