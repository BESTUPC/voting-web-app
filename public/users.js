var xhrAux = new XMLHttpRequest();
xhrAux.open('GET', '/api/users/current');
xhrAux.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhrAux.onload = function () {
    initNavBar(JSON.parse(xhrAux.response));
};
xhrAux.send();

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/users');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function () {
    users = JSON.parse(xhr.responseText);
    for (i in users) {
        user = users[i];
        var id = user.userId;
        var name = user.name;
        var email = user.email;
        var membership = user.membership;
        var member = '';
        var full = '';
        var admin = '';
        for (i in membership) {
            if (membership[i] == 'member') member = 'member';
            if (membership[i] == 'full') full = 'full';
            if (membership[i] == 'admin') admin = 'admin';
        }
        //crea una nova fila amb el nom i la deadline
        var row = $(
            '<tr><td>' +
                name +
                '</td><td>' +
                email +
                '</td><td>' +
                member +
                '</td><td>' +
                full +
                '</td><td>' +
                admin +
                '</td></tr>',
        )
            .attr('id', 'poll' + id) //afegeix link a la fila
            .click(function () {
                window.location =
                    DOMAIN + '/user.html?id=' + $(this).attr('id').substr(4);
            })
            .css('cursor', 'pointer')
            .hover(
                function () {
                    $(this)
                        .css('background-color', '#eff0f1')
                        .find('td')
                        .css('text-decoration', 'underline');
                },
                function () {
                    $(this)
                        .css('background-color', '#ffffff')
                        .find('td')
                        .css('text-decoration', 'none');
                },
            );
        $('#usersTable tbody').append(row); //afegeix fila a la taula
    }

    var table = $('#usersTable').DataTable({
        //            "order": [[1,"desc"]],
        fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull,
        ) {
            var isMember = aData[2] == 'member';
            var isFull = aData[3] == 'full';
            var isAdmin = aData[4] == 'admin';
            $('td:eq(2)', nRow).html(
                isMember
                    ? '<i class="fa fa-check"></i>'
                    : '<i class="fa fa-close"></i>',
            );
            $('td:eq(3)', nRow).html(
                isFull
                    ? '<i class="fa fa-check"></i>'
                    : '<i class="fa fa-close"></i>',
            );
            $('td:eq(4)', nRow).html(
                isAdmin
                    ? '<i class="fa fa-check"></i>'
                    : '<i class="fa fa-close"></i>',
            );
            //                $('td:eq(2)', nRow).html('hola')
        },
    });
};
xhr.send();
$(':root').keydown(function (e) {
    if (e.keyCode == 13) {
        //enter
        var trToClick = $('#usersTable').find('tr:nth-child(1)');
        if (trToClick.exists()) trToClick.click();
    }
});
