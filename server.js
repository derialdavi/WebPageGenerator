const fs = require('fs');
const hbs = require('hbs');
const path = require('path');
const async = require('async');
const express = require('express');
const archiver = require('archiver');
const handlebars = require('handlebars');
const fileUpload = require('express-fileupload');

var PORT = 3000;
function getPort() {
    process.argv.forEach((val, index, array) => {
        if (val == '-p') {
            if (parseInt(process.argv[index + 1]) != NaN) {
                PORT = process.argv[index + 1];
            }
        }
    })
};
getPort();

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
    // Array di file delle immagini
    if (req.files != null) {    
        var { images } = req.files;
    }

    // Lettura dal corpo della richiesta del template selezionato
    let templateNumber = req.body.product;

    let projectFolder;
    let projectName;
    let content;

    if (req.body.switch == undefined) {
        const { JSONfile } = req.files;

        // Controllo che nella richiesta ci sia un file JSON
        if (!JSONfile) return res.sendStatus(400);

        // Ottenere i dati del file JSON
        content = JSON.parse(JSONfile.data.toString());
        projectName = JSONfile.name.substring(0, JSONfile.name.indexOf('.'));
        projectFolder = __dirname + '/public/siti/' + projectName;

    }
    else {
        let sections;
        let sectionsParagraph;

        projectName = req.body.Titolo
        projectFolder = __dirname + '/public/siti/' + projectName;
        content = {
            Titolo: projectName,
            Proprietario: req.body.Proprietario,
            header: {
                titolo: req.body.titolo,
                sottotitolo: req.body.sottotitolo
            },
            sections: [],
            footer: {
                indirizzo: req.body.indirizzo,
                email: req.body.email,
                telefono: req.body.telefono
            }
        }

        sections = typeof(req.body.Sezioni) == 'string' ? sections = new Array(req.body.Sezioni) : sections = req.body.Sezioni;
        sectionsParagraph = typeof(req.body.paragrafoSezioni) == 'string' ? sectionsParagraph = new Array(req.body.paragrafoSezioni) : sections = req.body.paragrafoSezioni
        
        for (let i = 0; i < sections.length; i++) {
            let lists = new Array();
            let elements = new Array();
            let listsInSections;
            let elementsInList;
            var section = {
                titolo: sections[i],
                paragrafo: sectionsParagraph[i]
            }

            if (req.body['listeSezione' + i] != undefined) {
                listsInSections = new Array(req.body['listeSezione' + i]);

                for (let j = 0; j < listsInSections.length; i++) {
                    elementsInList = new Array(req.body['elementiLista' + j + 'Sezione' + i])
                    for (let k = 0; k < elementsInList.length; k++) {
                        elements.push(elementsInList[k]);
                    }

                    lists.push({
                        [req.body['listeSezione' + i][j]]: elements
                    })
                }
            }
            section['liste'] = lists;

            if (images != undefined) {
                section['img'] = images[i];
            }

            content.sections.push(section);
        }
        // Se già non esiste una cartella con il nome del progetto
        if (!fs.existsSync(projectFolder)) {

            // Creo la cartella del progetto con le sue sotto cartelle
            fs.mkdirSync(projectFolder);
            fs.mkdirSync(projectFolder + '/css');
            fs.mkdirSync(projectFolder + '/img');


            // Caricare il template handlebars dal file del template selezionato
            let template = handlebars.compile(fs.readFileSync('views/template' + templateNumber + '.hbs').toString());

            // Creare il file index.html con il contenuto del template compilato con i dati del JSON e copiare il css del template nella cartella del css del progetto
            fs.writeFileSync(projectFolder + '/index.html', template(content));
            fs.writeFileSync(projectFolder + '/css/style.css', fs.readFileSync('./public/css/template' + templateNumber + '.css'));

            // Spostare i file nella cartella del progetto
            if (images != undefined) {
                images.forEach(image => {
                    image.mv(projectFolder + '/img/' + image.name);
                });
            }
                
            res.redirect('/?sendToPage=true&projectName=' + projectName);

        }
        else {
            // Esiste gia un progetto con questo nome
            res.redirect('/?alreadyExists=true');
        }
    }
});

// Url per scaricare i siti
app.get('/download/:projectName', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'siti');
    const folderName = req.params.projectName;

    // Creare un'archivio .zip della cartella
    const archive = archiver('zip', {
        zlib: { level: 9 } // livello di compressione
    });

    // Aggiungi i file della cartella all'archivio
    archive.directory(folderPath, folderName);

    // Imposta il nome del file zip e il tipo di contenuto della risposta
    res.attachment(`${folderName}.zip`);
    res.type('zip');

    // Invia l'archivio zip al client
    archive.pipe(res);
    archive.finalize();
});

app.listen(PORT, () => {
    console.log('Server at %s', PORT);
});