// JavaScript Document

      window.fbAsyncInit = function() {
         Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");	
					Parse.FacebookUtils.init({
    			 appId      : '1452756891666119', // Facebook App ID
          xfbml      : true,
					 cookie     : true, // enable cookies to allow Parse to access the session
  				  version    : 'v1.0'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/all.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));





