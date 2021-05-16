
 
 
/* ------------------------- */
/*   XMLHttpRequest Enable   */
/* ------------------------- */
 
function getXMLHttpRequest() {
    var xhr = null;
     
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Your browser doesn't support XMLHTTPRequest.");
        return null;
    }
     
    return xhr;
}
 
 
var xhr = getXMLHttpRequest()
 
 
 
/* ------------------------- */
/*           LOGIN           */
/* ------------------------- */
 
function login() {
 
var user_login      = document.getElementById('username').value;
var user_password   = document.getElementById('password').value;
 
xhr.open('post', 'traitement/authenti.php');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.onreadystatechange = loginReply;
xhr.send(null);
}
 
function loginReply(){
if(xhr.readyState == 4){
var response = xhr.responseText;
if (response == "no"){
document.getElementbyId('error').innerHTML = 'Login failed. Please check your login & password.';
}else{
document.getElementbyId('error').innerHTML = 'Login successful.';
}
}
}
