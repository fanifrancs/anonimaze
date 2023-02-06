const usernameField = document.querySelector('#username');
const message = document.querySelector('#message');

usernameField.addEventListener('input', (e) => {
    usernameField.value = e.target.value.toLowerCase().trim().replace(/(\W|_)/g, '');
})

document.addEventListener('submit', (e) => {
    const p1 = document.querySelector('#p1').value,
          p2 = document.querySelector('#p2').value;
    if (p1 !== p2) {
        e.preventDefault();
        message.innerText = 'Passwords do not match';
        message.style.display = 'block';
        setTimeout(() => {
        message.style.display = 'none';
        }, 2000)
    }
})
