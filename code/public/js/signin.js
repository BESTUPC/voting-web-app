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
  setCookie("profile",JSON.stringify(googleUser.getBasicProfile()),300);
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
