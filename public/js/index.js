$(document).ready(function () {
    $('#navbar').load('navbar.html');
    var table = $('#pollListTable').DataTable({
        ajax: {
            url: '/api/polls',
            dataSrc: '',
        },
        columns: [{ data: 'pollName' }, { data: 'pollDeadline' }],
        order: [[1, 'desc']],
        stateSave: true,
        fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull,
        ) {
            var state = aData.state;
            if (state === 'open') {
                nRow.style.backgroundColor = 'rgba(63, 191, 63, 0.3)';
            } else if (state === 'closed_hidden') {
                nRow.style.backgroundColor = 'rgba(100, 100, 100, 0.3)';
            } else {
                nRow.style.backgroundColor = 'white';
            }
            var date = new Date(parseInt(aData.pollDeadline));
            $('td:eq(1)', nRow).html(date.toLocaleString().slice(0, -3));
        },
        aoColumns: [{ bSearchable: true }, { bSearchable: false }],
    });
    $('#pollListTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        if (data.state == 'closed') {
            window.location = '/results.html?id=' + data._id;
        } else if (data.state == 'closed_hidden') {
            window.location = '/results.html?id=' + data._id;
        } else {
            window.location = '/poll.html?id=' + data._id;
        }
    });
});
var row = '';
