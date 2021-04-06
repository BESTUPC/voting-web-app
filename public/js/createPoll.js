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
        if (response) showModal('Info', 'Memberships updated', false);
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

function removeColumn(reference) {
    $(reference).parent().remove();
}

function addColumn(reference) {
    $(reference).click(function () {
        removeColumn(reference);
    });
    var newColumn = $(reference).parent().clone();
    newColumn.find('.form-control')[0].value = '';
    newColumn.appendTo('#options');
    var thisColumn = $(reference).parent();
    thisColumn.find('.form-control')[0].disabled = true;
    thisColumn[0].classList.add('removable');
    thisColumn.find('.fa')[0].classList.remove('fa-plus');
    thisColumn.find('.fa')[0].classList.add('fa-close');
    thisColumn.find('.btn').click(function () {
        addColumn(reference);
    });
}

var globalVarsUser = {
    id: '',
};

$(document).ready(function () {
    $('#navbar').load('navbar.html');

    $('.removable')
        .find('.btn')
        .click(function () {
            removeColumn(this);
        });
    $('#add')
        .find('.btn')
        .click(function () {
            addColumn(this);
        });
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
