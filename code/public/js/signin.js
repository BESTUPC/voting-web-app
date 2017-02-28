function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://localhost:3000/tokensignin');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);

  //la sessio caduca en 300 dies
  setCookie("idtoken",id_token,300);
  profile=googleUser.getBasicProfile()
  setCookie("profile",JSON.stringify({
    name: profile.getName(),
    email: profile.getEmail(),
    id: profile.getId(),
    imageUrl: profile.getImageUrl()
  }),300)
  //alert(JSON.stringify(googleUser.getBasicProfile()))
  window.location = "http://localhost:3000";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
    //alert(expires);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
