const fs = require('fs')

module.exports = class FileList {
	constructor() {
		this.createTmpFolder();
	}
	getList() {
		let dir = './tmp'
		let files = []
		fs.readdirSync(dir).forEach(file => {
			let data = fs.readFileSync('tmp/' + file, 'utf8')
			files.push({name: file, content: data})
		})
		return files
	}
	hasFiles() {
		return fs.existsSync('./tmp')
	}
	getHTMLList() {
		return this.getList()
	}
	createTmpFolder() {
		let dir = './tmp';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
	}
}