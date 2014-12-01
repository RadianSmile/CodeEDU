// JavaScript Document
//Parse._initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");
var userName="Anonymous";
var linkTo="dashboard.html";
var userimageHeight=19;
var userPhoto ;
var currentUser = Parse.User.current();

//console.log (currentUser);


$(function(){$("title").append(" | 程式設計基礎遊戲學習平台")});
  window.fbAsyncInit = function() {
		Parse.FacebookUtils.init({
			appId      : '1452756891666119',
			cookie     : true,  // enable cookies to allow the server to access 
			xfbml      : true,  // parse social plugins on this page
			version    : 'v1.0' // use version 2.1
  });

	
	// 規定只能使用這種，使用 status:true 會造成Parse出問題
  FB.getLoginStatus(function(response) {
		var s = response.status ; 
		if (s === 'connected'){
			if (currentUser){
				currentUser.fetch().then(function(u){
					userPhoto = u.get('photo');
					changeBarView(response,userPhoto);				
				});
			}
		}else if (s === 'not_authorized'){
			
		}else{
			if (currentUser){
				Parse.User.logOut();
			}
		}
		
		
		FBinitDone();
	
	$(document).on('click','#logout',fb_logout);
	function fb_logout(){
		Parse.User.logOut();
		FB.logout(function (){
			alert("登出成功 :))");
			window.location="index.html";
			
		});
		return false;
		//FB.logout();
	}


  });
};
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/zh_TW/all.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


Parse.User.prototype.ID = function () {
	return this.get("ID");
}

function getLoginStatus () {}




function FBinitDone(){}
/* make the API call */
/*

FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
   
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
*/


function getPhoto (){

}

function fb_login () {
	FB.login(function(response){
		//console.log(response);
		var u = response.authResponse.userID;
		var q = new Parse.Query(Parse.User);
		q.equalTo("uid",u);
		q.first().then(function(s){	
//		console.log (s);
			if(typeof(s) !== "undefined"){
				Parse.FacebookUtils.logIn(null,{success:function(u){
					if (!u.existed()) {
						//這裡理論上不能發生！
						
						alert ("我幫你註冊了，但好像有哪裡不太對噢");
						document.location="signup.html";
					}else{ 
						FB.api("/me/picture",{"redirect": false,"height": "200","type": "normal","width": "200"},function (response) {
								if (response && !response.error) {
									var url = response.data.url;
									var ourl = s.get("photo") ;
									if ( ourl === url ){
										alert("登入成功!");
										reloadToDashBoard();
									}else{
										s.set("photo",url);
										s.save().then(function (s){
											alert("登入成功，並更新了你的大頭貼");
											reloadToDashBoard();
										});
									}
								}
						});
	//asSs				alert("登入成功!");
					}
				}, error : function(){
					alert("請重新整理頁面再試一次");
					console.log(alert(error.message));
				}});	
					
			}else{
				
				alert ("你尚未註冊，系統將自動跳轉註冊頁面。");
				document.location="signup.html";
			}
			
		},function(e){
			console.log(e.message);	
		});
	});
	
}


function reloadToDashBoard(){
	document.location ="dashboard.html";	
}
function reloadToIndex(){
	document.location ="index.html";	
}










$(document).on("click",".toTop",function(e){
	var scroll_pos=(0);          
   $('html, body').animate({scrollTop:(scroll_pos)}, '1000');
});

function scrollToEle(selector){
	var pos = $(selector).offset().top - 70  ;
	//alert("scrollToEle");
   $('html, body').animate({scrollTop:(pos)}, '1000');
}

$(document).on("scroll","window",function(e){
	console.log($(document).scrollTop());
	if($(document).scrollTop() > 50 ){
		$(".toTop").fadeIn();	
	}else {
		$(".toTop").fadeOut();	
	}
	
});











function getViewerRole(){
	var p = new Parse.Promise();
	var u = Parse.User.current();
	if (u){
		u.fetch().then(function(s){
			p.resolve (s.get("role"));
		},Log)
	}else {
		p.resolve("guest");
	}
	return p ;  // student || role || guest 
}


