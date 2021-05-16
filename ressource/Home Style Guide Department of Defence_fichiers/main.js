function beforePrint() { $(".tab-content").attr("style", "display:block"); $(".tab").removeAttr("style"); $(".ui-accordion-content").attr("style", "display:block"); $(".lt-ie9 .wrapper, .wrapper").css("width", "90%"); $(".lt-ie9 footer, .lt-ie9 footer>div").hide() } function afterPrint() { $(".ui-accordion-content").attr("style", "display:none"); $(".ui-accordion-content").first().attr("style", "display:block"); $(".lt-ie9 .wrapper").css("width", "100%").removeAttr("style"); $(".lt-ie9 footer, .lt-ie9 footer>div").show(); setupTabs() } $(document).ready(function (e) { var t = ""; t = ['<article class="content">', '<h3><a href="{link}" title="visit the news article">{title}</a></h3>', '<div class="row">', '<div class="col span_2_of_4 mobileHide">', '<figure class="imgCrop">', '<img src="{media:content[url]}" alt="" class="focusLeft scale"/>', "</figure>", "</div>", '<div class="col span_2_of_4">', "{description}", '<p class="alignRight padding1">', '<a href="{link}" class="button">More ', '<span class="visuallyhidden">About {title}</span>', "</a>", "</p>", "</div>", "</div>", "</article>"].join("\n"); t = ['<div class="slide">', '<a href="{link}" target="_blank">', '<img width="100%" src="{media:content[url]}"/>', "</a>", "</div>"].join("\n"); t = ['<div class="row padding1 content swipe-slide">', '<div class="col span_1_of_3 mobileHide"><img src="{media:content[url]}" alt="{title}" class="scale"/></div>', '<div class="col span_2_of_3">', '<h3><a href="{link}">{title}</a></h3>', "<div>{description}</div>", "</div>", "</div>"].join("\n"); t = ['<div class="slide">', '<a href="{link}" target="_blank">', '<span class="icon"></span>', '<img width="100%" src="{media:content[url]}"/>', "</a>", "<h3>{title}</h3>", "<div>{description}</div>", "</div>"].join("\n"); t = ['<div class="slide">', '<a href="{link}" target="_blank">', '<img width="100%" src="{media:content[url]}"/>', "</a>", "<h3>{title}</h3>", "<div>{description}</div>", "</div>"].join("\n"); t = ["<li>", '<a href="{link}" target="_blank">{title}</a>', "</li>"].join("\n"); if ($("#news_feed").length > 0) $("#news_feed").loadFeed("/_master/xml/ReleasesFeed.xml", t, 8); t = ["<li>", '<a href="{link}" target="_blank">{title}</a>', "</li>"].join("\n"); if ($("#clientSide").length > 0) $("#clientSide").loadFeed("/RSS/_master/xml/ReleasesFeed.xml", t, 8); t = ["<div>", '<figure class="alignCenter">', '<img src="{media:content[url]}" class="scale shadow whiteBorder" alt="{title}"/>', "</figure>", "<h3>{title}</h3>", "<p>{description}", '<a href="{link}">Read the full story</a>', "</p>", "</div>"].join("\n"); if ($(".carousel").length > 0) $(".carousel").carousel(); $(".touch .swipe").carousel({ slides: ".swipe-slide", nav: false, controls: false, info: false, autoplay: false }); $(".DITCCarousel").carousel({ slides: ".slide", nav: true, controls: true, info: true, autoplay: true, time: 5, speed: .5, keyboard: true }); setupTabs(); if ($(".mainNav li.level-1").length > 0) { var n = $(".mainNav li.level-1"), r = n.children("ul"); n.click(function (e) { var t = $(this).children("ul"); if (!e.target.href && e.target.nodeName.toLowerCase() == "span" && e.target.parentNode.nodeName.toLowerCase() == "a" && t.is(":hidden")) { r.not(t).hide(); t.toggle(); e.preventDefault() } }) } $(".mainNav a.level-1 span").equalHeight(); $(".subsiteNav > ul > li > a").equalHeight(); $(".callout").fixColumns(".col,.callout-link"); var i = null; $(".mainNav > ul >li").on("touchstart mouseenter", function (e) { if (i) { clearTimeout(i); i = null } var t = $(this); i = setTimeout(function (e) { t.find(".level-2").fadeIn({ duration: 300 }); t.children("a").addClass("touched") }, 300) }).on("touchend mouseleave", function (e) { if (i) { clearTimeout(i); i = null } $(this).find(".level-2").fadeOut({ duration: 300 }); $(this).closest(".level-1>a").removeClass("touched"); $(this).children("a").removeClass("touched") }); var s = ""; $("#global_nav #global_nav_home").on("touchstart", function (e) { var t = $(this).closest("li#global_nav_home").find("#global_nav_sitemap"); if (s === "") { e.preventDefault() } if (!t) { alert("flyout menu not found") } if (t && t.css("height") == "1px") { e.preventDefault() } else { if (!e.target.href) { $(this).removeClass("hovered") } else { if (s == "touchstart") { window.location.href = e.target.href } else { $(this).removeClass("hovered") } } } s = e.type }).on("mouseenter mouseleave", function (e) { $(this).toggleClass("hovered") }).on("click", function (e) { $(this).toggleClass("hovered") }); $(".lt-ie10 li.viewDesktop").hide() }); if ("onbeforeprint" in window) { $(window).on("beforeprint", beforePrint); $(window).on("afterprint", afterPrint) } else if ("matchMedia" in window) { window.matchMedia("print").addListener(function (e) { if (e.matches) { beforePrint() } else { $(document).one("mouseover", afterPrint) } }) }
$(function () { jQuery('nav.secondaryNav ul.accordion').accordion();});
$(function () {
$('.subNavAccordionMenu').accordion({ heightStyle: 'content', header: 'h3' });
    $('.subSubNavAccordionMenu').accordion({ heightStyle: 'content', header: 'h4' });
    $('.subNavAccordionMenu').accordion({ collapsible: true, active: 'none' });
    $('.subSubNavAccordionMenu').accordion({ collapsible: true, active: 'none' });
    
    var myFirstLevel = 0;
    var mySecondLevel = 0;
    var myLenghtCal = 0;
    var myInternalLenghtCal = 0;
    $('.subNavAccordionMenu h3').parent().each(function () {
        var lengthSelect = $(this).find('li.selected').length;
        var length = $(this).find('h4').parent().length;
        if (length >= 0) {
            mySecondLevel = 0;
            myLenghtCal += length;
            if (lengthSelect > 0) {
                myInternalLenghtCal += length;
                $('.subNavAccordionMenu').accordion({ active: parseInt(myFirstLevel) });
                $('.subSubNavAccordionMenu h4').parent().each(function () {
                    var lengthSecond = $(this).find('li.selected').length;
                    if (lengthSecond > 0) {
                       var putMeHere = (mySecondLevel + myInternalLenghtCal) - myLenghtCal;
                       //alert("correct pos:" + (putMeHere));
                       $('.subSubNavAccordionMenu').accordion({ active: parseInt(putMeHere) });
                    }
                    mySecondLevel += 1;
                });
            }
            myFirstLevel += 1;
        }
    });
});

