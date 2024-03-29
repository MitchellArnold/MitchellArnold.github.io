$(document).ready(function(){
	init();
});
var scrollbar;
var rtime;
var timeout = false;
var delta = 300;
$(window).resize(function() {
		rtime = new Date();
		if (timeout === false) {
				timeout = true;
				setTimeout(resizeend, delta);
		}
});	


var container = $('.fish'),
tl;
function getAnimation() {
  var element = $('<figure class="cod"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/253981/fish_od7msy.png"/></figure>');
  container.append(element);
  TweenLite.set(element, {x:$winW*1.2, y:Math.random() + 50, scaleX: -1,  scaleY: -1, skewX: -5, skewY: 5})
  var bezTween = new TimelineLite();
  bezTween.to(element, 70, {
    bezier:{
      type:"soft", 
      values:[ {x:$winW*1.2, y:$winH/2*Math.random() + $winH/4}, {x:$winW/2*Math.random() + $winW/4, y:$winH/2*Math.random() + $winH/4}, {x:-$winW/4, y:$winH/2*Math.random() + $winH/4}],
      autoRotate:true
    },
    ease:Linear.easeNone});
  bezTween.to(element, 0.3, {scaleX:-0.96, repeat:(bezTween.duration() / 0.3) -1, yoyo:true}, 0)
  
  return bezTween;
} 
function buildTimeline() {
  tl = new TimelineMax({repeat:0, delay:1});
  for (i = 0 ; i< 300; i++){
    tl.add(getAnimation(i), i * .5);
  }
}
function setupScrollbar(){
	$scrolled = 0;
	//console.log('setup scrollbar');
	var scrollbar = Scrollbar.init($('main')[0], {
		speed: .3,
		damping: 0.1,
		renderByPixels: true,
		syncCallbacks: true,
		continuousScrolling: false,
		overscrollEffect: false
	});
	scrollbar.addListener(function (status) {
		$scrolled = status.offset.y;
		$('.fixed').css('top',$scrolled + 'px');
		$('section span').css('opacity',1 - $scrolled/200);
		if(tl){
			var progress = tl.totalProgress();
			var pct = $scrolled / $winH;
			tl.pause();
			$('.fish').attr('data-pct',pct);
			tl.progress(pct/8);
		}
		if (status.direction.y == 'down'){
			$down = true;
			if($('.fish').length >= 1){
				$('.fish').removeClass('reverse');
			}
		} else {
			$down = false;
			if($('.fish').length >= 1){
				$('.fish').addClass('reverse');
			}
		}

	});
}
function init(){
	$winW = $(window).width();
	$winH = $(window).height();
	//getAnimation();
	buildTimeline();
	tl.pause();
	setupScrollbar();
	
}
function resizeend() {
		if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
		} else {
				timeout = false;
				$('.fish img').remove();
				Scrollbar.destroy($('main')[0]);
				TweenMax.killAll();
				setTimeout(function(){
					$winW = $(window).width();
					$winH = $(window).height();
					//getAnimation();
					buildTimeline();
					tl.pause();
					setupScrollbar();	
					$('section span').css('opacity','1');
				},1500);
		}               
}