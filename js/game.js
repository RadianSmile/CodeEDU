

/** test control**/
var now = new Date ()//(2014,8,30) ;
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
			return undefined;
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
		for (var i = 1 ; i <= AssignInfoArr.length ; i++){    // Rn 6
			$(generateAssignInfo(i.toString())).insertAfter("#assignInfoArea");
		}
		for (i = 1 ; i <= 6 ; i++ ){
			changeIndexGame(i,$(".indexGame").eq(i-1));
		}
	}

/////////////////////////////////

function changeIndexGame (nth,$e){
	var asnInfo = getAssignInfoByNthFromArr(nth);
	console.log ("asnInfo",asnInfo);
	if (asnInfo === -1 || typeof(asnInfo) === 'undefined'){
		$e.addClass("noGame");
		$e.data("toggle","tooltip");
		$e.attr("title","尚未發佈");
	}else{
		var reviewDue = asnInfo.get("reviewDue");
		var reviewDueString = reviewDue.toLocaleDateString() + reviewDue.toLocaleTimeString();
		var now = new Date ();

		if (now > reviewDue){  
			$e.find('img').first().attr('src','img/games/light-0'+nth+'.png')
			$e.addClass("repaired");
			$e.data("toggle","tooltip");
			$e.attr("title","快點進來玩");
			//hoverChange($e);
		}else{
			$e.addClass("repairing");
			$e.data("toggle","tooltip");
			$e.attr("title","創作中的遊戲...將在"+reviewDueString+"開放");
		}
	}
	$e.tooltip();
}

/*
function hoverChange($e){
	var nth = $e.data("nth");
	$img = $e.find("img").eq(0) ;
	var oPath = $img.attr("src");
	var nPath = "img/games/light-0"+nth+".png";
	$e.hover(function(i){
		//$img.attr("src",nPath);
	},function(o){
		$img.attr("src",oPath);
	});
}
*/



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function generateAssignInfo (nth) {
	console.log ("nth: ",nth);
	var asnInfo = getAssignInfoByNthFromArr(nth);
	var asn = getPersonalAssignByNthFromArr(nth);
	var isNewAsn =  typeof(asn) ==='undefined';
	var openDate = asnInfo.get("reviewDue").toLocaleDateString() + asnInfo.get("reviewDue").toLocaleTimeString();

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

		var viewAllBtnDisable =	'<a class="btn btn-default assignInfo-link view-other disabled" disabled="true" href="#" onclick="return false"  style="background:rgba(250,250,250,1) !important; ">檢視全體的遊戲 ( 開放時間：'+openDate+' ) </a>';
		var viewAllBtn =	'<a class="btn btn-default assignInfo-main-btn  assignInfo-link view-other" href="games.html?nth='+nth+'">檢視全體的遊戲</a>';

		var l ="";
		if (submitDate > now) { 
			status = 1 ;
			l=" 第一區間：還沒開始作業" ;
			btns+= viewAllBtnDisable
		}
		if (reviewDate > now && now > submitDate ){
			status = 2 ;	
			l =" 第二區間：開始作業";
			btns+= viewAllBtnDisable
		}
		if (reviewDue > now && now  > reviewDate  ){	
			status = 3 ; l =" 第三區間：開始評分";
			btns+= viewAllBtnDisable
		}
		if (now > reviewDue){  
			status = 4 ;
			l ="四區間：結束評分";
			btns+=  viewAllBtn;
		}
		//alert (l);
		return btns;
	}
	
	function prepareModal(){
		//alert(btns);
		var imgUrl = 'img/games/' ;
		if (status < 4  ){
				imgUrl+= "broke-0"+nth+".png" ;
		}else{
			imgUrl+= "light-0"+nth+".png";
		}
		
		var intro = asnInfo.get("intro");
		var req = asnInfo.get("req");
		var n = asnInfo.get("name");
		
		var assignInfoModal = '<div id="assignModalInfo'+nth+'" class="modal fade" tabindex="-1" role="dialog"  aria-hidden="true" aria-labelledby="AssignInfo'+nth+'">\
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
								<h4>What Students Have Done</h4>\
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
		//console.log (assignInfoModal);
		return assignInfoModal;
	}	
}

// 在初始化的時候就要去判斷是否有 null 這個值


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



