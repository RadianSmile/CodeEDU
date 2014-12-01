
// 抓取 BUG
function qurBugs (assignID){ // old name QueryBug
	var BugRecord = Parse.Object.extend("Bug_Record");
	var q = new Parse.Query (BugRecord);
	var Assign = Parse.Object.extend("Assign");
	var a = new Assign();
	a.id = assignID ;
	q.equalTo("assign",a);
	q.include("reporter");
	q.include("bugger");
	q.ascending("createdAt");
	return q.find();
}
function getBug (bid){
	var BugRecord = Parse.Object.extend("Bug_Record");
	var q = new Parse.Query (BugRecord);
	return q.get(bid);
}


function getControlPanes  (e) {
	var $e = $(e);		
	$e.$d = $e.find('.bug-bugger-control') ;
	$e.$r = $e.find('.bug-reporter-control') ;
	$e.$g = $e.find('.bug-guest-control') ;
	$e.$ta = $e.find('.bug-ta-control');
	return $e ;
}
function controlAllBugView (){
	$(".bug-bugger-view").each(function(i, e) {
			var $e = getControlPanes(e);
			//alert("fffakjjjjjjjj;");
			$e.$d.show();
			$e.$r.remove();
			$e.$g.remove();
			$e.$ta.remove();
	});
	//console.log ("!!!!!!!!!!!!!!!!!",'$(".bug-reporter-view")',$(".bug-reporter-view").length);
	$(".bug-reporter-view").each(function(i, e) {
			var $e = getControlPanes(e);
			$e.$d.remove();
			$e.$r.show();
			$e.$g.remove(); 	
			$e.$ta.remove();
	});
	$(".bug-guest-view").each(function(i, e) {
			var $e = getControlPanes(e);
			$e.$d.remove();
			$e.$r.remove();
			$e.$g.show();	
			$e.$ta.remove();			
	});
	$(".bug-ta-view").each(function(i, e) {
			var $e = getControlPanes(e);
			$e.$d.remove();
			$e.$r.remove();
			$e.$g.remove();	
			$e.$ta.show();			
	});
	
}
function controlAllStepView (){
	$('.bug').each(function(i,e) {
		var $e = $(e);
		var step = $e.data("bugstatus");
		$e.find('.bug-step').each(function(ii, ee) {
			var $ee = $(ee) ; 
			console.log ($e.attr('id'),$ee.data("bugstep") , step);
			if ($ee.data("bugstep") == step ){$ee.show();}
		});		
	});
}
function judgeStep(bugRecord){
	
	var a = bugRecord.get("isAccepted") ; 
		var taA = bugRecord.get("taAccepted");
	var b = bugRecord.get("isUpdated") ;
	var c = bugRecord.get("isSolved");
		var taC = bugRecord.get("taSolved");

	var s ; 
	if (typeof a === 'undefined'){
		s = 1 ;
		return s ; 
	}
	if (a === false ){
		if (taA === true){
			a = true ;
			// 假性呈現，作者承認了這筆BUG，繼續接下來的判斷
		}else if ( taA === false ){
			s = -1 ;
			// 連助教都否認了，這筆BUG就直接進入移除的狀態
			return s ;		
		}else{
		// 這裡代表助教還沒有評訂，進入等待狀態
			s = 0 ; 
			return s ;
		}
	}
	if ( c === false ){
		if (taC === true){ // 認為通過
			//假性呈現，呈報者已經認為通過了
			s = 4 ; 
			return s ;
		}else if ( taC === false ){ 
			// 認為不通過
			// 理論上，taC === false 時，cloud code 就會進行改寫了
		}else{		
			// 這裡代表助教還沒有評訂，進入等待狀態
			s = 5 ; 
			console.log ("step 5");
			return s;
		}
	}
	
	s = a ? b ? c ? 4 : 3 : 2 : 1 ; console.log ("step :"+s);
	return  s ;
}

function judgeRelation(bugRecord){ 
	var bugger = bugRecord.get("bugger");
	var reporter = bugRecord.get("reporter");

	var a = ''; 
	if (!paraCheck(currentUser)){
		console.log ('guest');
		a = 'guest';
	}else{
		console.log ("currentUser in BugJS " ,currentUser);
		var srh = getQueryString ();

		if ((currentUser.get("role") === "TA" || currentUser.get("role") === "teacher") && srh.ta_test_role !== 'student'){
			console.log ("TA");
			a = 'ta';
		}else if (currentUser.id === bugger.id){
			console.log ('bugger');
			a = 'bugger';
		}else if (currentUser.id  === reporter.id){
			console.log ('reporter');
			a =  'reporter';
		}else{
			console.log ('guest');
			a = 'guest';
		}
	}
	return a ;
}

