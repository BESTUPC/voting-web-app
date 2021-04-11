function currentProfileRequestListener() {
    if (this.readyState === 4 && this.status === 200) {
        try {
            var response = JSON.parse(this.responseText);
            var profileImageURL = response.google.photos[0].value;
            document.getElementById('profileImage').src = profileImageURL;
            var membershipList = response.web.membership;
            globalVarsNav.membershipList = membershipList;
            globalVarsNav.userId = response.web.userId;
            var select = document.getElementById('membershipList');
            for (var i = 0; i < membershipList.length; i++) {
                var opt = membershipList[i];
                var el = document.createElement('li');
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
            if (membershipList.includes('admin')) {
                document.getElementById('navToggler').style.display = 'unset';
                const adminTools = document.getElementById('adminTools');
                if (adminTools !== null) adminTools.style.display = 'flex';
            } else {
                document.getElementById('navToggler').style.display = 'none';
                const adminTools = document.getElementById('adminTools');
                if (adminTools !== null) adminTools.style.display = 'none';
            }
        } catch {
            showModal(
                'Error',
                "We couldn't parse your user's information, you will be logged out",
                true,
            );
        }
    } else {
        console.log(e);
        showModal(
            'Error',
            "We couldn't access your user's information, you will be logged out",
            true,
        );
    }
}

var globalVarsNav = {
    membershipList: [],
    userId: '',
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
    document
        .getElementById('infoModal')
        .addEventListener('hidden.bs.modal', function (event) {
            if (logOut) {
                window.location.href = '/auth/logout';
            } else {
                window.location.reload();
            }
        });

    modalBootstrap.show();
}

$(document).ready(function () {
    var currentProfileRequest = new XMLHttpRequest();
    currentProfileRequest.addEventListener(
        'load',
        currentProfileRequestListener,
    );
    currentProfileRequest.open('GET', '/api/users/current');
    currentProfileRequest.setRequestHeader('Content-Type', 'application/json');
    currentProfileRequest.send();
});
