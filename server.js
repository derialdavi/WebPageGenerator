const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const async = require('async');
const express = require('express');
const handlebars = require('handlebars');
const fileUpload = require('express-fileupload');

const PORT = 8080;

const app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
app.use(fileUpload());

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
    const { JSONfile } = req.files;
    var images = new Array();

    for (const key in req.files) {
        if (Object.hasOwnProperty.call(req.files, key)) {
            if (key.substring(0, key.indexOf('e') + 1) == 'image') {
                images.push(req.files[key]);
            }
        }
    };

    if (!fs.existsSync(__dirname + '/public/siti')) {
        fs.mkdirSync(__dirname + '/public/siti');
    }

    var projectFolder = __dirname + '/public/siti/' + JSONfile.name.substring(0, JSONfile.name.indexOf('.'));
    if (!fs.existsSync(projectFolder)) {

        fs.mkdirSync(projectFolder);
        fs.mkdirSync(projectFolder + '/css');
        fs.mkdirSync(projectFolder + '/img');

        let templateNumber = req.body.product;
        let template = handlebars.compile(fs.readFileSync('views/template' + templateNumber + '.hbs').toString());

        let content = JSON.parse(JSONfile.data.toString())
        
        fs.writeFileSync(projectFolder + '/index.html', template(content));
        fs.writeFileSync(projectFolder + '/css/style.css', fs.readFileSync('./public/css/template' + templateNumber + '.css'));

        images.forEach(image => {
            image.mv(projectFolder + '/img/' + image.name);
        });

        res.redirect('/?sendToPage=true&projectName=' + JSONfile.name.substring(0, JSONfile.name.indexOf('.')));

    }
    else {
        res.redirect('/?alreadyExists=true');
    }
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});