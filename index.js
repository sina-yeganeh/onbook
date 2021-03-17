const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'data', 'books.db')
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) return console.error(err.message)
	console.log("Successful connection to the database.")
})

db.run(`CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR NOT NULL, content TEXT, author VARCHAR NOT NULL, likes INTEGER NOT NULL)`, err => {
	if (err) return console.error(err.message)
	console.log('Books table created successfuly.')
	db.run(`INSERT INTO books (title, content, author, likes) VALUES ('Hello', 'My name is ashkan', 'Ashkan Laei', 12), ('Hi', 'Mahdi', 'Ashkan Laei', 43), ('End', 'Third content', 'Ashkan Laei', 32)`, (err) => {
		if (err) throw new Error(err)
		console.log('Samples inserted successfuly.')
	})
})

let app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => db.all('SELECT * FROM books ORDER BY id DESC LIMIT 5', (err, rows) => {
	if (err) return console.error(err.message)
	res.render('index', { url: req.url, books: rows })
}))
app.get('/search', (req, res) => db.all('SELECT * FROM books WHERE title LIKE ? ORDER BY id DESC', req.query.title, (err, rows) => {
	if (err) return console.error(err.message)
	res.render('search', {
		url: req.url,
		input: req.query.title,
		books: rows
	})
}))
app.get('/best', (req, res) => {
	// supposed to render best books
	// but simply redirect to homepage for now
	res.redirect('/')
})
app.get('/popular', (req, res) => {
	// supposed to render most visited books
	// but simply redirect to homepage for now
	res.redirect('/')
})
app.get('/b(ook)?/:id', (req, res) => {
	db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
		if (err) return console.error(err.message)
		res.render('book', { url: req.url, book: row })
	})
})
app.get('/author/:name', (req, res) => {
	db.all('SELECT * FROM books WHERE author = ?', req.params.name, (err, row) => {
		if (err) return console.error(err.message)
		res.render('author', { url: req.url, author: req.params.name, books: row })
	})
})

app.listen(8080)
