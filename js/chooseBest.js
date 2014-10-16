



  $(document).on('click','.star-btn',function () {
		
		var $this = $(this);
		var radio = $this.siblings('input:radio[name=star]')[0];
		radio.checked = !radio.checked ;

    $('.star-btn').each(function(i, e) {
			if ($(e).siblings('input:radio[name=star]')[0].checked){ //被選了
				$(e).addClass("btn-warning").removeClass("btn-default");
				$($(".tab").get(i)).find(".glyphicon-star.preview").first().removeClass("hidden");
				gradeArr[i][2] = true ;
			}else { // 被取消
				$(e).removeClass("btn-warning").addClass("btn-default");
				$($(".tab").get(i)).find(".glyphicon-star.preview").first().addClass("hidden");
				gradeArr[i][2] = false ;
			}
			localStorage["gradeArr"] = JSON.stringify (gradeArr);

		});
  });


////////////////////////////////////////////////////////////////////////////////////////////////

$('#review-tab a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

var assignToReview;
var asnInfo ;
var AssignArr = [] ;
var CodeArr =  [] ;
var TimeArr = [] ;
var gradeArr = [];
var submitDeadline ;

checkAbleGrade();
function checkAbleGrade (){

	if (localStorage.getItem("reviewNth") === null){
		alert("沒有偵測到要評分的作業，\n系統將跳返回個人主頁。");
		document.location = "dashboard.html";
	}else{
		assignToReview = localStorage.getItem("reviewNth") ;
	}

	
	qurAssignInfo().then(function (s){
		asnInfo = getObjectByAttrVal(s,"nth",assignToReview);
		var now = new Date ();
		submitDeadline = asnInfo.get("reviewDate") ;
		if ( now > asnInfo.get("reviewDate") && now < asnInfo.get("reviewDue") ){
			init();
		}else{
			alert("評分時程已過，系統將返回Dashboard");
			document.location = "dashboard.html";
		}
		
		
		
	})
}

function init (){	
	// check is able grading

	var mdl = prepareReqModal(asnInfo);
	$("#apd").append(mdl);
	
	
	for (var i = 0 ; i < 5; i++){
		// Prepare editor
		var tabEditor =  $($(".tab-pane")[i]).find(".editor").first().get(0);
		var editor = ace.edit( tabEditor );
		editor.setTheme("ace/theme/twilight");
		editor.getSession().setUseWrapMode(true);
		editor.getSession().setTabSize(2);
		tabEditor.style.fontSize='14px';
		editor.getSession().setMode("ace/mode/java");
	}
	// 判斷是否有 local gradeArr
	if (localStorage.getItem("gradeArr") !== null){
		console.log (localStorage["gradeArr"],typeof(localStorage["gradeArr"]));
		gradeArr = JSON.parse(localStorage["gradeArr"]);
		console.log("init,local",gradeArr);
		
		showLocal();
		
	}else {
		// 如果沒有，創造Local
		console.log ("init, new gradeArr");
		for (var i = 0 ; i < 5 ; i++){
			var arr = ["","-",false];
			gradeArr.push(arr);
		}
	}
	showAssignAndBug();
}

function showLocal (){
	for (var i = 0 ;  i < gradeArr.length ; i++){
		if (gradeArr[i][1] !== '-'){
			var Select = $($(".tab-pane").get(i)).find(".grade-select");
			var opt = Select.find('option:contains("'+gradeArr[i][1]+'")');
			$($(".tab").get(i)).find(".grade-preview").first().text(gradeArr[i][1]);
			opt.attr("selected",true);
			console.log (Select.val());
			Select.val(gradeArr[i][1]);
		}
		if (gradeArr[i][2]){
			var radio = $($(".tab-pane").get(i)).find(".star-btn").click();
		}
	}	
}


function QueryAssigns (){
	var promise = new Parse.Promise();
	var Assign = Parse.Object.extend("Assign");

	var q = new Parse.Query(Assign);
	q.descending("star");
	q.equalTo("nth",assignToReview);
	q.limit(15);
	q.find().then(function(r){
		console.log (r);
		for (var i = 0 ; i < r.length ; i++) gradeArr[i][0] =  r[i].id ;
		AssignArr = r ;
		console.log ("AssignArr",AssignArr);
		promise.resolve(r);
		//console.log("Parse Done, Querying Data..");
	
	},function(e){
		promise.reject(e.message);
		console.log(e.message);
	});
	return promise ;
}

function showAssignAndBug(){
	
	var jobCount = 0 ;
	var finalCount = 0 ; 
	
	QueryAssigns().then (function(r){
		// prepare assigns and  report btns;
		var $cheatSelect = $ ("#cheat-select");
		finalCount = r.length ;
		for (var i = 0 ; i < r.length ; i++){
		
			$cheatSelect.append('<option value="'+r[i].get("assign").id+'">#'+(i+1)+'</option>');
			
			// prepare assigns to review 
			var url = 	r[i].get("assign").get("url"); 	
			isInTime(url,i,r[i].get("assign"));	
			getCode(url,i); ///
			var id = AssignArr[i].get("assign").id; 
			show(id , i );
		}
	},function (e){console.log (e);});
	
	function show (id,i){
		qurBugs(id).then(function(r){
				for ( var j = 0 ; j < r.length ; j++ ){
					var  b = r[j] ;
					console.log (j);
					showBug(b,i);
				}
				finishCortrol (jobCount++);
			},function(e){console.log(e);
		});
	}
	function finishCortrol(){
		console.log ("BugInit");
		 jobCount === finalCount && bugInit() ;
	}
}


function submitReview (e) {
	//checkResult ; /**************************************/
	$(this).addClass("disabled");
	var checkStar = false ;
		for (var i = 0 ; i < AssignArr.length ; i++){
			var g  =  gradeArr [i] ;
			if (g[1] === "-"){ alert("#"+(i+1)+" 還沒評等喔！"); return false}	
			AssignArr[i].set("grade",g[1]);
			AssignArr[i].set("star",g[2]);
			AssignArr[i].set("overtime",TimeArr[i]);
			if (g[2]){checkStar = true ;}
		}
		if (!checkStar){alert("你還沒挑選最佳解喔！");
		return false}
		if (confirm("確定要繳交了嗎?繳交後就不能再更改囉")){
			$(this).attr("disabled","disabled");
			Parse.Object.saveAll(AssignArr).then (function (re){
				console.log ("SaveResult",re);
				localStorage.removeItem("reviewNth");
				localStorage.removeItem("gradeArr");
				alert("繳交成功了!");
				document.location="dashboard.html";
			},function(e){
				console.log ("e");
			});
		}
}


function isInTime(url,i,a){
	console.log("Check Last Modified...");
		$.ajax({
			url : "lastModifyForGhost.php",
			async : false,
			type: "GET",
			data:{url:url},
			dataType : 'text', //explicitly requesting the xml as text, rather than an xml document
			success : function (data, status, xhr) {	
				var d = new Date (data);
				
				if (	d > submitDeadline){
					//alert(d +"\n" + submitDeadline);
					url = "blankAssign/play.html" ;

					if ( typeof a.get("note") === 'undefined' || a.get("note") === ''){
						a.set("note","overdue");
						a.save().then(function(a){
							sendEvent(a.get("maker"),44).then(function(s){
							},Log);
						});
					}
				}
				
				var play = document.createElement("iframe");
				play.frameBorder = 0 ;
				play.scrolling ="no";
				play.style.width = "640px";
				play.style.height = "480px";
				play.setAttribute("src",url);
				$($(".tab-pane")[i]).find(".play").first().html(play);
			}
		});
}

////////////////////////////////////////////////////////////////////////////////////////////////


/**這是程式預覽**/

function getCode (url,i){
		console.log("Ajaxing");
		$.ajax({
			url : "getcodeForGhost.php",
			async : true,
			type: "POST",
			data:{url:url},
			dataType : 'text', //explicitly requesting the xml as text, rather than an xml document
			success : function (data, status, xhr) {		
				if (status == 'success') {
					var tabEditor =  $($(".tab-pane")[i]).find(".editor").first().get(0);
					//console.log(tabEditor);
					var editor = ace.edit( tabEditor );
			//		editor.setTheme("ace/theme/twilight");
			//		editor.getSession().setUseWrapMode(true);
			//		editor.getSession().setTabSize(2);
			//		tabEditor.style.fontSize='14px';
			//		editor.getSession().setMode("ace/mode/java");
					editor.setValue(data);
					CodeArr[i] = data ;				
				}	
			}
		});
}


// reportCheat
$(document).on('click','.report-cheat-submit-btn',function (e){
	var $p = $("#report-cheat-modal") ; 
	var v = $p.find(".cheat-reason").eq(0).val();
	var a = $p.find("#cheat-select").eq(0).val();
	console.log (a);
	var $t = $(this);
	$t.toggleDisabled();
	
	if (a.length > 1 ){
		var Report = Parse.Object.extend("Report");
		var r = new Report();
		//r.set("a", );
		r.set("assign",pointer(a,"Assign"));
		r.set("reviewer",Parse.User.current());

		r.set("reason",v);
		r.set("type","cheat");
		r.save().then(function (s){
			alert("舉報成功!待助教確認！");
			resetForm($p);
			$t.toggleDisabled();
			$p.modal('hide');
		});
		
	}else{
		alert("請輸入作弊事由");
	}
});

//// assign info 

function qurAssignInfo (){
	var AsnInfo = Parse.Object.extend("Assign_Info");
	var q = new Parse.Query(AsnInfo);
	return	q.find();
}

function prepareReqModal(asnInfo){
	//alert(btns);
	var nth = asnInfo.get("nth");
	var imgUrl = 'img/games/'+"broke-0"+nth+".png";
	var req = asnInfo.get("req");
	var n = asnInfo.get("name");
	
	var assignInfoModal = '<div class="modal fade assignModalInfo" id="req" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
	<div class="modal-dialog modal-lg" >\
		<div class="modal-content" >\
		\
		<div class="assign-info-outer">\
			<div class="assignInfo container-fluid">\
				<div class="row">\
						<div class="col-xs-3 ">\
							<div class="assignInfo-photo">\
		\						<img src="'+imgUrl+'" width="100%" >\
							</div>\
						</div>\
					<div class=" col-xs-9">\
		\				<h2 class="assignInfo-name">'+n +'</h2>\
						<div class="des-block requirement">\
							<h4>Requirement</h4>\
		\					<div class="des assignInfo-requirement">'+req+'</div>\
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