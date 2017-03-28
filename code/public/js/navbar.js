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
    $('#modalButton').click(f);
    $('#modalClose').click(f);
    $('#errorModal').modal('show');
}
function success( title, message , f) {
    if (f == undefined)f=function(){};
    $('#modal-title-text').text(title);
    $('#modal-text').text(message);
    $('#header-box-errorModal').css('background-color','rgb(190,215,70)');
    $('#footer-box-errorModal').css('background-color','rgb(190,215,70)');
    $('#modalButton').click(f);
    $('#modalClose').click(f);
    $('#errorModal').modal('show');
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
        if(!isAdmin){
        	$('#sidebar').remove();
        	$('#navbar-toggle').remove();
        	$('#page-wrapper').css('margin','0');
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
}
