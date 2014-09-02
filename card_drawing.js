Parse.initialize("9eo5r1mHWoIPSTCzmrpdKa3lcHPjySx4y5D6q8Nq", "R8SWwYxpJcy73ogQKuSD43y7FigrlDGjBLcy1lzC");
$(document).ready(draw_card());


//Drawing card function
var Shortdescription;
var Title;
var Imagesrc;

function randomNum(){
    var n = Math.floor(Math.random() * 2);
    var vac;

    switch(n){
        case 0:
            vac = 'a';
            break;
        case 1:
            vac = 'b';
            break;
        case 2:
            vac = 'c';
            break;
    }

    if(vac == 'a'){
        num = Math.floor(Math.random() * 2 + 1);
        var no = vac + num;
        return(no);
    }
    else if(vac == 'b'){
        num = Math.floor(Math.random() * 8 + 1);
        var no = vac + num;
        return(no);
    }
    else{
        num = Math.floor(Math.random() * 9 + 1);
        var no = vac + num;
        return(no);
    }
}

function getData(){
    var card = Parse.Object.extend("Card_info");
    var query = new Parse.Query(card);
    var No = randomNum();
    query.equalTo("cardno", No);
    query.first({
        success: function(results){
            var object = results;
            Shortdescription = object.get('shortdes');
            Title = object.get('name');
            Imagesrc = object.get('imagesrc');

            $('h2#title').html(Title);

            $('#image1').attr("src", Imagesrc)
            $('#image2').attr("src", Imagesrc)
            $('#image3').attr("src", Imagesrc)

            var owncard = Parse.Object.extend("Owncard");
            var own = new owncard();

            own.set('user', Parse.User.current());
            own.set('Card_info', object);
            own.save(null, {
                success: function(){

                },
                error: function(error){
                    alert('Failed to create new object, with error code: ' + error.description);
                }
            })


        },
        error: function(error){
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

var draw_card =  function (){
    var current_user = Parse.User.current();
    if(current_user){
        remainCard();
    }
}

//getNotification
function getNotification(){

};

function changeClass1(){
    if(document.getElementById("block1").className == "block"){
        document.getElementById("block1").className += " rotated";
        document.getElementById("block2").className += " gone";
        document.getElementById("block3").className += " gone";
    }
    else
        document.getElementById("block").className = "block";
        getData();
    };
function changeClass2(){
    if(document.getElementById("block2").className == "block"){
        document.getElementById("block2").className += " rotated";
        document.getElementById("block1").className += " gone";
        document.getElementById("block3").className += " gone";
    }
    else
        document.getElementById("block").className = "block";
        getData();  
    };      
function changeClass3(){
    if(document.getElementById("block3").className == "block"){
        document.getElementById("block3").className += " rotated";
        document.getElementById("block2").className += " gone";
        document.getElementById("block1").className += " gone";
    }
    else
        document.getElementById("block").className = "block";
        getData();
    };

function remainCard(){
    var card = Parse.Object.extend("Card_info");
    var query = new Parse.Query(card);
    query.greaterThan("remain",0);
    query.count({
        success: function(count){
            if(count==0)
                setRemainCard();
        },
        error: function(error){
        }
    });
}

function setRemainCard(){
    var card = Parse.Object.extend("Card_info");
    var query = new Parse.Query(card);
    query.ascending("card_no");
    query.find({
        success: function(data){
            var no = [1,9,20,15,10,5,15,10,5,1,30,3,15,5,10,5,3,10,5,3];
            data.forEach(function (element, index, array){
                var num = Parse.Object.extend('Card_info');
                var n = new num();
                
                n.set('objectId',element.get('objectId'));
                
                n.save(null,{
                    success: function(n){
                        n.set('remain', no[index]);
                        n.save();
                    }
                });
            });
        },
        error: function(error){
        }
    });
}