function showBugs (aid){
	console.log (aid);
	qurBugs(aid).then(function(bugs){
		each(bugs,function (bug){
			showBug(bug);
		});
		bugInit();
	},Log);

}

function showBug (b , i ){
	i = isSet(i) ? i : 0 ;
	var relation = judgeRelation (b);
	var step  = judgeStep(b);
	var html = getBugHtml(b,relation,step);
	$($('.bug-pane')[i]).prepend(html); 
	if (step === -1 && paraCheck(b.get("tell"))){
		$("#" + b.id).find(".bug-notExist").each(function(index, element) {
			var t = $(element).attr("title");
			$(element).attr("title",t +"。原因為："+ b.get("tell"));
		});;
	}
	console.log($('.bug-pane')[i]);
	$(".no-bug-info").hide();
}


function bugInit(){
	controlAllBugView();
	controlAllStepView ();
	appendEvent();
}


function getBugHtml (b,relation,step)
{
	var id = b.id ; 
	var cls = "bug-"+relation+"-view" ;
 	var des = b.get("des");
	//var reviewer = b.get("reviewer");
	//var des = b.get("des");
	var imgUrl = b.get("img").url();
	var time = b.createdAt 
 	var html =  	'<div id="'+id+'" class="bug '+cls+'" data-bugstatus="'+step+'">\
<div class="media" style="background:none; border:none;">\
  <a class="pull-left fancy" tabindex="10" href="'+imgUrl+'" title="'+des+'" >\
    <div class="media-object view-bug-img " style="background:url('+imgUrl+')" alt=""></div>\
  </a>\
	<div class="pull-right">\
		<div class="bug-func-btns">\
			<div class="bug-bugger-control">\
				<div class="bug-step" data-bugStep="-1">\
					<div class="bug-status bug-notExist"  data-toggle="tooltip" data-placement="left" title="BUG並不存在"><span class="glyphicon glyphicon-remove-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="0">\
					<div class="bug-status bug-waiting-ta-check" data-toggle="tooltip" data-placement="left" title="BUG被否認，等待助教審核中"><span class="glyphicon  glyphicon-eye-open"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="1">\
					<a class="accept-bug-btn bug-func-btn" data-toggle="tooltip" data-placement="left" title="承認這筆BUG" ><span class="glyphicon glyphicon-ok"></span></a>\
					<a class="reject-bug-btn bug-func-btn" data-toggle="tooltip" data-placement="left" title="BUG並不存在" ><span class="glyphicon glyphicon-remove"></span></a>\
				</div>\
				<div class="bug-step" data-bugStep="2">\
					<a class="noti-reporter-bug-btn bug-func-btn bug-func-btn-lg" data-toggle="tooltip" data-placement="left" title="通知舉報者已經解除BUG"><span class="glyphicon glyphicon-bell"></span></a>\
				</div>\
				<div class="bug-step" data-bugStep="3">\
					<div class="bug-status bug-waiting-check" data-toggle="tooltip" data-placement="left" title="等待呈報者審核中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="4">\
					<div class="bug-status bug-resolved"  data-toggle="tooltip" data-placement="left" title="BUG已經解除"><span class="glyphicon glyphicon-ok-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="5">\
					<div class="bug-status bug-waiting-ta-check" data-toggle="tooltip" data-placement="left" title="呈報者認為BUG沒有成功修正，等待助教審核中"><span class="glyphicon glyphicon-eye-open"></span></div>\
				</div>\
			</div>\
			<div class="bug-reporter-control">			\
				<div class="bug-step" data-bugStep="-1">\
					<div class="bug-status bug-notExist"  data-toggle="tooltip" data-placement="left" title="BUG並不存在"><span class="glyphicon glyphicon-remove-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="0">\
					<div class="bug-status bug-waiting-ta-check" data-toggle="tooltip" data-placement="left" title="BUG被否認，等待助教審核中"><span class="glyphicon glyphicon-eye-open"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="1">\
					<div class="bug-status bug-waiting-accept"  data-toggle="tooltip" data-placement="left" title="等待遊戲作者承認中"><span class="glyphicon glyphicon-question-sign"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="2">\
					<div class="bug-status bug-waiting-update" data-toggle="tooltip" data-placement="left" title="等待遊戲作者更新中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="3">\
					<a class="pass-bug-btn bug-func-btn "  data-toggle="tooltip" data-placement="left" title="作者成功解除BUG"><span class="glyphicon glyphicon-ok"></span></a>\
					<a class="fail-bug-btn bug-func-btn "  data-toggle="tooltip" data-placement="left" title="作者沒有成功解除BUG"><span class="glyphicon glyphicon-remove"></span></a>\
				</div>\
				<div class="bug-step" data-bugStep="4">\
					<div class="bug-status bug-resolved" data-bugStep="4"  data-toggle="tooltip" data-placement="left" title="已經解除霸個"><span class="glyphicon glyphicon-ok-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="5">\
					<div class="bug-status bug-waiting-ta-check" data-toggle="tooltip" data-placement="left" title="呈報者認為BUG沒有成功修正，等待助教審核中"><span class="glyphicon glyphicon-eye-open"></span></div>\
				</div>\
			</div>\
			<div class="bug-guest-control" >\
				<div class="bug-step" data-bugStep="-1">\
					<div class="bug-status bug-notExist"  data-toggle="tooltip" data-placement="left" title="BUG並不存在"><span class="glyphicon glyphicon-remove-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="0">\
					<div class="bug-status bug-guest-waiting-resolve" data-toggle="tooltip" data-placement="left" title="處理中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="1">\
					<div class="bug-status bug-guest-waiting-resolve" data-toggle="tooltip" data-placement="left" title="處理中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="2">\
					<div class="bug-status bug-guest-waiting-resolve" data-toggle="tooltip" data-placement="left" title="處理中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="3">\
					<div class="bug-status bug-guest-waiting-resolve" data-toggle="tooltip" data-placement="left" title="處理中"><span class="glyphicon glyphicon-time"></span></div>\
				</div>\
				<div class="bug-step" data-bugStep="4">\
					<div class="bug-status bug-resolved" data-bugStep="4"  data-toggle="tooltip" data-placement="left" title="已經解除霸個"><span class="glyphicon glyphicon-ok-circle"></span></div>\
				</div>\
			</div>\
			<div class="bug-ta-control">\
				<div class="bug-step" data-bugStep="-1">\
					<div class="bug-status bug-notExist"  data-toggle="tooltip" data-placement="left" title="BUG已經被核定為不存在"><span class="glyphicon glyphicon-remove-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="0">\
					<a class="ta-accept-bug-btn bug-func-btn" data-toggle="tooltip" data-placement="left" title="這筆BUG是存在的" ><span class="glyphicon glyphicon-ok"></span></a>\
					<a class="ta-reject-bug-btn bug-func-btn" data-toggle="tooltip" data-placement="left" title="同意作者，BUG並不存在" ><span class="glyphicon glyphicon-remove"></span></a>\
				</div>\
				<div class="bug-step" data-bugStep="1">\
					<div class="bug-status bug-waiting-accept"  data-toggle="tooltip" data-placement="left" title="等待遊戲作者承認中">認</div>\
				</div>\
				<div class="bug-step" data-bugStep="2">\
					<div class="bug-status bug-waiting-update" data-toggle="tooltip" data-placement="left" title="等待遊戲作者更新中">更</div>\
				</div>\
				<div class="bug-step" data-bugStep="3">\
					<div class="bug-status bug-waiting-check" data-toggle="tooltip" data-placement="left" title="等待呈報者審核中">審</div>\
				</div>\
				<div class="bug-step" data-bugStep="4">\
					<div class="bug-status bug-resolved" data-bugStep="4"  data-toggle="tooltip" data-placement="left" title="已經解除霸個"><span class="glyphicon glyphicon-ok-circle"></span></div>\
				</div>\
				<div class="bug-step bug-func-btns" data-bugStep="5">\
					<a class="ta-pass-bug-btn bug-func-btn "  data-toggle="tooltip" data-placement="left" title="遊戲作者有成功解除BUG"><span class="glyphicon glyphicon-ok-circle"></span></a>\
					<a class="ta-fail-bug-btn bug-func-btn "  data-toggle="tooltip" data-placement="left" title="同意舉報者，作者沒有成功解除BUG"><span class="glyphicon glyphicon-remove"></span></a>\
				</div>\
			</div>\
		</div>\
	</div>\
  <div class="media-body view-bug-des " >\
		 '+des+'  \
   <span class="view-bug-time">'+time+'</span>\
  </div>\
</div>\
</div>' ;
	return html ;
}
  


