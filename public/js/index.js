const input = document.querySelector('input[type="file"]');
let content;
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        content = reader.result;
        document.getElementById('file-content').value = content;
    };
    reader.readAsText(input.files[0]);
});