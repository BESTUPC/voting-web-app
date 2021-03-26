document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        console.log('FUCK');
        window.location.href = '/auth';
    }
});