function each (arr,func ){
	console.log ("Rn.Each is Triggered , Array Length is : " + arr.length);
	for (var i = 0 ; i < arr.length ; i++){
		func(arr[i] , i);
	}
}



function qurClass (name) {
	var Class = Parse.Object.extend(name),
			q = new Parse.Query (Class);
	q.limit (20000);
	return q.find ();
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
	
	var pointer;
	if ( className === "User"){
		pointer = new Parse.User ();		
	}else{
		pointer = new Parse.Object(className);
	}
	pointer.id = objectID;
  return pointer;
}

//## search Querys 
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


//## handle error ;


// Parse Error
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
// Hyperlink no parameter

function paraCheck (para,msg){  // return true if exist
	if ( typeof(para) === "undefined" || para === null ){
		if (typeof(msg) !== "undefined"){
			alert(msg);
		}
		return false ;
	}else {
		return true;
	}
}
	function padLeft(str, len) {
		str = '' + str;
		return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
	}



function renameClass (oldClass , newClass) {
	qurClass(oldClass).then(function(a){
		var newArr = [],
				N = Parse.Object.extend(newClass);

		each(a,function (r , i){
					newArr[i]= new N ();
			$.map(r.attributes,function (o,k){
				newArr[i].set(k,o);
			});
		});
		Parse.Object.saveAll(newArr).then(Log,Log);
	},Log);
}

Array.prototype.randomPop = function (){
	var l = this.length ; 
	if ( l === 0 ){ return false ;}
	var r = randBtw( 0, l -1);
  return this.splice(r, 1)[0];
}

Array.prototype.getIndexByOfValue = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            return i;
        }
    }
		return -1
}



Array.prototype.getIndexByAttr = function (attr, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i]['attributes'][attr] == value) {
            return i;
        }
    }
		return -1
}
Array.prototype.getValueByAttr = function (attr) {
	if (this['attributes'][attr]) {
		return	this['attributes'][attr] ;
	}else {
		return -1;
	}
}


Array.prototype.getIndexById = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].id == value) {
            return i;
        }
    }
		return -1
}
Array.prototype.getMatchElements = function (attr,value){
	var arr = [] ;
	for (var i = 0 ; i < this.length ; i++){
		if (this[i]['attributes'][attr] == value){
			arr.push (this[i]);
		}
	}
	return arr ;
}

function getObjectByAttrVal (Arr, attr , val){
	return Arr[Arr.getIndexByAttr(attr,val)];
}


$.fn.toggleDisabled = function (changeToAble) {
	
	var $this = $(this);

	if (!paraCheck(changeToAble) ){
		if ($this.prop('disabled')) {
			changeToAble = true ;
		}else{
			changeToAble = false ;
		}
	}

	return this.each(function () {
		if (changeToAble) { // 這時候代表 要變成 able
			$this.removeClass("disabled");
			console.log ("toggled to able");
			$this.prop('disabled', false);
		} else { // 這時候代表 要變成 disable
			$this.addClass("disabled");
			console.log ("toggled to disalbe");		
			$this.prop('disabled', true);
		}
	});
};

function isSet (a){
	return (typeof(a) !== 'undefined') ;
}


// -------------------------change logint to picture--------------------------



var userImageLink= userPhoto ;


function changeBarView(response,photourl){
	if(response.status=="connected" && currentUser){
		$("#nav-user-block a ").removeAttr('data-toggle');
		$("#nav-user-block a ").empty();
	$("#nav-user-block a").attr("href",linkTo);
	$("#nav-user-block a").append("<div></div>");
	if($("#nav-user-block a").hasClass("index-head")){
		$("#nav-user-block a div").css({"margin-right":7+"px"});
		$("#nav-user-block a").append("<span></span>");
		$(".index-head span").append(currentUser.get("name"));
		$("#nav-user-block").css({"padding-right":"15px"});
		$(".index-head span").css({"display":"inline-block","height":19+"px","line-height":"19px","vertical-align":"middle"});
	}
	loadPic(photourl,"#nav-user-block a",userName);
	//	$("#login-status a").empty();
	//	$("#login-status a").attr("href",linkTo);
	//	loadPic(userImageLink,"#login-status a",userName)
	}
}

