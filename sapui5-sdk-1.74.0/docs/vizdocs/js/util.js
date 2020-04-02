// declaration of the module. Will ensure that the namespace 'util' exists.
jQuery.sap.declare("util");

// create the object of the module
util = {};

util.log = function(arg) {
    if (false) {
        console.log(arg);
    }
};
util.showLoading = function() {
    $(".circle").show();
    $("#loading").show();
}
util.hideLoading = function() {
    $(".circle").hide();
    $("#loading").hide();
}
util.loadPageWithCustomdata = function(customData, isPanel, queryStr) {
    if (customData.length > 0) {
        var customUrl;
        var showCode;
        var panel;
        var jsurl;
        if (isPanel) {
            //There is an unknown item in panel's customdata, skip it.
            customUrl = customData[1].getValue();
            showCode = customData[2].getValue();
            panel = customData[3].getValue();
            jsurl = customData[4].getValue();
        } else {
            customUrl = customData[0].getValue();
            showCode = customData[1].getValue();
            panel = customData[2].getValue();
            jsurl = customData[3].getValue();
        }
        if (showCode) {
            window._showCode = showCode;
            window._jsurl = jsurl;
            window._htmlurl = customUrl;
            window._panel = panel;
        }
        if (customUrl) {
            util.loadPageToIframe(queryStr ? customUrl + queryStr : customUrl);
            return true;
        }
    }
    return false;
};

util.hideSubMenuEpdIfrm = function() {
    if ($("#" + CONSTANT.HTZ_LO_SUBMENULAYER).height() === 0) {
        return;
    }
    $("#" + CONSTANT.HTZ_LO_SUBMENULAYER).animate({
        height: '0'
    }, 600, function() {
        var subMenu = document.getElementById(CONSTANT.HTZ_LO_SUBMENULAYER);
        subMenu.style.display = 'none';
    });
    // $('#'+CONSTANT.SCOLL_WRAPPER).animate({
    //     top: '50px'
    // }, 600, util.changeFilterTreeHeight);
};
util.showSubMenuNarIfrm = function() {
    if ($("#" + CONSTANT.HTZ_LO_SUBMENULAYER).height() > 0) {
        return;
    }
    var subMenu = document.getElementById(CONSTANT.HTZ_LO_SUBMENULAYER);
    subMenu.style.display = '';
    $("#" + CONSTANT.HTZ_LO_SUBMENULAYER).animate({
        height: '60px'
    }, 600);
    // $('#'+CONSTANT.SCOLL_WRAPPER).animate({
    //     top: '111px'
    // }, 600, util.changeFilterTreeHeight);
};
util.hideBtmEpdIfrm = function() {
    var btm = document.getElementById(CONSTANT.BOTTOMDIV);
    var contentViewController = sap.ui.getCore().byId(CONSTANT.CONTENTVIEW).oController;

    if (btm.style.bottom === '-28px') {
        return;
    }
    $(btm).animate({
        bottom: '-28px'
    }, 600);
    $("#splitterV").parent().animate({
        bottom: '0px'
    }, 600, function() {
        // Add setTimeout to execute function after animation finished a while.
        setTimeout(contentViewController.adjustFilterTreeSize, 200);
    });
};
util.showBtmClpsIfrm = function() {
    var btm = document.getElementById(CONSTANT.BOTTOMDIV);
    var contentViewController = sap.ui.getCore().byId(CONSTANT.CONTENTVIEW).oController;

    if (btm.style.bottom === '0px') {
        return;
    }
    $(btm).animate({
        bottom: '0px'
    }, 600);

    util.stopSrollListener();
    $("#splitterV").parent().animate({
        bottom: '26px'
    }, 600, function() {
        setTimeout(function() {
            var myFrame = document.getElementById(CONSTANT.IFRAME);
            var scrollHeight = $(myFrame.contentDocument.getElementsByTagName('html')).prop('scrollHeight');
            var divHeight = $(myFrame).height();
            var scrollerEndPoint = scrollHeight - divHeight;
            //$(myFrame.contentWindow).scrollTop(scrollerEndPoint);
            //$(myFrame.contentWindow.document.body).animate({'scrollTop':scrollerEndPoint}, 500);
            util.startSrollListener();
        }, 200);
        // Add setTimeout to execute function after animation finished a while.
        setTimeout(contentViewController.adjustFilterTreeSize, 200);
    });
};
util.stopSrollListener = function() {
    var myFrame = document.getElementById(CONSTANT.IFRAME);
    $(myFrame.contentWindow).off("scroll");
};
util.startSrollListener = function() {
    var myFrame = document.getElementById(CONSTANT.IFRAME);
    $(myFrame.contentWindow).scroll(function() {
        var scrollHeight = $(myFrame.contentDocument.getElementsByTagName('html')).prop('scrollHeight');
        var divHeight = $(myFrame).height();
        var scrollerEndPoint = scrollHeight - divHeight;
        var divScrollerTop = $(myFrame.contentWindow).scrollTop();
        //if ((1-divScrollerTop/scrollerEndPoint)<0.001) {
        if (scrollerEndPoint - divScrollerTop < 5) {
            util.showBtmClpsIfrm();
        } else if (divScrollerTop < 10) {
            util.hideBtmEpdIfrm();
        }
        // if (!window._singlePage) {
        //     if (scrollHeight - divHeight > 100 && divScrollerTop > 5) {
        //         util.hideSubMenuEpdIfrm();
        //     } else {
        //         util.showSubMenuNarIfrm();
        //     }
        // }
    });
};

