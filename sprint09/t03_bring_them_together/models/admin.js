const pool = require('../db.js');

class Admin {
	constructor(id, login, role) {
		this.id = id;
		this.login = login;
		this.role = role;
	}

	async saveAdmin() {
		if (this.role === 'on')  {
			await pool.promise().query('INSERT INTO admins (user_id, user_login) VALUE(?, ?)', [
				this.id,
				this.login,
				]);
			return 'admin';
		}
		return 'user';
	}
}

module.exports = {Admin};
