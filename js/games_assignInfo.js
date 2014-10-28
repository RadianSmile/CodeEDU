function qurAssignInfo (){
	var AsnInfo = Parse.Object.extend("Assign_Info");
	var q = new Parse.Query(AsnInfo);
	return	q.find();
}


function showAsnInfoOnGames (asnInfos ,nth ){
	var currentAsnInfo = asnInfos//getObjectByAttrVal (asnInfos, "nth" , nth);
	var imgUrl = "img/games/light-0"+nth+".png" ;
	var intro = currentAsnInfo.get("intro");
	var req = currentAsnInfo.get("req");
	var n = currentAsnInfo.get("name");
	var html = '			\
			<div class="assign-info-outer">\
				<div class="assignInfo container-fluid">\
					<div class="row">\
							<div class="col-xs-2 col-xs-offset-1">\
								<div class="assignInfo-photo">\
			\						<img  src="'+imgUrl+'" width="100%" >\
								</div>\
							</div>\
						<div class=" col-xs-8 col-xs-offset-1">\
			\				<h2 class="assignInfo-name">'+n +'</h2>\
							<div class="des-block intro">\
								<h4>Introduction</h4>\
			\					<div class="des assignInfo-intro">'+intro+'</div>				\
							</div>\
							<!--div class="des-block requirement">\
								<h4>Requirement</h4>\
			\					<div class="des assignInfo-requirement">'+req+'</div>\
							</div-->\
						</div>\
					</div>\
				</div>\
				</div>';
	
	$("#asnInfoArea").append(html);
	
}
