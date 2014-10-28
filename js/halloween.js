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
            var userobject = alluser[i];
            var userrole = alluser[i].get('User').get('role');
            if(userrole == "student"){
              count++;
              if(count <= 30){
                var cardinfo = Parse.Object.extend('Card_info');
                var query = new Parse.Query(cardinfo);
                query.equalTo('objectId', "1PF6Z8XISA");
                query.first({
                  success:function(stealcard){
                    var Owncard = Parse.Object.extend('Owncard');
                    var owncard = new Owncard();
                    owncard.set('user', userobject);
                    owncard.set('Card_info', stealcard);
                    owncard.save(null, {
                      success:function(){
                        console.log("發放偷竊卡片卡成功!");
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
                query.equalTo('objectId', "aJONHaxQtM");
                query.first({
                  success:function(lifecard){
                    var Owncard = Parse.Object.extend('Owncard');
                    var owncard = new Owncard();
                    owncard.set('user', userobject);
                    owncard.set('Card_info', lifecard);
                    owncard.save(null, {
                      success:function(){
                        console.log("發放加生命值卡成功!");
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
}

