const input = document.querySelector('input[type="file"]');
let content;
input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = function () {
        content = reader.result;
        // console.log(content);
        document.getElementById('file-content').value = content;
    };
    reader.readAsText(input.files[0]);
});

// function sendFile() {
//     console.log('mandato')
//     fetch('/sendFile', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: content
//     })
//     .finally(() => {
//         window.location.replace('/?alreadyExists=true');
//     })
// }