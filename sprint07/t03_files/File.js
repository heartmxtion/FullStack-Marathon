const fs = require('fs');

module.exports = class File {
	constructor(name) {
		this.name = name;
		this.path = `./tmp/${name}`;
	}

	write(content) {
		let dir = './tmp';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}

		if (fs.existsSync(this.path)) {
			const existingContent = fs.readFileSync(this.path, 'utf8');
			fs.writeFileSync(this.path, existingContent + '\n' + content);
		} else {
			fs.writeFileSync(this.path, content);
		}
	}

	read() {
		return fs.readFileSync(this.path, 'utf8');
	}

	delete() {
		try {
			fs.unlinkSync(this.path);
		} catch (err) {
			console.error(err);
		}
	}
}
