const input = document.querySelector('input[type="submit"]');
let content;
input.addEventListener('click', () => {
    const reader = new FileReader();
    reader.onload = function () {
        content = reader.result;
        document.getElementById('file-content').value = content;
    };
    reader.readAsText(input.files[0]);
});