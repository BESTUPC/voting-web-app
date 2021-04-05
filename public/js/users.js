$(document).ready(function () {
    $('#navbar').load('navbar.html');
    var table = $('#userListTable').DataTable({
        ajax: {
            url: '/api/users',
            dataSrc: '',
        },
        responsive: {
            responsive: true,
        },
        columns: [
            { data: 'name' },
            { data: 'email' },
            { data: 'email' },
            { data: 'email' },
            { data: 'email' },
        ],
        order: [[1, 'desc']],
        stateSave: true,
        fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull,
        ) {
            var iconClose = 'fa-close';
            var iconCheck = 'fa-check';
            var iconAdmin = aData.membership.includes('admin')
                ? iconCheck
                : iconClose;
            var iconMember = aData.membership.includes('member')
                ? iconCheck
                : iconClose;
            var iconFull = aData.membership.includes('full')
                ? iconCheck
                : iconClose;
            $('td:eq(2)', nRow).html('<i class="fa ' + iconMember + '"></i>');
            $('td:eq(3)', nRow).html('<i class="fa ' + iconFull + '"></i>');
            $('td:eq(4)', nRow).html('<i class="fa ' + iconAdmin + '"></i>');
        },
        aoColumns: [
            { bSearchable: true },
            { bSearchable: true },
            { bSearchable: true },
            { bSearchable: true },
            { bSearchable: true },
        ],
    });
    $('#userListTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        window.location = '/user.html?id=' + data.userId;
    });
});
