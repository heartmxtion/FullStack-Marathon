const express = require('express')
const expressThymeleaf = require('express-thymeleaf')
const {TemplateEngine} = require('thymeleaf')
const bodyParser = require('body-parser')
const session = require('express-session')
const File = require('./File')
const FileList = require('./FileList')
const PORT = process.env.PORT || 3000

const app = express()
const templateEngine = new TemplateEngine()
app.engine('html', expressThymeleaf(templateEngine))
app.set('view engine', 'html')
app.set('views', __dirname + '/')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	})
)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`)
})

app.get('/', function (req, res) {
	const ss = req.session
	if (ss.errorMsg !== undefined) {
		return res.render('index',  {
			errorMsg: ss.errorMsg
		})
	}
	let files = new FileList()
	if (files.hasFiles()) {
		res.render('index', {
			files: JSON.stringify(files.getList())
		})
	}
})

app.post('/create', async (req, res) => {
	const rb = req.body
	const ss = req.session

	if (rb.fileName === '') {
		ss.errorMsg = 'File name cannot be empty!'
		return res.redirect('/')
	}

	(new File(rb.fileName)).write(rb.content)
	res.redirect('/')
})

app.post('/delete', async (req, res) => {
	(new File(req.body.deleteFile)).delete()
	return res.redirect('/')
})

