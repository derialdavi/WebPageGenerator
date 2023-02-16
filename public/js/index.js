$(document).ready(() => {

    let JSONFileBtnInner = `<div id="JSON-file-btn-inner">
    <label for="file-selector" class="button-85">Carica un file JSON</label>
    <input type="file" name="JSONfile" id="file-selector" accept=".json" required>
    </div>`;

    let dataInner = `<div id="data-inner">
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
        <div id="sezione1">

            <h2>Sezione 1</h2>
            titolo:
            <input type="text" name="titoloSezione1" id="titolo-sezione1">
            <br>
            descrizione:
            <input type="text" name="descrizioneSezione1" id="descrizione-sezione1">
            <br>

            <div id="immagineSezione1" class="input_container" style="max-width: 15%;">
                <label for="file-selector" class="button-85">Carica immagine sezione 1</label>
                <input class="image-input" type="file" name="immagineSezione1" id="immagineSezione1" accept="image/png, image/jpeg">
            </div>

            <div id="optionalsSezione1">
            </div>

            <button class="aggiungiLista" type="button" data-idSezione="1">+ lista</button>
        </div>
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

</div>
</div>`

    $('#switch-selector').change(() => {
        if (!$('#switch-selector').is(':checked')) {

            $('#JSON-file-btn').html();

            $('#img-selector').append('<div id="img-selector-inner"></div>')
            $('#data-inner').remove();
        }
        else {
            $('#data').html(dataInner)
            $('#JSON-file-btn-inner').remove();
            $('#img-selector-inner').remove();
        }
    });

    $(document).on('change', '#file-selector', event => {

        let file = event.target.files[0];
        let reader = new FileReader();

        reader.onload = () => {

            let sections = JSON.parse(reader.result).sections;
            $('#img-selector-inner').html('');
            let text = '';
            for (var i = 0; i < sections.length; i++) {
                text += '<label for="img-selector' + parseInt(i + 1) + '" class="button-85"> carica immagine sezione n.' + parseInt(i + 1) + ' </label><input type="file" name="image' + parseInt(i + 1) + '" id="img-selector' + parseInt(i + 1) + '" accept="image/*">'
            }
            $('#img-selector-inner').html(text);
        }
        reader.readAsText(file);
    });

    // Mostra il divisore della preview dei template
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

    // Se viene selezionato il secondo template mostra gli input per le foto, se no li nasconde
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

    // listeInSezioni
    /*
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
    let sezioni = 0;
    let listeInSezioni = [];
    $(document).on('click', '.aggiungiLista', event => {
        let idSezione = $(event.target).attr('data-idSezione');

        idSezione--;
        if (listeInSezioni[idSezione] == undefined) {
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

    $(document).on('click', '.rimuovi-lista-btn', event => {
        let idSezione = $(event.target).attr('data-idSezione');

        listeInSezioni[idSezione - 1][0]--;
        listeInSezioni[idSezione - 1][1].pop();

        let idLista = $(event.target).attr('data-idLista');
        $('#div-sezione' + idSezione + '-lista' + idLista).remove();
        $('#div-sezione' + idSezione + '-lista' + parseInt(idLista - 1)).attr('hidden', false);
    });

    $('#aggiungi').click(() => {
        sezioni++;

    });

});