
var active_phase = "";

$(document).ready(function () {
  jqueryFncOverrides();

  // redirect root to en
  // if((window.location.href.indexOf("www.hsbcaddev") >= 0 ||
  // window.location.href.indexOf("https://hsbcaddev") >= 0) &&
  // window.location.href.indexOf("dashboard.weglot.com") < 0 &&
  // window.location.href.indexOf("?edit") < 0){
  // 	window.location.replace('https://en.hsbcaddev.com');
  // }

  // REMOVE ATTR IMGSRC THING FOR WEGLOT IMAGES

  // REMOVE WEBFLOW CONDITIONAL INVISIBLE ELEMENTS
  $(".w-condition-invisible").remove();

  // LANGUAGE REDIRECT
  // var userLang = navigator.language || navigator.userLanguage;
  // if(userLang.indexOf('de') >= 0 && window.location.href.indexOf('//de.') <= 0){
  // 	window.location.replace('https://de.hsbcad.com');
  // }

  // GENERAL
	indentHack()
  active_phase = $("body").attr("data-active-phase");
  initUnreleasedToolsets();

  $(".hide").hide();
  $(".popup").hide();
  $("body.colored-header .main-menu").addClass("alpha");
  $(window).scroll(scrollTriggers);
  setPhaseNav();

  // DIRECT LINK POPUPS
  if (window.location.href.indexOf("popup") >= 0) {
    directLinkPopup();
  }

  // MENU
  $(".btn-toggle-menu").click(toggleMobileMenu);
  $(".main-menu").mouseover(mainMenuHover);
  $(".main-menu").mouseout(mainMenuAlphaIfNeeded);
  $(".li-menu.solutions").mouseover(submenuSolutionsStickyOff);
  $(".li-menu.solutions").mouseout(submenuSolutionsSmallBanner);

  // MENU MOBILE
  $(".li-menu.has-submenu .link-menu").click(toggleSubmenu);

  // TOOLSET PAGE
  initSolutionPage();
  $(".li-tool").first().addClass("active");
  $(".li-tool.tool-thumb-detail").first().addClass("active");
  $(".tool-features-container").first().removeClass("active");
  $(".li-tool.tool-thumb-detail").click(tabTool);
  $(".li-tool").mouseover(toolHover);
  $(".li-tool").mouseout(toolHoverOut);
  $(".tool-images-list").click(toolsetCarousselPopup);
  $("body").on("click", ".prev-toolset-photo", prevToolsetPhoto);
  $("body").on("click", ".next-toolset-photo", nextToolsetPhoto);
  if (urlParam("toolset") != undefined) {
    toolsetOnLoad(urlParam("toolset"));
  }

  // HOME
  $(".toolset-tools .li-tool").click(homeToolsetClicked);

  // FORMS
  $(".txt-input").focus(focusInInput);
  $(".txt-input").focusout(focusOutInput);
  $(".chk-interest").change(interestChkChanged);

  // POPUP GENERAL
  $(".btn-popup").click(openPopup);
  $(".btn-close-popup").click(closePopup);

  // CASES
  const viewCase = () => {
    const tiles = document.querySelectorAll(".case-tile");

    tiles.forEach((tile) => {
        tile.addEventListener("click", () => {
            tile.querySelector(".popup").style.display = "flex";
            console.log(tile.querySelector(".btn-close-case-popup"));
            lockPageScroll();
        });

        tile.querySelector(".btn-close-case-popup").addEventListener("click", () => {
            console.log("ja, sluit");
            tile.querySelector(".popup").style.display = "none";
            unLockPageScroll();
        });
    });
  };

  viewCase();

  const observer = new MutationObserver(() => {
    viewCase();
  });

  observer.observe(document.querySelector(".collection-list"), {
    attributes: true,
    childList: true
  });

//   $("body").on("click", ".btn-close-case-popup", closeCasePopup);
  $("body").on("click", ".prev-case-photo", prevCasePhoto);
  $("body").on("click", ".next-case-photo", nextCasePhoto);

  // CONTACT
  initContact();
  $(".chk-interest.solution").change(chkInterestChanged);
});

function directLinkPopup() {
  var popup = urlParam("popup");

  if (popup == "pp") {
    $("#popup-privacy").show();
    lockPageScroll();
  }
}

function interestChkChanged() {
  cl("chk changed");
  if ($(this).is(":checked")) {
    $(this).val("block");
  } else {
    $(this).val("none");
  }
}

function initSolutionPage() {
  $(".tool-features-container").removeClass("visible");
  $(".tool-features-container:first-of-type").addClass("visible");
}

