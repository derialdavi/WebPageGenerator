const fs = require('fs');
const express = require('express');

const PORT = 8080;

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/sendFile', (req, res) => {
    res.send('test');
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});