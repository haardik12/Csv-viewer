const express = require('express');
const port = 8000;
const app = express();
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

app.use(expressLayouts)
const db = require('./config/mongoose');
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.set('layout extractStyles', true)
app.set('layout extractScripts', true)

app.use(express.static('./assets')) 

app.set('view engine', 'ejs')
app.set('views', './views')

app.use('/', require('./routes'))

app.listen(port, function(err) {
    if (err) {
        console.log(`error in running the server' ${err}`);
    }

    console.log(`app is running on port: ${port}`);
})