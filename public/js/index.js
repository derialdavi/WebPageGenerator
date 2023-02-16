$(document).ready(() => {
    // Contatore sezioni
    let nSezioni = 1;
    // Template html di una sezione
    let sezione = (nSezione) => {
        return `<div id="sezione` + nSezione + `">
                    <h2>Sezione ` + nSezione + `</h2>
                    titolo:
                    <input type="text" name="titoloSezione` + nSezione + `" id="titolo-sezione` + nSezione + `">
                    <br>
                    descrizione:
                    <input type="text" name="descrizioneSezione` + nSezione + `" id="descrizione-sezione` + nSezione + `">
                    <br>

                    <div id="immagineSezione` + nSezione + `" class="input_container" style="max-width: 15%;">
                        <label for="file-selector" class="button-85">Carica immagine sezione ` + nSezione + `</label>
                        <input class="image-input" type="file" name="immagineSezione1" id="immagineSezione` + nSezione + `" accept="image/png, image/jpeg">
                    </div>

                    <div id="optionalsSezione` + nSezione + `">
                    </div>

                    <button class="aggiungiLista" type="button" data-idSezione="` + nSezione + `">+ lista</button>
                    <br>
                    <button class="rimuoviSezione" type="button" data-idSezione="` + nSezione + `">rimuovi sezione</button>
                </div>`;
    }

    // Template dell'input file per il JSON
    let JSONFileBtnInner = `<div id="JSON-file-btn-inner">
                                <label for="file-selector" class="button-85">Carica un file JSON</label>
                                <input type="file" name="JSONfile" id="file-selector" accept=".json" required>
                            </div>`;

    // Template per il divisore dei dati
    var dataInner = `<div id="data-inner">
                        Titolo:
                        <input type="text" name="Titolo" id="titolo">
                        <br>
                        Proprietario:
                        <input type="text" name="Proprietario" id="proprietario">

                        <hr>

                        <h2>Header</h2>
                        titolo:
                        <input type="text" name="titolo" id="titolo-header">
                        <br>
                        sottotitolo:
                        <input type="text" name="sottotitolo" id="sottotitolo">

                        <hr>
                        
                        <div id="sezioni">
                            ` + sezione('1') + `
                        </div>
                                
                        <hr>
                        <button id="aggiungiSezione" type="button">+ sezione</button>
                        <hr>

                        <h2>Footer</h2>
                        Indirizzo:
                        <input type="text" name="indirizzo" id="indirizzo">
                        <br>
                        Email:
                        <input type="text" name="email" id="email">
                        <br>
                        Telefono:
                        <input type="text" name="telefono" id="telefono">
                    </div>`


    /* 
        Quando cambia il checkbox per selezionare se usare il JSON o il form
        Se non è selezionato
        Aggiungi il template dell'input del file e del contenitore di input per le immagini e rimuovi il form
        Altrimenti mostra il form e rimuove il template dell'input del file e del contenitore di input per le immagini
    */
    $('#switch-selector').change(() => {
        if (!$('#switch-selector').is(':checked')) {
            $('#JSON-file-btn').html(JSONFileBtnInner);
            $('#img-selector').append('<div id="img-selector-inner"></div>')
            $('#data-inner').remove();
        }
        else {
            $('#data').html(dataInner)
            $('#JSON-file-btn-inner').remove();
            $('#img-selector-inner').remove();
        }
    });

    /*
        Quando cambia l'input per il file JSON
        Legge il contenuto e ne fa il parsing da stringa a JSON, guardando quante sezioni ci sono
        Per ogni sezione
        Creo una label e un input per immagini
        Aggiungo il testo generato nell'HTML
    */
    $(document).on('change', '#file-selector', event => {
        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = () => {

            let sections = JSON.parse(reader.result).sections;
            let text = '';
            for (var i = 0; i < sections.length; i++) {
                text += '<label for="img-selector' + parseInt(i + 1) + '" class="button-85"> carica immagine sezione n.' + parseInt(i + 1) + ' </label><input type="file" name="image' + parseInt(i + 1) + '" id="img-selector' + parseInt(i + 1) + '" accept="image/*">'
            }
            $('#img-selector-inner').html(text);
        }
        reader.readAsText(file);
    });

    /*
        Mostra il divisore della preview dei template caricando il template
        in base al prametro 'data-idTemplate' preso dal bottone premuto
    */
    $('.preview-btn').click(event => {
        let template = $(event.target).attr('data-idTemplate');
        $('#template-number').html("Template " + template);
        $('#template-img').attr('src', '/img/template' + template + '-full.png');
        $('#template-img').attr('alt', 'template img');

        $('#preview').css('visibility', 'visible');
        $('#preview').css('opacity', 1);
    });

    // Nasconde il divisore della preview dei template
    $('#exit').click(() => {
        $('#preview').css('visibility', 'hidden');
        $('#preview').css('opacity', 0);
    });

    /*
        Se viene selezionato il secondo template mostra gli input per le foto
        e li mette l'attributo required, se no li nasconde e toglie il required
    */
    $('#form').change(function () {
        let radioValue = $("input[name='product']:checked").val();
        if (radioValue == 2) {
            $('.image-input').attr('required', true);
            $('#img-selector').attr('hidden', false);
            $('.img-selector').attr('required', true);
        }
        else {
            $('.image-input').attr('required', false);
            $('#img-selector').attr('hidden', true);
            $('.img-selector').attr('required', false);
        }
    });

    /* listeInSezioni
        [
sez -->     [3, [1, 5, 3]],
sez -->     [1, [4]],
sez -->     [5, [1, 6, 5, 3, 5]]
        ]
            ^   ^
            |   |--- Numero di elementi per liste
            |
            |---- Numero di liste per sezione
    */
    let listeInSezioni = [];

    /*
        Quando viene aggiunta una lista
        Controlla a quale sezione si sta aggiugnendo la lista
        Se è la prima lista in quella sezione
        Viene aggiunta una sezione all'array listeInSezioni
        Se non è la prima lista in sezione aumenta in counter di liste in quella sezione e ci inserisce un elemento
        Se non è la prima lista in sezione nasconde la lista precedente
        Aggiungo il template della lista nell'HTML
    */
    $(document).on('click', '.aggiungiLista', event => {
        let idSezione = $(event.target).attr('data-idSezione');

        // Quando prendo l'id della sezione dal bottone sono numerati partendo da 1, gli array partono da 0 quindi diminuisco di 1
        idSezione--;
        if (listeInSezioni[idSezione] == undefined) {
            for (let i = listeInSezioni.length; i < idSezione; i++) {
                listeInSezioni.push([0, [0]]);
            }
            listeInSezioni.push([1, [1]]);
        }
        else {
            listeInSezioni[idSezione][0]++;
            listeInSezioni[idSezione][1].push(1);
        }

        let idLista = listeInSezioni[idSezione][0];
        if (listeInSezioni[idSezione][0] > 1) {
            $('#div-sezione' + parseInt(idSezione + 1) + '-lista' + parseInt(idLista - 1)).attr('hidden', true);
        }

        // Aumento l'id di 1 per contare partendo da 1
        idSezione++;
        $('#optionalsSezione' + idSezione).append('<div id="div-sezione' + idSezione + '-lista' + idLista + '">' +
            '<br> Nome lista ' + idLista + ': ' +
            '<input type="text" name="nomeLista' + idLista + 'Sezione' + idSezione + '" id="nomeLista' + idLista + 'Sezione' + idSezione + '">' +
            '<button type="button" class="rimuovi-lista-btn" data-idLista="' + idLista + '" data-idSezione="' + idSezione + '">rimuovi lista ' + idLista + '</button> <br>' +
            'Elementi:' +
            '<input type="number" min="1" value="1" name="nElementiLista' + idLista + 'Sezione' + idSezione + '" class="nElementiLista" data-idSezione="' + idSezione + '" data-idLista="' + idLista + '" />' +
            '<div id="elementiLista' + idLista + 'Sezione' + idSezione + '">' +
            '<div id="elemento1Sezione' + idSezione + 'Lista' + idLista + '">' +
            'Elemento 1: <input type="text" /></div></div>');
    });

    /*
        Quando viene cambiato l'input per specificare quanti elementi ci sono nella lista
        Prendo a quale lista di quale sezione mi sto riferendo
        Capisco se il valore è stato aumentato o diminuito tramite il valore dell'array listeInSezioni e il nuovo valore dell'input
        Se è stato aumentato aggiungo il template dell'elemento della lista
        Se è stato diminuito rimuovo l'elemento con l'id piu alto
    */
    $(document).on('change', '.nElementiLista', event => {
        let idSezione = $(event.target).attr('data-idSezione');
        let idLista = $(event.target).attr('data-idLista');

        let prevValue = listeInSezioni[idSezione - 1][1][idLista - 1];
        listeInSezioni[idSezione - 1][1][idLista - 1] = $(event.target).val();

        if (parseInt($(event.target).val()) > prevValue) {
            $('#elementiLista' + idLista + 'Sezione' + idSezione).append('<div id="elemento' + listeInSezioni[idSezione - 1][1][idLista - 1] + 'Sezione' + idSezione + 'Lista' + idLista + '">' +
                'Elemento ' + listeInSezioni[idSezione - 1][1][idLista - 1] + ' : <input type="text" />' +
                '</div>');
        }
        else {
            $('#elemento' + parseInt(parseInt($(event.target).val()) + 1) + 'Sezione' + idSezione + 'Lista' + idLista).remove();
        }
    });

    /*
        Se viene premuto il pulsante per eliminare una lista
        Prendo a quale sezione mi sto riferendo
        Diminuisco di 1 il contatore di liste in quella sezione e rimuovo il contatore di elementi di quella lista
        Prendo a quale lista mi sto riferendo e la rimuovo il template dall'HTML
    */
    $(document).on('click', '.rimuovi-lista-btn', event => {
        let idSezione = $(event.target).attr('data-idSezione');

        listeInSezioni[idSezione - 1][0]--;
        listeInSezioni[idSezione - 1][1].pop();

        let idLista = $(event.target).attr('data-idLista');
        $('#div-sezione' + idSezione + '-lista' + idLista).remove();
        $('#div-sezione' + idSezione + '-lista' + parseInt(idLista - 1)).attr('hidden', false);
    });

    /*
        Quando premo il pulsante per aggiugnere una sezione
        Nascondo la sezione precedente, aumento il contatore di sezione e mostro la prossima sezione
    */
    $(document).on('click', '#aggiungiSezione', () => {
        $('#sezione' + nSezioni).attr('hidden', true);
        nSezioni++;
        $('#sezioni').append(sezione(nSezioni));
    });

    /*
        Quando premo il pulsante per rimuovere una sezione
        Se l'id della sezione che devo rimuovere è maggiore di 1
        Rimuovo la sezione e mostro quella precedente, diminuendo il contatore di sezioni
        Non posso avere meno di una sezione
    */
    $(document).on('click', '.rimuoviSezione', event => {
        let idSezione = $(event.target).attr('data-idSezione');
        if (idSezione > 1) {
            nSezioni--;
            $('#sezione' + idSezione).remove();
            $('#sezione' + parseInt(idSezione - 1)).attr('hidden', false);
        }
    });
});