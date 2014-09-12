//About Personal page owncard display
$(document).ready(function(){
    Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");
    //front-end user_status
    var userStatus=Parse.Object.extend('User_status');
    var query = new Parse.Query(userStatus);
    query.equalTo('User', Parse.User.current());
    query.include('User');
    query.first({
        success:function(data){
            var photo = data.get('User').get('photo');
            var name = data.get('User').get('name');
            var level = data.get('Level');
            var hp = data.get('HP');
            var xp = data.get('XP');
            var life = data.get('Life');
            var hpblocks = parseInt(hp * 10 / 100);
            var xpblocks = parseInt(xp * 10 / 100);
            i = 0;

            $('#bighead').attr("src", photo);
            $('#name').append(name);
            $('#level').append("Level "+level);

            $("#hp td:lt("+hpblocks+")").each(function(i){
                var _this = this;
                setTimeout(function(){
                    $(_this).css('background-color', '#fff')
                }, 200*i);
            })
            $("#xp td:lt("+xpblocks+")").each(function(i){
                var _this = this;
                setTimeout(function(){
                    $(_this).css('background-color', '#fff')
                }, 200*i);
            })
            for(var i = 1; i<=life; i++){
                var s = "<img id='heart' src='img/heart.png'>";
                $('#life').append(s);
            }
        }
    });
    //back-end owncard
    var current_user = Parse.User.current();
    if(current_user){
        var ownCard = Parse.Object.extend('Owncard');
        var query = new Parse.Query(ownCard);
        query.include('Card_info');
        query.equalTo('user', current_user);
        query.find({
            success: function(data){
            	    var ccontainer = "";
            	    for(var i = 0; i<data.length; i++){
            	        var card = data[i].get('Card_info');
                        if(card == undefined){
                            var backcard = "<a href='http://radiansmile.github.io/CodeEDU/card_drawing.html'><img id='backcard' src='img/choosecard/back.png'></a>";
                            $('div.cardbox').append(backcard);
                        }
                        else{
                            var s = getElementStringByowncard(card.get('name'), card.get('imagesrc'), data[i].id);
                            ccontainer += s;
                            if((i+1) % 6 == 0){
                                var string = "<div class='cards'> " + ccontainer + "</div>";
                                $('div.cardbox').append(string);
                                ccontainer = "";
                                $('.card').on('click', function(){
                                    var id = $(this).attr('id');
                                    localStorage['owncardId'] = id;
                                    window.location.assign("http://radiansmile.github.io/CodeEDU/carddes.html");
                                })
                            }
                            else if(i == data.length - 1){
                                var string = "<div class = 'cards'>" + ccontainer + "</div>";
                                $('div.cardbox').append(string);
                                ccontainer = "";
                              $('.card').on('click', function(){
                                    var id = $(this).attr('id');
                                    localStorage['owncardId'] = id;
                                    window.location.assign("http://radiansmile.github.io/CodeEDU/carddes.html");
                                })
                            }
                        }
            	    }
            }
        })
    }
    else{
    	alert("Please Login!");
    	window.location.assign("http://radiansmile.github.io/CodeEDU/fblogin.html");
    }
});

function getElementStringByowncard(name, imagesrc, id){
    var s0 = "<h2>" + name + "</h2>";
    var s1 = "<img src='" + imagesrc + "'>";
    var s = "<div class='card' id='"+id+"'>" + s0 + s1 + "</div>";

    return s;
};