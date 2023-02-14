// Quando l'input di file JSON cambia (viene selezionato un altro file) viene letto il contenuto del file per leggere quante sezioni ci sono, in modo da generare tanti input[type=file] quante sezioni in caso l'utente dovesse selezionare il secondo template
const input = document.querySelector('input[type="file"]');
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        let sections = JSON.parse(reader.result).sections;
        $('#img-selector').html('');
        for (var i = 0; i < sections.length; i++) {
            let text = $('#img-selector').html();
            $('#img-selector').html(text + '<label for="img-selector'+ parseInt(i+1) +'" class="button-85"> carica immagine sezione n.'+ parseInt(i+1) +' </label><input type="file" name="image' + parseInt(i+1) + '" id="img-selector' + parseInt(i+1) + '" accept="image/*">')
        }
    };
    reader.readAsText(input.files[0]);
});


// Mostra il divisore della preview dei template
function visualizza(template) {
    $('#template-number').html("Template " + template);
    $('#template-img').attr('src', '/img/template' + template + '-full.png');
    $('#template-img').attr('alt', 'template img');

    $('#preview').css('visibility', 'visible');
    $('#preview').css('opacity', 1);
}

// Nasconde il divisore della preview dei template
function nascondi() {
    $('#preview').css('visibility', 'hidden');
    $('#preview').css('opacity', 0);
}

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