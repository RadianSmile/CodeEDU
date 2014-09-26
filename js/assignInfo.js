
Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");

/** test control**/
var now = new  Date();//Date (2014,8,30) ;
var currentUser = Parse.User.current() ;
var $D = $(document);
//console.log ("outer success , ",$("#assignModalInfo").length);
//var nth =  assignNth// 

 var getAsnDone,getInfoDone ;

// 原始頁面也需要的資訊


var AssignInfoArr = [];
var PersonalAssignArr = [] ;


	function qurPersonalAssign (currentUser){  /* FOR PERSONAL */
		var Assign = Parse.Object.extend("Assign");
		var q = new Parse.Query(Assign);
		q.equalTo("maker",currentUser);
		q.ascending("nth");
		//q.include("maker");
		return q.find();
	}
	function qurAssignInfo (){
		var AsnInfo = Parse.Object.extend("Assign_Info");
		var q = new Parse.Query(AsnInfo);
		return	q.find();
	}
	function getPersonalAssignByNthFromArr(nth){
		var a = PersonalAssignArr.getIndexByAttr("nth", nth) ;
		if (a >= 0 ){
			return PersonalAssignArr[a];
		}else{
			return -1;
		}
	}
	function getAssignInfoByNthFromArr(nth){
		var a = AssignInfoArr.getIndexByAttr("nth", nth) ;
		if (a >= 0 ){
		//	console.log(AssignInfoArr[a]);
			return AssignInfoArr[a];
		}else{
			return undefined;
		}
	}
	function addProfileGameSHref(){

		$('.game').each(function(i, e) {
			var $e = $(e);
			var nth = $e.data('nth').toString();
			var j = PersonalAssignArr.getIndexByAttr('nth',nth) ;
			
			if (j === -1 ){
				/*$e.parent(".machineBox").addClass("noGame");
				$e.data("toggle",'tooltip');
				$e.attr('title',"尚未遊戲");
				$e.tooltip();
				return true ;*/
			}else{
				console.log ("showing");
				//if (nth !== invisibleAsn.nth){
					//var gameUrl = 'play.html?aid='+UserAsns[j].id;
					//$e.attr('href',gameUrl);
					//$e.attr('target','_blank');
				//}else{
				//	$e.attr('title',"遊戲將於" +invisibleAsn.openDate+"評分結束後開放參觀");
				//	$e.data("toggle",'tooltip');
				//	$e.tooltip();
				//}
				$e.find('img').first().attr('src','img/games/dark-0'+nth+'.png');
			}
		});	
	}


	
	

	
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
		addProfileGameSHref();

		$apd = $("#assignInfoArea");
		for (var i = 1 ; i <= AssignInfoArr.length ; i++){    // Rn 6
			//console.log ("正在 append");
			//console.log (generateAssignInfo( i.toString()));
			$apd.append(generateAssignInfo( i.toString()));
			
		}
	}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function generateAssignInfo (nth) {
	console.log ("nth: ",nth);
	var asnInfo = getAssignInfoByNthFromArr(nth);
	var asn = getPersonalAssignByNthFromArr(nth);
	var isNewAsn =  asn === -1 ;

	var btns = "";
		makeAsnInfoBtns();
		return prepareModal ();

	function makeAsnInfoBtns (){
		var submitDate = asnInfo.get("submitDate");
		var reviewDate = asnInfo.get("reviewDate");
		var reviewDue = asnInfo.get("reviewDue");
		console.log ("submitDate: " +submitDate.toLocaleString());
		console.log ("reviewDate: " +reviewDate.toLocaleString());
		console.log ("reviewDue : " +reviewDue.toLocaleString());
		var uploadBtn =  
			'<div class="note">\
				<input class=" form-control input-md input-asnUrl" type="text" placeholder="請貼入遊戲play.html連結">\
				<a class="btn btn-default assignInfo-link assignInfo-main-btn submit-asnUrl" data-loading-text="新增遊戲連結中..."  data-nth="'+nth+'" >繳交遊戲連結</a>\
			</div>';

		var renewBtn =  
			'<div class="note">\
				<input class=" form-control input-md input-asnUrl" type="text" placeholder="貼入更新的遊戲play.html連結">\
				<a class="btn btn-default assignInfo-link submit-asnUrl" data-loading-text="更新遊戲連結中..." data-nth="'+nth+'" >更新遊戲連結</a>\
			</div>';

			
		var preUpload = 
			'<div class="note" style="color:black;">\
			 	 遊戲開放繳交日期：'+submitDate.toLocaleString()+' ~ '+reviewDate.toLocaleString()+'\
			 </div>';
				//<a class="btn btn-default assignInfo-link submit-asnUrl disabled" >上傳遊戲連結</a>\
			
		console.log (isNewAsn);
		var viewSelfBtn ='<a class="btn btn-default assignInfo-main-btn assignInfo-link view-self" href="play.html?aid='+ (!isNewAsn ? asn.id :"")  +'">檢視已繳交的作業</a>';
		var seperateLine = '<hr class="assignInfo-line">';
		var viewSelfBtnDuringReview ='<a class="btn btn-default assignInfo-link view-self" href="play.html?aid='+ (!isNewAsn ? asn.id :"")  +'">查看已繳交的作業</a>';
		var viewSelfBtn ='<a class="btn btn-default assignInfo-main-btn assignInfo-link view-self" href="play.html?aid='+ (!isNewAsn ? asn.id :"")  +'">檢視自己的遊戲</a>';
		var reviewBtn =  '<a class="btn btn-default assignInfo-main-btn  assignInfo-link to-review" href="review.html">前往評分</a>';
		var viewAllBtn =	'<a class="btn btn-default assignInfo-link view-other" href="games.html?nth='+nth+'">檢視全體的遊戲</a>';
	
		// 開始評分時的按鈕：

	
		var l ="";
		if (submitDate > now) { status = 1 ;l=" 第一區間：還沒開始作業" ;
			btns +=preUpload;}
		if (reviewDate > now && now > submitDate ){status = 2 ;	l =" 第二區間：開始作業";
			if (!isNewAsn){ 
				btns+=(viewSelfBtn);
				btns+=seperateLine;
				btns+= renewBtn ;
			}else{
			btns+= uploadBtn ;
			}
		}
		if (reviewDue > now && now  > reviewDate  ){	status = 3 ; l =" 第三區間：開始評分";
			btns+= reviewBtn + viewSelfBtnDuringReview ;}
		if (now > reviewDue){  status = 4 ;l ="四區間：結束評分";
			btns+= viewSelfBtn + viewAllBtn }	
		//alert (l);
		return btns;
	}
	
	function prepareModal(){
		//alert(btns);
		var imgUrl = 'img/games/' ;
		if (status < 4  ){
			if (isNewAsn){
				imgUrl+= "broke-0"+nth+".png" ;
			}else{
				imgUrl+= "dark-0"+nth+".png";
			}
		}else{
			imgUrl+= "light-0"+nth+".png";
		}

		var intro = asnInfo.get("intro");
		var req = asnInfo.get("req");
		var n = asnInfo.get("name");
		
		var assignInfoModal = '<div class="modal fade assignModalInfo" id="assignModalInfo'+nth+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		<div class="modal-dialog modal-lg" >\
			<div class="modal-content" >\
			\
			<div class="assign-info-outer">\
				<div class="assignInfo container-fluid">\
					<div class="row">\
							<div class="col-xs-3 ">\
								<div class="assignInfo-photo">\
			\						<img  src="'+imgUrl+'" width="100%" >\
								</div>\
							</div>\
						<div class=" col-xs-9">\
			\				<h2 class="assignInfo-name">'+n +'</h2>\
							<div class="des-block intro">\
								<h4>Introduction</h4>\
			\					<div class="des assignInfo-intro">'+intro+'</div>				\
							</div>\
							<div class="des-block requirement">\
								<h4>Requirement</h4>\
			\					<div class="des assignInfo-requirement">'+req+'</div>\
							</div>\
							<div class="links">\
								'+btns+' \
							</div>\
						</div>\
					</div>\
				</div>\
				</div>\
				</div>\
			</div>\
		</div>';
		console.log (assignInfoModal);
		return assignInfoModal;
	}	
}

// 在初始化的時候就要去判斷是否有 null 這個值


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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
				alert(s);
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
					console.log (d);
					alert(d);
					
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
