var URL = 'https://localhost:3000';
var DOMAIN = 'https://localhost:3000';

function signOut() {
    console.log('Fuck');
    location.href = '/auth/logout';
}

$('#signout').click(function () {
    signOut();
});

// clickme.js
$(document).ready(function(){
    // jQuery will wait until the document is loaded
    // before executing code inside here

    signOut();
});