function initUnreleasedToolsets() {
  $(".ts-set-release-note").each(function () {
    cl("unreleased");
    if ($(this).text() != "") {
      $(this).closest(".li-tool").addClass("unreleased");
    }
  });
}

function chkInterestChanged() {
  var cat = $(this).attr("data-category");
  $(".interest-sublist." + cat + " .chk-toolset").prop("checked", false);
  $(".interest-sublist." + cat).toggle();
}

function initContact() {
  var tsname;
  $(".contact-interest-chk-container.chk-toolset").each(function () {
    tsname = $(this).children(".chk-interest-label").html();
    $(this).children(".chk-toolset").attr("name", tsname);
    $(this).children(".chk-toolset").attr("id", tsname);
    $(this).children(".chk-toolset").attr("data-name", tsname);
  });
}

function homeToolsetClicked() {
  var parent_solution_slug = $(this).attr("data-parent-solution-slug");
  var toolset = $(this).children(".tool-name").text();
  var released = $(this).find(".ts-set-release-note").text() == "";
	
  if (released) {
    self.location = "/solutions/" + parent_solution_slug + "/?toolset=" + toolset;
  }
}

function toolsetCarousselPopup() {
  var images = $(this).children(".toolset-caroussel-image").clone();
  $(".popup-toolset-caroussel .toolset-photos-list").html(images);
  $(
    ".popup-toolset-caroussel .toolset-photos-list .toolset-caroussel-image"
  ).removeClass("thumb");

  // hide buttons if 1 photo
  if (images.length < 2) {
    $(".prev-toolset-photo, .next-toolset-photo").hide();
  } else if (!isMobile) {
    $(".prev-toolset-photo, .next-toolset-photo").show();
  }

  $(".popup-toolset-caroussel").show();
}

function prevToolsetPhoto() {
  var prev = $(this)
    .siblings(".toolset-photos-list")
    .find(".toolset-caroussel-image")
    .first();
  $(prev).parent().append(prev);

  cl("prev");
}

function nextToolsetPhoto() {
  var current = $(this)
    .siblings(".toolset-photos-list")
    .find(".toolset-caroussel-image")
    .last();
  $(current).parent().prepend(current);

  cl("next");
}

function mainMenuHover() {
  $(".main-menu").removeClass("alpha");
}

function mainMenuHoverOut() {
  $("body.colored-header .main-menu").addClass("alpha");
}

function mobileMenuIsOpen() {
  return $(".main-menu").hasClass("mobile-open");
}

function toggleMobileMenu() {
  $(".main-menu").removeClass("alpha");
  if (mobileMenuIsOpen()) {
    mainMenuAlphaIfNeeded();
    unLockPageScroll();
  } else {
    lockPageScroll();
    submenuSolutionsStickyOff();
  }

  $(".main-menu").toggleClass("mobile-open");
  $(".btn-toggle-menu").toggleClass("close");
}

function mainMenuAlphaIfNeeded() {
  var scroll = $(window).scrollTop();
  var height_header = $(".section-header").height();

  if (scroll < height_header) {
    $("body.colored-header .main-menu").addClass("alpha");
  }
}

function toggleSubmenu() {
  $(".submenu").hide();
  $(this).siblings(".submenu").toggle();
}

function setPhaseNav() {
  if (active_phase != "undefined" && active_phase != "") {
    $(".list-phase-tile-nav .tilenav-li.phase" + active_phase).addClass(
      "active"
    );
  }
}

function toolHover() {
  $(this).children(".tool-hover").show();
}

function toolHoverOut() {
  $(this).children(".tool-hover").hide();
}

function focusInInput() {
  cl($(this).val());
  $(this).siblings(".txt-ph").addClass("active");
}

function focusOutInput() {
  cl($(this).val());
  if ($(this).val() == "") {
    $(this).siblings(".txt-ph").removeClass("active");
  }
}

function prevCasePhoto() {
  var prev = $(this)
    .siblings(".case-photos-list")
    .find(".case-photo-li")
    .first();
  $(prev).parent().append(prev);

  cl("prev");
}

function nextCasePhoto() {
  var current = $(this)
    .siblings(".case-photos-list")
    .find(".case-photo-li")
    .last();
  $(current).parent().prepend(current);

  cl("next");
}

function openPopup() {
  cl("open popup");
  var popup_id = $(this).attr("data-popup-id");
  $("#" + popup_id).show();

  lockPageScroll();
}

function closePopup() {
  $(this).closest(".popup").hide();
  unLockPageScroll();
}

