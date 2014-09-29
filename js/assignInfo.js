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



