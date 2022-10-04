// if(process.env.NODE_ENV !== 'production') {
//     require('dotenv').load()
// }

require('dotenv').config()

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const consola = require('consola')
const port = process.env.PORT || 3000

const router = require('./routes')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/app');

app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
}).then(() => consola.success('Connected to Mongoose'))
.catch((err) => consola.error(err))

app.use('/', router);

app.listen(port, () => {
    consola.success(`Server is listening at port ${port}`)
}) 