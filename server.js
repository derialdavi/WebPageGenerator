const fs = require('fs');
const hbs = require('hbs');
const express = require('express');

const PORT = 8080;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/test', (req, res) => {
    res.render('test', {showTitle: true, foo: 'foo'});
});

app.get('/test1', (req, res) => {
    res.render('test1');
});

app.get('/sendFile', (req, res) => {
    console.log(req.file);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});