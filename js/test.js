
function BugRecordSet_doneNotifi_undefined (){
	qurClass("Bug_Record").then(function(BRs){
		var saveArr = [] ;
		each(BRs,function (b){
			b.unset("isDoneNoti");
			saveArr.push(b);
		})
		Parse.Object.saveAll(saveArr).then(Log,Log);
	});

}