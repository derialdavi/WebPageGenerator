const input = document.querySelector('input[type="file"]');
let content;
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        content = reader.result;
    };
    reader.readAsText(input.files[0]);
});

function sendFile() {
    fetch('/sendFile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: content
    });
}