function appendEvent (){
	$('.bug-func-btn , .bug-status').tooltip();
	$(".fancy").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	600, 
		'overlayShow'	:	false,
		'type' : "image",
		'titlePosition':'inside',
		titleFormat :{ 'font-size':'20px'},
		helpers : { 
    title : { type : 'inside' }
   }
	});
}
$(document).on('click','.add-bug-img',function(e){
	$(this).siblings("input:file.add-img-input").first().trigger('click');
});
$(document).on('click',".accept-bug-btn",{attr:"isAccepted",val: true},updateBugStatus);
$(document).on('click',".reject-bug-btn",{attr:"isAccepted",val: false},updateBugStatus);
$(document).on('click',".pass-bug-btn",{attr:"isSolved",val: true},updateBugStatus);
$(document).on('click',".fail-bug-btn",{attr:"isSolved",val: false},updateBugStatus);
$(document).on('click',".noti-reporter-bug-btn",{attr:"isUpdated",val: true},updateBugStatus);

$(document).on('click',".ta-accept-bug-btn",{attr:"taAccepted",val: true},updateBugStatus);
$(document).on('click',".ta-reject-bug-btn",{attr:"taAccepted",val: false},updateBugStatus);

$(document).on('click',".ta-pass-bug-btn",{attr:"taSolved",val: true},updateBugStatus);
$(document).on('click',".ta-fail-bug-btn",{attr:"taSolved",val: false},updateBugStatus);



