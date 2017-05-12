function gup( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
function error( title, message, f ) {
    if (f == undefined)f=function(){};
    $('#modal-title-text').text(title);
    $('#modal-text').text(message);
    $('#header-box-errorModal').css('background-color','rgb(241,103,103)');
    $('#footer-box-errorModal').css('background-color','rgb(241,103,103)');

    $('#errorModal').modal('show').on('hidden.bs.modal',f);
}
function success( title, message , f) {
    if (f == undefined)f=function(){};
    $('#modal-title-text').text(title);
    $('#modal-text').text(message);
    $('#header-box-errorModal').css('background-color','rgb(190,215,70)');
    $('#footer-box-errorModal').css('background-color','rgb(190,215,70)');

    $('#errorModal').modal('show').on('hidden.bs.modal',f);
}
function goHome(){
    window.location = DOMAIN + '/index.html';
}
function goLogin(){
    window.location = DOMAIN + '/login.html';
}
function initNavBar(profile){
    $.fn.exists = function () {
        return this.length !== 0;
    };
	$('#navbar-photo').attr('src',profile.imageUrl);
	$('#username').text(profile.name);
	var xhrNav = new XMLHttpRequest();
    xhrNav.open('POST', URL + '/getUserInfo');
    xhrNav.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhrNav.onload = function() {
        var response=JSON.parse(xhrNav.responseText);
        //alert(xhrNav.responseText);
        if (response.status!='0'){
            error('Error',response.message,goLogin());
            return 0;
        }
		var membership = response.membership;
        membership.sort();
        var isAdmin = 0;
        for (i in membership){
        	role=membership[i];
        	if (role!='all'){
        		$('#membership').append('<em style="display:block">'+role+'</em>');
        		if(role=='admin')isAdmin=1;
        	}
        }
        if(isAdmin){
        	$('#sidebar').css('display','block');
        	$('#navbar-toggle').css('display','block');
        	$('#page-wrapper').css('margin','0 0 0 250 px');
    	}
    };
    xhrNav.send('userId='+profile.id);
    $(':root').keydown(function(e){
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) { //CTRL F
            var input=$('body').find('input[type=search]');
            if (input.exists()){
                input.focus();
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }
        else if(e.keyCode==13){ //ENTER
            if( $('#errorModal').hasClass('in') ){
                e.stopImmediatePropagation();
                $('#modalButton').click();
            }
        }
        else if(e.keyCode==27){ //ESC
            goHome();
            e.stopImmediatePropagation();
        }
    });

    var path=window.location.pathname;
    if(path=='/poll.html' || path=='/results.html'){
        pollId=gup('id');
        $('#side-menu').append('<li><div style="padding-left:15px" class="text-primary h4"> Poll tools </div></li><li><div style="padding:10px 5px 10px 15px; display:inline-block" class="text-primary"><i class="fa fa-exchange fa-fw"></i> Set state</div><select id="selectState" style="vertical-align: middle;"><option>Open</option><option>Closed hidden</option><option>Closed</option></select><div id="stateBtn" class="btn btn-primary" style="font-size:10px; padding:3px 1px; margin-left: 5px">SET</div></li>');
        $('#stateBtn').click(function () {
            var val= $('#selectState').val();
            var id_token = getCookie("idtoken");
            // /setState(idtoken, pollID, state)
            var state;
            if(val=='Open')state='open';
            if(val=='Closed hidden')state='closed_private';
            if(val=='Closed')state='closed';

            var xhrState = new XMLHttpRequest();
            xhrState.open('POST', URL + '/setState');
            xhrState.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhrState.onload = function() {
                var response=JSON.parse(xhrState.responseText);
                if (response.status!='0'){
                    error('Error',response.message,goHome());
                    return 0;
                }
                else success('Success','State changed successfully',goHome());
            };
            xhrState.send('idtoken='+id_token+'&pollId='+pollId+'&state='+state);
        });
    }
}
