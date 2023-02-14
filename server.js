const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const async = require('async');
const express = require('express');
const handlebars = require('handlebars');
const fileUpload = require('express-fileupload');

const PORT = 8080;

const app = express();

// Template
app.set('view engine', 'hbs');
// Static folder
app.use(express.static('public'));
// upload dei file tramite form HTML
app.use(fileUpload());

// Helper handlebars per la compilazione dei template
handlebars.registerHelper('isEven', value => {
    return value % 2 === 0;
})

hbs.registerHelper('isTwo', value => {
    return value === 2;
})

// MAIN ROUTE
app.get('/', (req, res) => {

    let flag, projectName;
    let projects = new Array();
    let listTemplate = new Array();

    // Se si arriva alla pagina con la query alreadyExists=true vuol dire che si è provato a creare un progetto ma aveva lo stesso nome di un progetto già creato e viene stampato un messaggio
    if (req.query.alreadyExists === undefined)
        flag = false;

    else
        flag = true;

    // Se si arriva alla pagina con la query sendToPage=true vuol dire che è appena stato creato un progetto e verrà stampato un bottone che porta al sito appena creato
    if (req.query.sendToPage)
        projectName = req.query.projectName;

    else
        projectName = null;

    // Legge quanti template ci sono dalla cartella /views (legge tutti i file - 1, ovvero l'index di WebPageGenerator)
    fs.readdir('./views', (err, files) => {
        for (var i = 1; i < files.length; i++) {
            listTemplate.push(i);
        }
    });

    // Lettura delle cartelle dentro 'public/siti' per poi fare i bottoni per ogni sito creato
    const directoryPath = 'public/siti';
    // Legge la directory
    fs.readdir(directoryPath, function (err, files) {
        // Se non trova la directory
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        // Per ogni elemento della directory
        async.each(files, function (file, callback) {
            const filePath = path.join(directoryPath, file);
            fs.stat(filePath, function (error, stat) {
                if (error) {
                    console.log(error);
                    callback(error);
                    return;
                }
                // Se l'elemento è una directory
                if (stat.isDirectory()) {
                    // Aggiunge l'elemento (il nome della directory) all'array projects
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

    // Compila index.hbs con i vari dati passati nell'oggetto
    res.render('index', { alreadyExists: flag, projectName: projectName, sendToPage: req.query.sendToPage, listTemplate: listTemplate, link: projects });
});

app.post('/createPage', (req, res) => {
    const { JSONfile } = req.files;

    // Controllo che nella richiesta ci sia un file JSON
    if (!JSONfile) return res.sendStatus(400);

    // Array di file delle immagini
    var images = new Array();

    // Inizializzare l'array images
    for (const key in req.files) {
        if (Object.hasOwnProperty.call(req.files, key)) {
            if (key.substring(0, key.indexOf('e') + 1) == 'image') {
                images.push(req.files[key]);
            }
        }
    };

    // Se già non esiste una cartella con il nome del progetto
    var projectFolder = __dirname + '/public/siti/' + JSONfile.name.substring(0, JSONfile.name.indexOf('.'));
    if (!fs.existsSync(projectFolder)) {

        // Creo la cartella del progetto con le sue sotto cartelle
        fs.mkdirSync(projectFolder);
        fs.mkdirSync(projectFolder + '/css');
        fs.mkdirSync(projectFolder + '/img');

        // Lettura dal corpo della richiesta del template selezionato
        let templateNumber = req.body.product;
        // Caricare il template handlebars dal file del template selezionato
        let template = handlebars.compile(fs.readFileSync('views/template' + templateNumber + '.hbs').toString());
        // Ottenere i dati del file JSON
        let content = JSON.parse(JSONfile.data.toString())
        
        // Creare il file index.html con il contenuto del template compilato con i dati del JSON e copiare il css del template nella cartella del css del progetto
        fs.writeFileSync(projectFolder + '/index.html', template(content));
        fs.writeFileSync(projectFolder + '/css/style.css', fs.readFileSync('./public/css/template' + templateNumber + '.css'));

        // Spostare i file nella cartella del progetto
        images.forEach(image => {
            image.mv(projectFolder + '/img/' + image.name);
        });

        res.redirect('/?sendToPage=true&projectName=' + JSONfile.name.substring(0, JSONfile.name.indexOf('.')));

    }
    else {
        // Esiste gia un progetto con questo nome
        res.redirect('/?alreadyExists=true');
    }
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});