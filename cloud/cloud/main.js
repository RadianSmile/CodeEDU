
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});
Parse.Cloud.define("getRole",function(rq,rp){
	Parse.Cloud.useMasterKey();
	
	var q = new Parse.Query(Parse.Role);
	q.find().then(rp.success,rp.error);
})


/** Uncompleted Function
/*Parse.Cloud.define("cleanUserStatus",function(rq,rp){
	var userStatusArr = [] ;
	qurClass("User_status").then(function(us){
		userStatusArr = us ;
		var q = new Parse.Query(Parse.User);
		q.limit(10000);
			
		}).then(function(){},function(){})
	})
});*/


/*Parse.Cloud.beforeSave("Event_Record",function(request){
});*/

Parse.Cloud.beforeSave(Parse.User,function(request,response){
	Parse.Cloud.useMasterKey();
	var obj = request.object;
	console.log ("----------------------------------------------" + obj.get("rolePwd"));
	if (typeof (obj.get("rolePwd")) === 'undefined' ){ // 這時候代表不是註冊或是已經處理完了，完全不用處理
		console.log ("已經註冊過/或是新增FB資料中~沒有事情發生");
		response.success();
	}else { // 這時候代表剛註冊完///
		console.log ("Obj.id = "+obj.id) ;
		if (typeof(obj.id) === 'undefined'){response.success();}
		var q = new Parse.Query (Parse.User);
		q.get(obj.id).then(JudgeRole,noAction)
		.then(addRoleToUser)  //新增角色
		 // 東西都完成了，密碼可以解除，之後就不會再進來initialize了
		.then(sucs,error); // 
	} // end if 
	
	function sucs (s){
		obj.unset("rolePwd");
		console.log ("有成功做到最後一步！")
		response.success();
	}
	function error (e){
		console.log (e.message);	
		response.error(e.message);
	}
	function statusRowExist(e){
		console.log ("使用者狀態已經存在，是否出錯了？");
		error(e);
	}
	
	function JudgeRole (pwd){
		console.log ("正在判斷使用者");
		var pwd = obj.get("rolePwd"); 
		var q = new Parse.Query(Parse.Role);

		if (pwd === "std781"){
			q.equalTo("name","Student");
			return q.first();
		}else if (pwd === "m6s/6cl6781!") {
			q.equalTo("name","Teacher");
			return q.first()
		}else if (pwd === "ta-781!"){
			q.equalTo("name","Assistant");
			return q.first()
		}else { //密碼錯誤
			console.log ("! the wrong pwd");
			response.error("密碼有誤，請重新整理頁面再操作一次！");
		}
	}
	
	function noAction(e){// 這時候代表，我還沒存進系統，暫時不處理。
		console.log ("! Adding FB ~ will Add role next step");			
		response.success("Fb Add Done");
	}
	function addRoleToUser (role){
		console.log ("把使用者塞進角色");
		role.getUsers().add(obj);
		return role.save();
	}
	function error (e) {
		//console.log ("! "+e.message);
		response.error (e);
	}
});



Parse.Cloud.afterSave(Parse.User,function(rq){
	Parse.Cloud.useMasterKey();
	var Status = Parse.Object.extend("User_status");
	var LevelInfo = Parse.Object.extend('Level_Info');
	var ql = new Parse.Query (LevelInfo);
	
	var obj = rq.object ;
	var l ;
	var eid = 10 ;

	if (!obj.existed()){
		console.log (obj.id);
		
		// welcom card ;
		sendEvent(obj,10).then(sucMes);
		
		// Level 
		ql.ascending('Level');
		ql.first()
			.then(addStatusRow)
			.then(sucMes,Log);
	}
	
	function addStatusRow (l){
		var status = new Status ();
		status.set("User",obj);
		status.set("HP",90);
		status.set("XP",0);
		status.set("Life",3);
		status.set("Level",1);
		status.set("LevelInfo",l);
		return status.save();	
	}
});



//UserStatus-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋

