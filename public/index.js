var xhrAux = new XMLHttpRequest();
xhrAux.open('GET', '/api/users/current');
xhrAux.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhrAux.onload = function () {
    initNavBar(JSON.parse(xhrAux.response));
};
xhrAux.send();

var xhr = new XMLHttpRequest();
xhr.open('GET', '/api/polls');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onload = function () {
    var pollList = JSON.parse(xhr.responseText);
    /*if (result.status!='0'){
            setCookie('profile',"",1);
            setCookie('idtoken',"",1);
            error('Error',result.message,goLogin);
            return 0;
        }*/
    //console.log(result);
    for (var i in pollList) {
        //alert(JSON.stringify(pollList[i]))
        var poll = pollList[i];
        var id = poll._id;
        var name = poll.pollName;
        var date_ms = poll.pollDeadline * 1000;
        //crea una nova fila amb el nom i la deadline
        var row = $(
            '<tr><td>' + name + '</td><td>' + date_ms.toString() + '</td></tr>',
        )
            .attr('id', 'poll' + id) //afegeix link a la fila
            .css('cursor', 'pointer');
        if (poll.state == 'closed') {
            row.css('background-color', 'White')
                .hover(
                    function () {
                        $(this)
                            .css('background-color', '#e5e5e5')
                            .find('td')
                            .css('text-decoration', 'underline');
                    },
                    function () {
                        $(this)
                            .css('background-color', 'White')
                            .find('td')
                            .css('text-decoration', 'none');
                    },
                )
                .click(function () {
                    window.location =
                        '/results.html?id=' + $(this).attr('id').substr(4);
                });
        } else if (poll.state == 'closed_hidden') {
            row.css('background-color', '#d5d5d5')
                .hover(
                    function () {
                        $(this)
                            .css('background-color', '#c5c5c5')
                            .find('td')
                            .css('text-decoration', 'underline');
                    },
                    function () {
                        $(this)
                            .css('background-color', '#d5d5d5')
                            .find('td')
                            .css('text-decoration', 'none');
                    },
                )
                .click(function () {
                    window.location =
                        DOMAIN +
                        '/results.html?id=' +
                        $(this).attr('id').substr(4);
                });
        } else {
            row.css('background-color', '#B7E797')
                .hover(
                    function () {
                        $(this)
                            .css('background-color', '#a4cf87')
                            .find('td')
                            .css('text-decoration', 'underline');
                    },
                    function () {
                        $(this)
                            .css('background-color', '#B7E797')
                            .find('td')
                            .css('text-decoration', 'none');
                    },
                )
                .click(function () {
                    window.location =
                        DOMAIN +
                        '/poll.html?id=' +
                        $(this).attr('id').substr(4);
                });
        }

        $('#pollListContent').append(row); //afegeix fila a la taula
    }

    var table = $('#pollListTable').DataTable({
        order: [[1, 'desc']], //ordena per DL
        stateSave: true,
        fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull,
        ) {
            //canvia la data a un string, no es fa abans perque aixi quan li dones a ordenar ho fa per els milisegons i no per el string de la data
            var date = new Date(parseInt(aData[1]) / 1000);
            $('td:eq(1)', nRow).html(date.toLocaleString().slice(0, -3));
        },
        aoColumns: [{ bSearchable: true }, { bSearchable: false }],
    });

    $(':root').keydown(function (e) {
        if (e.keyCode == 13) {
            //enter
            var trToClick = $('#pollListContent').find('tr:nth-child(1)');
            if (trToClick.exists()) trToClick.click();
        }
    });
};
xhr.send();
