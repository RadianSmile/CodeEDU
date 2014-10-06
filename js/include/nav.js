document.write(
'<style type="text/css">\
.headroom {position: fixed;top: 0;left: 0;right: 0;transition: all .6s ease-in-out;}\
.headroom--unpinned {top: -48px;}\
.headroom--pinned {top: 0;}\
\
nav div.tooltip-inner {\
    max-width: 350px;\
}\
</style>'
);

document.write('<nav class="navbar navbar-default navbar-fixed-top headroom " role="navigation">\
		<div class="container-fluid">\
				<a class="navbar-brand" href="index.html">PROGRAMING 101</a>\
\
				<ul id="main-navigation" class="nav navbar-nav">\
						<li id="nav-user-block"><a href="dashboard.html"><span class="glyphicon glyphicon-user"></span></a></li>   <!--RN-->\
						<li><a href="notification.html" id="bell"><span class="glyphicon glyphicon-bell"></span></a></li>\
		<li data-toggle="tooltip" title="" class="nav-grading-btn hidden"><a href="review.html">Grading</a></li>\
		<li class="nav-students-btn"><a data-toggle="modal" href="students.html" data-target="#students">Student List</a></li>\
		<li class="nav-schedule-btn"><a data-toggle="modal" href="schedule.html" data-target="#schedule">Schedule</a></li>\
				</ul>\
\
				<ul class="nav navbar-nav navbar-right">\
		<!--li><a href="#">Help</a></li-->\
		<li><a href="#" id="logout" >Logout</a></li>\
				</ul>\
		</div>\
</nav>');

function ableGrading (s){
	var nth = s.get("nth");
	var ddl = s.get("reviewDue").toLocaleDateString()+s.get("reviewDue").toLocaleTimeString();
	localStorage.setItem("reviewNth",nth);
	console.log("reviewNth " +nth );
	var $btn = $(".nav-grading-btn") ;
	$btn.data("title","Dead Line : "+ddl).removeClass("hidden").hide().fadeIn().tooltip({
		animated: 'fade',
		placement: 'bottom',
	});;
}

function checkGradingTime (){
	/* */
	
	//review
	var fileName = getFileName();
	var reviewer = Parse.User.current();
	
	localStorage.removeItem("reveiwNth");
	var now = new Date();//new Date (2014,9,7)//Date(); 
	var AssignInfoArr = [] ;
	var AssignInfo = Parse.Object.extend("Assign_Info");
	//var assignInfo = new AssignInfo();
	var qAI = new Parse.Query(AssignInfo);
	qAI.lessThan("reviewDate",now);
	qAI.greaterThan("reviewDue",now);
	qAI.first().then(function(s){
		console.log ("reviewBtn AI object : ",s);
		if (s){

			var nth = s.get("nth");
			// 確定有沒有評過分			
			var ReviewRecord = Parse.Object.extend("Review_Record");
			var qRR = new Parse.Query(ReviewRecord);
			qRR.equalTo("nth",nth);
			qRR.equalTo("reviewer",reviewer);
			qRR.first().then(function(rr){
				if (typeof (rr) !== 'undefined'){
					//alert(rr.get("grade"));
					if (rr.get("grade")){
						// Have Done Review ;
						$(document).on('click','.game', function (e) {
							$(".assignInfo-link.to-review").text("前往評分 ( 太棒了！你已經評完分了 ) ").addClass("disabled").prop("disabled",true);;
						});

						//alert(fileName);
						if (fileName === "review.html" ){
							$(document).ready(function(e) {
								$(".review-submit").text("你已經評過分了").addClass("disabled").prop("disabled",true);	
							});
							//alert("你已經評完分了，不可以再次評分");
							//document.location = "dashboard.html";
						}
					}else {
						// Done Random but not review yet ;
						console.log (rr.get("Grade"));
						ableGrading(s);
					}
				}else {
					// cloud job is not finished
					console.log("cloud job not finish ");
				}
			},Log);
		}else{
			// Not During Reviewe
		}
	},function (e){
		console.log (e);
		//alert("error");
	});
}
checkGradingTime();

