//This file can be used to contain all your plugins, such as jQuery plugins and other 3rd party scripts.

// --------------- Avoid `console` errors ---------------
// ------------------------------------------------------
if( !(window.console && console.log) ) {
	(function(){
		var noop = function() {};
		var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
		var length = methods.length;
		var console = window.console = {};
		while( length-- ) {
			console[methods[length]] = noop;
		}
	}());
}


// --------------- SETUP TABS ---------------
// ------------------------------------------
function setupTabs(){
	 jQuery('.tabbed').each(function(){
		
		// Select Objects
		var Container = jQuery(this);
		var Tabs = Container.children('.tab');
		var Contents = Container.children().not(Tabs);
		
		// Set Vars
		var total = Tabs.length;
		var percentage = 100/total;
		
		// Setup HTML
		Container.css({ position:'relative' });
		Tabs.css({ position:'absolute', top:0, left:0, width:percentage+'%', cursor:'pointer', textAlign:'center' }).wrapInner('<a href="#">');
		Tabs.each(function(i){
			jQuery(this).css({ left:percentage*i+'%' });
		});
		
		Tabs.equalHeight('.tabbed');
		
		function showTab(number) {
			Contents.hide();//addClass('visuallyhidden');
			Tabs.removeClass('active');
			Tabs.eq(number).addClass('active').next().show();//.removeClass('visuallyhidden');
			jQuery(window).trigger('resize');
		}
		
		Tabs.click(function(e){
			var num = Tabs.index($(this));
			showTab(num);
			e.preventDefault();
		});
		
		showTab(0);
	});
}

// --------------- BACKGROUND IMAGE ---------------
// ------------------------------------------------
//---------------- =DWIC --------------------------
myBGImage = function(imgLoc, imgBGColor) {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		// don't load background image
	}
	else {
		if (imgLoc && imgBGColor) {
			//$('body').css({ "background-image": "url(" + imgLoc + ")", "background-color": "" + imgBGColor + "" });
			//document.body.setAttribute("style", 'background-image:url('+"'"+imgLoc+"'"+');background-color:'+imgBGColor+';'); // have to do this natively as jQuery not yet loaded.
			document.body.style.cssText='background-image:url('+"'"+imgLoc+"'"+');background-color:'+imgBGColor+';'; // have to do this natively as jQuery not yet loaded.
		}
	}
};

/* Remove any of the old div tags that might be left after the function change 14.04.2014*/	
$(document).ready(function () {
	$(".customBG").remove();
});
	