Parse.Cloud.beforeSave("User_status",function(request,response){
		Parse.Cloud.useMasterKey();

	var obj = request.object ; 
	//var fromUser = new Parse.User({id:request.params.userId});
	var user = obj.get("User");
	//console.log ("測試測試，From User vs User 檢測是否一樣" + (fromUser === user))
	var hp = obj.get("HP");
	var xp = obj.get("XP");
	var life = obj.get("Life");
	console.log ("HP" + hp.toString());
	if ( hp  > 100 ){
		hp = 100 ;
		obj.set("HP" ,100);
		console.log ("hp Overflowed!! now hp set to 100");
	}else if ( hp <= 0 ){
		//rn.yet 這邊要寫 防止 user 宰殺
		if (life - 1 > 0 ){
			sendEvent(user,20);
			obj.set('Life', life-1);
			obj.set('HP',100);
			sendEvent(user,20);
		}else if (life - 1 <= 0){
			obj.set("HP",0);
			obj.set('Life', 0);
			checkEventExistOne(user,21).then(function(s){
				if (typeof (s) === 'undefined'){
					sendEvent(user,21);
				}
			});
			
		}
	}

	
	var LevelInfo = Parse.Object.extend("Level_Info");
	var q = new Parse.Query(LevelInfo);
	
	var EventRecord = Parse.Object.extend("Event_Record");
	var xp = obj.get('XP');
	var level = obj.get("Level");
	var newLevel = 0 ;
				var eid = 16;
//---------	
	q.ascending('Level');
	q.find()
		.then(getNewLevel)
		.then(modifyLevel)
		.then(sendRaiseEvent);
		
//----------
	function getNewLevel (l){
		console.log ("getNewLevel");
		var p = new Parse.Promise();
		for (var i = 0 ; i < l.length ; i++){
			//console.log ("正在驗算 level");
			console.log ("xp :" + xp + ", sum : " + l[i].get("sum"));
			if ( xp >= l[i].get("sum") && xp < l[i+1].get("sum")){	
 				newLevel = i ;
				p.resolve(i); // 
				obj.set("LevelInfo",l[i]);
				break ;
			}
		}
		return p ;
	} 
	function modifyLevel(newLevel){
		var p = Parse.Promise();
		console.log ("processLevel");
		console.log ('new : '+newLevel+" old : "+level);

		if (newLevel > level){
			console.log ("Level Updated to "+ newLevel);
		}else if (newLevel < level){
			console.log ("Level Decrease ");
		}else {
			console.log ("Level Not Change")
		}
		obj.set("Level",newLevel);
 		return p
	}		
	function sendRaiseEvent(a){
		var d = newLevel - level ;
		//console.log("sending evnet---------- " + d);
		var saveArr = [] ;
		if (d > 0){
			for (var i = 0 ; i < d ; i++ ){
				var er = new EventRecord ();
				er.set("eid",eid);
				er.set("target",user);	
				saveArr.push (er);
			}
		}
		success();
		return Parse.Object.saveAll(saveArr);
	}
	function success (){
		response.success();
	}function error(e){
		response.error(e.message);
	}

});

/*
Parse.Cloud.afterSave("User_status",function(request){
	var obj = request.object ;
	var q = new Parse.Query(LevelInfo);
	var EventRecord = Parse.Object.extend("Event_Record");
	var user = obj.get('User');
	var xp = obj.get('XP');
	var level = obj.get("Level");

	var newLevel = 0 ;
	q.ascending('Level');
	q.find()
		.then(getNewLevel)
		.then(processLevel,function (e){console.error (e.message)});
	
	function getNewLevel (l){
		console.log ("getNewLevel");
		var p = new Parse.Promise();
		for (var i = 0 ; i < l.length ; i++){
			//console.log ("正在驗算 level");
			console.log ("xp :" + xp + ", sum : " + l[i].get("sum"));
			if ( xp > l[i].get("sum") && xp < l[i+1].get("sum")){	
 				newLevel = i ;
				p.resolve(i); //
				break ;
			}
		}
		return p ;
	}
	function processLevel(newLevel){
		console.log ("processLevel");
		var eid = 16;
		console.log ('new : '+newLevel+" old : "+level);
		if (newLevel > level){
			obj.set("Level",newLevel);
			obj.save(function(a){
				console.log ("Level Updated to "+ newLevel);
				var saveArr = [] ;
				for (var i = 0  , d = newLevel - level ; i < d ; i++ ){
					var er = new EventRecord ();
					er.set("eid",eid);
					er.set("target",user);	
					saveArr.push (er);
				}
				Parse.Object.saveAll(saveArr).then(function(a){
         console.log ("aaaa");
				},function(e){
					console.log("Got an error " + e.code + " : " + e.message);
				});
			},function (e){	
				console.log("Got an error " + e.code + " : " + e.message);
			});
			
		}
	}

///

});    */

