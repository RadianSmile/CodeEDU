$.post("getip.php",{},logip);
function logip(ip,s,x){
	if (currentUser){
		var SignInLog = Parse.Object.extend("Signin_Log") ;
		var signinlog = new SignInLog ();
		signinlog.set("ip",ip);
		signinlog.set("user",currentUser);
		signinlog.save().then(function(s){
			console.log (ip);
			//alert("signin! "+ip );
		},function (e){
			//alert(e.message);
		});
	}
}
