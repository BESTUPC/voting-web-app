function initNavBar(profile){
	$('#navbar-photo').attr('src',profile.imageUrl)
	$('#username').text(profile.name)
	var xhrNav = new XMLHttpRequest();
    xhrNav.open('POST', 'http://localhost:3000/getMembership');
    xhrNav.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhrNav.onload = function() {
        var response=JSON.parse(xhrNav.responseText);
				var membership = response.membership;
        membership.sort();
        var isAdmin = 0
        for (i in membership){
        	role=membership[i]
        	if (role!='all'){
        		$('#membership').append('<em style="display:block">'+role+'</em>')
        		if(role=='admin')isAdmin=1
        	}
        }
        if(!isAdmin){
        	$('#sidebar').remove()
        	$('#navbar-toggle').remove()
        	$('#page-wrapper').css('margin','0')
    	}
    }
    xhrNav.send('userId=' + profile.id);
}
