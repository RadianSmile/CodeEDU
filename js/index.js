$(document).ready(function(){

	
	$(".rotationA").hover(function(){
		$(".story-text").removeClass("active");
		$(".text-wrap").children().eq(0).addClass("active");
	});

	$(".rotationB").hover(function(){
		$(".story-text").removeClass("active");
		$(".text-wrap").children().eq(1).addClass("active");
	});

	$(".rotationC").hover(function(){
		$(".story-text").removeClass("active");
		$(".text-wrap").children().eq(2).addClass("active");
	});

	$(".rotationD").hover(function(){
		$(".story-text").removeClass("active");
		$(".text-wrap").children().eq(3).addClass("active");
	});
	$(document).on('click','#goGame',function (e){	
		$("html, body").animate({scrollTop:$("#games").offset().top - 100}, 500, 'swing');
	});

});

