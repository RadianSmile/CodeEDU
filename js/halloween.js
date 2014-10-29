Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");

function halloween(){
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
                                    success:function(){
                                        console.log("發放偷竊卡片卡成功!");
                                        localStorage.removeItem('userobject');
                                    },
                                    error:function(error){
                                        console.log(error);
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
                                    success:function(){
                                        console.log("發放加生命值卡成功!");
                                        localStorage.removeItem('userobject');
                                    },
                                    error:function(error){
                                        console.log(error);
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

/*function halloween(){
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
                var userobject = alluser[i];
                localStorage.setItem('userobject', userobject);
                count++;
                if(count <= 27){
                    console.log(i);
                    var cardinfo = Parse.Object.extend('Card_info');
                    var query = new Parse.Query(cardinfo);
                    query.get("1PF6Z8XISA",{
                        success:function(stealcard){
                            console.log(i);
                            var Owncard = Parse.Object.extend('Owncard');
                            var owncard = new Owncard();
                            var retrievedObject = localStorage.getItem('userobject');
                            owncard.set('user', retrievedObject);
                            owncard.set('Card_info', stealcard);
                            owncard.save(null, {
                                success:function(){
                                    console.log("發放偷竊卡片卡成功!");
                                    localStorage.removeItem('userobject');
                                },
                                error:function(error){
                                    console.log(error);
                                }
                            })
                        },
                        error:function(error){
                            console.log(error);
                        }
                    })
                }
                else{
                    var cardinfo = Parse.Object.extend('Card_info');
                    var query = new Parse.Query(cardinfo);
                    query.get("aJONHaxQtM",{
                        success:function(lifecard){
                            console.log(i);
                            var Owncard = Parse.Object.extend('Owncard');
                            var owncard = new Owncard();
                            var retrievedObject = localStorage.getItem('userobject');
                            owncard.set('user', retrievedObject);
                            owncard.set('Card_info', lifecard);
                            owncard.save(null, {
                                success:function(){
                                    console.log("發放加生命值卡成功!");
                                    localStorage.removeItem('userobject');
                                },
                                error:function(error){
                                    console.log(error);
                                }
                            })
                        }
                    })
                }
            } 
      }
    }
  })
}*/