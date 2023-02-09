const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const Handlebars = require("handlebars");
const PORT = 8080;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/test', (req, res) => {
    res.render('test', { showTitle: true, foo: 'foo' });
});

app.get('/test1', (req, res) => {
    res.render('test1',{data:data});
});

app.get('/sendFile', (req, res) => {
    console.log(req.file);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});

hbs.registerHelper('isSection', value => {
    return value.toString().includes("section");
});

hbs.registerHelper('json', context => {
    return JSON.stringify(context);
});

var data = {
    "header":{
        "Titolo":"aaaa",
        "Sottotitolo":"bbbbb",
    },
    "sections":[{
        "titolo":"titolo1",
        "descrizione":"descrizione1",
    },
    {
        "titolo":"titolo2",
        "descrizione":"descrizione2",
    },
    {
        "titolo":"titolo3",
        "descrizione":"descrizione3",
    },
    {
        "titolo":"titolo4",
        "descrizione":"descrizione4",
    },
    {
        "titolo":"titolo5",
        "descrizione":"descrizione5",
    },
    {
        "titolo":"titolo6",
        "descrizione":"descrizione6",
    }]
};


