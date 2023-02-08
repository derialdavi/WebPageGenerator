const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const formidable = require('formidable');

const PORT = 8080;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { showTitle: true, foo: 'foo' });
});

app.post('/sendFile', (req, res) => {
    req.on('data', chunk => {
        console.log('ei ' + chunk);
    });

    res.redirect('/')
});


app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});