(function($){

// --------------- CAROUSEL ---------------
// ----------------------------------------
/*
$('#example').carousel({		// Selector for slideshow
	slides:'.slide', 			// Selector for slides
	time:5,						// Pause between slides time in secs
	speed:0.5,					// transition time in secs
	keyboard:true,				// keyboard navigation
	autoplay:true,
	controls:true				// Show or hide controls
})
*/
$.fn.extend({
	// MODIFICATIONS:
	// 1. Removed default controls and created new accessible ones
	// 2. Read 'responsive' class from html instead of body
	carousel : function(arguments) {
		
		// SET DEFAULT VALUES
		var args = $.extend( {}, {
			'slides':	'.slide',
			'time':		5,
			'speed':	.5,
			'keyboard':	true,
			
			'controls': true
		}, arguments );
		
		args.css3	= ( Modernizr.csstransforms3d && Modernizr.touch );
		args.time	*= 1000; // Convert seconds to milliseconds
		args.speed	*= 1000; // Convert seconds to milliseconds
		
		// LOOP CAROUSELS
		return this.each(function(){
			
			// ____________________ SETUP ____________________
			
			// Select Objects
			var Carousel = $(this);
			var Slides = Carousel.find(args.slides);
			
			// Check that is not already a carousel
			if( Carousel.data('carousel') )
				return;
			else
				Carousel.data('carousel',true);
			
			// Setup Vars
			var id = Carousel.attr('id');
			var total = Slides.length;
			var last = total-1;
			var current = -1;
			var moving = false;
			var timer = false;
			var autoplay = args.autoplay; // prevents overriding default setting
			
			// ----- WCAG -----
				var Controls = $('<div>',{ 'class':'carousel-controls clearfix' });
				if( id )
					Controls.attr( 'id', id+'Controls' );
				
				// Create Heading
				Controls.append( $('<h3>',{ 'text':'Slideshow Controls', 'class':'visuallyhidden' }) );
				
				// Create Controls
				var prev_text = 'Show previous slide';
				var prev_text_disabled = 'Currently showing first slide';
				var next_text = 'Show next slide';
				var next_text_disabled = 'Currently showing last slide';
				var play_text = 'Play slideshow';
				var pause_text = 'Pause slideshow';
				
				var Prev = $('<a>',{ href:'#', text:prev_text, title:prev_text, 'class':'prev' });
				var Next = $('<a>',{ href:'#', text:next_text, title:next_text, 'class':'next' });
				var Play = $('<a>',{ href:'#', text:play_text, title:play_text, 'class':'play' });
				if( autoplay )
					Play.toggleClass('pause play').text( pause_text );
				Controls.append( $('<ul>',{ 'class':'clearfix' }) ).children(':last').append( $('<li>').append(Prev), $('<li>').append(Play), $('<li>').append(Next) );
				
				// Create Numbers
				var number_text = 'Show slide number ';
				var current_number_text = 'Currently showing slide number ';
				Controls.append( $('<ol>',{ 'class':'clearfix' }) );
				for( var i=0; i<total; i++ ) {
					Controls.children(':last').append( $('<li>').append( $('<a>',{ href:"#", title:number_text+(i+1), html:'<span class="visuallyhidden">'+number_text+'</span>'+(i+1), 'class':'number' }) ) );
				}
				var NavLinks = Controls.find('ol a');
				
				// Append
				Controls.find('li a').wrapInner('<span>');
				if( args.controls ) Carousel.after( Controls );
				
			// ----- -----
			
			
			// Create Slider

			var Slider = Slides.parent();
			if( Slider.is(Carousel) ) {
				Slider = $('<div>',{ 'class':'carousel-slider' });
				Carousel.append( Slider.append(Slides) );
			}
			
			// Setup CSS
			Carousel.css({ position:'relative', overflow:'hidden' });
			Slider.css({ position:'absolute', left:0, top:0, listStyle:'none' });
			Slides.css({ float:'left' });
			
			
			
			// ____________________ FUNCTIONS ____________________
			
			// === FUNCTION: showSlide ===
			function showSlide( number, speed, forced ) {
				
				// Defaults
				if( speed===undefined ) speed = args.speed;
				if( forced===undefined ) forced = false;
				
				// Validate
				if( number>last ) number=last;
				if( number<0 ) number=0;
				if( !forced && (moving || number==current) )
					return false;
				
				// Update Vars and Nav Links
				moving = true;
				current = number;
				clearTimeout(timer);
				
				// Update Nav Links
				NavLinks.removeClass('selected').each(function(i){  $(this).attr({ title:number_text+(i+1) })  }).find('span span').text(number_text);
				NavLinks.eq(number).addClass('selected').attr({ title:current_number_text+(number+1) }).find('span span').text(current_number_text);
				
				// Update Prev/Next Links
				Prev.removeClass('disabled').attr({ title:prev_text }).children('span').text(prev_text);
				Next.removeClass('disabled').attr({ title:next_text }).children('span').text(next_text);
				if( number<1 ) Prev.addClass('disabled').attr({ title:prev_text_disabled }).children('span').text(prev_text_disabled);
				if( number>=last ) Next.addClass('disabled').attr({ title:next_text_disabled }).children('span').text(next_text_disabled);
				
				// Move Slides
				if( args.css3 ) {
					var new_left = (-number/(total)*100)+'%';
					Slider.css({ 'transform':'translate('+new_left+',0)', 'transition-duration':speed+'ms' });
				} else {
					var new_left = (-number*100)+'%';
					Slider.animate({ left:new_left },{ duration:speed });
				}
				
				// Callback
				setTimeout(function(){
					moving = false;
					// Show next slide
					if( autoplay )
						playSlides();
				}, speed );
			}
			
			// === FUNCTION: showPrevious, showNext, stopSlides, playSlides ===
			function showPrevious() {
				showSlide( current-1 );
			}
			function showNext() {
				showSlide( current+1 );
			}
			function stopSlides() {
				clearTimeout(timer);
				autoplay = false;
			}
			function playSlides() {
				clearTimeout(timer);
				autoplay = true;
				
				var next = current+1;
				if( next>last ) next=0;
				timer = setTimeout( function(){showSlide(next)}, args.time );
			}
			
			// === FUNCTION: updateSize ===
			function updateSize() {
				
				// Reset CSS
				Carousel.width('auto');
				Slider.css({ 'transition-duration':'0ms' });
				
				// Get & Set New Width
				var Test = Carousel;
				var width = Test.width();
				var margins = Test.outerWidth(true) - Test.width();
				
				while( width<2 ) {
					Test = Test.parent();
					width = Test.width()-margins;
					margins += Test.outerWidth(true) - Test.width();
				}
				
				Slider.css({ width:width*total });
				Slides.css({ width:width-(Slides.outerWidth(true)-Slides.width()) });
				Touch.width = width;
				
				// Get & Set New Height
				var height = 0;
				Slides.each(function(){
					height = Math.max( height, $(this).outerHeight() );
				});
				Carousel.css({ height:height });
			}
			
			
			// ____________________ BIND ACTIONS & EVENTS ____________________
			
			// Nav Links
			NavLinks.click(function(){
				var number = NavLinks.index($(this));
				showSlide(number);
				return false;
			});
			Prev.click(function(){
				showPrevious();
				return false;
			});
			Next.click(function(){
				showNext();
				return false;
			});
			Play.click(function(){
				if( $(this).hasClass('pause') ) {
					$(this).attr({ title:play_text }).children('span').text(play_text);
					stopSlides();
				} else {
					$(this).attr({ title:pause_text }).children('span').text(pause_text);
					playSlides();
				}
				$(this).toggleClass('pause play');
				return false;
			});
			
			// Carousel Hover
			Carousel.hover(
				function(){
					if( autoplay ) {
						stopSlides();
						autoplay = true;
					}
				},
				function(){
					if( autoplay )
						playSlides();
				}
			);
			
			// Keyboard Navigation
			if( args.keyboard ) {
				$(document).keydown(function(event){
					var key = event.which;
					if( key==37 )      showPrevious();
					else if( key==39 ) showNext();
				});
			}
			
			// Window resize
			$(window).resize(function(){
				
				if( $('html').hasClass('responsive') ) {
					updateSize();
					if( autoplay )
						playSlides();
				}
			});
			
			
			// ____________________ TOUCH DEVICES ____________________
			var Touch = {};
			Touch.width = Carousel.innerWidth();
			if( Modernizr.touch ){
				
				// Setup
				Slides.css({ 'user-select': 'none' });
				
				// === EVENT: touchstart ===
				Slider.bind('touchstart',function(e){
					e = e.originalEvent;
					
					// Reset Time
					Slider.css({ 'transition-duration':'0ms' });
					showSlide( current, 0, true );
					clearTimeout( timer );
					
					// Init vars
					Touch.startX = e.touches[0].pageX;
					Touch.startY = e.touches[0].pageY;
					Touch.newX = 0;
					Touch.newY = 0;
					Touch.deltaX = 0;
					Touch.deltaY = 0;
					Touch.verticalSwipe = undefined;
					Touch.startTime = Number( new Date() );
				})
				
				// === EVENT: touchmove ===
				.bind('touchmove',function(e){
					e = e.originalEvent;
					
					// Update Vars
					Touch.newX = e.touches[0].pageX;
					Touch.newY = e.touches[0].pageY;
					Touch.deltaX = Touch.newX - Touch.startX;
					Touch.deltaY = Touch.newY - Touch.startY;
					
					// Detect vertical swipe
					if( typeof Touch.verticalSwipe == 'undefined' ) {
						Touch.verticalSwipe = ( Math.abs(Touch.deltaX) < Math.abs(Touch.deltaY) );
					}
					
					// Exit if: swiping with more than one touch || pinching || vertical scrolling
					if( e.touches.length>1 || (e.scale && e.scale!==1) || Touch.verticalSwipe ) return;
					
					// Increase resistance in first or last slide
					if( (current<=0 && Touch.deltaX>0) || (current>=last && Touch.deltaX<0) ) {
						Touch.deltaX = Touch.deltaX / ( Math.abs(Touch.deltaX) / Touch.width + 2 );
					}
					
					// Cancel default actions
					clearTimeout( timer ); // stop slideshow
					e.preventDefault(); // prevent native scrolling 
					
					// Set New Value
					Touch.translateX = Touch.deltaX - current * Touch.width;
					if( args.css3 ) {
						Slider.css({ 'transform':'translate3d('+Touch.translateX+'px,0,0)' });
					} else {
						Slider.css({ left:Touch.translateX });
					}
				})
				
				// === EVENT: touchend ===
				.bind('touchend',function(e){
					e = e.originalEvent;
					
					// if not scrolling vertically
					if( !Touch.verticalSwipe ) {
							
						// Determine if slide attempt triggers next/prev slide
						var quick_swipe = ( Number(new Date()) - Touch.startTime < 250 );
						var minimum_swipe = ( Math.abs(Touch.deltaX) > 20 );
						var long_swipe = ( Math.abs(Touch.deltaX) > Touch.width/2 );
						
						var valid_swipe = ( (quick_swipe && minimum_swipe) || long_swipe );
						var swipe_dir = valid_swipe ? (Touch.deltaX<0 ? 1 : -1) : 0;
						
						// Change Slide
						var new_slide = current + swipe_dir;
						current = -1;
						showSlide( new_slide );
					}
				});
			}
			
			
			// ____________________ START ____________________
			
			updateSize();
			setTimeout( updateSize, 100 );
			showSlide(0,0);
			
			
		});// -- Els.each() --
		
	} // jQuery.carousel()
});



// --------------- EQUAL HEIGHT ---------------
// --------------------------------------------
$.fn.extend({
	equalHeight : function(parent) {
		
		// Set Variables
		if( parent===undefined ) parent = false;
		var Els = this;
		
		if( Els.length ) {
			// Function
			function updateHeight() {
				var maxH = 0;
				var outerH = 20;
				Els.height('auto');
				Els.each(function(i){
					maxH = Math.max( maxH, Els.eq(i).height() );
					outerH = Math.max( outerH, Els.eq(i).outerHeight(true) );
				});
				Els.height( maxH );
				
				if( parent )
					Els.closest(parent).css({ paddingTop:outerH });
			}
			
			updateHeight();
			$(window).resize(updateHeight);
		}
		
		// Return Original Object
		return Els;
	},
	
	
	fixColumns : function( selector ) {
		return this.each(function(){
			$(this).find(selector).equalHeight();
		});
	}
});



// --------------- BACK TO TOP ---------------
// --------------------------------------------

$(document).ready(function(e) {

	// hide at first
	$(".topLink").hide();
	
	// fade in #back-top
	$(function () {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.topLink').fadeIn();
			} else {
				$('.topLink').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('.topLink a').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});	
	
});


// --------------- TABLE SEARCH ---------------
// --------------------------------------------
  //define the table search as an object, which can implement both functions and properties
        window.tableSearch = {};
		
        //initialize the search, setup the current object
        tableSearch.init = function() {
            //define the properties I want on the tableSearch object
            this.Rows = document.getElementById('data').getElementsByTagName('TR');
            this.RowsLength = tableSearch.Rows.length;
            this.RowsText = [];
            
            //loop through the table and add the data to
            for (var i = 0; i < tableSearch.RowsLength; i++) {
                this.RowsText[i] = (tableSearch.Rows[i].innerText) ? tableSearch.Rows[i].innerText.toUpperCase() : tableSearch.Rows[i].textContent.toUpperCase();
            }
        }

        //onlys shows the relevant rows as determined by the search string
        tableSearch.runSearch = function() {
            //get the search term
            this.Term = document.getElementById('textBoxSearch').value.toUpperCase();
            
            //loop through the rows and hide rows that do not match the search query 
            for (var i = 0, row; row = this.Rows[i], rowText = this.RowsText[i]; i++) {
                row.style.display = ((rowText.indexOf(this.Term) != -1) || this.Term === '') ? '' : 'none';
            }
        }

 		tableSearch.clearTable = function() {
            //get the search term
            this.Term = "";
			document.getElementById('textBoxSearch').value = "";
            
            //loop through the rows and hide rows that do not match the search query 
            for (var i = 0, row; row = this.Rows[i], rowText = this.RowsText[i]; i++) {
                row.style.display = ((rowText.indexOf(this.Term) != -1) || this.Term === '') ? '' : 'none';
            }
        }
		
        //runs the search
        tableSearch.search = function(e) {
            //checks if the user pressed the enter key, and if they did then run the search
            var keycode;
            if (window.event) { keycode = window.event.keyCode; }
            else if (e) { keycode = e.which; }
            else { return false; }
            if (keycode == 13 || 8) {
                tableSearch.runSearch();
            }
            else { return false; }
        }


// --------------- MODAL POPUP ---------------
// --------------------------------------------

/*
 * nyroModal v2.0.0
 * Core
 *
 * Commit 61895b6ee8cb543cfdaa17d703ec6bcd338fec5f (01/16/2013) * 
 * 
 * Included parts:
 * - anims.fade
 * - filters.title
 * - filters.gallery
 * - filters.link
 * - filters.dom
 * - filters.data
 * - filters.image
 * - filters.swf
 * - filters.form
 * - filters.formFile
 * - filters.iframe
 * - filters.iframeForm
 * - filters.embedly
 */
 jQuery(function($,undefined){var uaMatch=function(ua){ua=ua.toLowerCase();var match= /(chrome)[ \/]([\w.]+)/.exec(ua)||
			/(webkit)[ \/]([\w.]+)/.exec(ua)||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||
			/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&& /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[ 1 ]||"",version:match[ 2 ]||"0"};},matched=uaMatch(navigator.userAgent),browser={};if(matched.browser){browser[matched.browser]=true;browser.version=matched.version;}if(browser.chrome){browser.webkit=true;}else if(browser.webkit){browser.safari=true;}var $w=$(window),$d=$(document),$b=$('body'),baseHref=$('base').attr('href'),_nmObj={filters:[],callbacks:{},anims:{},loadFilter:undefined,modal:false,closeOnEscape:true,closeOnClick:true,useKeyHandler:false,showCloseButton:true,closeButton:'<a href="#" class="nyroModalClose nyroModalCloseButton nmReposition" title="close">Close</a>',stack:false,nonStackable:'form',header:undefined,footer:undefined,galleryLoop:true,galleryCounts:true,ltr:true,domCopy:false,ajax:{},imageRegex:'[^\.]\.(jpg|jpeg|png|tiff|gif|bmp)\s*$',selIndicator:'nyroModalSel',swfObjectId:undefined,swf:{allowFullScreen:'true',allowscriptaccess:'always',wmode:'transparent'},store:{},errorMsg:'An error occured',elts:{all:undefined,bg:undefined,load:undefined,cont:undefined,hidden:undefined},sizes:{initW:undefined,initH:undefined,w:undefined,h:undefined,minW:undefined,minH:undefined,wMargin:undefined,hMargin:undefined},anim:{def:undefined,showBg:undefined,hideBg:undefined,showLoad:undefined,hideLoad:undefined,showCont:undefined,hideCont:undefined,showTrans:undefined,hideTrans:undefined,resize:undefined},_open:false,_bgReady:false,_opened:false,_loading:false,_animated:false,_transition:false,_nmOpener:undefined,_nbContentLoading:0,_scripts:'',_scriptsShown:'',saveObj:function(){this.opener.data('nmObj',this);},open:function(){if(this._nmOpener)this._nmOpener._close();this.getInternal()._pushStack(this.opener);this._opened=false;this._bgReady=false;this._open=true;this._initElts();this._load();this._nbContentLoading=0;this._callAnim('showBg',$.proxy(function(){this._bgReady=true;if(this._nmOpener){this._nmOpener._bgReady=false;this._nmOpener._loading=false;this._nmOpener._animated=false;this._nmOpener._opened=false;this._nmOpener._open=false;this._nmOpener.elts.cont=this._nmOpener.elts.hidden=this._nmOpener.elts.load=this._nmOpener.elts.bg=this._nmOpener.elts.all=undefined;this._nmOpener.saveObj();this._nmOpener=undefined;}this._contentLoading();},this));},resize:function(recalc){if(recalc){this.elts.hidden.append(this.elts.cont.children().first().clone());this.sizes.initW=this.sizes.w=this.elts.hidden.width();this.sizes.initH=this.sizes.h=this.elts.hidden.height();this.elts.hidden.empty();}else{this.sizes.w=this.sizes.initW;this.sizes.h=this.sizes.initH;}this._unreposition();this.size();this._callAnim('resize',$.proxy(function(){this._reposition();},this));},size:function(){var maxHeight=this.getInternal().fullSize.viewH-this.sizes.hMargin,maxWidth=this.getInternal().fullSize.viewW-this.sizes.wMargin;if(this.sizes.minW&&this.sizes.minW>this.sizes.w)this.sizes.w=this.sizes.minW;if(this.sizes.minH&&this.sizes.minH>this.sizes.h)this.sizes.h=this.sizes.minH;if(this.sizes.h>maxHeight||this.sizes.w>maxWidth){this.sizes.h=Math.min(this.sizes.h,maxHeight);this.sizes.w=Math.min(this.sizes.w,maxWidth);}this._callFilters('size');},getForNewLinks:function(elt){var ret;if(this.stack&&(!elt||this.isStackable(elt))){ret=$.extend(true,{},this);ret._nmOpener=undefined;ret.elts.all=undefined;}else{ret=$.extend({},this);ret._nmOpener=this;}ret.filters=[];ret.opener=undefined;ret._open=false;return ret;},isStackable:function(elt){return!elt.is(this.nonStackable);},keyHandle:function(e){this.keyEvent=e;this._callFilters('keyHandle');this.keyEvent=undefined;delete(this.keyEvent);},getInternal:function(){return _internal;},_close:function(){this.getInternal()._removeStack(this.opener);this._opened=false;this._open=false;this._callFilters('close');},close:function(){this._close();this._callFilters('beforeClose');var self=this;this._unreposition();self._callAnim('hideCont',function(){self._callAnim('hideLoad',function(){self._callAnim('hideBg',function(){self._callFilters('afterClose');self.elts.cont.remove();self.elts.hidden.remove();self.elts.load.remove();self.elts.bg.remove();self.elts.all.remove();self.elts.cont=self.elts.hidden=self.elts.load=self.elts.bg=self.elts.all=undefined;});});});},destroy:function(){if(this._open)return false;this._callFilters('destroy');if(this.elts.all)this.elts.all.remove();return true;},_initElts:function(){if(!this.stack&&this.getInternal().stack.length>1)this.elts=this.getInternal().stack[this.getInternal().stack.length-2]['nmObj'].elts;if(!this.elts.all||this.elts.all.closest('body').length==0)this.elts.all=this.elts.bg=this.elts.cont=this.elts.hidden=this.elts.load=undefined;if(!this.elts.all)this.elts.all=$('<div />').appendTo(this.getInternal()._container);if(!this.elts.bg)this.elts.bg=$('<div />').hide().appendTo(this.elts.all);if(!this.elts.cont)this.elts.cont=$('<div />').hide().appendTo(this.elts.all);if(!this.elts.hidden)this.elts.hidden=$('<div />').hide().appendTo(this.elts.all);this.elts.hidden.empty();if(!this.elts.load)this.elts.load=$('<div />').hide().appendTo(this.elts.all);this._callFilters('initElts');},_error:function(jqXHR){this._callFilters('error',jqXHR);},_setCont:function(html,selector){if(selector){var tmp=[],i=0;html=html .replace(/\r\n/gi,'nyroModalLN').replace(/<script(.|\s)*?\/script>/gi,function(x){tmp[i]=x;return '<pre class=nyroModalScript rel="'+(i++)+'"></pre>';});var cur=$('<div>'+html+'</div>').find(selector);if(cur.length){html=cur.html().replace(/<pre class="?nyroModalScript"? rel="?([0-9]*)"?><\/pre>/gi,function(x,y,z){return tmp[y];}).replace(/nyroModalLN/gi,"\r\n");}else{this._error();return;}}this.elts.hidden .append(this._filterScripts(html)).prepend(this.header).append(this.footer).wrapInner($('<div />',{'class':'nyroModal'+ucfirst(this.loadFilter)}));this.sizes.initW=this.sizes.w=this.elts.hidden.width();this.sizes.initH=this.sizes.h=this.elts.hidden.height();var outer=this.getInternal()._getOuter(this.elts.cont);this.sizes.hMargin=outer.h.total;this.sizes.wMargin=outer.w.total;this.size();this.loading=false;this._callFilters('filledContent');this._contentLoading();},_filterScripts:function(data){if(typeof data!='string')return data;this._scripts=[];this._scriptsShown=[];var start=0,stStart='<script',stEnd='</script>',endLn=stEnd.length,pos,pos2,tmp;while((pos=data.indexOf(stStart,start))>-1){pos2=data.indexOf(stEnd)+endLn;tmp=$(data.substring(pos,pos2));if(!tmp.attr('src')||tmp.attr('rel')=='forceLoad'){if(tmp.attr('rev')=='shown')this._scriptsShown.push(tmp.get(0));else this._scripts.push(tmp.get(0));}data=data.substring(0,pos)+data.substr(pos2);start=pos;}return data;},_hasFilter:function(filter){var ret=false;$.each(this.filters,function(i,f){ret=ret||f==filter;});return ret;},_delFilter:function(filter){this.filters=$.map(this.filters,function(v){if(v!=filter)return v;});},_callFilters:function(fct,prm){this.getInternal()._debug(fct);var ret=[],self=this;$.each(this.filters,function(i,f){ret[f]=self._callFilter(f,fct,prm);});if(this.callbacks[fct]&&$.isFunction(this.callbacks[fct]))this.callbacks[fct](this,prm);return ret;},_callFilter:function(f,fct,prm){if(_filters[f]&&_filters[f][fct]&&$.isFunction(_filters[f][fct]))return _filters[f][fct](this,prm);return undefined;},_callAnim:function(fct,clb){this.getInternal()._debug(fct);this._callFilters('before'+ucfirst(fct));if(!this._animated){this._animated=true;if(!$.isFunction(clb))clb=$.noop;if(this.anims[fct]&&$.isFunction(this.anims[fct])){curFct=this.anims[fct];}else{var set=this.anim[fct]||this.anim.def||'basic';if(!_animations[set]||!_animations[set][fct]||!$.isFunction(_animations[set][fct]))set='basic';curFct=_animations[set][fct];}curFct(this,$.proxy(function(){this._animated=false;this._callFilters('after'+ucfirst(fct));clb();},this));}},_load:function(){this.getInternal()._debug('_load');if(!this.loading&&this.loadFilter){this.loading=true;this._callFilter(this.loadFilter,'load');}},_contentLoading:function(){if(!this._animated&&this._bgReady){if(!this._transition&&this.elts.cont.html().length>0)this._transition=true;this._nbContentLoading++;if(!this.loading){if(!this._opened){this._opened=true;if(this._transition){var fct=$.proxy(function(){this._writeContent();this._callFilters('beforeShowCont');this._callAnim('hideTrans',$.proxy(function(){this._transition=false;this._callFilters('afterShowCont');this.elts.cont.append(this._scriptsShown);this._reposition();this.elts.cont.scrollTop(0);},this));},this);if(this._nbContentLoading==1){this._unreposition();this._callAnim('showTrans',fct);}else{fct();}}else{this._callAnim('hideLoad',$.proxy(function(){this._writeContent();this._callAnim('showCont',$.proxy(function(){this.elts.cont.append(this._scriptsShown);this._reposition();this.elts.cont.scrollTop(0);},this));},this));}}}else if(this._nbContentLoading==1){var outer=this.getInternal()._getOuter(this.elts.load);this.elts.load .css({position:'fixed',top:(this.getInternal().fullSize.viewH-this.elts.load.height()-outer.h.margin)/2,left:(this.getInternal().fullSize.viewW-this.elts.load.width()-outer.w.margin)/2});if(this._transition){this._unreposition();this._callAnim('showTrans',$.proxy(function(){this._contentLoading();},this));}else{this._callAnim('showLoad',$.proxy(function(){this._contentLoading();},this));}}}},_writeContent:function(){this.elts.cont .empty().append(this.elts.hidden.contents()).append(this._scripts).append(this.showCloseButton?this.closeButton:'').css({position:'fixed',width:this.sizes.w,height:this.sizes.h,top:(this.getInternal().fullSize.viewH-this.sizes.h-this.sizes.hMargin)/2,left:(this.getInternal().fullSize.viewW-this.sizes.w-this.sizes.wMargin)/2});},_reposition:function(){var elts=this.elts.cont.find('.nmReposition');if(elts.length){var space=this.getInternal()._getSpaceReposition();elts.each(function(){var me=$(this),offset=me.offset();me.css({position:'fixed',top:offset.top-space.top,left:offset.left-space.left});});this.elts.cont.after(elts);}this.elts.cont.css('overflow','auto');this._callFilters('afterReposition');},_unreposition:function(){this.elts.cont.css('overflow','');var elts=this.elts.all.find('.nmReposition');if(elts.length)this.elts.cont.append(elts.removeAttr('style'));this._callFilters('afterUnreposition');}},_internal={firstInit:true,debug:false,stack:[],fullSize:{w:0,h:0,wW:0,wH:0,viewW:0,viewH:0},nyroModal:function(opts,fullObj){if(_internal.firstInit){_internal._container=$('<div />').appendTo($b);$w.smartresize($.proxy(_internal._resize,_internal));$d.on('keydown.nyroModal',$.proxy(_internal._keyHandler,_internal));_internal._calculateFullSize();_internal.firstInit=false;}return this.nmInit(opts,fullObj).each(function(){_internal._init($(this).data('nmObj'));});},nmInit:function(opts,fullObj){return this.each(function(){var me=$(this);if(fullObj)me.data('nmObj',$.extend(true,{opener:me},opts));else me.data('nmObj',me.data('nmObj')?$.extend(true,me.data('nmObj'),opts):$.extend(true,{opener:me},_nmObj,opts));});},nmDestroy:function(){return this.each(function(){var me=$(this);if(me.data('nmObj')){if(me.data('nmObj').destroy())me.removeData('nmObj');}});},nmCall:function(){return this.trigger('nyroModal');},nmManual:function(url,opts){$('<a />',{href:url}).nyroModal(opts).trigger('nyroModal');},nmData:function(data,opts){this.nmManual('#',$.extend({data:data},opts));},nmObj:function(opts){$.extend(true,_nmObj,opts);},nmInternal:function(opts){$.extend(true,_internal,opts);},nmAnims:function(opts){$.extend(true,_animations,opts);},nmFilters:function(opts){$.extend(true,_filters,opts);},nmTop:function(){if(_internal.stack.length)return _internal.stack[_internal.stack.length-1]['nmObj'];return undefined;},_debug:function(msg){if(this.debug&&window.console&&window.console.log)window.console.log(msg);},_container:undefined,_init:function(nm){nm.filters=[];$.each(_filters,function(f,obj){if(obj.is&&$.isFunction(obj.is)&&obj.is(nm)){nm.filters.push(f);}});nm._callFilters('initFilters');nm._callFilters('init');nm.opener .off('nyroModal.nyroModal nmClose.nyroModal nmResize.nyroModal').on({'nyroModal.nyroModal':function(){nm.open();return false;},'nmClose.nyroModal':function(){nm.close();return false;},'nmResize.nyroModal':function(){nm.resize();return false;}});},_selNyroModal:function(obj){return $(obj).data('nmObj')?true:false;},_selNyroModalOpen:function(obj){var me=$(obj);return me.data('nmObj')?me.data('nmObj')._open:false;},_keyHandler:function(e){var nmTop=$.nmTop();if(nmTop&&nmTop.useKeyHandler){return nmTop.keyHandle(e);}},_pushStack:function(obj){this.stack=$.map(this.stack,function(elA){if(elA['nmOpener']!=obj.get(0))return elA;});this.stack.push({nmOpener:obj.get(0),nmObj:$(obj).data('nmObj')});},_removeStack:function(obj){this.stack=$.map(this.stack,function(elA){if(elA['nmOpener']!=obj.get(0))return elA;});},_resize:function(){var opens=$(':nmOpen').each(function(){$(this).data('nmObj')._unreposition();});this._calculateFullSize();opens.trigger('nmResize');},_calculateFullSize:function(){this.fullSize={w:$d.width(),h:$d.height(),wW:$w.width(),wH:$w.height()};this.fullSize.viewW=Math.min(this.fullSize.w,this.fullSize.wW);this.fullSize.viewH=Math.min(this.fullSize.h,this.fullSize.wH);},_getCurCSS:function(elm,name){var ret=parseInt($.css(elm,name,true));return isNaN(ret)?0:ret;},_getOuter:function(elm){elm=elm.get(0);var ret={h:{margin:this._getCurCSS(elm,'marginTop')+this._getCurCSS(elm,'marginBottom'),border:this._getCurCSS(elm,'borderTopWidth')+this._getCurCSS(elm,'borderBottomWidth'),padding:this._getCurCSS(elm,'paddingTop')+this._getCurCSS(elm,'paddingBottom')},w:{margin:this._getCurCSS(elm,'marginLeft')+this._getCurCSS(elm,'marginRight'),border:this._getCurCSS(elm,'borderLeftWidth')+this._getCurCSS(elm,'borderRightWidth'),padding:this._getCurCSS(elm,'paddingLeft')+this._getCurCSS(elm,'paddingRight')}};ret.h.outer=ret.h.margin+ret.h.border;ret.w.outer=ret.w.margin+ret.w.border;ret.h.inner=ret.h.padding+ret.h.border;ret.w.inner=ret.w.padding+ret.w.border;ret.h.total=ret.h.outer+ret.h.padding;ret.w.total=ret.w.outer+ret.w.padding;return ret;},_getSpaceReposition:function(){var outer=this._getOuter($b),ie7=browser.msie&&browser.version<8&&!(screen.height<=$w.height()+23);return{top:$w.scrollTop()-(!ie7?outer.h.border/2:0),left:$w.scrollLeft()-(!ie7?outer.w.border/2:0)};},_getHash:function(url){if(typeof url=='string'){var hashPos=url.indexOf('#');if(hashPos>-1)return url.substring(hashPos);}return '';},_extractUrl:function(url){var ret={url:undefined,sel:undefined};if(url){var hash=this._getHash(url),hashLoc=this._getHash(window.location.href),curLoc=window.location.href.substring(0,window.location.href.length-hashLoc.length),req=url.substring(0,url.length-hash.length);ret.sel=hash;if(req!=curLoc&&req!=baseHref)ret.url=req;}return ret;}},_animations={basic:{showBg:function(nm,clb){nm.elts.bg.css({opacity:0.7}).show();clb();},hideBg:function(nm,clb){nm.elts.bg.hide();clb();},showLoad:function(nm,clb){nm.elts.load.show();clb();},hideLoad:function(nm,clb){nm.elts.load.hide();clb();},showCont:function(nm,clb){nm.elts.cont.show();clb();},hideCont:function(nm,clb){nm.elts.cont.hide();clb();},showTrans:function(nm,clb){nm.elts.cont.hide();nm.elts.load.show();clb();},hideTrans:function(nm,clb){nm.elts.cont.show();nm.elts.load.hide();clb();},resize:function(nm,clb){nm.elts.cont.css({width:nm.sizes.w,height:nm.sizes.h,top:(nm.getInternal().fullSize.viewH-nm.sizes.h-nm.sizes.hMargin)/2,left:(nm.getInternal().fullSize.viewW-nm.sizes.w-nm.sizes.wMargin)/2});clb();}}},_filters={basic:{is:function(nm){return true;},init:function(nm){if(nm.opener.attr('rev')=='modal')nm.modal=true;if(nm.modal)nm.closeOnEscape=nm.closeOnClick=nm.showCloseButton=false;if(nm.closeOnEscape)nm.useKeyHandler=true;},initElts:function(nm){nm.elts.bg.addClass('nyroModalBg');if(nm.closeOnClick)nm.elts.bg.off('click.nyroModal').on('click.nyroModal',function(e){e.preventDefault();nm.close();});nm.elts.cont.addClass('nyroModalCont');nm.elts.hidden.addClass('nyroModalCont nyroModalHidden');nm.elts.load.addClass('nyroModalCont nyroModalLoad');},error:function(nm){nm.elts.hidden.addClass('nyroModalError');nm.elts.cont.addClass('nyroModalError');nm._setCont(nm.errorMsg);},beforeShowCont:function(nm){nm.elts.cont .find('.nyroModal').each(function(){var cur=$(this);cur.nyroModal(nm.getForNewLinks(cur),true);}).end().find('.nyroModalClose').on('click.nyroModal',function(e){e.preventDefault();nm.close();});},keyHandle:function(nm){if(nm.keyEvent.keyCode==27&&nm.closeOnEscape){nm.keyEvent.preventDefault();nm.close();}}},custom:{is:function(nm){return true;}}};$.fn.extend({nm:_internal.nyroModal,nyroModal:_internal.nyroModal,nmInit:_internal.nmInit,nmDestroy:_internal.nmDestroy,nmCall:_internal.nmCall});$.extend({nmManual:_internal.nmManual,nmData:_internal.nmData,nmObj:_internal.nmObj,nmInternal:_internal.nmInternal,nmAnims:_internal.nmAnims,nmFilters:_internal.nmFilters,nmTop:_internal.nmTop});$.expr[':'].nyroModal=$.expr[':'].nm=_internal._selNyroModal;$.expr[':'].nmOpen=_internal._selNyroModalOpen;});(function($,sr){var debounce=function(func,threshold,execAsap){var timeout;return function debounced(){var obj=this,args=arguments;function delayed(){if(!execAsap)func.apply(obj,args);timeout=null;};if(timeout)clearTimeout(timeout);else if(execAsap)func.apply(obj,args);timeout=setTimeout(delayed,threshold||100);};};jQuery.fn[sr]=function(fn){return fn?this.on('resize',debounce(fn)):this.trigger(sr);};})(jQuery,'smartresize');function ucfirst(str){str+='';var f=str.charAt(0).toUpperCase();return f+str.substr(1);};
 jQuery(function($,undefined){$.nmAnims({fade:{showBg:function(nm,clb){nm.elts.bg.fadeTo(250,0.7,clb);},hideBg:function(nm,clb){nm.elts.bg.fadeOut(clb);},showLoad:function(nm,clb){nm.elts.load.fadeIn(clb);},hideLoad:function(nm,clb){nm.elts.load.fadeOut(clb);},showCont:function(nm,clb){nm.elts.cont.fadeIn(clb);},hideCont:function(nm,clb){nm.elts.cont.css('overflow','hidden').fadeOut(clb);},showTrans:function(nm,clb){nm.elts.load .css({position:nm.elts.cont.css('position'),top:nm.elts.cont.css('top'),left:nm.elts.cont.css('left'),width:nm.elts.cont.css('width'),height:nm.elts.cont.css('height'),marginTop:nm.elts.cont.css('marginTop'),marginLeft:nm.elts.cont.css('marginLeft')}).fadeIn(function(){nm.elts.cont.hide();clb();});},hideTrans:function(nm,clb){nm.elts.cont.css('visibility','hidden').show();nm.elts.load .css('position',nm.elts.cont.css('position')).animate({top:nm.elts.cont.css('top'),left:nm.elts.cont.css('left'),width:nm.elts.cont.css('width'),height:nm.elts.cont.css('height'),marginTop:nm.elts.cont.css('marginTop'),marginLeft:nm.elts.cont.css('marginLeft')},function(){nm.elts.cont.css('visibility','');nm.elts.load.fadeOut(clb);});},resize:function(nm,clb){nm.elts.cont.animate({width:nm.sizes.w,height:nm.sizes.h,top:(nm.getInternal().fullSize.viewH-nm.sizes.h-nm.sizes.hMargin)/2,left:(nm.getInternal().fullSize.viewW-nm.sizes.w-nm.sizes.wMargin)/2},clb);}}});$.nmObj({anim:{def:'fade'}});});;
 jQuery(function($,undefined){$.nmFilters({title:{is:function(nm){return nm.opener.is('[title]');},beforeShowCont:function(nm){var offset=nm.elts.cont.offset();nm.store.title=$('<h1 />',{text:nm.opener.attr('title')}).addClass('nyroModalTitle nmReposition');nm.elts.cont.prepend(nm.store.title);},close:function(nm){if(nm.store.title){nm.store.title.remove();nm.store.title=undefined;delete(nm.store.title);}}}});});;
 jQuery(function($,undefined){$.nmFilters({gallery:{is:function(nm){var ret=nm.opener.is('[rel]:not([rel=external], [rel=nofollow])');if(ret){var rel=nm.opener.attr('rel'),indexSpace=rel.indexOf(' '),gal=indexSpace>0?rel.substr(0,indexSpace):rel,links=$('[href][rel="'+gal+'"], [href][rel^="'+gal+' "]');if(links.length<2)ret=false;if(ret&&nm.galleryCounts&&!nm._hasFilter('title'))nm.filters.push('title');}return ret;},init:function(nm){nm.useKeyHandler=true;},keyHandle:function(nm){if(!nm._animated&&nm._opened){if(nm.keyEvent.keyCode==39||nm.keyEvent.keyCode==40){nm.keyEvent.preventDefault();nm._callFilters('galleryNext');}else if(nm.keyEvent.keyCode==37||nm.keyEvent.keyCode==38){nm.keyEvent.preventDefault();nm._callFilters('galleryPrev');}}},initElts:function(nm){var rel=nm.opener.attr('rel'),indexSpace=rel.indexOf(' ');nm.store.gallery=indexSpace>0?rel.substr(0,indexSpace):rel;nm.store.galleryLinks=$('[href][rel="'+nm.store.gallery+'"], [href][rel^="'+nm.store.gallery+' "]');nm.store.galleryIndex=nm.store.galleryLinks.index(nm.opener);},beforeShowCont:function(nm){if(nm.galleryCounts&&nm.store.title&&nm.store.galleryLinks&&nm.store.galleryLinks.length>1){var curTitle=nm.store.title.html();nm.store.title.html((curTitle.length?curTitle+' - ':'')+(nm.store.galleryIndex+1)+'/'+nm.store.galleryLinks.length);}},filledContent:function(nm){var link=this._getGalleryLink(nm,-1),append=nm.elts.hidden.find(' > div');if(link){$('<a />',{text:'previous',href:'#'}).addClass('nyroModalPrev').on('click',function(e){e.preventDefault();nm._callFilters('galleryPrev');}).appendTo(append);}link=this._getGalleryLink(nm,1);if(link){$('<a />',{text:'next',href:'#'}).addClass('nyroModalNext').on('click',function(e){e.preventDefault();nm._callFilters('galleryNext');}).appendTo(append);}},close:function(nm){nm.store.gallery=undefined;nm.store.galleryLinks=undefined;nm.store.galleryIndex=undefined;delete(nm.store.gallery);delete(nm.store.galleryLinks);delete(nm.store.galleryIndex);if(nm.elts.cont)nm.elts.cont.find('.nyroModalNext, .nyroModalPrev').remove();},galleryNext:function(nm){this._getGalleryLink(nm,1).nyroModal(nm.getForNewLinks(),true).click();},galleryPrev:function(nm){this._getGalleryLink(nm,-1).nyroModal(nm.getForNewLinks(),true).click();},_getGalleryLink:function(nm,dir){if(nm.store.gallery){if(!nm.ltr)dir *=-1;var index=nm.store.galleryIndex+dir;if(nm.store.galleryLinks&&index>=0&&index<nm.store.galleryLinks.length)return nm.store.galleryLinks.eq(index);else if(nm.galleryLoop&&nm.store.galleryLinks)return nm.store.galleryLinks.eq(index<0?nm.store.galleryLinks.length-1:0);}return undefined;}}});});;
 jQuery(function($,undefined){$.nmFilters({link:{is:function(nm){var ret=nm.opener.is('[href]');if(ret)nm.store.link=nm.getInternal()._extractUrl(nm.opener.attr('href'));return ret;},init:function(nm){nm.loadFilter='link';nm.opener.off('click.nyroModal').on('click.nyroModal',function(e){e.preventDefault();nm.opener.trigger('nyroModal');});},load:function(nm){$.ajax($.extend(true,{},nm.ajax||{},{url:nm.store.link.url,data:nm.store.link.sel?[{name:nm.selIndicator,value:nm.store.link.sel.substring(1)}]:undefined,success:function(data){nm._setCont(data,nm.store.link.sel);},error:function(jqXHR){nm._error(jqXHR);}}));},destroy:function(nm){nm.opener.off('click.nyroModal');}}});});;
 jQuery(function($,undefined){$.nmFilters({dom:{is:function(nm){return nm._hasFilter('link')&&!nm.store.link.url&&nm.store.link.sel;},init:function(nm){nm.loadFilter='dom';},load:function(nm){nm.store.domEl=$(nm.store.link.sel);if(nm.store.domEl.length)nm._setCont(nm.domCopy?nm.store.domEl.html():nm.store.domEl.contents());else nm._error();},close:function(nm){if(!nm.domCopy&&nm.store.domEl&&nm.elts.cont)nm.store.domEl.append(nm.elts.cont.find('.nyroModalDom').contents());}}});});;
 jQuery(function($,undefined){$.nmFilters({data:{is:function(nm){var ret=nm.data?true:false;if(ret)nm._delFilter('dom');return ret;},init:function(nm){nm.loadFilter='data';},load:function(nm){nm._setCont(nm.data);}}});});;
 jQuery(function($,undefined){$.nmFilters({image:{is:function(nm){return(new RegExp(nm.imageRegex,'i')).test(nm.opener.attr('href'));},init:function(nm){nm.loadFilter='image';},load:function(nm){var url=nm.opener.attr('href');$('<img />').load(function(){nm.elts.cont.addClass('nyroModalImg');nm.elts.hidden.addClass('nyroModalImg');nm._setCont(this);}).error(function(){nm._error();}).attr('src',url);},size:function(nm){if(nm.sizes.w!=nm.sizes.initW||nm.sizes.h!=nm.sizes.initH){var ratio=Math.min(nm.sizes.w/nm.sizes.initW,nm.sizes.h/nm.sizes.initH);nm.sizes.w=nm.sizes.initW * ratio;nm.sizes.h=nm.sizes.initH * ratio;}var img=nm.loading?nm.elts.hidden.find('img'):nm.elts.cont.find('img');img.attr({width:nm.sizes.w,height:nm.sizes.h});},close:function(nm){if(nm.elts.cont){nm.elts.cont.removeClass('nyroModalImg');nm.elts.hidden.removeClass('nyroModalImg');}}}});});;
 jQuery(function($,undefined){$.nmFilters({swf:{idCounter:1,is:function(nm){return nm._hasFilter('link')&&nm.opener.is('[href$=".swf"]');},init:function(nm){nm.loadFilter='swf';},load:function(nm){if(!nm.swfObjectId)nm.swfObjectId='nyroModalSwf-'+(this.idCounter++);var url=nm.store.link.url,cont='<div><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="'+nm.swfObjectId+'" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"><param name="movie" value="'+url+'"></param>',tmp='';$.each(nm.swf,function(name,val){cont+='<param name="'+name+'" value="'+val+'"></param>';tmp+=' '+name+'="'+val+'"';});cont+='<embed src="'+url+'" type="application/x-shockwave-flash" width="'+nm.sizes.w+'" height="'+nm.sizes.h+'"'+tmp+'></embed></object></div>';nm._setCont(cont);}}});});;
 jQuery(function($,undefined){$.nmFilters({form:{is:function(nm){var ret=nm.opener.is('form');if(ret)nm.store.form=nm.getInternal()._extractUrl(nm.opener.attr('action'));return ret;},init:function(nm){nm.loadFilter='form';nm.opener.off('submit.nyroModal').on('submit.nyroModal',function(e){e.preventDefault();nm.opener.trigger('nyroModal');});},load:function(nm){var data={};$.map(nm.opener.serializeArray(),function(d){data[d.name]=d.value;});if(nm.store.form.sel)data[nm.selIndicator]=nm.store.form.sel.substring(1);$.ajax($.extend(true,{type:'get',dataType:'text'},nm.ajax||{},{url:nm.store.form.url,data:data,type:nm.opener.attr('method')?nm.opener.attr('method'):undefined,success:function(data){nm._setCont(data,nm.store.form.sel);},error:function(jqXHR){nm._error(jqXHR);}}));},destroy:function(nm){nm.opener.off('submit.nyroModal');}}});});;
 jQuery(function($,undefined){$.nmFilters({formFile:{is:function(nm){var ret=nm.opener.is('form[enctype="multipart/form-data"]');if(ret){nm._delFilter('form');if(!nm.store.form)nm.store.form=nm.getInternal()._extractUrl(nm.opener.attr('action'));}return ret;},init:function(nm){nm.loadFilter='formFile';nm.store.formFileLoading=false;nm.opener.off('submit.nyroModal').on('submit.nyroModal',function(e){if(!nm.store.formFileIframe){e.preventDefault();nm.opener.trigger('nyroModal');}else{nm.store.formFileLoading=true;}});},initElts:function(nm){var inputSel;if(nm.store.form.sel)inputSel=$('<input type="hidden" />',{name:nm.selIndicator,value:nm.store.form.sel.substring(1)}).appendTo(nm.opener);function rmFormFileElts(){if(inputSel){inputSel.remove();inputSel=undefined;delete(inputSel);}nm.store.formFileIframe.attr('src','about:blank').remove();nm.store.formFileIframe=undefined;delete(nm.store.formFileIframe);}nm.store.formFileIframe=$('<iframe />').attr({name:'nyroModalFormFile',src:'javascript:\'\';',id:'nyromodal-iframe-'+(new Date().getTime()),frameborder:'0'}).hide().load(function(){if(nm.store.formFileLoading){nm.store.formFileLoading=false;var content=nm.store.formFileIframe .off('load error').contents().find('body').not('script[src]');if(content&&content.html()&&content.html().length){rmFormFileElts();nm._setCont(content.html(),nm.store.form.sel);}else{var nbTry=0,fct=function(){nbTry++;var content=nm.store.formFileIframe .off('load error').contents().find('body').not('script[src]');if(content&&content.html()&&content.html().length){nm._setCont(content.html(),nm.store.form.sel);rmFormFileElts();}else if(nbTry<5){setTimeout(fct,25);}else{rmFormFileElts();nm._error();}};setTimeout(fct,25);}}}).on('error',function(){rmFormFileElts();nm._error();});nm.elts.all.append(nm.store.formFileIframe);nm.opener .attr('target','nyroModalFormFile').submit();},close:function(nm){nm.store.formFileLoading=false;if(nm.store.formFileIframe){nm.store.formFileIframe.remove();nm.store.formFileIframe=undefined;delete(nm.store.formFileIframe);}},destroy:function(nm){nm.opener.off('submit.nyroModal')}}});});;
 jQuery(function($,undefined){$.nmFilters({iframe:{is:function(nm){var target=nm.opener.attr('target')||'',rel=nm.opener.attr('rel')||'',opener=nm.opener.get(0);return!nm._hasFilter('image')&&(target.toLowerCase()=='_blank'||rel.toLowerCase().indexOf('external')>-1||(opener.hostname&&opener.hostname.replace(/:\d*$/,'')!=window.location.hostname.replace(/:\d*$/,'')));},init:function(nm){nm.loadFilter='iframe';},load:function(nm){nm.store.iframe=$('<iframe />').attr({src:'javascript:\'\';',id:'nyromodal-iframe-'+(new Date().getTime()),frameborder:'0'});nm._setCont(nm.store.iframe);},afterShowCont:function(nm){nm.store.iframe.attr('src',nm.opener.attr('href'));},close:function(nm){if(nm.store.iframe){nm.store.iframe.remove();nm.store.iframe=undefined;delete(nm.store.iframe);}}}});});;
 jQuery(function($,undefined){$.nmFilters({iframeForm:{is:function(nm){var ret=nm._hasFilter('iframe')&&nm.opener.is('form');if(ret){nm._delFilter('iframe');nm._delFilter('form');}return ret;},init:function(nm){nm.loadFilter='iframeForm';nm.store.iframeFormLoading=false;nm.store.iframeFormOrgTarget=nm.opener.attr('target');nm.opener.off('submit.nyroModal').on('submit.nyroModal',function(e){if(!nm.store.iframeFormIframe){e.preventDefault();nm.opener.trigger('nyroModal');}else{nm.store.iframeFormLoading=true;}});},load:function(nm){nm.store.iframeFormIframe=$('<iframe />').attr({name:'nyroModalIframeForm',src:'javascript:\'\';',id:'nyromodal-iframe-'+(new Date().getTime()),frameborder:'0'});nm._setCont(nm.store.iframeFormIframe);},afterShowCont:function(nm){nm.opener .attr('target','nyroModalIframeForm').submit();},close:function(nm){nm.store.iframeFormOrgTarget?nm.opener.attr('target',nm.store.iframeFormOrgTarget):nm.opener.removeAttr('target');delete(nm.store.formFileLoading);delete(nm.store.iframeFormOrgTarget);if(nm.store.iframeFormIframe){nm.store.iframeFormIframe.remove();nm.store.iframeFormIframe=undefined;delete(nm.store.iframeFormIframe);}},destroy:function(nm){nm.opener.off('submit.nyroModal')}}});});;
 jQuery(function($,undefined){$.nmObj({embedlyUrl:'http://api.embed.ly/1/oembed',embedly:{key:undefined,wmode:'transparent',allowscripts:true,format:'json'}});var cache=[];$.nmFilters({embedly:{is:function(nm){if(nm._hasFilter('link')&&nm._hasFilter('iframe')&&nm.opener.attr('href')&&nm.embedly.key){if(cache[nm.opener.attr('href')]){nm.store.embedly=cache[nm.opener.attr('href')];nm._delFilter('iframe');return true;}nm.store.embedly=false;var data=nm.embedly;data.url=nm.opener.attr('href');$.ajax({url:nm.embedlyUrl,dataType:'jsonp',data:data,success:function(data){if(data.type!='error'&&data.html){nm.store.embedly=data;cache[nm.opener.attr('href')]=data;nm._delFilter('iframe');nm.filters.push('embedly');nm._callFilters('initFilters');nm._callFilters('init');}}});}return false;},init:function(nm){nm.loadFilter='embedly';},load:function(nm){if(nm.store.embedly.type=='photo'){nm.filters.push('image');$('<img />').load(function(){nm.elts.cont.addClass('nyroModalImg');nm.elts.hidden.addClass('nyroModalImg');nm._setCont(this);}).on('error',function(){nm._error();}).attr('src',nm.store.embedly.url);}else{nm._setCont('<div>'+nm.store.embedly.html+'</div>');}},size:function(nm){if(nm.store.embedly.width&&!nm.sizes.height){nm.sizes.w=nm.store.embedly.width;nm.sizes.h=nm.store.embedly.height;}}}});});;


// --------------- LOAD FEED ---------------
// -----------------------------------------
$.fn.extend({
	loadFeed : function( feed_url, template, limit, carousel ) {
		
		return this.each(function(){
			// Set Variables
			if( template===undefined ) template = '<li><a href="{link}">{title}</a></li>';
			if( limit===undefined )    limit = 5;
			if( carousel===undefined ) carousel = false;
			if( carousel===true )      carousel = {};
			var Target = $(this);
			var swipe = ( $('html').hasClass('touch') && Target.hasClass('swipe') );
			
			// Setup
			if( carousel || swipe )
				Target.data('carousel',true);
			Target.html('').addClass('loading_feed');
			
			// Load Feed
			$.get( feed_url, function(data){
				
				// Set Variables
				var items = $(data).find('item'); // 'entry' or 'item'
				var total = Math.min( limit, items.length );
				var output = '';
				
				// Loop Items
				for( var i=0; i<total; i++ ) {
					output += template.replace( /{(\w+|\w+:\w+)(\[(\w+)\])?}/gi, function(){
						
						// Get Tag and Attribute
						var tag = arguments[1].replace( ':', '\\:' );
						var attr = arguments[3];
						var result = '';
						
						// Return attribute or text
						tag = items.eq(i).children(tag);
						return (attr) ? tag.attr(attr) : tag.text();
					});
				}
				
				// Insert Content and Run Carousel Script
				Target.removeClass('loading_feed');
				Target[0].innerHTML = output;
				
				if( carousel )
					Target.data('carousel',false).carousel(carousel);
				else if( swipe )
					Target.data('carousel',false).carousel({ slides:'.swipe-slide', nav:false, controls:false, info:false, autoplay:false })
			});
		});
		
	} // jQuery.loadFeed()
});


// =Chris - initialise all accordions
$(document).ready(function () {
    $("#accordion").accordion({
        heightStyle: "content" // size each panel to content rather than fixed size
    });
});

})(jQuery);



