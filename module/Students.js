
var Students = (function (){
	var all ;
	var AutoFillArr = [] ;
	var IDStdObjArr = [] ;
	
	
	function qurStds(){
		var p = new Parse.Promise();
		var q = new Parse.Query(Parse.User);
		q.equalTo("role","student");
		q.find().then(function(s){
			all = s ;
			p.resolve(s);
		});
		return p ;
	}
	
	function makeAutofillArr (a){
		
		;
		for (var i = 0 ; i < a.length ; i++)
		{
			var id = a[i].get("ID");
			var name = a[i].get("name");
			if(typeof (id) === 'undefined'){continue;}
			AutoFillArr.push({ label: id+" "+name , value: id });
			IDStdObjArr[id] = a[i];
		}
		
	}
	
	
	function init (options){
		var p = new Parse.Promise();
		qurStds()
			.then(function(s){
				makeAutofillArr(s);
				p.resolve(true);			
			});
		return p ;
	}
	
	
	function getById (ID){
		return IDStdObjArr[ID];
	}
	
	return {
		// Attr 
			all : all ,
			AutoFillArr : AutoFillArr ,
			IDStdObjArr :IDStdObjArr ,
		// method ;
			init : init ,
			get : getById 
	}
})();
	