util.loadPageToIframe = function(url) {
    var ifrm = document.getElementById(CONSTANT.IFRAME);
    if (!ifrm) {
        util.log(CONSTANT.IFRAME + " isn't found");
        return;
    }
    if (url) {
        window._loaded = false;
        setTimeout(function() {
            if (!window._loaded) {
                util.showLoading();
            }
        }, 1000);
        util.locReplace(ifrm, url);
        util.log("page: " + url + " is loaded");
    }
};
util.locReplace = function(iframe, url) {
    if (window._nav && /^((?!chrome).)*safari/i.test(navigator.userAgent)) {
        //location.replace doesn't work in iOS as other platform, special handle it,here.
        var a = iframe.contentWindow.location.pathname;
        var b = document.location.pathname;
        for (var i = 0; i < a.substring(b.length).split('/').length - 1; i++) {
            url = '../' + url;
        };
        iframe.contentWindow.location.replace(url);
        window._nav = false;
    } else {
        iframe.contentWindow.location.replace(url);
    }
};
util.getPageLength = function() {
    var myFrame = document.getElementById(CONSTANT.IFRAME);
    var scrollHeight = scrollHeight = $(myFrame.contentDocument.getElementsByTagName('html')).prop('scrollHeight');
    return scrollHeight;
};

util.createLabel = function(labelName, labelText, styleClassName) {
    var label = new sap.ui.commons.Label(labelName);
    label.setText(labelText);
    label.addStyleClass(styleClassName);
    return label;
};

util.IsValidMenu = function(menu) {
    for (var i = 0; i < window._menus.length; i++) {
        if (window._menus[i] === menu) {
            return true;
        }
    };
    return false;
};

//localhost:8080/#home?subtab=value1&treenode=value2.1/value2.2/value2.3&position=value3
util.analyseArgFromUrl = function(url) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g;
    var params = {};
    var match;
    while (match = regex.exec(url)) {
        params[match[1]] = match[2];
    }
    return params;
}

util.getDefaultPage = function(page) {
    if (!page) {
        return window._menus[0];
    }
    for (var i = 0; i < window._menus.length; i++) {
        if (window._menus[i] === page) {
            return page;
        }
    }
    return window._menus[0];
}

util.analyseUrl = function(url) {
    var params = {};
    var regexPage;
    var innerPageLoc;
    if (url.indexOf('/#') !== -1) { //original url has '/#'
        regexPage = /\/#([\w]+)[\?/]?/g;
        match = regexPage.exec(url);
        if (match && util.IsValidMenu(match[1])) {
            params.menu = match[1];
        } else {
            util.log("unrecognizable menu: " + match[1]);
            params.menu = util.getDefaultPage();
        }

        if (url.indexOf('/#' + params.menu) !== -1) {
            innerPageLoc = url.substring(url.indexOf('/#' + params.menu) + (2 + params.menu.length));
            if (innerPageLoc) {
                params.innerPageLoc = innerPageLoc;
            }
        }
    } else { //url from hyperlink has not '/#', special handler
        var origin = document.location.origin;
        if(!origin){
            origin = document.location.protocol + '//' + document.location.host;
             
        }
        var tmp = url.substring(origin.length);
        regexPage = /^\/([\w]+)[\?/]?/g;
        match = regexPage.exec(tmp);
        if (match && util.IsValidMenu(match[1])) {
            params.menu = match[1];
        } else {
            params.menu = util.getDefaultPage();
        }

        if (tmp.indexOf(params.menu) !== -1) {
            innerPageLoc = tmp.substring(tmp.indexOf(params.menu) + params.menu.length);
            if (innerPageLoc) {
                params.innerPageLoc = innerPageLoc;
            }
        }
    }
    return params;
};

