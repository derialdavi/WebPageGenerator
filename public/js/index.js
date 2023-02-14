const input = document.querySelector('input[type="file"]');
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        $('#file-content').val(reader.result);

        let sections = JSON.parse(reader.result).sections;
        $('#img-selector').html('');
        for (var i = 0; i < sections.length; i++) {
            let text = $('#img-selector').html();
            $('#img-selector').html(text + '<label for="img-selector'+ parseInt(i+1) +'" class="button-85"> carica immagine sezione n.'+ parseInt(i+1) +' </label><input type="file" name="image' + parseInt(i+1) + '" id="img-selector' + parseInt(i+1) + '" accept="image/*">')
        }
    };
    reader.readAsText(input.files[0]);
});



function visualizza(template) {
    console.log('eccomi')
    $('#template-number').html("Template " + template);
    $('#template-img').attr('src', '/img/template' + template + '-full.png');
    $('#template-img').attr('alt', 'template img');

    $('#preview').css('visibility', 'visible');
    $('#preview').css('opacity', 1);
}

function nascondi() {
    $('#preview').css('visibility', 'hidden');
    $('#preview').css('opacity', 0);
}

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