//Singin_Log /=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

Parse.Cloud.job("checkClassParticipate",function(rq,rp){

	var t = rq.params.time ; //[2014,9,22]
	
	var checkNum = 0 ;
	var StdArr = [] ;
	var SigninArr = [] ;
	
	var hoursPlusBecomeUTC = -8 ;
	var classStart = new Date(t[0],t[1]-1,t[2] , 18, 0 , 0 );  // Time in Taiwan
			classStart.setTime( classStart.getTime() + hoursPlusBecomeUTC*60*60*1000 ); // Become to Server
	var classEnd = new Date(t[0],t[1]-1,t[2] , 21, 0 , 0 ); // Time in Taiwan 
			classEnd.setTime( classEnd.getTime() +hoursPlusBecomeUTC*60*60*1000 ); // Become to Server

	var SigninLog = Parse.Object.extend("Singin_Log");
	var qSI = new Parse.Query(SigninLog);
	qSI.limit(2000);
	qSI.greaterThan("createdAt",classStart);
	qSI.lessThan("createdAt",classEnd);
	qSI.find().then(function(s){
		console.log(s);
		SigninArr = s ;
		qurStudent().then(function(u){
			StdArr = u ;
			var saveArr = [] ;
			var dropArr = [] ;
			for (var i = 0 ; i < StdArr.length ; i++){
				var u = StdArr[i];
				for (var j = 0 ; j < SigninArr.length ; j++){
					if (u.id === SigninArr[j].get("user").id &&  SigninArr[j].get("ip").indexOf("140.119.73") > -1 ){
						console.log(u.get("name")+"\t"+SigninArr[j].createdAt+"\t"+SigninArr[j].get("ip")+"<br>");
						saveArr.push(u);
						participate(u);
						break ;
					}
				}
				if (j === SigninArr.length){ // 這是沒有 140.119.73的情況下
					drop(u);
					console.log(u.get("name")+"\t"+"曠課"+"<br>");		// 如果要該使用著的 登入ＩＰ 請點開本機版：signinLogAll.html
/*				for (j = 0 ; j < SigninArr.length ; j++){
						if (u.id === SigninArr[j].get("user").id ){
							console.log("---"+u.get("name")+"\t"+SigninArr[j].createdAt+"\t"+SigninArr[j].get("ip")+"<br>");	
							dropArr.push(u);
						}
					}
*/
				}
			}
			
			
			
			console.log ("participants num :" +saveArr.length);
			console.log ("drop num :"+dropArr.length);
		});
	});


	function participate(u){
		sendEvent(u,11).then(checked,Log);
	}
	function drop (u){
		sendEvent(u,19).then(checked,Log);
	}
	function checked(){
		if (++checkNum === StdArr.length )	{
			rp.message(checkNum.toString());
			rp.success();
		}
	}
	function Log(e){
		rp.error(e.message);
	}

	function qurStudent (){
		var U = Parse.User;
		var q = new Parse.Query(U);
		q.equalTo("role",'student');
		return q.find();
	}
});



//Event Record /-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋-＋


Parse.Cloud.job("setEventRecord_EventInfo",function(rq,rp){
	var EI ;
	qurClass('Event_Info').then(function(){
		return qurClass('Event_Info')  
	}).then(function(eis){
		EI = eis ;
		return qurClass("Event_Record");
	}).then(function(ER){
		var saveArr = [];
		for (var i = 0 ; i < ER.length ; i++){
			var eidNum = ER[i].get('eid')
			var eid = eidNum.toString();
			var ei = getObjectByAttrVal(EI,'eid',eid);
			ER[i].set("Event_Info",ei);
			saveArr.push(ER[i]);
		}
		return Parse.Object.saveAll(saveArr);
	}).then(function(){
		rp.success();
	},function(e){
		rp.error(e.message);
	})
})


