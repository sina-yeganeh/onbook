const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'data', 'books.db')
const db = new sqlite3.Database(dbPath, err => {
	if (err) return console.error(err.message)
	console.log("Successful connection to the database.")
})

let app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => res.render('index'))
app.get('/search', (req, res) => res.render('search', { input: req.query.name, books: [] }))

app.listen(8080)