const mysql = require('./db.js');
const {Admin} = require('./models/admin.js');

module.exports = class Model {
	constructor(login, full_name, email, password, role) {
		this.id = 0;
		this.login = login;
		this.full_name = full_name;
		this.email = email;
		this.password = password;
		this.update = false;
		this.param = '';
		this.role = role;
	}

	async find(value) {
		const [result, _] = await mysql.promise().query(`SELECT * FROM users WHERE ${this.param} = ?`, value);
		try{
			this.id = result[0].id;
			this.login = result[0].login;
			this.full_name = result[0].full_name;
			this.email = result[0].email;
			this.password = result[0].password;
		}
		catch (err) {
			console.error('User is not exist');
		}
	}


	async save() {
		if (this.update){
			await mysql.promise().query(`UPDATE users SET password = '${this.password}' WHERE id = ${this.id}`);
			this.update = false;
			return;
		}
		await mysql.promise().query(
			'INSERT INTO users (login, full_name, email, password) VALUES (?, ?, ?, ?)',
			[this.login, this.full_name, this.email, this.password]
		);
		const [dataUser, _] = await mysql.promise().query('SELECT * FROM users WHERE login = ?', this.login);
		this.id = dataUser[0].id;
		const admin = new Admin(this.id, this.login, this.role);
		this.role = await admin.saveAdmin().then((result) => result);
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