Parse.Cloud.beforeSave("Event_Record",function(request,response){
	var obj = request.object ;
	var eidNum = obj.get('eid');
	var eid = eidNum.toString();
	var EventInfo = Parse.Object.extend("Event_Info");
	var qri = new Parse.Query(EventInfo);
		qri.equalTo("eid",eid);
		qri.first().then(function (ei){
			obj.set('Event_Info',ei);
			response.success();
		},function(e){
			response.error(e.message);
		});
});

Parse.Cloud.afterSave("Event_Record",function(request){
	var user = new Parse.User();
	var userOid = 	request.object.get("target").id;
	user.id = userOid;
	
	if(request.object.existed()) return false ; 
	console.log (userOid);
			
	function qurStatus (){
		var UserStatus = Parse.Object.extend("User_status");
		var q = new Parse.Query(UserStatus);	
		q.equalTo("User",user);
		return q.first();
	}

	var eid = request.object.get("eid");
			EI = Parse.Object.extend("Event_Info"),
			q = new Parse.Query(EI);
	
	var OwnCard = Parse.Object.extend("Owncard");
	
	q.equalTo("eid",eid.toString());
	q.first().then(function (evt){
		//console.log (JSON.stringify(evt));
		var eft = evt.get("effect_target") ;
		if (eft[0] !== 0 || eft[1] !== 0 ){	
			var dXP = eft[0];
			var dHP = eft[1];
			qurStatus().then(function(status){
				status.increment("XP",dXP);
				status.increment("HP",dHP);
				status.save().then(function(s){
					console.log ("add XP "+dXP );
					console.log ("add HP "+dHP );
				},function (e){console.log (e.message)});
			});
		}

		if (eft[2] > 0 ){
			console.log ("Sending Cards... " + eft[2] );
			var ownCardArr = new Array ();
			for (var j = 0 ; j < eft[2] ; j++){
				var ownCard = new OwnCard ();
				ownCard.set("user",user);
				ownCardArr.push(ownCard);
			}
			Parse.Object.saveAll(ownCardArr).then (function (r){
				console.log ("Card sent.");
			},function (e){
				console.log ("Card send faild");
			});
		}
	},function(e){
		console.log (e.message);
	});
});




Parse.Cloud.afterDelete(Parse.User,function(rq){
	var obj = rq.object;
	var qus = newQur('User_status') ;
	qus.equalTo('User',obj);
	qus.first().then(function(a){
		return a.destroy();
	}).then(Log,Log);

});

