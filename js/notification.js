(function (){
var notification_user ;

	var srh = getQueryString();
	var uid = srh.uid ;


$(document).ready(function (e){

	
	if (typeof (uid) !== 'undefined' && uid.length >= 1){
		getViewerRole().then(function(u){
			//alert(u);
			if ( u === 'guest'){
				alert("你沒有瀏覽別人的通知的權限\n系統將跳轉回Dashboard");
				document.location = "index.html";
			}else if (u === 'student'){
				alert("你沒有瀏覽別人的通知的權限\n系統將跳轉回Dashboard");
				document.location = "dashboard.html";	
			}else{ // 老師或ＴＡ
				
				var qU = new  Parse.Query (Parse.User);
				qU.equalTo("ID",uid);
				qU.first().then(function(s){  // 這個是 要看的目標
					if (typeof s ==='undefined'){    // 如果找不到目標：
						alert("找不到你要查詢的使用者\n系統將跳轉回Dashboard");
						document.location = "dashboard.html";
					}else{  // 找到目標了
						$("#developer-note").html("Developer-note : "+s.get("name")+"的通知記錄").css("color","white").css("padding","20px 0");
						notification_user = s ;					
						initNotification();
					}
				});
			}	
		});
	}else{
		notification_user = Parse.User.current();
	//	alert(notification_user.id);
		initNotification();
	}
});


function initNotification(nu){
	moment.locale('zh-TW');

    Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");
    if(notification_user){
			var EI = [] ;
        function getEventInfo (){
				   var EventInfo = Parse.Object.extend("Event_Info");
					 var q = new Parse.Query (EventInfo);
					 return q.find();
				}
				getEventInfo().then(function (Ei){
						EI = Ei ;
						 showEventRecord();
						
				})
				function showEventRecord (){
        var eventnotification = "";
        var eventrecord = Parse.Object.extend("Event_Record");
        var query3 = new Parse.Query(eventrecord);
				query3.descending("createdAt");
        query3.equalTo('target', notification_user);
        query3.find({
           success:function(data){ // evetRecord
						var saveArr = []
                for(var i = 0; i<data.length; i++){
                    
                    var eid = data[i].get('eid');
											var eidStr = eid.toString();
                    var datai = data[i]; // Event Record
											var addClass = (data[i].get('isNoti') !== true)? 'noti-new' : '' ;
											var noteArr = [] ;
//**					
											var currentEventInfo = getObjectByAttrVal(EI,"eid",eidStr);
//
											
											
											if (currentEventInfo.get("type") === 'b' && paraCheck(datai.get("note"))){
												addClass += " bug-event" ;
												console.log (datai.get("note"));
												noteArr = JSON.parse (datai.get("note"));
//												console.log (arr);
												
											}
												var s = eventRecord(datai, currentEventInfo);
												eventnotification += s;
												var strings = "<div class='notification-info "+ addClass +"' data-bid='"+noteArr.bid+"' data-aid='"+noteArr.aid+"'>" + eventnotification + "</div>";   //Rn
												$('#works').append(strings);
												eventnotification = "";
                        //}
                   // });
//**
										  if (data[i].get('isNoti') !== true){
											data[i].set('isNoti', true);
											saveArr.push (data[i]);
										}

                } // for
								
								// 如果看的人是自己，那就跟更新
								if ( typeof (uid) === 'undefined'){
                Parse.Object.saveAll(saveArr).then(Log,Log);
								}
            }
        });
				}
        //Card use
        var notification = "";
        var notif = Parse.Object.extend("Card_record");
        var query1 = new Parse.Query(notif);
        //query1.equalTo('type', "use");  
				 //var q = new Parse.Query(notif);
				 //q.equalTo('type', "get");
        var query2 = new Parse.Query(notif);
        query2.equalTo('user', notification_user);
        var query3 = new Parse.Query(notif);
        query3.equalTo('targetuser', notification_user);
        var query = Parse.Query.or(query2,query3);
        //query1.include('User');
        query.include('Card_info');
        query.include('user');
        query.include('targetuser');
        query.descending('createdAt');
        query.find({
            success:function(data){
                var saveArr = [];
                for(var i = 0; i<data.length; i++){
            					
											var newClass = (data[i].get('isNotif') !== true)? 'noti-new' : ''
                    var strings ;
                    if(data[i].get('type') == "use"){
                        var s = useRecord(data[i]);
                        //notification += s;
                        strings = "<div class = 'notification-info "+newClass+"'>" + s + "</div>";
                        //notification = "";
                    }else{
                       var s2 = getRecord(data[i]);
                       strings = "<div class = 'notification-info "+newClass+" '>" + s2 + "</div>";
                    }
                    $('#cards').append(strings);
											if (data[i].get('isNotif') !== true){
												data[i].set('isNotif', true);
												saveArr.push(data[i]);
                    }    
                }
									if ( typeof (uid) === 'undefined'){
										//alert(uid);
                		Parse.Object.saveAll(saveArr).then(Log,Log);
									}

            },
            error:function(error){
                console.log(error.toString());
            }
        });

        //Card get 
        /*
        var notification1 = "";
        var notif1 = Parse.Object.extend("Card_record");
        var query1 = new Parse.Query(notif1);
        query1.equalTo('type', "get");
        query1.equalTo('user', notification_user);
        query1.include('Card_info');
        query1.include('user');
        query1.descending('createdAt');
        query1.find({
            success:function(data){
                for(var i = 0; i<data.length; i++){
                    var s = getRecord(data[i]);
                    notification1 += s;
                    var strings = "<div class = 'notification-info'>" + notification1 + "</div>";
                    $('#cards').append(strings);
                    notification1 = "";
                }
            },
            error:function(error){
                console.log(error.toString());
            }
        });
*/ 
    }
}

function useRecord(data){
    var targetName = data.get('targetuser').get('name');
    var targetId = data.get('targetuser').id;
    var cardName = data.get('Card_info').get('name');
    var userId = data.get('user').id;
    var userName = data.get('user').get('name');
    var createTime = moment(data.createdAt).fromNow();  // Rn
        console.log ("createTime",createTime.toLocaleString());
    var container = "";
    var s = "";
        if(userId == notification_user.id){
            if(targetId == notification_user.id){
                s = "你對自己使用了" + cardName + "。";
                container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-plus-sign' style = 'white-space: nowrap;'></span>"+ s +"</div>";
            }
            else{
                s = "你對" + targetName + "使用了" + cardName + "。";
                container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-record' style = 'white-space: nowrap;'></span>"+ s +"</div>";
            }
        }
        else if(targetId == notification_user.id){
            s = userName+"對你使用了" + cardName + "。";
            container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-exclamation-sign' style = 'white-space: nowrap;'></span>"+ s +"</div>";
        }
    return container;
}

function getRecord(data){
    var userId = data.get('user').id;
    var cardName = data.get('Card_info').get('name');
    var createTime = moment(data.createdAt).fromNow(); //
    
    var container = "";
    var s = "";
        if(userId == notification_user.id){
            s = "你抽到了"+ cardName + "。";
            container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-certificate' style = 'white-space: nowrap;'></span>"+ s +"</div>";
        }
    return container;
}

function eventRecord(data, data1){ // Event Record , Event Info
		var isBug = data1.get("tyep") === 'b' ;
		var bid = "#" + isBug ? "<span class='bidText'>(霸個 " +JSON.parse(data.get("note")).bid + ")</span> " : "" ;
		
    var eventdes = data1.get('description');
        console.log (eventdes);
    var createTime = data.createdAt;
				console.log (createTime);
        var m = moment(data.createdAt).fromNow();
        
    var result = data1.get('effect_target');
    var xp = result[0];
    var hp = result[1];
    var cd = result[2];
    var container = "";
    var s = "";
        
        var start = (xp !== 0 || hp !== 0 || cd !== 0 ) ? "，因此你" : '' ;
        var xpStr = (xp !== 0) ? (xp > 0 ) ? 'XP增加了'+Math.abs(xp)+"，" : 'XP減少了'+Math.abs(xp)+"，": '' ;
        var hpStr = (hp !== 0) ? (hp > 0 ) ? 'HP增加了'+Math.abs(hp)+"，" : 'HP減少了'+Math.abs(hp)+"，": '' ; 
        var cdStr = (cd !== 0) ? (cd > 0 ) ? '卡片增加了'+Math.abs(cd)+"張，" : '的卡片減少了'+Math.abs(cd)+"張，": '' ; 
        s = start + xpStr + hpStr + cdStr;
        s = s.slice(0,-1) + "。";
    container =  "<span class = 'glyphicon glyphicon-info-sign' style = 'white-space: nowrap;'></span>" + bid+"<br>" +eventdes+s+"<span class = 'time-gray-color'>"+m+"</span></div>";
/*=======
    if(hp >=0){
        s = "因為" + eventdes + "，所以造成你的XP增加" + xp +"、你的HP增加" + hp + "、你的抽卡機會增加" + draw + "次。";
        container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-bullhorn' style = 'white-space: nowrap;'>"+ s +"</span></div>";
    }
    else{
        s = "因為" + eventdes + "，所以造成你的XP增加" + xp +"、你的HP被" + hp + "、你的抽卡機會增加" + draw + "次。";
        container = "<div class = 'time-gray-color'>"+createTime+"</div><span class = 'glyphicon glyphicon-bullhorn' style = 'white-space: nowrap;'>"+ s +"</span></div>";
    }
>>>>>>> FETCH_HEAD*/
    return container;
}

})();

//  Attach Event 

$(document).on('click',".bug-event",function(e){
	var bid = $(this).data("bid");
	var aid = $(this).data("aid");
	document.location = "play.html?aid=" + aid +"&bid=" + bid ;
	
});