$(function(){
        $('.subSubSubNavAccordionMenu h5 + div').slideUp();
        $('.subSubSubNavAccordionMenu li .selected').parent().parent().slideDown();
        $('.subSubSubNavAccordionMenu h5').addClass('ui-accordion-header ui-helper-reset ui-state-default ui-accordion-icons ui-accordion-header-active ui-state-active ui-corner-top').prepend('<span class="ui-accordion-header-icon ui-icon ui-icon-triangle-1-e"></span>');

        $('.subSubSubNavAccordionMenu h5 > a').click(function(e){

        	$('.subSubSubNavAccordionMenu h5 + div').not($(this).parent().next()).slideUp();
        	$(this).parent().next().slideToggle();
        	return false;
        });

        $(".accordion").accordion({ collapsible: true, heightStyle: "content", active: false });
    });

var warning = 'You are about to leave the Department of Defence\'s web site.\rThe Privacy and Copyright Policy of the site you are about to enter may not necessarily be the same as that of Defence.';

function MM_warningMsg() { //Displays link warning message
  alert(warning);
}


/*


    $('.webErrorModal').nyroModal();
    $('.websiteFeedback').nyroModal();
    $('.subNavAccordionMenu').accordion({ heightStyle: 'content', header: 'h3' });
    $('.subSubNavAccordionMenu').accordion({ heightStyle: 'content', header: 'h4' });

    var listItem1 = $("ul.subNavAccordionMenu .selected");
    var activeIndex1 = $("ul.subNavAccordionMenu > li").index(listItem1);
    if (activeIndex1 > -1) {
        $('.subNavAccordionMenu').accordion({ active: parseInt(activeIndex1) });
    }
    var setAtSubLevel = 0;

    var listItem = $("ul.subSubNavAccordionMenu ul .selected");
    var activeIndex = $("ul.subSubNavAccordionMenu ul > li").index(listItem);
    if (activeIndex > -1) {
        var b = 0;
        setAtSubLevel = 1;
        $('.subSubNavAccordionMenu ul').each(function () {
            var length = $(this).find('li.selected').length;
            if (length > 0) {

                $('.subSubNavAccordionMenu').accordion({ active: parseInt(b) });
            }
            b += 1;
        });
    }
    var listItemNew = $("ul.subNavAccordionMenu ul .selected");
    var activeIndexNew = $("ul.subNavAccordionMenu ul > li").index(listItemNew);
    if (activeIndexNew > -1 && setAtSubLevel == 0) {
        var b = 0;
        $('.subNavAccordionMenu ul').each(function () {
            var length = $(this).find('li.selected').length;
            if (length > 0) {
                $('.subNavAccordionMenu').accordion({ active: parseInt(b) });
            }
            b += 1;
        });
    }


*/
