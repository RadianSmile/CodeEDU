Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");

function halloween(){
  var userstatus = Parse.Object.extend('User_status');
  var query = new Parse.Query(userstatus);
  query.descending("XP");
  query.find({
    success:function(alluser){
      for(var i = 0; i<alluser.length; i++){
        var count = 0;
        var user = Parse.Object.extend('User');
        var query = new Parse.Query(user);
        query.equalTo('objectId', alluser[i].id);
        console.log(alluser[i].id);
        query.first({
          success:function(selectuser){
            var userrole = selectuser.get('role');
            if(userrole == "student"){
              count++;
              if(count <= 30){
                var cardinfo = Parse.Object.extend('Card_info');
                var query = new Parse.Query(cardinfo);
                query.equalTo('name', "偷竊卡片卡");
                query.first({
                  success:function(stealcard){
                    var Owncard = Parse.Object.extend('Owncard');
                    var owncard = new Owncard();
                    owncard.set('user', alluser[i]);
                    owncard.set('Card_info', stealcard);
                    owncard.save(null, {
                      success:function(){
                        console.log("發放偷竊卡片卡成功!");
                      },
                      error:function(error){
                        console.log(error);
                      }
                    })
                  }
                })
              }
              else{
                var cardinfo = Parse.Object.extend('Card_info');
                var query = new Parse.Query(cardinfo);
                query.equalTo('name', "加生命值卡");
                query.first({
                  success:function(lifecard){
                    var Owncard = Parse.Object.extend('Owncard');
                    var owncard = new Owncard();
                    owncard.set('user', alluser[i]);
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
        })
      }
    }
  })
}

