function Cookie(){

	this.setCookie = function(cname, cvalue, exdays){
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path/=";
	}

	this.getCookie = function (cname) {
		var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i < ca.length; i++) {
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

	this.eraseCookie = function(cname){
		this.setCookie(cname,"",-1);
	}

	this.getCookieConsent = function(){  
	    if(this.getCookie("cookieConsent") != "ok"){
	      	$('#cookie').css('display', 'inherit');
	    }

	    var that = this; 
	    $('#cookieConsent').on('click', function(){
	      	that.setCookie("cookieConsent", "ok", 30);
	      	$('#cookie').css('display', 'none');
	    });

	    $('#cookie .close').on('click', function(){
	      	$('#cookie').css('display', 'none');
	    });
	}

	this.checkCookieConsent = function(){
	    if(this.getCookie("cookieConsent") != "ok"){
	    	return false;
	    } else {
	      	return true;
	    }
	}
}