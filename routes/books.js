const router = require('express').Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const fs = require('fs')
const consola = require('consola')

const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All books page
router.get('/', async (req, res) => {
    let query = Book.find()
    
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query.gte('publishDate', req.query.publishedAfter)
    }
   
    try {
        const books = await query.exec()
        res.render('books/index', { 
            books: books, 
            searchOptions: req.query 
        })
    } catch (error) {
        res.redirect('/')
    }
})

// Create new book page
router.get('/create', async (req, res) => {
    renderNewPage(res, new Book())
})

// Store book to the database
router.post('/store', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    
    try {
        const newBook = await book.save()

        // res.redirect('books/${newBook.id}')
        res.redirect('/books')
    } catch (error) {
        if(book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(filename) {
    fs.unlink(path.join(uploadPath, filename), err => {
        if(err) consola.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})

        const params = {
            authors,
            book
        }

        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/create', params)
    } catch (error) {
        res.redirect('/books')
    }
}

module.exports = router