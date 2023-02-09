const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const handlebars = require('handlebars');

const PORT = 3000;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

hbs.registerHelper('isSection', value => {
    return value.toString().includes('section');
})

app.get('/', (req, res) => {

    var flag;
    if (req.query.alreadyExists === undefined)
        flag = false;

    else
        flag = true;

    res.render('index', { alreadyExists: flag });
});

app.post('/sendFile', (req, res) => {
    req.on('data', chunk => {

        // Formattazione della stringa di dati contenente il json
        chunk = chunk.toString().replace(/\+/g, ' ').replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%22/g, '"').replace(/%3A/g, ':').replace(/%2C/g, ',');
        chunk = chunk.replace(chunk.substring(0, chunk.indexOf('&') + 1), '');
        chunk = JSON.parse(chunk.replace(chunk.substring(0, chunk.indexOf('=') + 1), ''));

        // Scrivere il file nella directory del nuovo progetto se non esiste un progetto con lo stesso nome
        var projectFolder = __dirname + '/siti/' + chunk.titolo;
        if (!fs.existsSync(projectFolder)) {

            // Generazione della cartella e dei file del progetto
            fs.mkdirSync(projectFolder);
            fs.writeFileSync('./siti/' + chunk.titolo + '/' + chunk.titolo + '.json', JSON.stringify(chunk));
            fs.writeFileSync('./siti/' + chunk.titolo + '/' + chunk.titolo + '.hbs', fs.readFileSync('./template/template.hbs'));

            res.redirect('/');
        }
        
        else {
            res.redirect('/?alreadyExists=true');
        }
    });

});

app.get('/test', (req, res) => {
    var fileJSON = JSON.parse(fs.readFileSync('./siti/aaab/aaab.json'));
    res.render('template', { data : fileJSON });
})

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});