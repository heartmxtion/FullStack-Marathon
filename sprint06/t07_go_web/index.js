const express = require('express')
const PORT = process.env.PORT || 3000

const app = express()
app.set('view engine', 'ejs')
app.set('views', './t07_go_web/views')

const normal = require('./normal-router')
const quantum = require('./quantum-router')

const time = normal.calculateTime()
const quantumTime = quantum.calculateTime()

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`)
})

app.get("/", (req, res, next) => {
	let html =
		`<a href="/normal">normal space</a><br><br>` +
		`<a href="/quantum">quantum space</a>`
	res.send(html)
})

app.get('/normal', (req, res, next) => {
	res.render('normal', {
			year: time.years(),
			month: time.months(),
			day: time.days()
		})
})

app.get('/quantum', (req, res, next) => {
	res.render('quantum', {
			quantumYear : quantumTime[0],
			quantumMonth : quantumTime[1],
			quantumDay: quantumTime[2]
		})
})