

var currentAssign ;

function qurAssign (id){
	var Assign = Parse.Object.extend("Assign");
	var assign = new Assign();
	var q = new Parse.Query(Assign);
	q.include("maker");
	return q.get(id) ;
}
function qurAssignInfo (nth){
	var AssignInfo = Parse.Object.extend ("Assign_Info");
	var q = new Parse.Query(AssignInfo);
	q.equalTo("nth",nth);
	return q.first();
}
function qurAssigns ( nth ,descendBy) {
	var Assign = Parse.Object.extend("Assign");
	var q = new Parse.Query(Assign);
	q.equalTo("nth",nth);
	q.limit (5) ;
	q.descending(descendBy);
	q.ascending("grade")
	q.include("maker");
	return q.find() ;
}
function qurElectAssigns (nth){
	var Assign = Parse.Object.extend("Assign");
	var q = new Parse.Query(Assign);
	q.equalTo("isBest",true); 
	q.equalTo("nth",nth);
	q.descending("grade")
	q.include("maker");
	return q.find() ;
}

function getCode (url,callback){
	console.log("Getting Code...");
	$.ajax({
		url : "getcodeForGhost.php",
		async : true,
		type: "POST",
		data:{url:url},
		dataType : 'text', //explicitly requesting the xml as text, rather than an xml document
		success : callback
	});
}
function showCode (data, status, xhr) {		
console.log ("get code!")
	if (status === 'success') {
		//console.log ($(".editor").get(0));
		var editor =  $(".editor").get(0);
		editor = ace.edit( editor );
		//console.log (editor);
		editor.setValue(data);
	}else {
		alert("發生了某些狀況，請重新整理!");
	}
}
function apdBug(b){
	var reviewer = b.get("reporter");
	var des = b.get("des");
	var imgUrl = b.get("img").url();
	var time = b.createdAt;
	console.log ("bugi" ,des);
	var html =	
	'<div id="'+b.id+'" class="bug">\
		<!--div class="bug-reviewer col-md-1">'+reviewer.get("name")+'</div-->\
		<div class="bug-img"><a class="fancy" tabindex="10" href="'+imgUrl+'"><img class="bug-img-img" src="'+imgUrl+'" /></a>'+'</div>\
		<span class="bug-des">'+""+'</span>\
		<div class="bug-time">'+time+'</div>\
	</div>';
		$(".bug-pane").append(html);
		$("#"+b.id).find(".bug-des").text(des);

}


function getQueryString () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
};
function handleError(e){
	var Error = Parse.Object.extend ("Error");
	var error = new Error();
	error.set("location");
	error.set("error",JSON.stringify(e));
	error.set("msg",e.message);
	error.save().then(function(){
		alert (e.message +"\n 試著重新整理頁面在操作一次，\n錯誤訊息我們以經回報給系統了~")	;
	});
}
function showPlay (url) {
	var ifm = document.createElement("iframe");
	ifm.src = url ;
	ifm.width = 640 ;
	ifm.height = 480 ;
	ifm.border = 0 ;
	ifm.className	+= "playFrame";
	ifm.frameBorder = 0;
	var play = document.getElementsByClassName("play")[0];
	play.appendChild(ifm);	
}
function pprEditor (){ // Prepare
	var editorEle =  $(".editor").first().get(0); //editorElement
	var editor = ace.edit( editorEle );
	editor.setTheme("ace/theme/twilight");
	editor.getSession().setUseWrapMode(true);
	editor.getSession().setTabSize(2);
	editorEle.style.fontSize='14px';	
	editor.getSession().setMode("ace/mode/java");
	return editor;
}
function showFB (href){
	var cmtEle = document.getElementsByClassName("comment")[0];  
	cmtEle.innerHTML = "<div><fb:comments href='" + href+ "' num_posts='10' data-width='100%'></fb:comments></div>";  
	FB.XFBML.parse(cmtEle);
	
	var likeEle = document.getElementsByClassName("fblike")[0];  
	likeEle.innerHTML = '<div class="fb-like" data-href="'+href+'" data-width="300" data-layout="standard" data-action="like" data-show-faces="false" data-share="false"></div>';
	FB.XFBML.parse(likeEle);
}
function FBinitDone(){
	console.log ("document.fbinitDine!");
	showFB (document.location);
}

