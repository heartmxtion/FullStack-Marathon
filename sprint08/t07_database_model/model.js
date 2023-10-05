const mysql = require('./db.js')

module.exports = class Model {
    constructor(name, description, class_role, race) {
        this.id = 0
        this.heroName = name
        this.heroDescription = description
        this.class_role = class_role
        this.race = race
    }
    find(id) {
        mysql.connect()
        mysql.query('SELECT * FROM heroes WHERE id=?', id, function(err, rows, fields) {
            if (err) {
                console.log(`Hero wasn't found!`)
                throw err
            }
            this.id = rows[0].id
            this.heroName = rows[0].name
            this.heroDescription = rows[0].description
            this.class_role = rows[0].class_role
            this.race = rows[0].race

            console.log(`Hero was found: ${this.heroName}.`)
            console.log({
                id: this.id,
                name: this.heroName,
                description: this.heroDescription,
                class_role: this.class_role,
                race: this.race
            })

        })
    }
    save() {
        mysql.connect()
        let hero = {
            name: this.heroName,
            description: this.heroDescription,
            class_role: this.class_role,
            race: this.race
        }
        mysql.query('INSERT INTO heroes SET ?', hero, function(err, rows, fields) {
            if (err) throw err
            this.id = rows.insertId
        })
        console.log(`Successful save hero: ${this.heroName}.`)
    }
	delete(id) {
		let sql = 'DELETE FROM heroes WHERE id = ?';
		mysql.query(sql, [id], function (err, result) {
			if (err) throw err;
			console.log('Successful delete hero, count: ' + result.affectedRows);
		});
	}

}