util.analyseTreeNodeFromUrl = function(url) {
    var rslt = [];
    var treeString = '';
    if (!url) {
        return rslt;
    }
    //Remove query string
    if ((url.indexOf('/?') !== -1)) {
        treeString = url.substring(0, url.indexOf('/?'));
    } else {
        treeString = url;
    }

    var analyseTreeNode = function(str) {
        //Todo: do more check to the parse result.
        var regexTreeNode = /\/?([-%()&\w \.]+)/g;
        var paramsTreeNode = [];
        var matchTreeNode;
        while (matchTreeNode = regexTreeNode.exec(str)) {
            paramsTreeNode.push(matchTreeNode[1]);
        }
        return paramsTreeNode;
    };

    if (treeString) {
        return analyseTreeNode(treeString);
    }
    return rslt;
};

util.getQueryStringFromUrl = function(url) {
    var result = '';
    if (url && url.indexOf("/?") !== -1) {
        //"#" is necessary, otherwise page will not be loaded.
        result = "#" + url.substring(url.indexOf("/?"));
    }
    return result;
};

util.updateLocation = function(location) {
    if (!location) {
        return;
    }
    var href = document.location.href;
    var hash = document.location.hash;
    var baseUrl = href.substring(0, href.indexOf(hash));
    var newUrl = '';
    if (location.menu) {
        newUrl = baseUrl + '#' + location.menu + location.innerPageLoc;
    } else {
        newUrl = baseUrl + location;
    }
    newUrl = encodeURI(newUrl);
    history.pushState({}, "", newUrl);
};

util.getCurrentAddress = function() {
    return decodeURI(document.location.href);
};

util.addEvent = (function() {
    if (document.addEventListener) {
        return function(el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.addEventListener(type, fn, false);
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    util.addEvent(el[i], type, fn);
                }
            }
        };
    } else {
        return function(el, type, fn) {
            if (el && el.nodeName || el === window) {
                el.attachEvent('on' + type, function() {
                    return fn.call(el, window.event);
                });
            } else if (el && el.length) {
                for (var i = 0; i < el.length; i++) {
                    util.addEvent(el[i], type, fn);
                }
            }
        };
    }
})();

util.getUrlFromTreeNode = function(node) {
    var result = '';
    while (node.getId() !== CONSTANT.JS_FILTERTREE_VERTICALLAYOUT) {
        if (node.getText) {
            result = node.getText() + "/" + result;
        }
        node = node.getParent();
    }
    if (result.charAt(result.length - 1) === '/') {
        result = result.substr(0, result.length - 1);
    }
    return result;
};

//Load url stored in node and mark node as selected.
util.selectNode = function(node, isPanel, queryStr) {
    var urlTree = util.getUrlFromTreeNode(node);
    util.urlRecorder.recordUrl(urlTree, 2);
    var customData = node.getCustomData();
    var isLoaded = false;
    isLoaded = util.loadPageWithCustomdata(customData, isPanel, queryStr);
    if (isLoaded) {
        if (isPanel) {
            node.isSelected(true);
        } else {
            node.setIsSelected(true);
        }
    }
    return isLoaded;
};

util.isApple = function() {
    return navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i);
};