// 精選作品
function showElect (other){
	
	var n = other.get("maker").get("name"),
			p = other.get("maker").get("photo"),
			g = other.get("grade") ? other.get("grade") : "成績尚未公佈",
			s = other.get("star") ? genStars(other.get("star")) : "";
			//t = other.get("isBest") ? '<span class="glyphicon glyphicon-bookmark"></span>'  : "";
			h = other.get("url"),
			
			$p = $(".others  .inner").first();
	var html = 
			'<a class="other" href="play.html?aid='+other.id+'">\
				<span class="other-head"><img src="'+p+'"></span>\
				<span class="other-name">'+n+'</span>\
				<span class="other-grade">'+g+'</span>\
				<!--span class="other-best"></span-->\
				<!--span class="other-star">'+s+'</span-->\
			</a>';
	$p.append(html);
}
function genStars(s){
	var starsString ='' ;
	for (var i = 0 ; i < s ; i++){
		starsString += '<span class="glyphicon glyphicon-star"></span>';
	}
	return starsString ;
}


function PlayJs_start (){
	console.log ("PlayJs_start");
	var AsnArr ;
	var srh = getQueryString () ,
			asnId =   srh.aid,//typeof (srh.asn) === 'undefined' ? "LbQeJFDvRT" : srh.asn ,
			nth  ,
			curUser = currentUser ;//Parse.User.current();
	if (typeof asnId ==='undefined' ){
		alert("系統無法辨別你要看哪個遊戲，請重新點取");
		
		if (document.referrer === ""){
			document.location = "dashboard.html";
		}else {
			document.location = document.referrer;
		}
		return false ;	
	}
	
	
	qurAssign(asnId).then(function(a){
		var url = a.get("url") ;
		var maker = a.get("maker");
		var $profileLinkEle = $("#profile-link") ;
		$profileLinkEle.attr("href","profile.html?uid=" + maker.get("ID"));
		currentAssign = a ;
		
		nth = a.get("nth");  
		
		// assignInfo
		qurAssignInfo (nth).then(function(ai){
			var now = new Date();
			var openTime = ai.get("reviewDue") ;
			var $p = $('#main-game-info');
			
			$("#view-others-hyperlink").attr("href","games.html?nth="+nth);
			$(".assigninfo_name").text(ai.get("name"));
			
			$p.find(".game-name").text(ai.get("name").toUpperCase());
			
			//於 評分完成後 再開啟 資訊互動區
			if ( now.getTime() > openTime.getTime()){
				$("#information-pane").removeClass('hidden');
			}else{
				$("#review-due-show").text(openTime.toLocaleDateString()+openTime.toLocaleTimeString());
				$("#information-pane-disable").removeClass('hidden');
			}			
		});
	
		getViewerRole().then(function (s){
			if (s === "guest"){
				$(".add-bug-form").remove();
			}
		});
		
	

		$(".submit-bug").data("aid",a.id);
		showPlay (url); 
		$(".maker-name").text(maker.get("name"));
		$(".maker-photo").append('<img src="'+maker.get("photo")+'" height="50" width="50">');

		$(".count").text(a.get("count"));
		var g = a.get("grade") ? (" 獲得的評等：" + a.get("grade")) : "成績尚未公佈"  ;
		$(".grade").text(g);
		if (a.get("isBest")) $(".main-isBest").fadeIn();
		
		//if( curUser ){
			pprEditor();
			getCode(url,showCode);
			console.log(asnId);
			qurBugs(asnId).then(function(bs){
				console.log ("bug pull done " +bs.length);
				if (currentUser && (currentAssign.get("maker").id === currentUser.id)){
					$('div').remove("#add-bug-container");
					
				}
				if (bs.length === 0){
					$(".bug-pane").prepend('<div class="no-bug-info">太強了！沒有任何霸個！</div>');
				}else{
					$(".bug-pane").html("");
					each(bs,function (bug){
						showBug (bug);
					});
					bugInit();
					highLightBug();
					
				}
			},handleError);
		//}
		
		
		qurElectAssigns(nth).then(function (assigns){
			if (paraCheck(assigns)){
				$(".others").find(".blank-intro").hide();
				each(assigns,showElect);
			}
	});
		
	},function (e){console.log(e);})

}// PlayJs
 
