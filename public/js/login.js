document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(username, password)
    .then((userCredential) => {

        var user = userCredential.user;
        window.location.href = '/dashboard.html';
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        document.getElementById('login-error').textContent = 'Error: ' + errorMessage;
    });
});
