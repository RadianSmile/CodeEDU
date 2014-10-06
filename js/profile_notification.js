function showNotificationBtn (profileUser){
	var viewUser = Parse.User.current();
	viewUser.fetch().then(function (s){
		if (typeof s === 'undefined'){
			
		}else{
			if (s.get("role") === 'TA' ||s.get("role") === 'teacher' ){
				var $nav = $("#main-navigation");
				var ID = profileUser.get("ID");
				var html = "<li><a href='notification.html?uid="+ID+"'>Notification</a></li>";
				$nav.append(html);
			}
		}
	});
}