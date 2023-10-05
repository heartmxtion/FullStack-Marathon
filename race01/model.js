import mysql from './db.js';

export default class Model {
	constructor(name, email, password, avatar) {
		this.id = 0;
		this.name = name;
		this.email = email;
		this.password = password;
		this.avatar = avatar;
		this.update = false;
		this.param = '';
	}

	async find(value) {
		const [result, _] = await mysql.promise().query(`SELECT * FROM users WHERE ${this.param} = ?`, value);
		try{
			this.id = result[0].id;
			this.name = result[0].name;
			this.email = result[0].email;
			this.password = result[0].password;
			this.avatar = result[0].avatar;
		}
		catch (err) {
			console.error('User is not exist');
		}
	}


	async save() {
		if (this.update){
			await mysql.promise().query(`UPDATE users SET avatar = '${this.avatar}' WHERE name = '${this.name}'`);
			this.update = false;
			return;
		}
		await mysql.promise().query(
			'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
			[this.name, this.email, this.password, this.avatar]
		);
		const [dataUser, _] = await mysql.promise().query('SELECT * FROM users WHERE name = ?', this.name);
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
