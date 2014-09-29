// JavaScript Document

init_ai_dashboard ();
function init_ai_dashboard (){	
	qurPersonalAssign(currentUser).then(function (a){ 

		//console.log ("1!!!!!!!!!");
		getAsnDone = true; 
		PersonalAssignArr = a ;
		isNewAsn = (typeof (a) === 'undefined') ;
		controller();
	});
	qurAssignInfo().then(function(i){
		getInfoDone = true; 
		AssignInfoArr = i; 
		controller();
	});
	function controller (){
		if (getAsnDone && getInfoDone){
			start();
		}
	}
	
	function start(){
		addDashboardGameSHref();

		$apd = $("#assignInfoArea");
		for (var i = 1 ; i <= AssignInfoArr.length ; i++){    // Rn 6
			//console.log ("正在 append");
			//console.log (generateAssignInfo( i.toString()));
			$apd.append(generateAssignInfo( i.toString()));
			
		}
	}
}

function addDashboardGameSHref(){
	var now = new Date();
	$('.game').each(function(i, e) {
		var $e = $(e);
		var nth = $e.data('nth').toString();
		var j = PersonalAssignArr.getIndexByAttr('nth',nth) ;
		var AIj= AssignInfoArr.getIndexByAttr('nth',nth) ;
		if (AIj === -1 ){
			$e.parent(".machineBox").addClass("noGame");
			$e.data("toggle",'tooltip');
			$e.attr('title',"尚未發佈");
			$e.tooltip();
			return true ;
		}else{
			$e.css("display","block");
			var asnInfo = AssignInfoArr[AIj];
			if (j === -1){
				if ( now > asnInfo.get("submitDate") ){
					$e.attr('title',"上傳作業，繳交截止日期：" + asnInfo.get("reviewDue").toLocaleDateString() + asnInfo.get("reviewDue").toLocaleTimeString());
					$e.data("toggle",'tooltip');
				}else if (now > asnInfo.get("reviewDate")){
					$e.attr('title','遊戲未交');
					$e.data("toggle",'tooltip');
				}else{
					$e.attr('title',"預覽作業"+nth);
					$e.data("toggle",'tooltip');
				}
				$e.tooltip();

			}else{
				//var gameUrl = 'play.html?aid='+PersonalAssignArr[j].id;
				$e.attr('title',"遊戲已繳交");
				$e.data("toggle",'tooltip');
				//$e.attr('href',gameUrl);
				$e.attr('target','_blank');
				$e.tooltip();
				$e.find('img').first().attr('src','img/games/dark-0'+nth+'.png');

			}
		}
	});	
}


//////////////////////////////////////////////////////////////////////////////////////////


$D.on('click',".submit-asnUrl",function(e){
	var userDone = false ,
			checkDone = false ;

	$t = $(this)  ;
	$t.button('loading');
	$t.toggleDisabled();
	var nth = $t.data("nth").toString();


	
	var currentUserObj ;currentUser.fetch().then(function(u){
		currentUserObj=u ;
		if (u.get('role') !== 'student')
		{
			alert("你不是學生，不可以上傳作業");
			$t.button('reset');
			return false ;
			
		}
		userDone = true ;
		controlSave () ;
	},Log);
	$aI = $('.assignModalInfo');
	e.stopPropagation();
	
	var asn = getPersonalAssignByNthFromArr (nth);
	var isNewAsn = ( asn === -1 );
	
	var URL = 	$aI.find(".input-asnUrl").first().val();
	checkCode(URL); // it would both invoke check url and code ;

	function checkCode(URL){
		console.log (URL);
		$.ajax({
			url:"getcodeForGhost.php",
			data:	{url:URL},
			type: "POST",
			success: function(d,s,x){
				//alert(s);
				if (d==="no val"){
					alert("你沒有貼入連結");
					$t.button('reset');
					$t.toggleDisabled();
				}else if (d==="no play"){
					alert("無法讀取play.html檔，請確認\n1.連結是否正確\n2.檔案是已經否上傳了\n如果仍無法解決，請聯絡助教。")
					$t.button('reset');
					$t.toggleDisabled();
				}else if (d === "wrong host"){
					alert("要貼入的連結應該是 xxx.github.io/xxxx\n你是不是貼錯了?\n如果仍無法解決，請聯絡助教。")
					$t.button('reset');
					$t.toggleDisabled();
				}else if (d === "wrong play"){
					alert ("不正確的play.html，請確認\n1.你可能貼到的不是play.html的連結\n2.你的play.html內容或位置不正確，可嘗試重新做一個play.html\n如果仍無法解決，請聯絡助教。")
					$t.button('reset');
					$t.toggleDisabled();
				}else if (d === "no code"){
					alert("沒有正確存取到Play.html內data-processing-sources是否正確\n2.請確認檔案是否已經上傳到gh-pages\n如果仍無法解決，請聯絡助教。");
					$(this).toggleDisabled();
					$t.button('reset');
				}else{
					//console.log (d);
					//alert(d);
					
					checkDone = true ;
					controlSave();
				}		
		//		alert(d);
			}
		});
	}
	
	function controlSave(){
		if (userDone && checkDone){
			saveAssign();
		}
	}
	function saveAssign (){
		var asnUrl = URL ;
		var Asn = Parse.Object.extend("Assign");
		console.log ("isNewAsn",isNewAsn.toString());
		if (isNewAsn) {
			var savingasn = new Asn();
			savingasn.set("nth",nth);
			savingasn.set("maker",currentUser);
			savingasn.set("uid",currentUserObj.get('uid'))
		}else {
			savingasn = asn ;
		}
		savingasn.set("url",asnUrl);
		savingasn.save().then(function(s){
			if (isNewAsn){
				alert("作業繳交成功");
				$t.button('reset');
				$t.toggleDisabled();
				document.location.reload();
			}else{
				alert("作業更新成功");
				$t.button('reset');
				$t.toggleDisabled();
				document.location.reload();
			}
		},function(e){
			alert(e.message);
		})
	}
});
