Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");

function sendEvent (user,eidNum){
	var EventRecord = Parse.Object.extend("Event_Record");
	var e = new EventRecord ();
	e.set("target",user); // Target
	e.set("eid",eidNum);
	return e.save();
}

function halloween(){
	console.log ("running");
  var count = 0;
  var userstatus = Parse.Object.extend('User_status');
  var query = new Parse.Query(userstatus);
  query.descending("XP");
  query.include('User');
  query.find({
    success:function(alluser){
      for(var i = 0; i<alluser.length; i++){
            var userrole = alluser[i].get('User').get('role');
            if(userrole == "student"){
                var userobject = alluser[i].get('User').id;
                localStorage.setItem('userobject', userobject);
                count++;
                if(count <= 27){
                  var user = Parse.Object.extend('User');
                  var userquery = new Parse.Query(user);
                  var retrievedObject = localStorage.getItem('userobject');
                  userquery.equalTo('objectId', retrievedObject);
                  userquery.first({
                    success:function(user){
                        var cardinfo = Parse.Object.extend('Card_info');
                        var query = new Parse.Query(cardinfo);
                        query.get("1PF6Z8XISA",{
                            success:function(stealcard){
                                var Owncard = Parse.Object.extend('Owncard');
                                var owncard = new Owncard();
                                owncard.set('user', user);
                                owncard.set('Card_info', stealcard);
                                owncard.save(null, {
                                    success:function(s){
                                        console.log("發放偷竊卡片卡成功! " + s.get("user").get("name"));
                                        localStorage.removeItem('userobject');
																						// ** 這裡要發放 事件通知 與 卡片記錄
																						sendEvent (s.get("user"),63);
																				
                                    },
                                    error:function(error){
                                        console.log(error);
                                    }
                                })

                                var Cardrecord = Parse.Object.extend('Card_record');
                                var cardrecord = new Cardrecord();
                                cardrecord.set('user', user);
                                cardrecord.set('Card_info', stealcard);
                                cardrecord.set('User', user);
                                cardrecord.set('type', "get");
                                cardrecord.save(null,{
                                  success:function(){
                                    console.log("獲得偷竊卡紀錄成功!");
                                  }
                                })

                            },
                            error:function(error){
                                console.log(error);
                            }
                        })
                    }
                  })
                }
                else{
                  var user = Parse.Object.extend('User');
                  var userquery = new Parse.Query(user);
                  var retrievedObject = localStorage.getItem('userobject');
                  userquery.equalTo('objectId', retrievedObject);
                  userquery.first({
                    success:function(user){
                        var cardinfo = Parse.Object.extend('Card_info');
                        var query = new Parse.Query(cardinfo);
                        query.get("aJONHaxQtM",{
                            success:function(lifecard){
                                var Owncard = Parse.Object.extend('Owncard');
                                var owncard = new Owncard();
                                owncard.set('user', user);
                                owncard.set('Card_info', lifecard);
                                owncard.save(null, {
                                    success:function(s){
																						
                                        console.log("發放加生命值卡成功! " +s.get("user").get("name") );
                                        localStorage.removeItem('userobject');
																						sendEvent (s.get("user"),63);
                                    },
                                    error:function(error){
                                        console.log(error);
                                    }
                                })

                                var Cardrecord = Parse.Object.extend('Card_record');
                                var cardrecord = new Cardrecord();
                                cardrecord.set('user', user);
                                cardrecord.set('Card_info', lifecard);
                                cardrecord.set('User', user);
                                cardrecord.set('type', "get");
                                cardrecord.save(null,{
                                  success:function(){
                                    console.log("獲得加生命值卡紀錄成功!");
                                  }
                                })

                            }
                        })
                    }
                  })
                }
            } 
      }
    }
  })
}
