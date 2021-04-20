var globalVarsResults = {
    id: '',
    isPriority: false,
};

$(document).ready(function () {
    $('#navbar').load('navbar.html', function () {});
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    globalVarsResults.id = urlParams.get('id');
    $('#update').click(function () {
        var updatePollRequest = new XMLHttpRequest();
        updatePollRequest.addEventListener('load', function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response) {
                    showModal(
                        'Success',
                        'We updated the state',
                        false,
                        '/index.html',
                    );
                } else {
                    showModal(
                        'Error',
                        "We couldn't update the state",
                        false,
                        '',
                    );
                }
            } else {
                showModal('Error', "We couldn't update the state", false, '');
            }
        });
        updatePollRequest.open(
            'PATCH',
            '/api/polls/state/' + globalVarsResults.id,
        );
        updatePollRequest.setRequestHeader('Content-Type', 'application/json');
        updatePollRequest.send();
    });

    $('#delete').click(function () {
        var deletePollRequest = new XMLHttpRequest();
        deletePollRequest.addEventListener('load', function () {
            if (this.readyState === 4 && this.status === 200) {
                var response = JSON.parse(this.responseText);
                if (response) {
                    showModal(
                        'Success',
                        'We deleted the poll',
                        false,
                        '/index.html',
                    );
                } else {
                    showModal(
                        'Error',
                        "We couldn't delete the poll",
                        false,
                        '',
                    );
                }
            } else {
                showModal('Error', "We couldn't delete the poll", false, '');
            }
        });
        deletePollRequest.open('DELETE', '/api/polls/' + globalVarsResults.id);
        deletePollRequest.setRequestHeader('Content-Type', 'application/json');
        deletePollRequest.send();
    });
    var getPollRequest = new XMLHttpRequest();
    getPollRequest.addEventListener('load', function () {
        if (getPollRequest.readyState === 4 && getPollRequest.status === 200) {
            var poll = JSON.parse(getPollRequest.responseText);
            $('#title').text(poll.pollName);
            $('#description').text(poll.description);
            $('#abstention').css({
                display: poll.abstentionIsValid ? 'unset' : 'none',
            });
            $('#private').css({
                display: poll.isPrivate ? 'unset' : 'none',
            });
            $('#priority').css({
                display: poll.isPriority ? 'unset' : 'none',
            });
            $(`#${poll.approvalRatio}`).css({
                display: 'unset',
            });
        } else {
            showModal(
                'Error',
                "We couldn't get the poll",
                false,
                '/index.html',
            );
        }
    });
    getPollRequest.open('GET', `/api/polls/${globalVarsResults.id}`);
    getPollRequest.send();
    var data = {
        // A labels array that can contain any sort of values
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        // Our series array that contains series objects or in this case series data arrays
        series: [[5, 2, 4, 2, 0]],
    };
    var options = {
        axisY: {
            showLabel: false,
        },
    };
    var chart = new Chartist.Bar('.ct-chart', data, options);
    var drawn = 0;
    chart.on('draw', function (dataDraw) {
        if (drawn < data.series.length) {
            console.log(dataDraw);
            console.log(dataDraw.series[dataDraw.index]);
            var ms_total = 5000;
            var duration =
                (ms_total * data.series[dataDraw.index]) /
                Math.max.apply(null, data.series);
            console.log(duration);
            dataDraw.element.animate({
                y2: {
                    begin: 0,
                    dur: duration,
                    from: dataDraw.y1,
                    to: dataDraw.y2,
                    easing: Chartist.Svg.Easing.linear,
                },
            });
            drawn++;
            // setTimeout(
            //     function (data) {
            //         barHorizontalCenter = data.x1 + data.element.width() * 0.5;
            //         barVerticalCenter = data.y2 - 10;
            //         value = data.element.attr('ct:value');
            //         label = new Chartist.Svg('text');
            //         label.text('' + value + ' vots');
            //         label.addClass('ct-barlabel');
            //         label.attr({
            //             x: barHorizontalCenter,
            //             y: barVerticalCenter,
            //             'text-anchor': 'middle',
            //         });
            //         data.group.append(label);
            //     },
            //     duration,
            //     data,
            // );
        } else {
            // barHorizontalCenter = data.x1 + data.element.width() * 0.5;
            // barVerticalCenter = data.y1 + data.element.height() * -1 - 10;
            // value = data.element.attr('ct:value');
            // label = new Chartist.Svg('text');
            // label.text('' + value + ' vots');
            // label.addClass('ct-barlabel');
            // label.attr({
            //     x: barHorizontalCenter,
            //     y: barVerticalCenter,
            //     'text-anchor': 'middle',
            // });
            // data.group.append(label);
        }
    });
    var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});