function updateBugStatus (e){
	var $this = $(this) ;
	if ($this.hasClass('disabled')) {
		return false 
	};
	
	
	$this.parent().children('.bug-func-btn').tooltip('disable');
	$this.parent().children('.bug-func-btn').addClass('disabled');
	$this.parent().children('.bug-func-btn').removeAttr('href');

	var $b = $this.closest('.bug');
	var Bug = Parse.Object.extend("Bug_Record");
	var bug = new Bug();
	bug.id = $b.attr('id');
	console.log ($b.attr('id'));
	console.log (e.data.attr , e.data.val );
	
	
	if (e.data.attr === 'taAccepted' && !e.data.val){
		var removeReason = prompt("請輸入此筆BUG不存在的原因，以提示大家");
		if (removeReason != null && confirm ("確認送出?")) {
			bug.set("tell",removeReason) ;
    }else {
			$this.parent().children('.bug-func-btn').tooltip();
			$this.parent().children('.bug-func-btn').removeClass('disabled');			
			return false ;
		}
	}
	
	bug.set(e.data.attr , e.data.val );
	bug.set("isDoneNoti",false);

	bug.save().then(function(b){
		return getBug(b.id);
	}).then (function(ee){
		alert("成功更新BUG狀態");
		console.log (ee)
		var relation = judgeRelation (ee);
		var step  = judgeStep(ee);
		var html = getBugHtml(ee,relation,step);	
		appendEvent();
		$b.replaceWith(html);
		bugInit();
	},Log);
}



// 這裡是偵測點選上傳圖片時
$("input:file.add-img-input")	.change(function () {				
	var $p = $(this).closest(".bug") ;
	
	var isTooBig = this.files[0].size  ;
	//alert ("File size " +isTooBig);
	console.log (isTooBig);

		var reader =  new  FileReader ();
		 reader.onload = function (e) {
			 var i = new Image ();
					i.src = e.target.result ;
			var finalWitdh = 800 ;
			var finalHeight =  i.naturalHeight  /i.naturalWidth * finalWitdh   ;
					$ ( i ). css ( 'width' , finalWitdh+'px' )	;		
			//  $("body").append(i);
			var cvs = document.createElement ( 'canvas' );
			cvs.width = finalWitdh ;
			cvs.height = finalHeight;
			var ctx = cvs.getContext( "2d" ).drawImage( i,0,0,finalWitdh,finalHeight);
			
			// 這邊應該要做壓縮倍率的判斷 Rn.yet			
			
			var newImageData = cvs.toDataURL ( "image/jpeg" , .6 );
			var result_image_obj =  new  Image ();
				 result_image_obj.src = newImageData ;

				$p.find('.add-bug-img').first().css('background-image', 'url('+newImageData+')');

		 //   $("body").append(result_image_obj);
			$('.add-bug-img').data("base64",newImageData.replace("data:image/jpeg;base64,", ""));
				 //console.log (base64);
		 }
		reader.readAsDataURL ( this.files[0] );			
});


