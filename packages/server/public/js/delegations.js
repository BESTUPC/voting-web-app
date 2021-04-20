function deleteAllRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response) showModal('Info', 'Delegations deleted', false, '');
        else {
            showModal('Error', "We couldn't delete the delegations", false, '');
        }
    } else {
        showModal('Error', "We couldn't delete the delegations", false, '');
    }
}

function createRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response) showModal('Info', 'Delegation created', false, '');
        else {
            showModal('Error', "We couldn't create the delegation", false, '');
        }
    } else {
        showModal('Error', "We couldn't create the delegation", false, '');
    }
}

function deleteRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response) showModal('Info', 'Delegation deleted', false, '');
        else {
            showModal('Error', "We couldn't delete the delegation", false, '');
        }
    } else {
        showModal('Error', "We couldn't delete the delegation", false, '');
    }
}

function getUsersRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        for (user of response) {
            $('#delegator').append(
                '<option value="' +
                    user.userId +
                    '">' +
                    user.name +
                    '</option>',
            );
            $('#receiver').append(
                '<option value="' +
                    user.userId +
                    '">' +
                    user.name +
                    '</option>',
            );
        }
        $('.selectpicker').selectpicker('refresh');
    } else {
        showModal('Error', "We couldn't get the users", false, '');
    }
}

function getUsersDelegatedRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        var i = 0;
        for (var row of $('tbody tr td')) {
            var name = response.find((user) => user.userId === row.innerHTML);
            if (name !== undefined)
                row.innerHTML = response.find(
                    (user) => user.userId === row.innerHTML,
                ).name;
        }
    } else {
        showModal('Error', "We couldn't get the users", false, '');
    }
}

$(document).ready(function () {
    $('#navbar').load('navbar.html');
    $('#deleteAll').click(function () {
        var deleteAllRequest = new XMLHttpRequest();
        deleteAllRequest.addEventListener('load', deleteAllRequestListener);
        deleteAllRequest.open('DELETE', '/api/delegations');
        deleteAllRequest.send();
    });
    $('#createDelegation').click(function () {
        var createRequest = new XMLHttpRequest();
        createRequest.addEventListener('load', createRequestListener);
        var delegator = $('#delegator').selectpicker('val');
        var receiver = $('#receiver').selectpicker('val');
        createRequest.open('POST', `/api/delegations/${delegator}/${receiver}`);
        createRequest.send();
    });

    var table = $('#delegationListTable').DataTable({
        ajax: {
            url: '/api/delegations',
            dataSrc: '',
        },
        columns: [{ data: 'userIdDelegator' }, { data: 'userIdReceiver' }],
        order: [[1, 'desc']],
        stateSave: true,
        fnRowCallback: function (
            nRow,
            aData,
            iDisplayIndex,
            iDisplayIndexFull,
        ) {
            var getUsersDelegatedRequest = new XMLHttpRequest();
            getUsersDelegatedRequest.addEventListener(
                'load',
                getUsersDelegatedRequestListener,
            );
            getUsersDelegatedRequest.open('GET', '/api/users');
            getUsersDelegatedRequest.send();
        },
        aoColumns: [{ bSearchable: true }, { bSearchable: true }],
    });
    $('#delegationListTable tbody').on('click', 'tr', function () {
        var data = table.row(this).data();
        var deleteRequest = new XMLHttpRequest();
        deleteRequest.addEventListener('load', deleteRequestListener);
        deleteRequest.open('DELETE', `/api/delegations/${data._id}`);
        deleteRequest.send();
    });
    var getUsersRequest = new XMLHttpRequest();
    getUsersRequest.addEventListener('load', getUsersRequestListener);
    getUsersRequest.open('GET', '/api/users');
    getUsersRequest.send();
});
