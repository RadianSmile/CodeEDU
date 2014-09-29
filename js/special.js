(function special(){
	var now = new Date ();
	var $mainNav = $("#main-navigation");
	var $apd = $("#special");
	
	
	var teacher = new Date (2014,8,28);
	var teacherDue = new Date (2014,8,30);
	if (now > teacher && now < teacherDue){
		var modalId =  "SpecialTeacher";
		var title = "教師節特別活動：請輸入你對這門課的修課期許。";
		var eidNum = 61;
		checkEventExistOne (61).then(function (s){
			if (typeof (s) === 'undefined'){
				prepareSpecial (modalId,title,eidNum);
			}
		});
	}
	
	
	
	
	function prepareSpecial (modalId,title,eidNum){
		$mainNav.append(genNavLi("Festival",modalId));
		var html ='<textarea class="special-textarea" placeholder="請輸入至少20個字"></textarea>';

		var modal = genSpeciaModal (modalId,title,html);
		$(modal).insertAfter('#special');
		$("#special").append(modal);
		$(document).on('click',"#"+modalId+" .sendEventBtn",function(e){
			var $this = $(this);
			$this.toggleDisabled();
			var $p = $this.closest(".special");
			var val = $p.find(".special-textarea").val();
			if (val.length < 20) {alert("請輸入至少20個字!\n目前長度："+val.length+"。"); $this.toggleDisabled(); return false ;}
			sendSpricalEvent(Parse.User.current(),eidNum,val).then(function(s){
				alert("繳交成功！");
				document.location.reload();
			},Log);
		});
		var modal = genSpeciaModal(modalId,title,html) ;
	}
	
	
	function genNavLi (title,modalId){
		var ele = '<li class="hasNoti"><a data-toggle="modal" data-target="#'+modalId+'">'+title+'</a></li>';
		return ele;
	}
	
	function genSpeciaModal (modalId,title,html){
		var modal ='<div class="modal special fade" id="'+modalId+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
		<div class="modal-dialog">\
			<div class="modal-content">\
				<div class="modal-header">\
					<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
					<h4 class="modal-title" id="myModalLabel">'+title+'</h4>\
				</div>\
				<div class="modal-body">\
					'+html+' \
				</div>\
				<div class="modal-footer">\
					<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
					<button type="button" class="btn btn-primary sendEventBtn">繳交拿獎勵！</button>\
				</div>\
			</div>\
		</div>\
	</div>';
		return modal;
		
	}
	function sendSpricalEvent (user,eidNum,note){
			var EventRecord = Parse.Object.extend("Event_Record");
			var e = new EventRecord ();
			e.set("target",user); // Target
			e.set("eid",eidNum);
			e.set("note",note);
			return e.save();
	}
	function checkEventExistOne(eidNum){
		var ER = Parse.Object.extend("Event_Record");
		q = new Parse.Query(ER);
		q.equalTo("eid",eidNum);
		q.equalTo("target",Parse.User.current());
		return q.first();		
	}
	
})();