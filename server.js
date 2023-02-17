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

    // Directory cartella del progetto
    let projectFolder;
    // Nome del progetto
    let projectName;
    // Contenuto in formato JSON
    let content;

    // Se il checkbox non è selezionato
    if (req.body.switch == undefined) {
        // Prendo il file JSON dall'input
        const { JSONfile } = req.files;

        // Controllo che il file JSON esista
        if (!JSONfile) return res.sendStatus(400);

        // Ottenere i dati del file JSON e estrarre il nome del progetto dal nome del file
        content = JSON.parse(JSONfile.data.toString());
        projectName = JSONfile.name.substring(0, JSONfile.name.indexOf('.'));
        
    }
    // Se il checkbox è selezionato
    else {
        let sections;
        let sectionsParagraph;
        // Perendo il nome del progetto dal body della richiesta
        projectName = req.body.Titolo

        // Struttura base del JSON
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

        /*
            Dal corpo della richiesta ottengo quante sezioni (e paragrafi ad esse legate) ci sono,
            se deovesse essere solo 1 e facessi un ciclo per i = 0; i < sections.length il ciclo itererebbe per le lettere del nome della sezione
            e creerebbe una sezione per ogni lettera, quindi evito questo caso facendo il casting ad array se il tipo di req.body.Sezioni == string
        */
        sections = typeof(req.body.Sezioni) == 'string' ? new Array(req.body.Sezioni) : req.body.Sezioni;
        sectionsParagraph = typeof(req.body.paragrafoSezioni) == 'string' ? new Array(req.body.paragrafoSezioni) : req.body.paragrafoSezioni
        
        // Per ogni sezione
        for (let i = 1; i < sections.length + 1; i++) {
            let lists = new Array();
            let elements = new Array();
            let listsInSection;
            let elementsInList;
            
            // Struttura base di una sezione
            var section = {
                titolo: sections[i-1],
                paragrafo: sectionsParagraph[i-1]
            }
            
            // Guardo se ci sono liste e faccio lo stesso controllo delle sezioni
            listsInSection = typeof(req.body['listeSezione' + i]) == 'string' ? new Array(req.body['listeSezione' + i]) : req.body['listeSezione' + i];

            // Se almeno una lista è presente
            if (listsInSection != undefined) {
                // Per ogni lista della sezione
                for (let j = 0; j < listsInSection.length; j++) {
                    // Guardo quanti elementi della lista ci sono e faccio lo stesso controllo delle sezioni
                    elementsInList = typeof(req.body['elementiLista' + parseInt(j+1) + 'Sezione' + parseInt(i)]) == 'string' ? new Array(req.body['elementiLista' + parseInt(j+1) + 'Sezione' + parseInt(i)]) :  req.body['elementiLista' + parseInt(j+1) + 'Sezione' + parseInt(i)];

                    // Aggiungo ad elements ogni elemento della lista e la inserisco in lists
                    elements = [];
                    for (let k = 0; k < elementsInList.length; k++) {
                        elements.push(elementsInList[k]);
                    }
                    lists.push({
                        [listsInSection[j]]: elements
                    })
                }
                // Aggiungo alla struttura base della sezione tutte le liste
                section['liste'] = lists;
            }

            // Se c'è almeno un immagine
            // TODO: se inserisco 3 sezioni, la prima e la terza con immagine e la seconda no, c'è errore
            if (images != undefined) {
                section['img'] = images[i];
            }

            // Aggiungo alla struttura del JSON le informazioni aggiuntive
            content.sections.push(section);
        }

        projectFolder = __dirname + '/public/siti/' + projectName;
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
            // Probabile errore qui
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