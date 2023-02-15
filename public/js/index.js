$(document).ready(() => {
    $('#switch-selector').change(() => {
        if ($('#switch-selector').is(':checked')) {
            $('#data').attr('hidden', true);
            $('#JSON-file-btn').attr('hidden', false);
        }
        else {
            $('#data').attr('hidden', false);
            $('#JSON-file-btn').attr('hidden', true);
        }
    });

    // Quando l'input di file JSON cambia (viene selezionato un altro file) viene letto il contenuto del file per leggere quante sezioni ci sono, in modo da generare tanti input[type=file] quante sezioni in caso l'utente dovesse selezionare il secondo template
    const input = document.querySelector('input[type="file"]');
    input.addEventListener('change', () => {
        const reader = new FileReader();
        reader.onload = function () {
            let sections = JSON.parse(reader.result).sections;
            $('#img-selector').html('');
            for (var i = 0; i < sections.length; i++) {
                let text = $('#img-selector').html();
                $('#img-selector').html(text + '<label for="img-selector' + parseInt(i + 1) + '" class="button-85"> carica immagine sezione n.' + parseInt(i + 1) + ' </label><input type="file" name="image' + parseInt(i + 1) + '" id="img-selector' + parseInt(i + 1) + '" accept="image/*">')
            }
        };
        reader.readAsText(input.files[0]);
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
        var radioValue = $("input[name='product']:checked").val();
        if (radioValue == 2) {
            $('#img-selector').attr('hidden', false);
            $('.img-selector').attr('required', true);
        }
        else {
            $('#img-selector').attr('hidden', true);
            $('.img-selector').attr('required', false);
        }
    });

    // listeInSezioni
    /*
        [
            [3, [1, 5, 3]],
            [1, [4]],
            [5, [1, 6, 5, 3, 5]]
        ]
            ^   ^
            |   |--- Numero di elementi per liste
            |
            |---- Numero di liste per sezione
    */
    let listeInSezioni = [];
    $('.aggiungiListaSezione').click(() => {
        let idSezione = $('.aggiungiListaSezione').attr('data-idSezione');
        
        idSezione--;
        if (listeInSezioni[idSezione] == undefined) {
            listeInSezioni.push([1, [1]]);
        }
        else {
            listeInSezioni[idSezione][0]++;
            listeInSezioni[idSezione][1].push(1);
        }
        
        let idLista = listeInSezioni[idSezione][0];
        if (listeInSezioni[idSezione][0] != 1) {
            $('#div-sezione' + parseInt(idSezione+1) + '-lista' + parseInt(idLista-1)).attr('hidden', true);
        }

        idSezione++;
        $('#optionalsSezione' + idSezione).append('<div id="div-sezione' + idSezione + '-lista' + idLista + '">' +
                                                    '<br> Nome lista ' + idLista + ': ' +
                                                    '<input type="text" name="nomeLista' + idLista + 'Sezione' + idSezione + '" id="nomeLista' + idLista + 'Sezione' + idSezione + '">' +
                                                    '<button type="button" class="rimuovi-lista-btn" data-idLista="' + idLista + '" data-idSezione="' + idSezione + '">rimuovi lista ' + idLista + '</button> <br>' +
                                                    'Elementi:' +
                                                    '<input type="number" min="1" value="1" name="nElementiLista' + idLista + 'Sezione' + idSezione + '" class="nElementiLista" data-idSezione="' + idSezione + '" data-idLista="' + idLista + '" />' +
                                                    '<div id="elementiLista' + idLista + 'Sezione' + idSezione + '">'+
                                                    '<div id="elementoSezione' + idSezione + 'Lista' + idLista + '">'+
                                                    'Elemento 1: <input type="text" /></div></div>');
    });

    $(document).on('change', '.nElementiLista', event => {
        let idSezione = $(event.target).attr('data-idSezione');
        let idLista = $(event.target).attr('data-idLista');

        let prevValue = listeInSezioni[idSezione-1][1][idLista-1];
        listeInSezioni[idSezione-1][1][idLista-1] = $(event.target).val();
        // Cambiare l'ordine di come vengono eliminate le cose facendo complemento a <max>
        // let tmp = 

        if ($(event.target).val() > prevValue) {
            $('#elementiLista' + idLista + 'Sezione' + idSezione).append('<div id="elementoSezione' + idSezione + 'Lista' + idLista + '">'+
                                                                            'Elemento ' + listeInSezioni[idSezione-1][1][idLista-1] + ' : <input type="text" />'+
                                                                            '</div>');
        }
        else {
            $('#elementoSezione' + idSezione + 'Lista' + idLista).remove();
        }
    });

    $(document).on('click', '.rimuovi-lista-btn', event => {
        let idSezione = $(event.target).attr('data-idSezione');
        
        listeInSezioni[idSezione - 1][0]--;
        listeInSezioni[idSezione - 1][1].pop();

        let idLista = $(event.target).attr('data-idLista');
        $('#div-sezione' + idSezione + '-lista' + idLista).remove();
        $('#div-sezione' + idSezione + '-lista' + parseInt(idLista-1)).attr('hidden', false);
    })
});