function loadPic(userImageLink,dom,userName){
	var img=new Image();
	img.src=userImageLink;
	img.id = 'userNavPhoto' ;
	var loadChecker = window.setInterval(function(){
		if(img.complete){
			window.clearInterval(loadChecker);
			img.height=userimageHeight;
			//console.log(img);
			$(dom+" div").css({"width":userimageHeight+"px","height":userimageHeight+"px","overflow":"hidden","overflow":"hidden","display":"inline"});
			$(dom+" div").append(img);
//			$("#login-status a").append(img);
//			$("#login-status a").append(userName);
		}
		},100);
}

function gradeRef(){
	
	var gradeToStrRef = [];
	gradeToStrRef[0] = "X";
	gradeToStrRef[1] = "C";
	gradeToStrRef[2] = "B";
	gradeToStrRef[3] = "A";
	
	var gradeToNumRef = [];
	gradeToNumRef["O"] =0 ;
	gradeToNumRef["C"] =1 ;
	gradeToNumRef["B"] =2 ;
	gradeToNumRef["A"] =3 ;

	return {
		numToStr : function (num){
			return  gradeToStrRef[num];
		},
		strToNum : function  (str){
			return gradeToNumRef[str];
		}
	}
}
function randBtw (Min,Max){
	return Math.floor(Math.random() * (Max - Min + 1))+ Min ;
}

function replaceUndefined (param,paramName,replaceVal){
	if ( paraCheck(paramName)) console.log ("Typeof " + paramName + " is " + typeof (param) );
	if (typeof(param) === 'undefined'){
		if ( paraCheck(paramName)) console.log ("Check Done , the value is replaced with " + replaceVal);
		return replaceVal ;
	}else{
		if ( paraCheck(paramName)) console.log ("Check Done , the value is " + param)
		return param ;
	}
}

function switchUndef ( para) {
	if ( !paraCheck(para)) {
		return "" ;
	}else {
		return para ;
	}
}

function Write(str){
	document.write(str + "<br>");
	
}
function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}

function getFileName() {
	var url = document.location.href;
	url = url.substring(0, (url.indexOf("#") == -1) ? url.length : url.indexOf("#"));
	url = url.substring(0, (url.indexOf("?") == -1) ? url.length : url.indexOf("?"));
	url = url.substring(url.lastIndexOf("/") + 1, url.length);
	return url;
}

function getPureDate(date){
	var time = paraCheck(date) ? date : new Date ();
	var y = time.getFullYear();
	var m = time.getMonth();
	var d = time.getDate();
	time = new Date(y,m,d);
	return time;
}

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}


function switchUser(uid,func){
	var p = new Parse.Promise ();
	func = paraCheck(func) ? func : function (){} ;
	if (currentUser){
		var nowRole = currentUser.get("role") ;
		if (nowRole === "TA" || nowRole === "teacher"){
			(function (){
				if ( paraCheck(uid)){
					var qU = new Parse.Query(Parse.User);
					qU.equalTo("ID",uid);
					qU.first().then(function(s){
						if (paraCheck(s)){
							alert("你的play.js和Bug.js的視角為:"+s.get("name"));
							currentUser = s ;
							console.log ("Switch User Result : " + uid);
						}else{
							currentUser = s ;
							console.log ("Switch User Result : Wrong Uid");
						}
						p.resolve(currentUser);
						func();	
					},Log);
				}else{
					console.log ("Switch User Result : Uid no set");
					p.resolve(currentUser);
					func();
				}
			})();
		}	else{
			console.log ("Switch User Result : Not Teacher");
			p.resolve(currentUser);
			func();
		}
	}else {
		console.log ("Switch User Result : no currentUSer");
		p.resolve(currentUser);
		func();
	}
	return p ;
}

// Rn.
function getStrActualLen(sChars){
	return sChars.replace(/[^\x00-\xff]/g,"xx").length;
}