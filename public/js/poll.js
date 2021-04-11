function sendVoteRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        try {
            var response = JSON.parse(this.responseText);
            if (response) {
                showModal('Success', 'Vote updated', false);
            } else {
                showModal('Success', 'Vote option was already set', false);
            }
        } catch {
            showModal('Error', 'There was some issue sending the vote', false);
        }
    } else {
        showModal('Error', 'There was some issue sending the vote', false);
    }
}

function getDelegationsRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        var getUsersDelegatedRequest = new XMLHttpRequest();
        getUsersDelegatedRequest.addEventListener('load', function () {
            if (
                getUsersDelegatedRequest.readyState === 4 &&
                getUsersDelegatedRequest.status === 200
            ) {
                var users = JSON.parse(getUsersDelegatedRequest.responseText);
                var getPollRequest = new XMLHttpRequest();
                getPollRequest.addEventListener('load', function () {
                    if (
                        getPollRequest.readyState === 4 &&
                        getPollRequest.status === 200
                    ) {
                        var poll = JSON.parse(getPollRequest.responseText);
                        var getVoteRequest = new XMLHttpRequest();
                        getVoteRequest.addEventListener('load', function () {
                            if (
                                getVoteRequest.readyState === 4 &&
                                (getVoteRequest.status === 200 ||
                                    getVoteRequest.status === 404)
                            ) {
                                if (getVoteRequest.status === 200) {
                                    var vote = JSON.parse(
                                        getVoteRequest.responseText,
                                    );
                                    if (poll.isPriority) {
                                        var optionSelected = vote.option;
                                    } else {
                                        var optionSelected =
                                            vote.option.length > 0
                                                ? vote.option[0]
                                                : '';
                                    }
                                } else {
                                    var optionSelected = '';
                                }
                                $('#title').text(poll.pollName);
                                $('#description').text(poll.description);
                                $('#private').css({
                                    display: poll.isPrivate ? 'unset' : 'none',
                                });
                                $('#priority').css({
                                    display: poll.isPriority ? 'unset' : 'none',
                                });
                                globalVarsPoll.isPriority = poll.isPriority;
                                var optionsSorted =
                                    poll.isPriority && optionSelected.length > 0
                                        ? optionSelected
                                        : poll.pollOptions;
                                for (var option of optionsSorted) {
                                    var html = '';
                                    if (option === optionSelected) {
                                        html = `<div data-id="${option}" style="margin-bottom: 20px"><input
                                                    type="radio"
                                                    class="btn-check"
                                                    name="options"
                                                    id="${option}"
                                                    value=${option}
                                                    autocomplete="off"
                                                    checked
                                                />
                                                <label class="btn btn-outline-primary" for="${option}"
                                                    >${option}</label
                                                ></div>`;
                                    } else if (poll.isPriority) {
                                        html = `<div data-id="${option}" style="margin-bottom: 20px" ><input
                                                    type="radio"
                                                    class="btn-check"
                                                    name="options"
                                                    id="${option}"
                                                    value=${option}
                                                    autocomplete="off"
                                                    disabled
                                                />
                                                <label class="btn btn-outline-primary" for="${option}"
                                                    >${option}</label
                                                ></div>`;
                                    } else {
                                        html = `<div data-id="${option}" style="margin-bottom: 20px"><input
                                                    type="radio"
                                                    class="btn-check"
                                                    name="options"
                                                    id="${option}"
                                                    data-id="${option}"
                                                    value=${option}
                                                    autocomplete="off"
                                                />
                                                <label class="btn btn-outline-primary" for="${option}"
                                                    >${option}</label
                                                ></div>`;
                                    }

                                    $('#options').append(html);
                                }
                                if (poll.isPriority) {
                                    var optionsDraggable = document.getElementById(
                                        'options',
                                    );
                                    globalVarsPoll.sortable = Sortable.create(
                                        optionsDraggable,
                                        {
                                            /* options */
                                        },
                                    );
                                }
                                for (delegation of response) {
                                    var delegatorUser = users.find(
                                        (user) =>
                                            user.userId ===
                                            delegation.userIdDelegator,
                                    );
                                    $('#voter').append(
                                        '<option value="' +
                                            delegation.userIdDelegator +
                                            '">' +
                                            delegatorUser.name +
                                            '</option>',
                                    );
                                }
                                $('#voter').append(
                                    '<option selected style="" value="' +
                                        globalVarsNav.userId +
                                        '">' +
                                        'Current User' +
                                        '</option>',
                                );
                                $('.selectpicker').selectpicker('refresh');
                            } else {
                                showModal(
                                    'Error',
                                    "We couldn't get the vote",
                                    false,
                                );
                            }
                        });
                        getVoteRequest.open(
                            'GET',
                            `/api/votes/${globalVarsNav.userId}/${globalVarsPoll.id}`,
                        );
                        getVoteRequest.send();
                    } else {
                        showModal(
                            'Error',
                            "We couldn't update the memberships",
                            false,
                        );
                    }
                });
                getPollRequest.open('GET', `/api/polls/${globalVarsPoll.id}`);
                getPollRequest.send();
            } else {
                showModal('Error', "We couldn't get the users", false);
            }
        });
        getUsersDelegatedRequest.open('GET', '/api/users');
        getUsersDelegatedRequest.send();
    } else {
        showModal('Error', "We couldn't get the delegations", false);
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

function getUsersDelegatedRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        var response = JSON.parse(this.responseText);
        var i = 0;
        for (row of $('tbody tr td')) {
            row.innerHTML = response.find(
                (user) => user.userId === row.innerHTML,
            ).name;
        }
    } else {
        showModal('Error', "We couldn't get the users", false);
    }
}