function closeCasePopup() {
  $("body .popup").first().remove();
  unLockPageScroll();
}

function openCase() {
  // move popup up the dom
  $(this).children(".popup").first().show();
  lockPageScroll();
}

function toolsetOnLoad(toolname) {
  toolname = decodeURIComponent(toolname);

  $(".li-tool").removeClass("active");
  $(".tool-name:contains('" + toolname + "')")
    .closest(".li-tool")
    .addClass("active");
  $(".tool-features-container").css("display", "none").removeClass("visible");
  $(".tool-detail-name:contains('" + toolname + "')")
    .closest(".tool-features-container")
    .addClass("visible");

  scrollToPos("#section-toolsets");
}

function tabTool() {
  if ($(this).hasClass("unreleased")) return false;

  var clickedToolName = $(this).children(".tool-name").text();
  $(".li-tool").removeClass("active");
  $(this).addClass("active");

  // important to add 'display none' to have only the first item visible in Designer
  $(".tool-features-container").css("display", "none").removeClass("visible");
  $(".tool-detail-name:contains('" + clickedToolName + "')")
    .closest(".tool-features-container")
    .addClass("visible");

  // scroll to tool top
  if (isMobile()) {
    var elem = $(".tool-detail-name:contains('" + clickedToolName + "')");

    $([document.documentElement, document.body]).animate(
      {
        scrollTop: elem.offset().top - 680,
      },
      1000
    );
  }
}

function submenuSolutionsStickyOn() {
  $(".submenu-solutions, .submenu-solutions .submenu-li").addClass("sticky");
  $(".submenu-solutions .submenu-li.phase" + active_phase).addClass("active");
}

function submenuSolutionsStickyOff() {
  $(".submenu-solutions, .submenu-solutions .submenu-li").removeClass("sticky");
  $(".submenu-solutions .submenu-li.phase" + active_phase).removeClass(
    "active"
  );
}

function submenuSolutionsSmallBanner(activate) {
  var scroll = $(window).scrollTop();
  var height_header = $(".section-header").height();

  if (activate && active_phase && scroll >= height_header) {
    submenuSolutionsStickyOn();
  } else if (activate === false) {
    submenuSolutionsStickyOff();
  }
}

function indentHack(){
	// get the li items
  const listItems = $('li');
  // for each li item
  listItems.each(function(index, item){
    // check for '~' character
    // it's recommended to start with the deepest level of sub bullet
    // to ensure only the relevant classes are applied

    // if the li item text starts with '~~'
    if($(item).text().startsWith('~~')){
      // run indentText() function
      indentText(this, 'hack20-sub-bullet-2');
    }	// else if the li item starts with '~'
    else if($(item).text().startsWith('~')){
      // run indentText() function
      indentText(this, 'hack20-sub-bullet');
    }
  });
}

// indentText function
function indentText(li, className){
	// add relevant className to li item
	// if the li item text starts with '~~' add the sub-bullet-2 class
	// else if the li item starts with '~' add the sub-bullet class
	$(li).addClass(className);
	// remove the '~' from the li items
	// the regex /~+/g
	// matches any one or more ~ characters
	const reformatedText = $(li).html().replace(/~+/g,'');
	// replace the li item's html text that has ~ tags
	// with the new text that removed the ~ character(s)
	$(li).html(reformatedText);
}

function scrollTriggers() {
  var scroll = $(window).scrollTop();

  // MAIN MENU BEHAVIOUR
  //var height_header = $('.section-header').height();
  var filledMenuBgHeight = 20;
  if (scroll >= filledMenuBgHeight) {
    $(".main-menu").removeClass("alpha");

    // SOLUTIONS STICKY SUBMENU
    submenuSolutionsSmallBanner(true);
  } else if (scroll < filledMenuBgHeight) {
    mainMenuAlphaIfNeeded();
    submenuSolutionsSmallBanner(false);
  }
}

function unLockPageScroll() {
  $("html").css("overflow", "scroll");
}

function lockPageScroll() {
  $("html").css("overflow", "hidden");
}

function scrollToPos(elem) {
  var header_offset = $(".main-menu").height();
  $([document.documentElement, document.body]).animate(
    {
      scrollTop: $(elem).offset().top - header_offset,
    },
    2000
  );
}

function urlParam(name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  } else {
    return results[1] || 0;
  }
}

function jqueryFncOverrides() {
  jQuery.expr[":"].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
  };
}

function isMobile() {
  // device detection
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  ) {
    return true;
  }
  return false;
}

function cl(mssg) {
  console.log(mssg);
}