//-----------------------------------------------------------------------------
Parse.Cloud.job("Random_review", function(rq, status) {
		
	var ASSIGN_NTH = rq.params.nth	 ;	
	var STD_NUM = 0 ; //user(role=std).length
	var REVIEW_MAX = 5 ; 
	var BLANK_URL = "radiansmile.github.io/CodeEDU/final_11/play.html?blak";

	var AssignArr =[];
	var UserArr = [];
	var reviewRandomArr = []; 

	start();

	function start (){	
		var User = Parse.User;
		var Assign =	Parse.Object.extend("Assign");
		
		var qa= new Parse.Query(Assign);
				qa.equalTo("nth",ASSIGN_NTH);
				qa.include("maker");
		
		var qu = new Parse.Query(User);
				qu.equalTo("role","student");
	
		// Start
		qa.find().then(function(a){
			AssignArr = a ;
			qu.find().then(function(u){
				UserArr = u ; STD_NUM = UserArr.length; status.message(STD_NUM.toString()); 
				// 這時候應該要先去找到，沒有交作業的人			
				checkUserSubmit().then(function(blankAssigns){
					console.log("AssignArr.length before "+AssignArr.length.toString());
					AssignArr = AssignArr.concat(blankAssigns);
					console.log("AssignArr.length after "+AssignArr.length.toString());
					reviewRandomArr = getReviewNumArr ();
					Record();
				},function (e){status.error(e.message)});
			},function (e){status.error(e.message)});
		});
	}
	
	function checkUserSubmit(){
		var saveArr = [] ;
		for (var i = 0 ; i < UserArr.length ; i++){
			var uoid = UserArr[i].id ;
			var checkSubmit = false ;
			for (var j = 0 ; j < AssignArr.length ; j++){
				var auoid = AssignArr[j].get('maker').id;
				if (auoid === uoid) {checkSubmit = true ; break ;}
			}
			if (checkSubmit){
				continue ;
			}else {
				var A = Parse.Object.extend("Assign");
				var aa = new A();
				aa.set("maker",UserArr[i]);
				aa.set("nth",ASSIGN_NTH);
				aa.set("url",BLANK_URL);
				aa.set("uid",UserArr[i].get('ID'));
				aa.set("note","uncomplete");
				saveArr.push (aa);
				console.log ("Didnot Submit User Id : "+UserArr[i].id);
			}
		}
		return Parse.Object.saveAll (saveArr);
	}
	
	function getReviewNumArr (){
		var reviewList = [];
	
		var arr = [];
		for (var i = 0 ; i <= REVIEW_MAX; i++) {
			arr =  (i === 0 ) ? makeArrBtw(0,STD_NUM) : shuffle(makeArrBtw(0,STD_NUM)) ;
			reviewList.push(arr);		
		} //!show (reviewList,"Origin:");
		var hw = checkDuplicate(reviewList);
		var stdHwArr = breakHW (hw);
			//show(stdHwArr);
			return stdHwArr ;
	}
	
	var overflowX = [] ;
	function checkDuplicate (hw) {
			for( var x = 0 ; x < STD_NUM ; x ++){ // 直排檢查開始  
			Vcheck(hw,x);
		}//
		if (overflowX.length > 0 ){//!show(overflowX);
			var a = overflowX.shift() ;
			while (typeof a  !== 'undefined')
			{	//!show(["Rechecking",a]);
				var obj = Vcheck(hw,a,true);
				a = overflowX.shift() ;
			}//!show(["success"]);
		}//!show (hw,"Alter:");
		return (hw);
	}
	function Vcheck(hw,x,isOverflow){
			for( var y = 1 ; y <= REVIEW_MAX ; y++){		
				var obj = Hcheck(hw,x,y);			// 執行到這裡代表Unique，會得到一個新的X
				switch (obj.status) {
					case 3:  //!console.log("obj.x: ",obj.x);
						overflowX.push(obj.x);
					case 2 :  // 執行交換  //!var testArr =["原y",y,"原x",x,"後y",y,"後x",obj.x];
						if(isOverflow){overflowX.push(obj.x);} //!show(testArr,"test");
						var temp = hw[y][x] ;
						hw[y][x] = hw[y][obj.x];
						hw[y][obj.x] = temp ; 
						break ;
					case 1 ://!if(isOverflow) {show(["Unique"]);}
						break;
					default :
						break; 
				}
			}//		
	}	
	function Hcheck(hw,x,y){
		//判別：下面這邊開始要縱項檢查
		var obj = new Object();
		obj.status = 0 ; //!console.log("tempY",y);                          
		tempY = y ; 								//正在變動的Y
		tempX = x ; 								//正在變動的X
			while ( --tempY >= 0 ){			//檢查下一個縱向檢查值 //!console.log("tempY",y);
				var vCheck = hw[tempY][x]; //變動的縱向檢查值
				var hCheck = hw[y][tempX]; //變動的橫向檢查值
				if( hCheck !== vCheck  ){
					obj.status = (obj.status < 1) ? 1 : obj.status;
				}else{
					obj.status =  (obj.status < 2) ? 2 : obj.status;
					if (tempX < STD_NUM -1 ){ 		//開始往右   //讓回圈用下一個橫向檢查值，來做縱向檢查。
						tempX++;
					}else {
					obj.status =  (obj.status < 3) ? 3 : obj.status;
						tempX = 0 ;
					}
					tempY = y ; //讓Y值回歸，重新縱向檢查。
				}
			}//while
			obj.x = tempX;
			obj.y = tempY; 	//console.log(obj.status);
		return obj ;
	}
	function breakHW (hw){
		var stdHW = [];
		var HW = hw.slice();
		HW.shift();
		
		for (var x = 0 ; x < STD_NUM ; x++){
			status.message(JSON.stringify(arr));
			var arr = [] ;
			for (var y = 0 ; y < REVIEW_MAX  ; y++ ){
				arr.push (HW[y][x]);
			}
			stdHW.push(arr);
		}
		return stdHW ;
	
	}
	
	function makeArrBtw (lowEnd , highEnd ){
		var arr = [] ; 
		for (var i = lowEnd; i < highEnd; i++) {
			arr.push(i);
		}
		return arr ;
	}
	function shuffle(o){ //v1.0
			for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x   );
			return o;
	}	
	function Record (){
		AssignArr ;
		UserArr ;
		reviewRandomArr ;
		var saveAllArr = [];
		var ReviewRecord = Parse.Object.extend("Review_Record");
		for ( var i = 0 ; i < reviewRandomArr.length; i++){
			var  row = reviewRandomArr[i] ;
			for ( var j = 0  ; j < row.length; j++){
				var makerIndex = row[j]
				for ( var k = 0 ; k < AssignArr.length; k++){
					var assign = AssignArr[k] ;
					if (assign.get("maker").id === UserArr[makerIndex].id ){//
						var reviewRecord = new ReviewRecord ();
						reviewRecord.set("reviewer",UserArr[i]);
						reviewRecord.set("assign",assign);
						reviewRecord.set("assign_id",assign.id);
						reviewRecord.set("nth",ASSIGN_NTH);	
						saveAllArr.push (reviewRecord);		
					}
				}
			}
		}
		console.log("saveAllArr",saveAllArr);
		Parse.Object.saveAll(saveAllArr).then(function(l){
			console.log("Random Done!! Congratulations!!");
			console.log(l);
			status.success("Random Done!!");
			}
		,function(e){
			console.log (e);	
			status.error(e.message);	
		});
	}
});