function removeAddbug(assign){
	var mUid = assign.get("maker").id ;
	var cUid = currentUser.id ;
	
	if (mUid === cUid){
		
	}
	
}

$(document).on('click' ,".submit-bug",function (e){

	var $thisBtn = $(this);
	$thisBtn.toggleDisabled();

	var aid = $(this).data('aid');
	
	var Assign = Parse.Object.extend ("Assign"),
	assign = new Assign ();
	assign.id = aid ;
	
	var bugger = new Parse.User();
	bugger.id = currentAssign.get("maker").id
	//!!!!!!!!
	
	
	
	//檢查BUg 是否新增完成	
	e.preventDefault();
	//console.log ("true");
	var $p = $(this).closest(".bug") ;
	var i = $p.index();
	var form = $p.find(".add-bug-form").get(0);;
	var $img = $p.find(".add-img-input").first();
	var $preImg = $p.find(".add-bug-img").first();
	var base64 = $preImg.data("base64");
	var $btn = $p.find(".submit-bug").first();
	var des = $p.find(".add-des-input").first().val();
	
	var fileUploadControl = $img[0];
	
	if(des.length < 10 ){ 
		alert("你的描述太過精簡，請至少超過十個字。"); 
		$thisBtn.toggleDisabled();
		return false ;
	}
	
	if (fileUploadControl.files.length > 0) {
		if (Validate(form)){
			$btn.attr("disabled","disabled");
			$btn.addClass('disabled');
			var BugRecord = Parse.Object.extend("Bug_Record");
			var bugRecord = new BugRecord();
		
			var file = fileUploadControl.files[0];
			var name = file.name;
			var bugImg = new Parse.File("Bug",{base64:base64});
			
			//http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
			bugImg.save().then(function(img){
				console.log(img);
				bugRecord.set("reporter",currentUser);
				bugRecord.set("assign",assign);
				bugRecord.set("bugger",bugger);
				bugRecord.set("isDoneNoti",false);
				bugRecord.set("img",img);
				bugRecord.set("des",des);
				return bugRecord.save();
			}).then (function(bugRecord){
				alert("BUG舉報成功，請等待作者確認");
				$thisBtn.toggleDisabled();

				console.log(bugRecord);
				showBug(bugRecord);
				bugInit();

				$p.find(".add-bug-form").trigger('reset');
				$preImg.removeAttr("style");
				$btn.removeClass('disabled');
				$btn.removeAttr("disabled");
			},function(e){console.log(e);});
		}else { // file is not image;
			$thisBtn.toggleDisabled();

			$img.trigger('click');
		}
	}else { // if 沒有點選附檔
		$thisBtn.toggleDisabled();
		alert("請附上Bug圖片");
	}
	return false ;
});

function Validate(oForm) { // http://stackoverflow.com/questions/4234589/validation-of-file-extension-before-uploading-file
		var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
    var arrInputs = oForm.getElementsByTagName("input");
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                if (!blnValid) {
                    alert("抱歉" + sFileName +"不符合格式！請重新選擇圖檔！ \n 允許格式：JPG,PNG,BMP,GIF");// + _validFileExtensions.join(", "));
                    return false;
                }
            }
        }
    }

    return true;
}


function readTimePlus(){
	$.post("getip.php",{},logip);
	function logip(ip,s,x){
		
		getViewerRole ().then(function(){
	
			var Play_View = Parse.Object.extend("Play_View") ;
			var qP = new Parse.Query(Play_View);
			//qP.equalTo("")
			
			
			var playView = new Play_View ();
			playView.set("ip",ip);
			if (currentUser){
				playView.set("user",currentUser);
			}
		
		
			playView.save().then(function(s){
				console.log (ip);
				//alert("signin! "+ip );
			},function (e){
				//alert(e.message);
			});
		},Log);
	}
}
