const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const async = require('async');
const express = require('express');
const handlebars = require('handlebars');

const PORT = 4000;

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

handlebars.registerHelper('isEven', value => {
    return value % 2 === 0;
})

hbs.registerHelper('isTwo', value => {
    return value === 2;
})

app.get('/', (req, res) => {

    let flag, projectName;
    let projects = new Array();
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

    // Lettura delle cartelle dentro 'public/siti' per poi fare i bottoni per ogni sito
    const directoryPath = 'public/siti';

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        let folderCount = 0;
        async.each(files, function (file, callback) {
            const filePath = path.join(directoryPath, file);
            fs.stat(filePath, function (error, stat) {
                if (error) {
                    console.log(error);
                    callback(error);
                    return;
                }

                if (stat.isDirectory()) {
                    folderCount++;
                    projects.push(file);
                }
                callback();
            });
        }, function (err) {
            if (err) {
                console.log(err);
                return;
            }

        });
    });

    res.render('index', { alreadyExists: flag, projectName: projectName, sendToPage: req.query.sendToPage, listTemplate: listTemplate, link: projects });
});

app.post('/createPage', (req, res) => {
    req.on('data', chunk => {

        // Formattazione della stringa di dati contenente i parametri della query
        chunk = chunk.toString().replace(/\+/g, ' ').replace(/%7B/g, '{').replace(/%7D/g, '}').replace(/%22/g, '"').replace(/%3A/g, ':').replace(/%2C/g, ',').replace(/%5B/g, '[').replace(/%5D/g, ']');
        var params = new URLSearchParams(chunk);

        let content = JSON.parse(params.get('file-content'));
        let templateNumber = params.get('product');
        let projectName = params.get('file').substring(0, params.get('file').indexOf('.'));

        if (!fs.existsSync(__dirname + '/public/siti'))
            fs.mkdirSync(__dirname + '/public/siti');

        // Scrivere il file nella directory del nuovo progetto se non esiste un progetto con lo stesso nome
        var projectFolder = __dirname + '/public/siti/' + projectName;
        if (!fs.existsSync(projectFolder)) {

            // Generazione della cartella e dei file del progetto
            fs.mkdirSync(projectFolder);
            fs.mkdirSync(projectFolder + '/css');
            fs.mkdirSync(projectFolder + '/img');

            let template = handlebars.compile(fs.readFileSync('views/template' + templateNumber + '.hbs').toString());

            fs.writeFileSync(projectFolder + '/index.html', template(content));
            fs.writeFileSync(projectFolder + '/css/style.css', fs.readFileSync('./public/css/template' + templateNumber + '.css'));

            res.redirect('/?sendToPage=true&projectName=' + projectName);
        }

        else {
            res.redirect('/?alreadyExists=true');
        }
    });

});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});