//Grading-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Parse.Cloud.job("Grading",function(rq,rp){
	var nth = rq.params.nth ;
	var assignNum = 0 ;
	var successCount = 0  ;
	
	var AssignArr = []
	
	getAssign()
		.then(doGrading,function (e){rp.error("really!?")});
	
	var gradeToStrRef = [];
	gradeToStrRef[0] = "X";
	gradeToStrRef[1] = "C";
	gradeToStrRef[2] = "B";
	gradeToStrRef[3] = "A";
	
	var gradeToNumRef = [];
	gradeToNumRef["X"] =0 ;
	gradeToNumRef["C"] =1 ;
	gradeToNumRef["B"] =2 ;
	gradeToNumRef["A"] =3 ;
	
	function successPlus(a){
		successCount++;
		rp.message("success " + successCount +" "+a.id);
		if (successCount === assignNum ){
			rp.success("successCount "+successCount);
		}
	}
	function doGrading (Assigns){
		AssignArr = Assigns
		assignNum =  Assigns.length ;
		console.log ("assignNum" + assignNum.toString());
		for (var i = 0 ; i < AssignArr.length ; i++){
			//console.log (Assign[i].id);
			getRecordByAssign(AssignArr[i])
			.then(singleGrading)
			.then(function(a){
				console.log(a.id+" grade "+a.get("grade") );		
				sendGradEvent(a).then(function(e){
					console.log ("userEventSend");
					successPlus (a);
				},function (e){
					successCount++;
					console.log ("event send fail, error : "+e.message);
					rp.error('fail to save a assign');	
				});
			},function(e){
				rp.error('fail to save a assign');	
			});
		}
	}
	
	function singleGrading (r){
		//console.log("Record Length "+r.length.toString());
		var p = new Parse.Promise();
		var star = 0 ;
		var total = 0 ;
		var count = 0 ;
		for (var i = 0 ; i < r.length ; i++){
			var g = r[i].get("grade") ;
			if (typeof (g) !== 'undefined'){ 
				total += gradeToNumRef[g];
				count++;
			}
			//console.log (r[i].get("star"));
			r[i].get("star") ? star++ : star ;
		}
		var avg = Math.round(total/ count) ;
		
		for (i = 0 ; i < r.length ; i++){
			var g = r[i].get("grade") ;
			var d = gradeToNumRef[g] - avg ;
			var note = "" ;
			if (typeof g !== 'undefined'){
				switch (d){
					case 3 : note = "Extremely High!!" ; break ;
					case -3 : note = "Extremely Low!!" ; break ; 
					case 2 : note = "Too High!!" ; break ; 
					case -2 : note = "Too Low!!";  break ; 
					case 1 : note = "High" ; break ; 
					case -1 : note = "Lower";  break ; 
					default : note = "";
				}
			}else{
				note = "Uncomplete!";
			}
			r[i].set("final", gradeToStrRef[avg]);
			r[i].set("variaty", d );
			r[i].set("note", note );
		}
		
		Parse.Object.saveAll(r).then(function(rr){
			rp.message("Record One Assign !");
			
		},function(e){
			rp.error("Record Save To Assign Fail");
		});
		
		
		var assign = r[0].get("assign");
		assign.set("grade",gradeToStrRef[avg]);
		assign.set("star",star);
		return assign.save();
	}
	
	//Rn src = https://www.parse.com/questions/how-to-query-for-class-with-pointer-equal-to-a-string-value
	function getRecordByAssign  (assign){
		var ReviewRecord = Parse.Object.extend ("Review_Record");
		var q = new Parse.Query (ReviewRecord);
		q.include("assign");
		q.equalTo("assign",assign);
		q.limit(1000);
		return q.find();
	}
	function getRecordByReviewer (userId) {
		var ReviewRecord = Parse.Object.extend ("Review_Record");
		var q = new Parse.Query (ReviewRecord);
		q.include("reviewer");
		q.equalTo("reviewer", {
			__type: "Pointer",
			className: "User",
			objectId: userId
		});
		return q.find();
	}
	function getAssign(){
		var Assign = Parse.Object.extend("Assign");
		var q = new Parse.Query (Assign);
		q.include("maker");
		q.equalTo('nth',nth);
		q.limit(1000);
		return q.find();
	}
	
	function sendGradEvent(a){
		var m = a.get('maker') ;
		var g = a.get("grade");
		var eid = 0 ;
		switch(g){
			case "A": eid = 34; break; 
			case "B": eid = 33; break; 
			case "C": eid = 32; break; 
			case "X": eid = 31; break; 
			default : rp.error("aoid "+a.id+" "+g+" wrong grade! why ?");
		}
		return sendEvent(m,eid);
	}
	
	function Log (e){console.log(e);}
	
});



