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

    fs.readdir('./views', (err, files) => {
        for (var i = 1; i < files.length; i++) {
            listTemplate.push(i);
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
        let projectName = params.get('file');

        if (!fs.existsSync(__dirname + '/public/siti'))
            fs.mkdirSync(__dirname + '/public/siti');

        // Scrivere il file nella directory del nuovo progetto se non esiste un progetto con lo stesso nome
        var projectFolder = __dirname + '/public/siti/' + projectName;
        if (!fs.existsSync(projectFolder)) {

            // Generazione della cartella e dei file del progetto
            fs.mkdirSync(projectFolder);
            fs.mkdirSync(projectFolder + '/css');
            fs.mkdirSync(projectFolder + '/img');
            // fs.mkdirSync(projectFolder + '/js');

            let template = handlebars.compile(fs.readFileSync('/views/template' + templateNumber + '.hbs'));
            

            fs.writeFileSync(projectFolder + '/index.html', template(JSON.stringify(content)));
            fs.writeFileSync(projectFolder + '/css/style.css', fs.readFileSync('./public/css/template' + templateNumber + '.css'));
            // fs.writeFileSync(projectFolder + '/template.json', JSON.stringify({ template: templateNumber }));

            res.redirect('/?sendToPage=true&projectName=' + projectName);
        }

        else {
            res.redirect('/?alreadyExists=true');
        }
    });

});

// app.get('/siti/:projectName', (req, res) => {
//     var projectName = req.params.projectName;
//     var templateFile = JSON.parse(fs.readFileSync('./siti/' + projectName + '/template.json'));
//     var templateNumber = templateFile.template;

//     var fileJSON = JSON.parse(fs.readFileSync('./siti/' + projectName + '/' + projectName + '.json'));
//     res.render('template' + templateNumber, fileJSON);
// })

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});