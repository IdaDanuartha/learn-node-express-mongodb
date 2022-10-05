const router = require('express').Router()
const Author = require('../models/author')

// All authors page
router.get('/', async (req, res) => {
    let searchOptions = {}

    if(req.query != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }

    try {
        const authors = await Author.find(searchOptions)

        res.render('authors/index', { authors: authors, searchOptions: req.query })
    } catch (error) {
        res.redirect('/')
    }
})

// Create new author page
router.get('/create', (req, res) => {
    res.render('authors/create', {author: new Author()})
})

// Store author to the database
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save()

        res.redirect('authors')
    } catch (error) {
        res.render('authors/create', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
})

module.exports = router