$('sample_on_submit').on('click' ,".submit-bug",function (e){
	//Rn!!!!!!!!!
	
	var aid = $(this).data('aid'); 
	
	var Assign = Parse.Object.extend ("Assign"),
	assign = new Assign ();
	assign.id = aid ;
	
	var bugger = new Parse.User();
	bugger.id  = currentAssign.get("maker").id;
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
				console.log(bugRecord);
				showBug(bugRecord);
				bugInit();

				$p.find(".add-bug-form").trigger('reset');
				$preImg.removeAttr("style");
				$btn.removeClass('disabled');
				$btn.removeAttr("disabled");
			},function(e){console.log(e);});
		}else { // file is not image;
			$img.trigger('click');
		}
	}else { // if 沒有點選附檔
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


function highLightBug (){
	var srh = getQueryString ();
	if (paraCheck(srh.bid)){
		$("#"+srh.bid).addClass("highLight");
		scrollToEle ("#"+srh.bid);
	}
}

/*
// 把霸個秀出去
function apdBug(i,b){
		var reviewer = b.get("reporter");
		var des = b.get("des");
		var imgUrl = b.get("img").url();
		var time = b.createdAt;
		//console.log ("bugi" , i ,des);
		var html =	'<div id="'+b.id+'" class="bug container-fluid">\
				<!--div class="bug-reviewer col-md-1">'+reviewer.get("name")+'</div-->\
				<div class="bug-img col-md-2"><a class="fancy" tabindex="10" href="'+imgUrl+'"><img class="bug-img-img" src="'+imgUrl+'" /></a>'+'</div>\
				<div class="bug-des col-md-5">'+""+'</div>\
				<div class="bug-time">'+time+'</div>\
			</div>';
	//	$(html).find(".bug-des").first().text(des);
		$('.bug-pane').append(html);
		$("#"+b.id).find(".view-bug-des").text(des);
}
// 這裡是註冊 Fancy Box

*/



/*
// Ole Bug Submit
$(document).on('click' ,".submit-bug",function (e){
	//檢查BUg 是否新增完成	
	e.preventDefault();
	//console.log ("true");
	var $p = $(this).closest(".bug").attr('id'); ;
	var $img = $p.find(".add-img-input").first();
	var $preImg = $p.find(".add-bug-img");
	var base64 = $preImg.data("base64");
	var $btn = $p.find(".submit-bug").first();
	var des = $p.find(".add-des-input").first().val();
	
	var fileUploadControl = $img[0];
	
	if(des.length < 10 ){ 
		alert("你的描述太過精簡，請至少超過十個字。"); 
		return false ;
	}
	
	if (fileUploadControl.files.length > 0) {
		if (Validate(form)){
			$btn.attr("disabled","disabled");
	
			var BugRecord = Parse.Object.extend("Bug_Record");
			var bugRecord = new BugRecord();
		
			var file = fileUploadControl.files[0];
			var name = file.name;
			var bugImg = new Parse.File("Bug",{base64:base64});
			//http://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded
			bugImg.save().then(function(img){
				console.log(img);
				bugRecord.set("reporter",currentUser);
				bugRecord.set("assign",AssignArr[i].get("assign"));
				bugRecord.set("bugger",AssignArr[i].get("assign").get("maker"));
				bugRecord.set("img",img);
				bugRecord.set("des",des);
				return bugRecord.save();
			}).then (function(bugRecord){
				console.log(bugRecord);
				apdBug (i,bugRecord);
				$p.find(".add-bug-form").trigger('reset');
				$preImg.removeAttr("style");
				$btn.removeAttr("disabled");
			},function(e){console.log(e);});
		}else { // file is not image;
			$img.trigger('click');
		}
	}else { // if 沒有點選附檔
		alert("請附上Bug圖片");
	}
	return false ;
});

*/