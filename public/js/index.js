const input = document.querySelector('input[type="file"]');
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('file-content').value = reader.result;
    };
    reader.readAsText(input.files[0]);
});

function visualizza(template) {

    document.getElementById('template-number').innerHTML = "Template " + template;
    document.getElementById('template-img').setAttribute('src', '/img/template' + template + '-full.png');
    document.getElementById('template-img').setAttribute('alt', 'template img');

    document.getElementById('preview').style.visibility = 'visible';
    document.getElementById('preview').style.opacity = 1;
}

function nascondi() {
    document.getElementById('preview').style.visibility = 'hidden';
    document.getElementById('preview').style.opacity = 0;
}