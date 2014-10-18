$(document).ready(function(){
	//jquery-ui autocomplete!
	var card_name=[{label:"加生命值卡"},
                             {label:"再抽一張卡"},
                             {label:"經驗值卡(+10)"},
                             {label:"經驗值卡(+30)"},
                             {label:"自我加血卡(+10)"},
                             {label:"自我加血卡(+30)"},
                             {label:"血量補滿卡"},
                             {label:"捐血卡(+10)"},
                             {label:"捐血卡(+30)"},
                             {label:"扣血卡(-10)"},
                             {label:"扣血卡(-30)"},
                             {label:"偷血卡(+10)"},
                             {label:"偷血卡(+30)"},
                             {label:"偷竊卡片卡"},
                             {label:"幫助加血卡(+10)"},
                             {label:"幫助加血卡(+30)"}];
	$("#card").autocomplete({source: card_name});

	var user = Parse.Object.extend('User');
	var query = new Parse.Query(user);
	query.find({
		success:function(data){
			    var ccontainer = "";
    			for(var i = 0; i < data.length; i++){
    				var username = data[i].get('name');
    				var id = data[i].id;
                    var photo = data[i].get('photo');
    				var s = getElementStringByowncard(username, id, photo);
    				ccontainer += s;
                    if((i+1) % 6 ==0){
                        var string = "<div class='row-fluid'>" + ccontainer + "</div>";
                        $('div#selecttarget').append(string);
                        ccontainer = "";
                    }
                    else if(i==data.length -1){
                        var string = "<div class="+"row-fluid"+">" + ccontainer + "</div>";
                        $('div#selecttarget').append(string);
                        ccontainer = "";                                                        
                    }
                }

                $('.in').on('click', function(){
                	var id = $(this).attr('id');
                	var targetuser = Parse.Object.extend('User');
                	var query = new Parse.Query(targetuser);
                	query.equalTo('objectId', id);
                	query.first({
                		success:function(targetuserdata){
                            var targetusername = targetuserdata.get("name");
                			var cardtext = $('#card').val();
                			var cardid = "";
                			if(cardtext == "加生命值卡")
                				cardid = "aJONHaxQtM";
                			else if(cardtext == "再抽一張卡")
                				cardid = "5Tt7IjAOuw";
                			else if(cardtext == "經驗值卡(+10)")
                				cardid = "OSRGBnKpaP";
                			else if(cardtext == "經驗值卡(+30)")
                				cardid = "4c3uX1rZ1K";
                			else if(cardtext == "自我加血卡(+10)")
                				cardid = "zLHR3S0hlb";
                			else if(cardtext == "自我加血卡(+30)")
                				cardid = "7mn5hYmEWH";
                			else if(cardtext == "血量補滿卡")
                				cardid = "UDfyCM4Pyb";
                			else if(cardtext == "捐血卡(+10)")
                				cardid = "10ypku2oZk";
                			else if(cardtext == "捐血卡(+30)")
                				cardid = "ysYpQz4TW0";
                			else if(cardtext == "扣血卡(-10)")
                				cardid = "y0pZ66Wl4X";
                			else if(cardtext == "扣血卡(-30)")
                				cardid = "ZLZIS7XbfQ";
                			else if(cardtext == "偷血卡(+10)")
                				cardid = "Byw6APXDGu";
                			else if(cardtext == "偷血卡(+30)")
                				cardid = "jqxvogKdXQ";
                			else if(cardtext == "偷竊卡片卡")
                				cardid = "1PF6Z8XISA";
                			else if(cardtext == "幫助加血卡(+10)")
                				cardid = "xJmFmNA97H";
                			else if(cardtext == "幫助加血卡(+30)")
                				cardid = "CsG1I2kDXT";

                			var card = Parse.Object.extend('Card_info');
                			var query1 = new Parse.Query(card);
                			query1.equalTo('objectId', cardid);
                            query1.first({
                                success:function(carddata){
                                    var cardname = carddata.get("name");
                                    var Owncard = Parse.Object.extend("Owncard");
                                    var owncard = new Owncard();
                                    owncard.set('user', targetuserdata);
                                    owncard.set('Card_info', carddata);
                                    owncard.save(null,{
                                        success:function(results){
                                            alert("你讓" + targetusername + "多了一張" + cardname);
                                        }
                                    })
                                }
                            });
                		}
                	})              		
                })
		}
	})
})

function getElementStringByowncard(name, id, photo){
    var s = "<h4>"+name+"</h4>";
    var s1 = "<img id='alluserphoto' src ='../"+photo+"''>";
    var all = "<div class ='in' id='"+id+"'>"+ s + s1 + "</div>";

    return all;
};