// --------------- IMAGE LOADER ---------------
// --------------------------------------------

/*!
 * imagesLoaded PACKAGED v3.0.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},"function"==typeof define&&define.amd?define(function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){"use strict";var t=document.documentElement,n=function(){};t.addEventListener?n=function(e,t,n){e.addEventListener(t,n,!1)}:t.attachEvent&&(n=function(t,n,i){t[n+i]=i.handleEvent?function(){var t=e.event;t.target=t.target||t.srcElement,i.handleEvent.call(i,t)}:function(){var n=e.event;n.target=n.target||n.srcElement,i.call(t,n)},t.attachEvent("on"+n,t[n+i])});var i=function(){};t.removeEventListener?i=function(e,t,n){e.removeEventListener(t,n,!1)}:t.detachEvent&&(i=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var r={bind:n,unbind:i};"function"==typeof define&&define.amd?define(r):e.eventie=r}(this),function(e){"use strict";function t(e,t){for(var n in t)e[n]=t[n];return e}function n(e){return"[object Array]"===c.call(e)}function i(e){var t=[];if(n(e))t=e;else if("number"==typeof e.length)for(var i=0,r=e.length;r>i;i++)t.push(e[i]);else t.push(e);return t}function r(e,n){function r(e,n,s){if(!(this instanceof r))return new r(e,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=i(e),this.options=t({},this.options),"function"==typeof n?s=n:t(this.options,n),s&&this.on("always",s),this.getImages(),o&&(this.jqDeferred=new o.Deferred);var a=this;setTimeout(function(){a.check()})}function c(e){this.img=e}r.prototype=new e,r.prototype.options={},r.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);for(var i=n.querySelectorAll("img"),r=0,o=i.length;o>r;r++){var s=i[r];this.addImage(s)}}},r.prototype.addImage=function(e){var t=new c(e);this.images.push(t)},r.prototype.check=function(){function e(e,r){return t.options.debug&&a&&s.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},r.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify(t,e)})},r.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},o&&(o.fn.imagesLoaded=function(e,t){var n=new r(this,e,t);return n.jqDeferred.promise(o(this))});var f={};return c.prototype=new e,c.prototype.check=function(){var e=f[this.img.src];if(e)return this.useCached(e),void 0;if(f[this.img.src]=this,this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this.proxyImage=new Image;n.bind(t,"load",this),n.bind(t,"error",this),t.src=this.img.src},c.prototype.useCached=function(e){if(e.isConfirmed)this.confirm(e.isLoaded,"cached was confirmed");else{var t=this;e.on("confirm",function(e){return t.confirm(e.isLoaded,"cache emitted confirmed"),!0})}},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindProxyEvents()},c.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindProxyEvents()},c.prototype.unbindProxyEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this)},r}var o=e.jQuery,s=e.console,a=s!==void 0,c=Object.prototype.toString;"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],r):e.imagesLoaded=r(e.EventEmitter,e.eventie)}(window);

/* Chris - added jQuery Validation plugin + additional validation plugins */
/*! jQuery Validation Plugin - v1.11.1 - 3/22/2013\n* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */(function (t) { t.extend(t.fn, { validate: function (e) { if (!this.length) return e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."), void 0; var i = t.data(this[0], "validator"); return i ? i : (this.attr("novalidate", "novalidate"), i = new t.validator(e, this[0]), t.data(this[0], "validator", i), i.settings.onsubmit && (this.validateDelegate(":submit", "click", function (e) { i.settings.submitHandler && (i.submitButton = e.target), t(e.target).hasClass("cancel") && (i.cancelSubmit = !0), void 0 !== t(e.target).attr("formnovalidate") && (i.cancelSubmit = !0) }), this.submit(function (e) { function s() { var s; return i.settings.submitHandler ? (i.submitButton && (s = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)), i.settings.submitHandler.call(i, i.currentForm, e), i.submitButton && s.remove(), !1) : !0 } return i.settings.debug && e.preventDefault(), i.cancelSubmit ? (i.cancelSubmit = !1, s()) : i.form() ? i.pendingRequest ? (i.formSubmitted = !0, !1) : s() : (i.focusInvalid(), !1) })), i) }, valid: function () { if (t(this[0]).is("form")) return this.validate().form(); var e = !0, i = t(this[0].form).validate(); return this.each(function () { e = e && i.element(this) }), e }, removeAttrs: function (e) { var i = {}, s = this; return t.each(e.split(/\s/), function (t, e) { i[e] = s.attr(e), s.removeAttr(e) }), i }, rules: function (e, i) { var s = this[0]; if (e) { var r = t.data(s.form, "validator").settings, n = r.rules, a = t.validator.staticRules(s); switch (e) { case "add": t.extend(a, t.validator.normalizeRule(i)), delete a.messages, n[s.name] = a, i.messages && (r.messages[s.name] = t.extend(r.messages[s.name], i.messages)); break; case "remove": if (!i) return delete n[s.name], a; var u = {}; return t.each(i.split(/\s/), function (t, e) { u[e] = a[e], delete a[e] }), u } } var o = t.validator.normalizeRules(t.extend({}, t.validator.classRules(s), t.validator.attributeRules(s), t.validator.dataRules(s), t.validator.staticRules(s)), s); if (o.required) { var l = o.required; delete o.required, o = t.extend({ required: l }, o) } return o } }), t.extend(t.expr[":"], { blank: function (e) { return !t.trim("" + t(e).val()) }, filled: function (e) { return !!t.trim("" + t(e).val()) }, unchecked: function (e) { return !t(e).prop("checked") } }), t.validator = function (e, i) { this.settings = t.extend(!0, {}, t.validator.defaults, e), this.currentForm = i, this.init() }, t.validator.format = function (e, i) { return 1 === arguments.length ? function () { var i = t.makeArray(arguments); return i.unshift(e), t.validator.format.apply(this, i) } : (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)), i.constructor !== Array && (i = [i]), t.each(i, function (t, i) { e = e.replace(RegExp("\\{" + t + "\\}", "g"), function () { return i }) }), e) }, t.extend(t.validator, { defaults: { messages: {}, groups: {}, rules: {}, errorClass: "error", validClass: "valid", errorElement: "label", focusInvalid: !0, errorContainer: t([]), errorLabelContainer: t([]), onsubmit: !0, ignore: ":hidden", ignoreTitle: !1, onfocusin: function (t) { this.lastActive = t, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(t)).hide()) }, onfocusout: function (t) { this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t) }, onkeyup: function (t, e) { (9 !== e.which || "" !== this.elementValue(t)) && (t.name in this.submitted || t === this.lastElement) && this.element(t) }, onclick: function (t) { t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode) }, highlight: function (e, i, s) { "radio" === e.type ? this.findByName(e.name).addClass(i).removeClass(s) : t(e).addClass(i).removeClass(s) }, unhighlight: function (e, i, s) { "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(s) : t(e).removeClass(i).addClass(s) } }, setDefaults: function (e) { t.extend(t.validator.defaults, e) }, messages: { required: "This field is required.", remote: "Please fix this field.", email: "Please enter a valid email address.", url: "Please enter a valid URL.", date: "Please enter a valid date.", dateISO: "Please enter a valid date (ISO).", number: "Please enter a valid number.", digits: "Please enter only digits.", creditcard: "Please enter a valid credit card number.", equalTo: "Please enter the same value again.", maxlength: t.validator.format("Please enter no more than {0} characters."), minlength: t.validator.format("Please enter at least {0} characters."), rangelength: t.validator.format("Please enter a value between {0} and {1} characters long."), range: t.validator.format("Please enter a value between {0} and {1}."), max: t.validator.format("Please enter a value less than or equal to {0}."), min: t.validator.format("Please enter a value greater than or equal to {0}.") }, autoCreateRanges: !1, prototype: { init: function () { function e(e) { var i = t.data(this[0].form, "validator"), s = "on" + e.type.replace(/^validate/, ""); i.settings[s] && i.settings[s].call(i, this[0], e) } this.labelContainer = t(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm), this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset(); var i = this.groups = {}; t.each(this.settings.groups, function (e, s) { "string" == typeof s && (s = s.split(/\s/)), t.each(s, function (t, s) { i[s] = e }) }); var s = this.settings.rules; t.each(s, function (e, i) { s[e] = t.validator.normalizeRule(i) }), t(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", e).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", e), this.settings.invalidHandler && t(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler) }, form: function () { return this.checkForm(), t.extend(this.submitted, this.errorMap), this.invalid = t.extend({}, this.errorMap), this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid() }, checkForm: function () { this.prepareForm(); for (var t = 0, e = this.currentElements = this.elements() ; e[t]; t++) this.check(e[t]); return this.valid() }, element: function (e) { e = this.validationTargetFor(this.clean(e)), this.lastElement = e, this.prepareElement(e), this.currentElements = t(e); var i = this.check(e) !== !1; return i ? delete this.invalid[e.name] : this.invalid[e.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), i }, showErrors: function (e) { if (e) { t.extend(this.errorMap, e), this.errorList = []; for (var i in e) this.errorList.push({ message: e[i], element: this.findByName(i)[0] }); this.successList = t.grep(this.successList, function (t) { return !(t.name in e) }) } this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors() }, resetForm: function () { t.fn.resetForm && t(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass).removeData("previousValue") }, numberOfInvalids: function () { return this.objectLength(this.invalid) }, objectLength: function (t) { var e = 0; for (var i in t) e++; return e }, hideErrors: function () { this.addWrapper(this.toHide).hide() }, valid: function () { return 0 === this.size() }, size: function () { return this.errorList.length }, focusInvalid: function () { if (this.settings.focusInvalid) try { t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin") } catch (e) { } }, findLastActive: function () { var e = this.lastActive; return e && 1 === t.grep(this.errorList, function (t) { return t.element.name === e.name }).length && e }, elements: function () { var e = this, i = {}; return t(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () { return !this.name && e.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in i || !e.objectLength(t(this).rules()) ? !1 : (i[this.name] = !0, !0) }) }, clean: function (e) { return t(e)[0] }, errors: function () { var e = this.settings.errorClass.replace(" ", "."); return t(this.settings.errorElement + "." + e, this.errorContext) }, reset: function () { this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = t([]), this.toHide = t([]), this.currentElements = t([]) }, prepareForm: function () { this.reset(), this.toHide = this.errors().add(this.containers) }, prepareElement: function (t) { this.reset(), this.toHide = this.errorsFor(t) }, elementValue: function (e) { var i = t(e).attr("type"), s = t(e).val(); return "radio" === i || "checkbox" === i ? t("input[name='" + t(e).attr("name") + "']:checked").val() : "string" == typeof s ? s.replace(/\r/g, "") : s }, check: function (e) { e = this.validationTargetFor(this.clean(e)); var i, s = t(e).rules(), r = !1, n = this.elementValue(e); for (var a in s) { var u = { method: a, parameters: s[a] }; try { if (i = t.validator.methods[a].call(this, n, e, u.parameters), "dependency-mismatch" === i) { r = !0; continue } if (r = !1, "pending" === i) return this.toHide = this.toHide.not(this.errorsFor(e)), void 0; if (!i) return this.formatAndAdd(e, u), !1 } catch (o) { throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + u.method + "' method.", o), o } } return r ? void 0 : (this.objectLength(s) && this.successList.push(e), !0) }, customDataMessage: function (e, i) { return t(e).data("msg-" + i.toLowerCase()) || e.attributes && t(e).attr("data-msg-" + i.toLowerCase()) }, customMessage: function (t, e) { var i = this.settings.messages[t]; return i && (i.constructor === String ? i : i[e]) }, findDefined: function () { for (var t = 0; arguments.length > t; t++) if (void 0 !== arguments[t]) return arguments[t]; return void 0 }, defaultMessage: function (e, i) { return this.findDefined(this.customMessage(e.name, i), this.customDataMessage(e, i), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[i], "<strong>Warning: No message defined for " + e.name + "</strong>") }, formatAndAdd: function (e, i) { var s = this.defaultMessage(e, i.method), r = /\$?\{(\d+)\}/g; "function" == typeof s ? s = s.call(this, i.parameters, e) : r.test(s) && (s = t.validator.format(s.replace(r, "{$1}"), i.parameters)), this.errorList.push({ message: s, element: e }), this.errorMap[e.name] = s, this.submitted[e.name] = s }, addWrapper: function (t) { return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))), t }, defaultShowErrors: function () { var t, e; for (t = 0; this.errorList[t]; t++) { var i = this.errorList[t]; this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass), this.showLabel(i.element, i.message) } if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (t = 0; this.successList[t]; t++) this.showLabel(this.successList[t]); if (this.settings.unhighlight) for (t = 0, e = this.validElements() ; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass); this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show() }, validElements: function () { return this.currentElements.not(this.invalidElements()) }, invalidElements: function () { return t(this.errorList).map(function () { return this.element }) }, showLabel: function (e, i) { var s = this.errorsFor(e); s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html(i)) : (s = t("<" + this.settings.errorElement + ">").attr("for", this.idOrName(e)).addClass(this.settings.errorClass).html(i || ""), this.settings.wrapper && (s = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(s).length || (this.settings.errorPlacement ? this.settings.errorPlacement(s, t(e)) : s.insertAfter(e))), !i && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, e)), this.toShow = this.toShow.add(s) }, errorsFor: function (e) { var i = this.idOrName(e); return this.errors().filter(function () { return t(this).attr("for") === i }) }, idOrName: function (t) { return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name) }, validationTargetFor: function (t) { return this.checkable(t) && (t = this.findByName(t.name).not(this.settings.ignore)[0]), t }, checkable: function (t) { return /radio|checkbox/i.test(t.type) }, findByName: function (e) { return t(this.currentForm).find("[name='" + e + "']") }, getLength: function (e, i) { switch (i.nodeName.toLowerCase()) { case "select": return t("option:selected", i).length; case "input": if (this.checkable(i)) return this.findByName(i.name).filter(":checked").length } return e.length }, depend: function (t, e) { return this.dependTypes[typeof t] ? this.dependTypes[typeof t](t, e) : !0 }, dependTypes: { "boolean": function (t) { return t }, string: function (e, i) { return !!t(e, i.form).length }, "function": function (t, e) { return t(e) } }, optional: function (e) { var i = this.elementValue(e); return !t.validator.methods.required.call(this, i, e) && "dependency-mismatch" }, startRequest: function (t) { this.pending[t.name] || (this.pendingRequest++, this.pending[t.name] = !0) }, stopRequest: function (e, i) { this.pendingRequest--, 0 > this.pendingRequest && (this.pendingRequest = 0), delete this.pending[e.name], i && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(), this.formSubmitted = !1) : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1) }, previousValue: function (e) { return t.data(e, "previousValue") || t.data(e, "previousValue", { old: null, valid: !0, message: this.defaultMessage(e, "remote") }) } }, classRuleSettings: { required: { required: !0 }, email: { email: !0 }, url: { url: !0 }, date: { date: !0 }, dateISO: { dateISO: !0 }, number: { number: !0 }, digits: { digits: !0 }, creditcard: { creditcard: !0 } }, addClassRules: function (e, i) { e.constructor === String ? this.classRuleSettings[e] = i : t.extend(this.classRuleSettings, e) }, classRules: function (e) { var i = {}, s = t(e).attr("class"); return s && t.each(s.split(" "), function () { this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this]) }), i }, attributeRules: function (e) { var i = {}, s = t(e), r = s[0].getAttribute("type"); for (var n in t.validator.methods) { var a; "required" === n ? (a = s.get(0).getAttribute(n), "" === a && (a = !0), a = !!a) : a = s.attr(n), /min|max/.test(n) && (null === r || /number|range|text/.test(r)) && (a = Number(a)), a ? i[n] = a : r === n && "range" !== r && (i[n] = !0) } return i.maxlength && /-1|2147483647|524288/.test(i.maxlength) && delete i.maxlength, i }, dataRules: function (e) { var i, s, r = {}, n = t(e); for (i in t.validator.methods) s = n.data("rule-" + i.toLowerCase()), void 0 !== s && (r[i] = s); return r }, staticRules: function (e) { var i = {}, s = t.data(e.form, "validator"); return s.settings.rules && (i = t.validator.normalizeRule(s.settings.rules[e.name]) || {}), i }, normalizeRules: function (e, i) { return t.each(e, function (s, r) { if (r === !1) return delete e[s], void 0; if (r.param || r.depends) { var n = !0; switch (typeof r.depends) { case "string": n = !!t(r.depends, i.form).length; break; case "function": n = r.depends.call(i, i) } n ? e[s] = void 0 !== r.param ? r.param : !0 : delete e[s] } }), t.each(e, function (s, r) { e[s] = t.isFunction(r) ? r(i) : r }), t.each(["minlength", "maxlength"], function () { e[this] && (e[this] = Number(e[this])) }), t.each(["rangelength", "range"], function () { var i; e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (i = e[this].split(/[\s,]+/), e[this] = [Number(i[0]), Number(i[1])])) }), t.validator.autoCreateRanges && (e.min && e.max && (e.range = [e.min, e.max], delete e.min, delete e.max), e.minlength && e.maxlength && (e.rangelength = [e.minlength, e.maxlength], delete e.minlength, delete e.maxlength)), e }, normalizeRule: function (e) { if ("string" == typeof e) { var i = {}; t.each(e.split(/\s/), function () { i[this] = !0 }), e = i } return e }, addMethod: function (e, i, s) { t.validator.methods[e] = i, t.validator.messages[e] = void 0 !== s ? s : t.validator.messages[e], 3 > i.length && t.validator.addClassRules(e, t.validator.normalizeRule(e)) }, methods: { required: function (e, i, s) { if (!this.depend(s, i)) return "dependency-mismatch"; if ("select" === i.nodeName.toLowerCase()) { var r = t(i).val(); return r && r.length > 0 } return this.checkable(i) ? this.getLength(e, i) > 0 : t.trim(e).length > 0 }, email: function (t, e) { return this.optional(e) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(t) }, url: function (t, e) { return this.optional(e) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t) }, date: function (t, e) { return this.optional(e) || !/Invalid|NaN/.test("" + new Date(t)) }, dateISO: function (t, e) { return this.optional(e) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(t) }, number: function (t, e) { return this.optional(e) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t) }, digits: function (t, e) { return this.optional(e) || /^\d+$/.test(t) }, creditcard: function (t, e) { if (this.optional(e)) return "dependency-mismatch"; if (/[^0-9 \-]+/.test(t)) return !1; var i = 0, s = 0, r = !1; t = t.replace(/\D/g, ""); for (var n = t.length - 1; n >= 0; n--) { var a = t.charAt(n); s = parseInt(a, 10), r && (s *= 2) > 9 && (s -= 9), i += s, r = !r } return 0 === i % 10 }, minlength: function (e, i, s) { var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i); return this.optional(i) || r >= s }, maxlength: function (e, i, s) { var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i); return this.optional(i) || s >= r }, rangelength: function (e, i, s) { var r = t.isArray(e) ? e.length : this.getLength(t.trim(e), i); return this.optional(i) || r >= s[0] && s[1] >= r }, min: function (t, e, i) { return this.optional(e) || t >= i }, max: function (t, e, i) { return this.optional(e) || i >= t }, range: function (t, e, i) { return this.optional(e) || t >= i[0] && i[1] >= t }, equalTo: function (e, i, s) { var r = t(s); return this.settings.onfocusout && r.unbind(".validate-equalTo").bind("blur.validate-equalTo", function () { t(i).valid() }), e === r.val() }, remote: function (e, i, s) { if (this.optional(i)) return "dependency-mismatch"; var r = this.previousValue(i); if (this.settings.messages[i.name] || (this.settings.messages[i.name] = {}), r.originalMessage = this.settings.messages[i.name].remote, this.settings.messages[i.name].remote = r.message, s = "string" == typeof s && { url: s } || s, r.old === e) return r.valid; r.old = e; var n = this; this.startRequest(i); var a = {}; return a[i.name] = e, t.ajax(t.extend(!0, { url: s, mode: "abort", port: "validate" + i.name, dataType: "json", data: a, success: function (s) { n.settings.messages[i.name].remote = r.originalMessage; var a = s === !0 || "true" === s; if (a) { var u = n.formSubmitted; n.prepareElement(i), n.formSubmitted = u, n.successList.push(i), delete n.invalid[i.name], n.showErrors() } else { var o = {}, l = s || n.defaultMessage(i, "remote"); o[i.name] = r.message = t.isFunction(l) ? l(e) : l, n.invalid[i.name] = !0, n.showErrors(o) } r.valid = a, n.stopRequest(i, a) } }, s)), "pending" } } }), t.format = t.validator.format })(jQuery), function (t) { var e = {}; if (t.ajaxPrefilter) t.ajaxPrefilter(function (t, i, s) { var r = t.port; "abort" === t.mode && (e[r] && e[r].abort(), e[r] = s) }); else { var i = t.ajax; t.ajax = function (s) { var r = ("mode" in s ? s : t.ajaxSettings).mode, n = ("port" in s ? s : t.ajaxSettings).port; return "abort" === r ? (e[n] && e[n].abort(), e[n] = i.apply(this, arguments), e[n]) : i.apply(this, arguments) } } }(jQuery), function (t) { t.extend(t.fn, { validateDelegate: function (e, i, s) { return this.bind(i, function (i) { var r = t(i.target); return r.is(e) ? s.apply(r, arguments) : void 0 }) } }) }(jQuery);
/*! jQuery Validation Plugin - v1.11.1 - 3/22/2013\n* https://github.com/jzaefferer/jquery-validation
* Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */(function () { function t(t) { return t.replace(/<.[^<>]*?>/g, " ").replace(/&nbsp;|&#160;/gi, " ").replace(/[.(),;:!?%#$'"_+=\/\-]*/g, "") } jQuery.validator.addMethod("maxWords", function (e, i, a) { return this.optional(i) || a >= t(e).match(/\b\w+\b/g).length }, jQuery.validator.format("Please enter {0} words or less.")), jQuery.validator.addMethod("minWords", function (e, i, a) { return this.optional(i) || t(e).match(/\b\w+\b/g).length >= a }, jQuery.validator.format("Please enter at least {0} words.")), jQuery.validator.addMethod("rangeWords", function (e, i, a) { var r = t(e), n = /\b\w+\b/g; return this.optional(i) || r.match(n).length >= a[0] && r.match(n).length <= a[1] }, jQuery.validator.format("Please enter between {0} and {1} words.")) })(), jQuery.validator.addMethod("letterswithbasicpunc", function (t, e) { return this.optional(e) || /^[a-z\-.,()'"\s]+$/i.test(t) }, "Letters or punctuation only please"), jQuery.validator.addMethod("alphanumeric", function (t, e) { return this.optional(e) || /^\w+$/i.test(t) }, "Letters, numbers, and underscores only please"), jQuery.validator.addMethod("lettersonly", function (t, e) { return this.optional(e) || /^[a-z]+$/i.test(t) }, "Letters only please"), jQuery.validator.addMethod("nowhitespace", function (t, e) { return this.optional(e) || /^\S+$/i.test(t) }, "No white space please"), jQuery.validator.addMethod("ziprange", function (t, e) { return this.optional(e) || /^90[2-5]\d\{2\}-\d{4}$/.test(t) }, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx"), jQuery.validator.addMethod("zipcodeUS", function (t, e) { return this.optional(e) || /\d{5}-\d{4}$|^\d{5}$/.test(t) }, "The specified US ZIP Code is invalid"), jQuery.validator.addMethod("integer", function (t, e) { return this.optional(e) || /^-?\d+$/.test(t) }, "A positive or negative non-decimal number please"), jQuery.validator.addMethod("vinUS", function (t) { if (17 !== t.length) return !1; var e, i, a, r, n, s, u = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"], d = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9], o = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], l = 0; for (e = 0; 17 > e; e++) { if (r = o[e], a = t.slice(e, e + 1), 8 === e && (s = a), isNaN(a)) { for (i = 0; u.length > i; i++) if (a.toUpperCase() === u[i]) { a = d[i], a *= r, isNaN(s) && 8 === i && (s = u[i]); break } } else a *= r; l += a } return n = l % 11, 10 === n && (n = "X"), n === s ? !0 : !1 }, "The specified vehicle identification number (VIN) is invalid."), jQuery.validator.addMethod("dateITA", function (t, e) { var i = !1, a = /^\d{1,2}\/\d{1,2}\/\d{4}$/; if (a.test(t)) { var r = t.split("/"), n = parseInt(r[0], 10), s = parseInt(r[1], 10), u = parseInt(r[2], 10), d = new Date(u, s - 1, n); i = d.getFullYear() === u && d.getMonth() === s - 1 && d.getDate() === n ? !0 : !1 } else i = !1; return this.optional(e) || i }, "Please enter a correct date"), jQuery.validator.addMethod("iban", function (t, e) { if (this.optional(e)) return !0; if (!/^([a-zA-Z0-9]{4} ){2,8}[a-zA-Z0-9]{1,4}|[a-zA-Z0-9]{12,34}$/.test(t)) return !1; var i = t.replace(/ /g, "").toUpperCase(), a = i.substring(0, 2), r = { AL: "\\d{8}[\\dA-Z]{16}", AD: "\\d{8}[\\dA-Z]{12}", AT: "\\d{16}", AZ: "[\\dA-Z]{4}\\d{20}", BE: "\\d{12}", BH: "[A-Z]{4}[\\dA-Z]{14}", BA: "\\d{16}", BR: "\\d{23}[A-Z][\\dA-Z]", BG: "[A-Z]{4}\\d{6}[\\dA-Z]{8}", CR: "\\d{17}", HR: "\\d{17}", CY: "\\d{8}[\\dA-Z]{16}", CZ: "\\d{20}", DK: "\\d{14}", DO: "[A-Z]{4}\\d{20}", EE: "\\d{16}", FO: "\\d{14}", FI: "\\d{14}", FR: "\\d{10}[\\dA-Z]{11}\\d{2}", GE: "[\\dA-Z]{2}\\d{16}", DE: "\\d{18}", GI: "[A-Z]{4}[\\dA-Z]{15}", GR: "\\d{7}[\\dA-Z]{16}", GL: "\\d{14}", GT: "[\\dA-Z]{4}[\\dA-Z]{20}", HU: "\\d{24}", IS: "\\d{22}", IE: "[\\dA-Z]{4}\\d{14}", IL: "\\d{19}", IT: "[A-Z]\\d{10}[\\dA-Z]{12}", KZ: "\\d{3}[\\dA-Z]{13}", KW: "[A-Z]{4}[\\dA-Z]{22}", LV: "[A-Z]{4}[\\dA-Z]{13}", LB: "\\d{4}[\\dA-Z]{20}", LI: "\\d{5}[\\dA-Z]{12}", LT: "\\d{16}", LU: "\\d{3}[\\dA-Z]{13}", MK: "\\d{3}[\\dA-Z]{10}\\d{2}", MT: "[A-Z]{4}\\d{5}[\\dA-Z]{18}", MR: "\\d{23}", MU: "[A-Z]{4}\\d{19}[A-Z]{3}", MC: "\\d{10}[\\dA-Z]{11}\\d{2}", MD: "[\\dA-Z]{2}\\d{18}", ME: "\\d{18}", NL: "[A-Z]{4}\\d{10}", NO: "\\d{11}", PK: "[\\dA-Z]{4}\\d{16}", PS: "[\\dA-Z]{4}\\d{21}", PL: "\\d{24}", PT: "\\d{21}", RO: "[A-Z]{4}[\\dA-Z]{16}", SM: "[A-Z]\\d{10}[\\dA-Z]{12}", SA: "\\d{2}[\\dA-Z]{18}", RS: "\\d{18}", SK: "\\d{20}", SI: "\\d{15}", ES: "\\d{20}", SE: "\\d{20}", CH: "\\d{5}[\\dA-Z]{12}", TN: "\\d{20}", TR: "\\d{5}[\\dA-Z]{17}", AE: "\\d{3}\\d{16}", GB: "[A-Z]{4}\\d{14}", VG: "[\\dA-Z]{4}\\d{16}" }, n = r[a]; if (n !== void 0) { var s = RegExp("^[A-Z]{2}\\d{2}" + n + "$", ""); if (!s.test(i)) return !1 } for (var u, d = i.substring(4, i.length) + i.substring(0, 4), o = "", l = !0, h = 0; d.length > h; h++) u = d.charAt(h), "0" !== u && (l = !1), l || (o += "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(u)); for (var F = "", c = "", m = 0; o.length > m; m++) { var f = o.charAt(m); c = "" + F + f, F = c % 97 } return 1 === F }, "Please specify a valid IBAN"), jQuery.validator.addMethod("dateNL", function (t, e) { return this.optional(e) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(t) }, "Please enter a correct date"), jQuery.validator.addMethod("phoneNL", function (t, e) { return this.optional(e) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9]){8}$/.test(t) }, "Please specify a valid phone number."), jQuery.validator.addMethod("mobileNL", function (t, e) { return this.optional(e) || /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)6((\s|\s?\-\s?)?[0-9]){8}$/.test(t) }, "Please specify a valid mobile number"), jQuery.validator.addMethod("postalcodeNL", function (t, e) { return this.optional(e) || /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(t) }, "Please specify a valid postal code"), jQuery.validator.addMethod("bankaccountNL", function (t, e) { if (this.optional(e)) return !0; if (!/^[0-9]{9}|([0-9]{2} ){3}[0-9]{3}$/.test(t)) return !1; for (var i = t.replace(/ /g, ""), a = 0, r = i.length, n = 0; r > n; n++) { var s = r - n, u = i.substring(n, n + 1); a += s * u } return 0 === a % 11 }, "Please specify a valid bank account number"), jQuery.validator.addMethod("giroaccountNL", function (t, e) { return this.optional(e) || /^[0-9]{1,7}$/.test(t) }, "Please specify a valid giro account number"), jQuery.validator.addMethod("bankorgiroaccountNL", function (t, e) { return this.optional(e) || $.validator.methods.bankaccountNL.call(this, t, e) || $.validator.methods.giroaccountNL.call(this, t, e) }, "Please specify a valid bank or giro account number"), jQuery.validator.addMethod("time", function (t, e) { return this.optional(e) || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(t) }, "Please enter a valid time, between 00:00 and 23:59"), jQuery.validator.addMethod("time12h", function (t, e) { return this.optional(e) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}(\ ?[AP]M))$/i.test(t) }, "Please enter a valid time in 12-hour am/pm format"), jQuery.validator.addMethod("phoneUS", function (t, e) { return t = t.replace(/\s+/g, ""), this.optional(e) || t.length > 9 && t.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/) }, "Please specify a valid phone number"), jQuery.validator.addMethod("phoneUK", function (t, e) { return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/) }, "Please specify a valid phone number"), jQuery.validator.addMethod("mobileUK", function (t, e) { return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/) }, "Please specify a valid mobile number"), jQuery.validator.addMethod("phonesUK", function (t, e) { return t = t.replace(/\(|\)|\s+|-/g, ""), this.optional(e) || t.length > 9 && t.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6})))$/) }, "Please specify a valid uk phone number"), jQuery.validator.addMethod("postcodeUK", function (t, e) { return this.optional(e) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test(t) }, "Please specify a valid UK postcode"), jQuery.validator.addMethod("strippedminlength", function (t, e, i) { return jQuery(t).text().length >= i }, jQuery.validator.format("Please enter at least {0} characters")), jQuery.validator.addMethod("email2", function (t, e) { return this.optional(e) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(t) }, jQuery.validator.messages.email), jQuery.validator.addMethod("url2", function (t, e) { return this.optional(e) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t) }, jQuery.validator.messages.url), jQuery.validator.addMethod("creditcardtypes", function (t, e, i) { if (/[^0-9\-]+/.test(t)) return !1; t = t.replace(/\D/g, ""); var a = 0; return i.mastercard && (a |= 1), i.visa && (a |= 2), i.amex && (a |= 4), i.dinersclub && (a |= 8), i.enroute && (a |= 16), i.discover && (a |= 32), i.jcb && (a |= 64), i.unknown && (a |= 128), i.all && (a = 255), 1 & a && /^(5[12345])/.test(t) ? 16 === t.length : 2 & a && /^(4)/.test(t) ? 16 === t.length : 4 & a && /^(3[47])/.test(t) ? 15 === t.length : 8 & a && /^(3(0[012345]|[68]))/.test(t) ? 14 === t.length : 16 & a && /^(2(014|149))/.test(t) ? 15 === t.length : 32 & a && /^(6011)/.test(t) ? 16 === t.length : 64 & a && /^(3)/.test(t) ? 16 === t.length : 64 & a && /^(2131|1800)/.test(t) ? 15 === t.length : 128 & a ? !0 : !1 }, "Please enter a valid credit card number."), jQuery.validator.addMethod("ipv4", function (t, e) { return this.optional(e) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(t) }, "Please enter a valid IP v4 address."), jQuery.validator.addMethod("ipv6", function (t, e) { return this.optional(e) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(t) }, "Please enter a valid IP v6 address."), jQuery.validator.addMethod("pattern", function (t, e, i) { return this.optional(e) ? !0 : ("string" == typeof i && (i = RegExp("^(?:" + i + ")$")), i.test(t)) }, "Invalid format."), jQuery.validator.addMethod("require_from_group", function (t, e, i) { var a = this, r = i[1], n = $(r, e.form).filter(function () { return a.elementValue(this) }).length >= i[0]; if (!$(e).data("being_validated")) { var s = $(r, e.form); s.data("being_validated", !0), s.valid(), s.data("being_validated", !1) } return n }, jQuery.format("Please fill at least {0} of these fields.")), jQuery.validator.addMethod("skip_or_fill_minimum", function (t, e, i) { var a = this, r = i[0], n = i[1], s = $(n, e.form).filter(function () { return a.elementValue(this) }).length, u = s >= r || 0 === s; if (!$(e).data("being_validated")) { var d = $(n, e.form); d.data("being_validated", !0), d.valid(), d.data("being_validated", !1) } return u }, jQuery.format("Please either skip these fields or fill at least {0} of them.")), jQuery.validator.addMethod("accept", function (t, e, i) { var a, r, n = "string" == typeof i ? i.replace(/\s/g, "").replace(/,/g, "|") : "image/*", s = this.optional(e); if (s) return s; if ("file" === $(e).attr("type") && (n = n.replace(/\*/g, ".*"), e.files && e.files.length)) for (a = 0; e.files.length > a; a++) if (r = e.files[a], !r.type.match(RegExp(".?(" + n + ")$", "i"))) return !1; return !0 }, jQuery.format("Please enter a value with a valid mimetype.")), jQuery.validator.addMethod("extension", function (t, e, i) { return i = "string" == typeof i ? i.replace(/,/g, "|") : "png|jpe?g|gif", this.optional(e) || t.match(RegExp(".(" + i + ")$", "i")) }, jQuery.format("Please enter a value with a valid extension."));

/* 20140212 - Chris - apply .selected class to secondary nav link */
var UrlParser = UrlParser || {};
// trims trailing slash - returns trimmed string
UrlParser.TrimTrailingSlash = function (url) {
    if (url.lastIndexOf('/') == url.length-1)
    {
        //console.log("path has trailing slash, trimming");
        var trimmed = url.substr(0, url.lastIndexOf('/'));
        return trimmed;
    }
    else
    {
        //console.log("no trailing slash. doing nothing");
        return url;
    }
};
// determines if the url is a local link or remote - returns true if local, false otherwise
UrlParser.IsLocalUrl = function (url) {
    var myHostname = window.location.hostname;
    var protocol = window.location.protocol;
    if (url.indexOf(protocol+myHostname) == 0)
    {
        // if url starts with http://myhostname - then yes
        return true;
    }
    else
    {
        if (url.indexOf(protocol) == 0)
        {
            // starts with http but does not then follow with myhostname
            return false;
        }
        // otherwise is a local link
        return true;
    }
};

// return relative path string
UrlParser.GetRelativePath = function (url) {
    if (UrlParser.IsLocalUrl(url))
    {
        return url.replace(window.location.protocol + "//" + window.location.hostname, "");
    }
    else
    {
        var link = document.createElement('a');
        link.href = url;
        return link.pathname;
    }
};

var UrlMatcher = UrlMatcher || {};
UrlMatcher.IsMatch = function (url1, url2) {
    if (!UrlParser.IsLocalUrl(url1) || !UrlParser.IsLocalUrl(url2)) {
        // it will never match if any one of the two are remote urls since we're no longer at the site
        return false;
    }
    var relUrl1 = UrlParser.TrimTrailingSlash(UrlParser.GetRelativePath(url1));
    var relUrl2 = UrlParser.TrimTrailingSlash(UrlParser.GetRelativePath(url2));
    if (relUrl1 == relUrl2)
        return true;
    return false;
};

var SecondaryNavHighlighter = SecondaryNavHighlighter || {};
// highlights secondary nav with selected class - this function is passed to an iterator .each
SecondaryNavHighlighter.HighlightLink = function () {
    var linkObject = $(this);
    var linkHref = linkObject.attr('href');
    if (UrlMatcher.IsMatch(linkHref, window.location.pathname))
    {
        linkObject.closest("li").attr("class", "selected");
    }
};


// parsers query string and returns value
var DWIC = DWIC || {};
DWIC.Utilities = DWIC.Utilities || {};
DWIC.Utilities.getQueryVariable = function (variable) {
	var query = window.location.search.substring(1);    
	var vars = query.split("&amp;");    
	for (var i=0;i<vars.length;i++) {      
		var pair = vars[i].split("=");      
		if (pair[0] == variable) {      
			return pair[1];    
		}  
	}  
	alert('Query Variable ' + variable + ' not found');
};
// for numeric entities, this decodes them
DWIC.Utilities.decodeNumericEntities = function(encodedMarkup) {
	var temp = document.createElement('textarea');
	temp.innerHTML = encodedMarkup;
	return temp.value;
};
// checks if the page is being browsed by a mobile
DWIC.Utilities.isMobile = function() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		 return true;
	}
	return false;	
};
// eg. DWIC.Utilities.addCSSRule(document.styleSheets[0],'header','float:left');
DWIC.Utilities.addCSSRule = function(sheet, selector, rules, index) {
	if (sheet.insertRule) {
		sheet.insertRule(selector + "{" + rules + "}", index);
	}
	else {
		sheet.addRule(selector,rules,index);
	}
};

DWIC.Utilities.addEvent = function(elem, type, eventHandle) {  
	if (elem == null || typeof(elem) == 'undefined') return;  
	if ( elem.addEventListener ) {  
		elem.addEventListener( type, eventHandle, false );  
	} else if ( elem.attachEvent ) {  
		elem.attachEvent( "on" + type, eventHandle );  
	} else {  
		elem["on"+type]=eventHandle;  
	}  
}; 

DWIC.Utilities.playPauseVideo = function (video,playButton) {
	playButton.addEventListener("click",function() {
		if (video.paused) {
			video.play();
			playButton.innerHTML = "<span class='icon-pause2'>Pause</span>";
		}
		else
		{
			video.pause();
			playButton.innerHTML = "<span class='icon-play3'>Play</span>";
		}
	})		
};

DWIC.Utilities.muteVideo = function (video,muteButton) {
	muteButton.addEventListener("click",function(){
		if (video.muted == false)
		{
			video.muted = true;
			muteButton.innerHTML = "<span class='icon-volume-mute'>Unmute</span>";
		}
		else {
			video.muted = false;
			muteButton.innerHTML = "<span class='icon-volume-mute2'>Mute</span>";
		}
	});
	
};

DWIC.Utilities.fullScreen = function (video,fullScreen) {
	fullScreen.addEventListener("click",function() {
		if (video.requestFullscreen) {
			video.requestFullscreen();
		} else if (video.mozRequestFullScreen) {
			video.mozRequestFullScreen(); // for Firefox
		} else if (video.webkitRequestFullscreen) {
			video.webkitRequestFullscreen(); // for Chrome and Safari
		}
	});
};

DWIC.Utilities.seekVideo = function(video,seekPosition) {
	seekPosition.addEventListener("change",function() {
		var time = video.duration * (seekPosition.value/100);
		video.currentTime = time;
	});
	video.addEventListener("timeupdate", function(){
		var value = (100/video.duration) * video.currentTime;
		seekPosition.value = value;
	});
	
	// when using the mouse to drag the slider, pause the video
	seekPosition.addEventListener("mousedown",function(){
		video.pause();
	});
	// play the video when the mouse button is released
	seekPosition.addEventListener("mouseup",function() {
		video.play();
	});
	
	// seek forward and backward 15 seconds
	seekPosition.addEventListener("keydown",function(event) {
		if (event.keyCode == 37 || event.keyCode == 39) {
			video.pause();
			if (event.keyCode == 39) {
				if (video.currentTime + 15 <= video.duration) {
					video.currentTime = video.currentTime + 15;
				}
				else
				{
					// fast forward to the end of the video if the increment is too large
					video.currentTime = video.duration;
				}
			}
			else if (event.keyCode == 37) {
				if (video.currentTime - 15 <= 0) {
					// go to the start of the video if the increment goes beyond the start
					video.currentTime = 0;	
				}
				else
				{
					video.currentTime = video.currentTime - 15;
				}
			}
		}
	});
	// unpause video when key released
	seekPosition.addEventListener("keyup", function(event) {
		if (event.keyCode == 37 || event.keyCode == 39) {
			video.play();
		}
	});
};


DWIC.Utilities.volumeControl = function(video,volume) {
	volume.addEventListener("change",function() {
		video.volume = volume.value;
	});
};

DWIC.Utilities.initVideo = function() {
	var video = document.getElementById("myVideo");
	var playButton = document.getElementById("playButton");
	var volume = document.getElementById("volume");
	var seekPosition = document.getElementById("position");
	var fullScreen = document.getElementById("fullScreen");
	var muteButton = document.getElementById("muteButton");
	// add event listeners
	DWIC.Utilities.playPauseVideo(video,playButton);
	DWIC.Utilities.muteVideo(video,muteButton);
	DWIC.Utilities.fullScreen(video,fullScreen);
	DWIC.Utilities.seekVideo(video,seekPosition);
	DWIC.Utilities.volumeControl(video,volume);
};

var vids = {}; 
	var vidObj = $('.vio-clearfix,.vioplayer-container[style],object[width],object param[name="flashvars"]'); 
	vids.initialWidth = $('.vioplayer-container[style],object[width],object param[name="flashvars"]').outerWidth(); 
	vids.initialHeight = $('.vioplayer-container[style],object[width],object param[name="flashvars"]').outerHeight(); 
	vids.initialWindowWidth = $(window).outerWidth(); 
	vids.initialWindowHeight = $(window).outerHeight(); 
	vids.widthRatio = vidObj.outerWidth()/vids.initialWindowWidth, 
	vids.heightRatio = vidObj.outerHeight()/vids.initialWindowHeight, 
	vids.vidRatio = vidObj.outerWidth()/vidObj.outerHeight();

DWIC.Utilities.adjustVideos = function () {  
 var videos = $('.vio-clearfix,.vioplayer-container[style],object[width],object param[name="flashvars"]'); 
 var winHeight = vids.initialWindowHeight, 
  winWidth = vids.initialWindowWidth; 
 var heightRatio = videos.outerHeight()/winHeight, 
  widthRatio = videos.outerWidth()/winWidth, 
  vidRatio = videos.outerWidth()/videos.outerHeight(); 
 //console.log(videos); 
 videos.each(function(){ 
  if ($(this).attr('style') != undefined) { 
   //console.log($(this)); 
   if ($(this).attr('style').indexOf('width') != -1) { 
	var wmatch = $(this).attr('style').match(/width:\s*([\d]*px);/); 
	if (wmatch && wmatch.length > 0) { 
	 //console.log(wmatch[1]); 
	 var newWidth = vids.widthRatio * $(window).outerWidth(); 
	 //console.log("newWidth:"+newWidth); 
	 var newStyle = $(this).attr('style').replace(/width:\s*([\d]*px);/,'width: '+newWidth+'px;'); 
	 //console.log("width newStyle:"+newStyle); 

	if($(this).hasClass('small-player') || $(this).attr('data-aspectratio') != undefined) {  
 		var newStyle = $(this).attr('style').replace(/width:\s*([\d]*px);/,'width: auto;');//+newWidth+'px;'); 
 	} 
	$(this).attr('style',newStyle); 
	} 
   } 
   if ($(this).attr('style').indexOf('height') != -1) { 
	var hmatch = $(this).attr('style').match(/height:\s*([\d]*px);/); 
	if (hmatch && hmatch.length > 0) { 
		//console.log(hmatch[1]); 
		var newWidth = vids.widthRatio * $(window).outerWidth(); 
	 	var newHeight = newWidth / vids.vidRatio; 
	 	//console.log("newHeight:"+newHeight); 
	 	var newStyle = $(this).attr('style').replace(/height:\s*([\d]*px);/,'height: auto;');//+newHeight+'px;'); 
	 	//console.log("height newStyle:"+newStyle); 
	 	$(this).attr('style',newStyle); 
	} 
   } 
   /// /height:\s*([\d]*px);/ 
  } 
	if ($(this).attr('width') != undefined) { 
		var newWidth = Math.ceil(vids.widthRatio * $(window).outerWidth()); 
		$(this).attr('width',newWidth); 
	} 


	if ($(this).attr('height') != undefined) { 
		var newWidth = Math.ceil(vids.widthRatio * $(window).outerWidth()); 
		var newHeight = Math.ceil(newWidth/vids.vidRatio); 
		$(this).attr('height','auto'); 
	} 
	
  if ($(this).attr('name') == 'flashvars') { 
   var flashvars = $(this).attr('value'); 
   var newWidth = Math.ceil(vids.widthRatio * $(window).outerWidth()); 
   flashvars = flashvars.replace(/playerWidth=(\d+)&/,'playerWidth='+newWidth+'&'); 
   var newHeight = Math.ceil(window.outerHeight / vids.vidRatio); 
   flashvars = flashvars.replace(/playerHeight=(\d+)&/,'playerHeight='+newHeight+'&'); 
   $(this).attr('value',flashvars); 
   //console.log('new flashvars: '+flashvars); 
  } 
 }); 
 //console.log(winHeight + ' ' + winWidth); 
}; 

/*
var myAppModule = null;
myAppModule = angular.module('newsList', []);	
myAppModule.directive('imgLoad',function() {
	return {
		restrict: 'A',
		link: function (scope,elem,attrs) {
			elem.on('load',function() {
				//console.log(scope.$parent.maxImgHeight + "," + $(this).height());
				if (scope.$parent.maxImgHeight < $(this).height()) {
					//console.log("updating height");
					scope.$parent.maxImgHeight = $(this).height();
					scope.$parent.maxImgHeightString = {height: scope.maxImgHeight + 'px'};
					scope.$parent.$apply();
					//console.log(scope);
				}
			});
		}
	}
});
myAppModule.directive('newsList',['$http',function($http) {
	return {
		restrict: 'A',
		replace:true,
		scope: {},  // Add this line to create an isolated scope
		templateUrl: '/_Master/JS/newsList.html',
		link: function (scope, element, attrs) {
		  "use strict";
		  scope.feedUrl = attrs.feedUrl;
		  scope.newsList = attrs.newsList;

			scope.selectedIndex = 0;
			scope.itemHovered = function ($index) { scope.selectedIndex = $index; }	

			
			var feedUrl = 'http://news.defence.gov.au/rssfeed/?url=http://'+scope.newsList+'&callback=JSON_CALLBACK';		
			$http.jsonp(feedUrl).
			success(function(data) {
				scope.data = data;
				var arrayLen = scope.data.item.length;
				for (var i=0;i<arrayLen;i++) {
					// decode description
					scope.data.item[i].description = DWIC.Utilities.decodeNumericEntities(scope.data.item[i].description);
					// get the first image
					var el = angular.element(scope.data.item[i].content);
					var images = el.find('img');
					if (images.length > 0) {
						if (!DWIC.Utilities.isMobile())
						{
							scope.data.item[i].image = angular.element(images[0]).attr('src');
							scope.data.item[i].imagealt = angular.element(images[0]).attr('alt');
						}
					}
				}

			}).
			error(function(data) {
				scope.data = "failed.";
			});
	  }
	};
}]);*/

// --------------- VIDEO CAROUSEL ---------------
// --------------------------------------------
function JsonCarousel(newReleasesUrl)
{
	$.ajax({
		   type: 'GET',
			url: newReleasesUrl,
			async: true,
			contentType: "application/json",
			dataType: 'jsonp'
		}).done(function(json){
			//console.dir(json);
			// should we be using a templating framework like KnockoutJS or AngularJs here rather than emitting HTML?
			// construct the markup for the slides
			var arrayLen = json['item'].length;
			//console.log("array len: "+arrayLen);
			var markupTest ='';
			for (var i=0; i<arrayLen;i++) {
				var currentItem = json['item'][i];
				//alert(playerID + currentItem.guid);
				//markupTest = currentItem.title;
				var titleString = currentItem.title;
			
				//titleString = titleString.substring(12,titleString.lenght);
				titleString = '<span class="icon-facebook2 floatLeft blackFont" style="font-size:1em;"></span> <span class="icon-twitter2 floatLeft blackFont" style="font-size:1em;"></span>' + titleString;
				markupTest = '<div>';
				markupTest += '<div id="ooyalaplayer'+currentItem.guid+'" style="height:260px;"></div>';
				markupTest += '<script>OO.ready(function() { OO.Player.create("ooyalaplayer'+currentItem.guid+'", "'+currentItem.guid+'"); });<\/script>';
				markupTest += '<h3 class="padding1 nomargin"><a href="http://video.defence.gov.au/play/'+currentItem.guid+'" title="'+currentItem.title+'">'+titleString+'</a></h3>';
				markupTest += '</div>';
				var currntItemLoop = "#slide"+(i+1);
				//alert(currntItemLoop);
				$(currntItemLoop).html(markupTest);					
			}
			// close list
			// append generated markup
		}).fail(function(e){
			console.log(e.message);
		}); 
	}
	
	
$(document).ready(function () {
    var currentUrl = window.location.pathname;
    var trimmedCurrentUrl = UrlParser.TrimTrailingSlash(currentUrl);
    if ($(".secondaryNav a").length > 0)
    {
        $(".secondaryNav a").each(SecondaryNavHighlighter.HighlightLink);
    }
	
	// 201403118 Chris - Added nyroModal
	var options = {}; // need to adjust the regex so image resizing happens
	options.imageRegex = '(\.fwx|[^\.]\.(jpg|jpeg|png|tiff|gif|bmp)\s*$)';
	$(".nyroModal").nyroModal(options);
});


// --------------- VIDEO CAROUSEL ---------------
// --------------------------------------------
function JsonCarousel11(newReleasesUrl)
{
	$.ajax({
		   type: 'GET',
			url: newReleasesUrl,
			async: true,
			contentType: "application/json",
			dataType: 'jsonp'
		}).done(function(json){
			//console.dir(json);
			// should we be using a templating framework like KnockoutJS or AngularJs here rather than emitting HTML?
			// construct the markup for the slides
			var arrayLen = json['item'].length;
			//console.log("array len: "+arrayLen);
			 var markupTest ='';
			for (var i=0; i<arrayLen;i++) {
				var currentItem = json['item'][i];
				//alert(playerID + currentItem.guid);
				//markupTest = currentItem.title;
				var titleString = currentItem.title;
			
				//titleString = titleString.substring(12,titleString.lenght);
				titleString = '<span class="icon-facebook2 floatLeft blackFont" style="font-size:1em;"></span> <span class="icon-twitter2 floatLeft blackFont" style="font-size:1em;"></span>' + titleString;
				markupTest = '<div>';
				markupTest += '<img id="abc'+currentItem.guid+'" style="height:260px;"></img>';
			 	markupTest += '<h3 class="padding1 nomargin"><a href="http://video.defence.gov.au/play/'+currentItem.guid+'" title="'+currentItem.title+'">'+titleString+'</a></h3>';
				markupTest += '</div>';
				var currntItemLoop = "#slide"+(i+1);
				//alert(currntItemLoop);
				$(currntItemLoop).html(markupTest);					
			}
			// close list
			// append generated markup
		}).fail(function(e){
			console.log(e.message);
		}); 
	}
	