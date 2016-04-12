// JavaScript Document

var initSkill = function(){
	$('.progress-bar').each(function(index, element) {
        var base = $(this);
		if(!base.hasClass('no-value')){
			var val = parseInt(base.attr('val'));
			base.append('<div class="value" style="width: ' + val + '%">' + val + '%</div>');
		}
    });
}

var $container;
var blockPos = [];
var popup, popupContent, overlay, main, mask;
var currentTopPos = 0;
var isPopup = false;
$(function(){
	overlay = $('.overlay');
	popup = $('.popup');
	popupContent = $('.popup .popup-content');
	main = $('.main-content');
	
	
	// setTimeout('createZebra()', 200);
	
	$('a').click(function(e) {
        var base = $(this);
		var href = base.attr('href');
		if(href[0] == '#'){
			var target = $(href);
			navTo(target);
		}
    });
	
	$('.box-porfolio ul li').click(function(e) {
        var base = $(this);
		if(!base.hasClass('active')){
			$('.box-porfolio ul li.active').removeClass('active');
			base.addClass('active');
			var rel = base.attr('rel');
			if(rel == 'all'){
				$('.box-porfolio .list .item').fadeIn();
			}
			else{
				$('.box-porfolio .list .item').hide();
				$('.box-porfolio .list .' + rel).fadeIn();
			}
			$container.masonry();
		}
		return false;
    });
	
	if($('#map').length > 0){
		createMap("map");
	}
	
	$('.box-porfolio').css('height', $('.box-porfolio').height() + 'px');
	$container = $('.box-porfolio .list');
	// initialize
	$container.imagesLoaded(function(){
	  	$container.masonry({
			columnWidth: 302,
			itemSelector: '.item'
	  	});
	});
	
	$('.box-porfolio .list .item').click(function(e) {
		var name = $(this).attr('rel');
		if(name != undefined && name.length > 0){
			requestData(name);
		}
        return false;
    });
	
	$('.overlay, .popup .btnClose').click(function(e) {
        hidePopup();
    });
	
	if(window.location.hash.length > 0){
		var target = $(window.location.hash);
		if(target.length > 1){
			navTo(target);
		}
	}
	
	$('.block').each(function(index, element) {
		var pos = [$(this).offset().top, $(this).children('.block-title').attr('id')];
        blockPos.push(pos);
    });
	
	$(window).scroll(function (e) {
		if(!isPopup){
			//var xTop = $(document).scrollTop();
			var anchorPos = $('#anchor').offset().top;
			var cont = true;
			var i = blockPos.length;
			while(i > 0 && cont){
				if(anchorPos > blockPos[i-1][0]){
					cont = false;
					$('.menu ul li.active').removeClass('active');
					$('#m-' + blockPos[i-1][1]).addClass('active');
					window.location.hash = blockPos[i-1][1];
				}
				else{
					i--;
				}
			}
		}
    });
	
	rebuild();
});

function requestData(name){
	overlay.fadeIn();
	if(popup.attr('rel') == name){
		showPopup();
	}
	else {
		$.ajax({
			type: 'GET',
			url: 'data/' + name + '.html',
			data: {},
			dataType: 'html',
			beforeSend: function(){
				overlay.addClass('loading');
			},
			success: function (msg) {
				if(msg != null && msg.length > 0){
					popupContent.html(msg);
					popup.attr('rel', name);
					showPopup();
				}
			},
			complete: function(){
				overlay.removeClass('loading');
			}
		});
	}
}

function showPopup(){
	currentTopPos = $(document).scrollTop();
	isPopup = true;
	popup.fadeIn();
	main.hide();
	mask.hide();
	$("body, html").animate({ 
		scrollTop: 0
	}, 200);
}

function hidePopup(){
	popup.fadeOut();
	overlay.fadeOut();
	main.show();
	mask.show();
	$("body, html").animate({ 
		scrollTop: currentTopPos
	}, 500);
	isPopup = false;
}

function rebuild() {
    changePopupSize();
}
var doit;
$(window).resize(function () {
    clearTimeout(doit);
    doit = setTimeout(function () { rebuild(); }, 500);
});


function changePopupSize(){
	var h = $(window).height() - 120;
	popup.css('min-height', h + 'px');
	//popup.css('margin-top', -h/2 + 'px');
}

function navTo(target){
	if(target.length > 0){
		$("body, html").animate({ 
			scrollTop: target.offset().top - 127
		}, 600);
	}
}

function createZebra(){
	$('.block').each(function(index, element) {
        if(index % 2 == 1){
			var top = $(this).offset().top;
			var height = $(this).height() + 65 + 70;
			var s = '<div class="mask" style="top:' + top+ 'px; height:'+height+'px;"></div>';
			$('body').append(s);
		}
    });
	mask = $('.mask');
}

function createMap(name) {
    if ($('#hfZoom').val().length == 0 || $('#hfLong').val().length == 0 || $('#hfLat').val().length == 0) {
        return;
    }
    // configuration
    var myZoom = parseInt($('#hfZoom').val());
    var myMarkerIsDraggable = true;
    var myCoordsLenght = 6;
    var defaultLat = parseFloat($('#hfLat').val());
    var defaultLng = parseFloat($('#hfLong').val());

    var mapOptions = {
        zoom: myZoom,
        center: new google.maps.LatLng(defaultLat, defaultLng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById(name), mapOptions);

    // creates a draggable marker to the given coords
    var myMarker = new google.maps.Marker({
        position: new google.maps.LatLng(defaultLat, defaultLng)
    });

    // centers the map on markers coords
    map.setCenter(myMarker.position);

    // adds the marker on the map
    myMarker.setMap(map);
}