util.calSplitterPos = function() {
    //hidebutton's width and padding.
    return (22 + 17 + 22) / $(window).width() * 100;
};
//Change sap.viz.vizservices' headlien to 'VizFrame & Service API' and Merge the item with same headline.
util.mergeConfigData =  function(dt, treeData){
    if(dt&&dt.length){
        dt.forEach(function(item){
            if(item.headline === 'vizservices'){
                item.headline = 'VizFrame API';
            } else if(item.headline ==='vizframe' || item.headline === 'VizFrame Service API'){
                item.headline = 'VizFrame API';
            } else if (item.headline === "api") {
                item.headline = "Consumption API";
            } else if (item.headline === "extapi") {
                item.headline = "Extension API";
            } else if (item.headline === "controls") {
                item.headline = "VizContainer API";
            } else if (item.headline === "geo") {
                item.headline = "Geo Map API";
            }
            //special handler for 'env', which has a folder and element, combine them.
            if(item.headline==="Consumption API"){
                var a;
                var b ;
                for (var i = 0; i < item.pages[0].pages.length; i++) {
                    if(item.pages[0].pages[i].pages&&item.pages[0].pages[i].pages.length&&item.pages[0].pages[i].title==="env"){
                        a = i;
                    }else if(!item.pages[0].pages[i].pages&&item.pages[0].pages[i].title==="env"){
                        b = i;
                    }
                };
                if(a&&b){
                    item.pages[0].pages[a].url = item.pages[0].pages[b].url;
                    item.pages[0].pages.splice(b, 1);
                }
            }
        });
    }
    var newDt = [];
    for (var m = 0; m < dt.length; m++) {
        var bFound = false;
        for (var i = 0; i < treeData.length; i++) {
            for (var j = 0; j < treeData[i].length; j++) {
                if(treeData[i][j].headline == dt[m].headline){
                    bFound = true;
                    if(!treeData[i][j].pages){
                        treeData[i][j].pages = dt[m].pages;
                    }else{
                        dt[m].pages.forEach(function(item){
                            treeData[i][j].pages.push(item);
                        });
                    }
                    break;
                }
            };
            if(bFound){
                break;
            }
        };
        if(!bFound){
            newDt.push(dt[m]);
        }
    };
    if(newDt.length){
        treeData.push(newDt);
    }
};

window._switchPage = function(loc) {
    var evt = document.createEvent('Event');
    evt.initEvent('switchPage', true, true);
    var element = parent.parent.document.getElementById(CONSTANT.IFRAME); // $('#containerDiv') for parent
    if (loc.indexOf(" ") !== -1) {
        evt.location = loc;
    } else {
        evt.location = decodeURI(loc);
    }
    element.dispatchEvent(evt);
};

window._getIndexOfSelection = function() {
    if (window._urlRecord.length === 0) {
        return "";
    }
    var result = "";
    for (var i = 0; i < window._urlRecord.length; i++) {
        if (i <= 1) {
            result += window.util.urlRecorder.getTextByKey(window._urlRecord[i], i) + "/";
        } else {
            result += window._urlRecord[i] + "/";
        }
    }
    if (result.charAt(result.length - 1) === '/') {
        result = result.substr(0, result.length - 1);
    }
    return result;
};

/*  Url recorder records user's selection in menu, submenu and tree. this information is used to construct url.
    Menu is level 0, submenu is leve 1 and tree is level 2.
    Every click on the menu, submenu and tree should be recorded.
    input url in address bar and switch page from iframe page also need to record information.
*/
window._urlRecord = [];
util.urlRecorder = {};
util.urlRecorder.getTextByKey = function(key, level) {
    if (level < 0 || level > 1 || key === '') {
        util.log("input is wrong when calling util.urlRecorder.getTextByKey");
        return;
    }
    switch (level) {
        case 0:
            for (var i = 0; i < window._navItems.length; i++) {
                if (window._navItems[i]['key'] === key) {
                    return window._navItems[i]['text'];
                }
            };
            break;
        case 1:
            for (var i = 0; i < window._subMenuItems.length; i++) {
                if (window._subMenuItems[i]['key'] === key) {
                    return window._subMenuItems[i]['text'];
                }
            };
            break;
    }
    return "";
};
util.urlRecorder.recordUrl = function(record, level) {
    var getUrlByLevel = function(level) {
        if (window._urlRecord.length <= level) {
            util.log("level is too high, please check level");
            return;
        }
        var result = "#";
        for (var i = 0; i <= level; i++) {
            result += window._urlRecord[i] + "/";
        }
        return result;
    };
    if (window._urlRecord.length < level) {
        util.log("level is too high, please check some level is not recorded");
        return;
    }
    if (level === window._urlRecord.length) {
        window._urlRecord.push(record);
    } else {
        window._urlRecord.splice(level, window._urlRecord.length - level);
        window._urlRecord.push(record);
    }
    return getUrlByLevel(level);
};