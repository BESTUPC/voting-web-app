var URL = 'https://localhost:3000';
var DOMAIN = 'https://localhost:3000';

function signOut() {
    console.log('Fuck');
    window.location = '/auth/logout';

}

$('#signout').click(function () {
    signOut();
});

// clickme.js
