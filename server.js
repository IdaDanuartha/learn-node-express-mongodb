// if(process.env.NODE_ENV !== 'production') {
//     require('dotenv').load()
// }

require('dotenv').config()

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const consola = require('consola')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

const indexRouter = require('./routes')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/app');

app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
}).then(() => consola.success('Connected to Mongoose'))
.catch((err) => consola.error(err))

// Router
app.use('/', indexRouter);
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(port, () => {
    consola.success(`Server is listening at port ${port}`)
}) 