const fs = require('fs');
const hbs = require('hbs');
const express = require('express');
const handlebars = require('handlebars');

const PORT = 4000;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

hbs.registerHelper('isEven', value => {
    return value % 2 === 0;
})

app.get('/', (req, res) => {
    
    let flag, projectName;
    let listTemplate = new Array();
    
    if (req.query.alreadyExists === undefined)
        flag = false;

    else
        flag = true;

    if (req.query.sendToPage)
        projectName = req.query.projectName;

    else
        projectName = null;

    fs.readdir('./public/img', (err, files) => {
        for (var i = 0; i < files.length; i++) {
            listTemplate.push(i + 1);
        }
    });

    res.render('index', { alreadyExists: flag, projectName: projectName, sendToPage: req.query.sendToPage, listTemplate: listTemplate });
});

app.post('/createPage', (req, res) => {
    req.on('data', chunk => {

        // Formattazione della stringa di dati contenente i parametri della query
        chunk = chunk.toString().replace(/\+/g, ' ').replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%22/g, '"').replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/\%5B/g, '[').replace(/\%5D/g, ']');
        var params = new URLSearchParams(chunk);
        
        let content = JSON.parse(params.get('file-content'));
        let templateNumber = params.get('product');

        if (!fs.existsSync(__dirname + '/siti'))
            fs.mkdirSync(__dirname + '/siti');

        // Scrivere il file nella directory del nuovo progetto se non esiste un progetto con lo stesso nome
        var projectFolder = __dirname + '/siti/' + content.header.titolo;
        if (!fs.existsSync(projectFolder)) {

            // Generazione della cartella e dei file del progetto
            fs.mkdirSync(projectFolder);
            fs.writeFileSync('./siti/' + content.header.titolo + '/' + content.header.titolo + '.json', JSON.stringify(content));
            fs.writeFileSync('./siti/' + content.header.titolo + '/template.json', JSON.stringify({ template: templateNumber }));

            res.redirect('/?sendToPage=true&projectName=' + content.header.titolo + '&template=' + templateNumber);
        }

        else {
            res.redirect('/?alreadyExists=true');
        }
    });

});

app.get('/:projectName', (req, res) => {
    var projectName = req.params.projectName;
    var templateFile = JSON.parse(fs.readFileSync('./siti/' + projectName + '/template.json'));
    var templateNumber = templateFile.template;

    var fileJSON = JSON.parse(fs.readFileSync('./siti/' + projectName + '/' + projectName + '.json'));
    res.render('template' + templateNumber, fileJSON);
})

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});