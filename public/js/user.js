function userRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        try {
            var response = JSON.parse(this.responseText);
            $('#name').text(response.name); //add name to html
            $('title').text(response.name); //add name to page name
            $('#email').text(response.email); //add email to html
            var membershipList = response.membership; //get membership
            var checkedMember = membershipList.includes('member')
                ? 'on'
                : 'off';
            var checkedFull = membershipList.includes('full') ? 'on' : 'off';
            var checkedAdmin = membershipList.includes('admin') ? 'on' : 'off';
            $('#member').bootstrapToggle(checkedMember);
            $('#full').bootstrapToggle(checkedFull);
            $('#admin').bootstrapToggle(checkedAdmin);
        } catch {
            showModal(
                'Error',
                "We couldn't parse the user's information",
                false,
            );
        }
    } else {
        showModal('Error', "We couldn't access the user's information", false);
    }
}

function applyRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        if (response)
            showModal('Info', "Memberships updated", false);
    } else {
        showModal('Error', "We couldn't update the memberships", false);
    }
}

var globalVarsNav = {
    membershipList: [],
};

function showModal(title, message, logOut) {
    document.getElementById('infoModalTitle').innerHTML = title;
    document.getElementById('infoModalBody').innerHTML = message;
    var modalBootstrap = new bootstrap.Modal(
        document.getElementById('infoModal'),
        {
            keyboard: false,
        },
    );
    if (logOut) {
        document
            .getElementById('infoModal')
            .addEventListener('hidden.bs.modal', function (event) {
                window.location.href = '/auth/logout';
            });
    }
    modalBootstrap.show();
}

var globalVarsUser = {
    id: '',
};

$(document).ready(function () {
    $('#navbar').load('navbar.html');

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
    globalVarsUser.id = id;
    var userRequest = new XMLHttpRequest();
    userRequest.addEventListener('load', userRequestListener);
    userRequest.open('GET', '/api/users/' + id);
    userRequest.setRequestHeader('Content-Type', 'application/json');
    userRequest.send();
    $('#apply').click(function () {
        var applyRequest = new XMLHttpRequest();
        applyRequest.addEventListener('load', applyRequestListener);
        applyRequest.open('PATCH', '/api/users/membership/' + id);
        applyRequest.setRequestHeader('Content-Type', 'application/json');
        var membership = ['all'];
        if ($('#member').prop('checked')) {
            membership.push('member');
        }
        if ($('#admin').prop('checked')) {
            membership.push('admin');
        }
        if ($('#full').prop('checked')) {
            membership.push('full');
        }
        var body = {
            membership,
        };
        applyRequest.send(JSON.stringify(body));
    });
});
