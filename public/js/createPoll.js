function createRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        try {
            var response = JSON.parse(this.responseText);
            if (response) {
                showModal('Success', 'Poll created without issue', false);
            } else {
                showModal(
                    'Error',
                    'There was some issue creating the poll',
                    false,
                );
            }
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

function removeColumn(reference) {
    $(reference).parent().remove();
}

function addColumn(reference) {
    if ($(reference).parent().find('.form-control')[0].value === '') {
        $(reference)
            .parent()[0]
            .classList.add('animate__animated', 'animate__shakeX');
        $(reference)
            .parent()[0]
            .addEventListener('animationend', () => {
                $(reference)
                    .parent()[0]
                    .classList.remove('animate__animated', 'animate__shakeX');
            });
    } else {
        $(reference).unbind();
        var newColumn = $(reference).parent().clone();
        newColumn.find('.form-control')[0].value = '';
        newColumn.find('.form-control')[0].placeholder = 'New Option';
        newColumn[0].classList.remove('animate__animated', 'animate__shakeX');
        newColumn.appendTo('#options');
        newColumn.find('.btn').click(function () {
            addColumn(this);
        });
        var thisColumn = $(reference).parent();
        thisColumn.find('.form-control')[0].disabled = true;
        thisColumn[0].classList.add('removable');
        thisColumn[0].classList.remove('addable');
        thisColumn.find('.fa')[0].classList.remove('fa-plus');
        thisColumn.find('.fa')[0].classList.add('fa-close');
        $(reference).click(function () {
            removeColumn(reference);
        });
    }
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
    $('.addable')
        .find('.btn')
        .click(function () {
            addColumn(this);
        });
    $('#create').click(function () {
        var isPriority = $('#priority')[0].checked;
        var isPrivate = $('#private')[0].checked;
        var pollName = $('#title')[0].value;
        if (pollName === '') {
            showModal('Error', 'The poll name can not be empty', false);
            return;
        }
        var description = $('#description')[0].value;
        var targetGroup = $('#target')[0].value;
        var deadline = new Date($('#datetime')[0].value);
        if ($('#datetime')[0].value === '') {
            showModal('Error', 'The deadline should be set', false);
            return;
        }
        var pollDeadline = deadline.getTime();
        var optionElements = $('.removable').find('.form-control');
        var pollOptions = [];
        for (opt of optionElements) {
            pollOptions.push(opt.value);
        }
        if (pollOptions.length < 2) {
            showModal('Error', 'There should be at least 2 options', false);
            return;
        }
        var body = {
            isPriority,
            isPrivate,
            pollDeadline,
            targetGroup,
            pollOptions,
            description,
            pollName,
        };
        var createRequest = new XMLHttpRequest();
        createRequest.addEventListener('load', createRequestListener);
        createRequest.open('POST', '/api/polls');
        createRequest.setRequestHeader('Content-Type', 'application/json');
        createRequest.send(JSON.stringify(body));
    });
});