//Common Function  -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

function qurClass (name) {
	var Class = Parse.Object.extend(name),
			q = new Parse.Query (Class);
	q.limit (20000);
	q.descending("createdAt");
	return q.find ();
}
function qurStudent (){
	var U = Parse.User;
	var q = new Parse.Query(U);
	q.equalTo("role",'student');
	return q.find();
}

function newObject(className){
	var C = Parse.Object.extend(className);
	var c = new C();
	return c ; 
}
function newQur (className){
	var C = Parse.Object.extend(className);
	var q = new Parse.Query(C);
	return q ;
}

function Log(o){
	console.log (o) ;
}

function pointer (objectID,className){
	var c = (typeof(className) !== 'undefined') ? className : "Assign";
	console.log (c);
  var pointer = new Parse.Object(c);
  pointer.id = objectID;
  return pointer;
}


function sendEvent (user,eidNum){
	var EventRecord = Parse.Object.extend("Event_Record");
	var e = new EventRecord ();
	e.set("target",user); // Target
	e.set("eid",eidNum);
	return e.save();
}

function checkEventExistOne(user,eidNum){
	var ER = Parse.Object.extend("Event_Record");
	q = new Parse.Query(ER);
	q.equalTo("eid",eidNum);
	q.equalTo("target",user);
	return q.first();		
}


function sucMes(s){
	console.log ("成功完成！");
}

//Object function -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
Array.prototype.getIndexByAttr = function (attr, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i]['attributes'][attr] == value) {
            return i;
        }
    }
		return -1
}
Array.prototype.getIndexById = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id == value) {
            return i;
        }
    }
		return -1
}

function getObjectByAttrVal (Arr, attr , val){
	return Arr[Arr.getIndexByAttr(attr,val)];
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=