var globalVarsPoll = {
    id: '',
    sortable: '',
    isPriority: false,
};

$(document).ready(function () {
    $('#navbar').load('navbar.html', function () {});
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    globalVarsPoll.id = urlParams.get('id');
    $('#send').click(function () {
        if (!globalVarsPoll.isPriority) {
            var selectedOption = $("input[name='options']:checked").val();
            if (selectedOption === undefined) {
                showModal('Error', 'An option should be selected', false);
                return;
            }
            selectedOption = [selectedOption];
        } else {
            var selectedOption = globalVarsPoll.sortable.toArray();
        }
        var voter = $('#voter').selectpicker('val');
        if (voter === undefined) {
            showModal('Error', 'A voter should be selected', false);
            return;
        }
        var body = {
            pollId: globalVarsPoll.id,
            option: selectedOption,
        };
        var uri =
            voter === globalVarsNav.userId
                ? '/api/votes'
                : '/api/votes/' + voter;
        var sendVoteRequest = new XMLHttpRequest();
        sendVoteRequest.addEventListener('load', sendVoteRequestListener);
        sendVoteRequest.open('POST', uri);
        sendVoteRequest.setRequestHeader('Content-Type', 'application/json');
        sendVoteRequest.send(JSON.stringify(body));
    });
    var getDelegationsRequest = new XMLHttpRequest();
    getDelegationsRequest.addEventListener(
        'load',
        getDelegationsRequestListener,
    );
    getDelegationsRequest.open(
        'GET',
        `/api/delegations/${globalVarsNav.userId}`,
    );
    getDelegationsRequest.send();
    $('#voter').on(
        'changed.bs.select',
        function (e, clickedIndex, isSelected, previousValue) {
            var getVoteRequest = new XMLHttpRequest();
            getVoteRequest.addEventListener('load', function () {
                if (
                    getVoteRequest.readyState === 4 &&
                    getVoteRequest.status === 200
                ) {
                    var vote = JSON.parse(getVoteRequest.responseText);
                    var optionSelected =
                        vote.option.length === 1 ? vote.option[0] : vote.option;
                    if (!globalVarsPoll.isPriority) {
                        for (var check of $('.btn-check')) {
                            if (check.value === optionSelected) {
                                check.checked = true;
                            } else {
                                check.checked = false;
                            }
                        }
                    } else {
                        globalVarsPoll.sortable.sort(optionSelected);
                    }
                } else if (getVoteRequest.status === 404) {
                    for (var check of $('.btn-check')) {
                        check.checked = false;
                    }
                } else {
                    showModal('Error', "We couldn't get the vote", false);
                }
            });
            getVoteRequest.open(
                'GET',
                `/api/votes/${$('#voter').selectpicker('val')}/${
                    globalVarsPoll.id
                }`,
            );
            getVoteRequest.send();
        },
    );
});
