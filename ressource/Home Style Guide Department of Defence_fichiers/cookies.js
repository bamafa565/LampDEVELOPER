// createCookie( name, value, days ) / readCookie( name ) / eraseCookie( name )
function createCookie(e,t,n){if(n){var r=new Date;r.setTime(r.getTime()+n*24*60*60*1e3);var i="; expires="+r.toGMTString()}else var i="";document.cookie=e+"="+t+i+"; path=/"}function readCookie(e){var t=e+"=";var n=document.cookie.split(";");for(var r=0;r<n.length;r++){var i=n[r];while(i.charAt(0)==" ")i=i.substring(1,i.length);if(i.indexOf(t)==0)return i.substring(t.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}

// Disable responsive version if requested by the user
if( readCookie('notResponsive') ) {
	var metas = document.getElementsByTagName('meta');
	for( var i=0; i<metas.length; i++ ) {
		if( metas[i].name=='viewport') {
			metas[i].content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6'
		}
	}
	var html = document.getElementsByTagName('html')[0];
	var body_class = ' '+html.className+' ';         
	html.className = body_class.replace( ' responsive ', '' );
	 
	var htmlBody = document.getElementsByTagName('body')[0];
	//alert(htmlBody.className);
	var htmlBodyReplace = htmlBody.className;
	htmlBody.className = htmlBodyReplace.replace('responsive', ' ');
	//alert(htmlBody.className);
}
