
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.job("Random_review", function(rq, status) {
	
var ASSIGN_NTH = rq.params.assignNum	 ;	
var STD_NUM = 0 ; //user(role=std).length
var REVIEW_MAX = 5 ; 

	

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
};



var Test_User = Parse.Object.extend("Test_User");
var Test_Assign =	Parse.Object.extend("Test_Assign");

var qa= new Parse.Query(Test_Assign);
qa.equalTo("nth",ASSIGN_NTH);
qa.include("maker");
var AssignArr =[];

var qu = new Parse.Query(Test_User);
qu.equalTo("role","std");
var UserArr = [];

STD_NUM;REVIEW_MAX // two var used in  "getReviewNumArr()";

var reviewRandomArr = []; 

qa.find().then(function(o){AssignArr = o ;}).then(function(e){
	qu.find().then(function(o){UserArr = o ; 
		STD_NUM = UserArr.length;
		console.log ("STD_NUM",STD_NUM);
		reviewRandomArr = getReviewNumArr ();
		Record();
	},function(e){console.log(e);});
});



function Record (){
	AssignArr ;
	UserArr ;
	reviewRandomArr ;
	var saveAllArr = [];
	var ReviewRecord = Parse.Object.extend("Test_Review_Record");
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
					reviewRecord.set("nth",ASSIGN_NTH);	
					saveAllArr.push (reviewRecord);		
				}
			}
		}
	}
	console.log("saveAllArr",saveAllArr);
	Parse.Object.saveAll(saveAllArr).then(function(l){
		console.log("Fuck");
		console.log(l);
		status.success("Random Done!! Congratulations!!");
		}
	,function(e){
		console.log (e);	
		status.error(e.message);	
	});
}


});

