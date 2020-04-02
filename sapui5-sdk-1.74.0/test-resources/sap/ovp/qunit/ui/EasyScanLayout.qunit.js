sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "sap/ui/thirdparty/jquery",
    "sap/ovp/cards/CommonUtils",
    "/sap/ovp/ui/EasyScanLayout",
    "/sap/ovp/ui/CustomData",
    "sap/ui/events/KeyCodes"
],function (utils, mockservers, jQuery, CommonUtils, EasyScanLayout, CustomData, Keycodes) {
    "use strict";
    /* module, ok, test, jQuery, sap */
    //jQuery.sap.require("EasyScanLayout");
    //jQuery.sap.require("CustomData");

    module("EasyScanLayout", {
        /**
         * This method is called before each test
         */
        setup: function () {
            if (!this.easyScanLayout) {
                this.easyScanLayout = new EasyScanLayout;
            }
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
        }
    });

    test("Constructor Test", function () {
        ok(this.easyScanLayout.columnCount === 1 , "initial column count is 1");
    });

    test("5 Resolutions Media Listeners Test", function () {
        //IE version 9 or less doesn't support the current test
        if (!(sap.ui.Device.browser.msie && sap.ui.Device.browser.version > 9)) {
            ok("IE version 9");
            return;
        }

        var columnResolutionList = [
            {minWidth: 0, styleClass: "columns-block", columnCount: 1},
            {minWidth: 768, styleClass: "columns-narrow", columnCount: 2},
            {minWidth: 900, styleClass: "columns-wide", columnCount: 2},
            {minWidth: 1024, styleClass: "columns-narrow", columnCount: 3},
            {minWidth: 1440, styleClass: "columns-wide", columnCount: 3}
        ]
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);

        ok(/(max-width: *767px)/.test(mediaListeners[0].media), "Test 1 bounds top");
        ok(/(min-width: *0px)/.test(mediaListeners[0].media), "Test 1 bounds bottom");
        ok(mediaListeners[0].media.indexOf("and") !== -1, "Test lower 1 condition");
        ok(/(max-width: *899px)/.test(mediaListeners[1].media), "Test 2 bounds top");
        ok(/(min-width: *768px)/.test(mediaListeners[1].media), "Test 2 bounds bottom");
        ok(mediaListeners[1].media.indexOf("and") !== -1, "Test lower 2 condition");
        ok(/(max-width: *1023px)/.test(mediaListeners[2].media), "Test 3 bounds top");
        ok(/(min-width: *900px)/.test(mediaListeners[2].media), "Test 3 bounds bottom");
        ok(mediaListeners[2].media.indexOf("and") !== -1, "Test lower 3 condition");
        ok(/(max-width: *1439px)/.test(mediaListeners[3].media), "Test 4 bounds top");
        ok(/(min-width: *1024px)/.test(mediaListeners[3].media), "Test 4 bounds bottom");
        ok(mediaListeners[3].media.indexOf("and") !== -1, "Test lower 4 condition");
        ok(/(min-width: *1440px)/.test(mediaListeners[4].media), "Test 5 bounds bottom");
    });

    test("ResizeHandler Test", function () {
        var columnResolutionList = [];
        var resizeHandlerId = this.easyScanLayout.initResizeHandler(columnResolutionList);
        ok(resizeHandlerId.indexOf("rs") !== -1, "Test ResizeHandler Id");
    });

    test("1 Resolutions Media Listeners Test", function () {
        //IE version 9 or less doesn't support the current test
        if (!(sap.ui.Device.browser.msie && sap.ui.Device.browser.version > 9)) {
            ok("IE version 9");
            return;
        }
        var columnResolutionList = [{minWidth: 768, styleClass: "columns-narrow", columnCount: 2}];
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);
        ok(/(min-width: *768px)/.test(mediaListeners[0].media), "Test max bounds");
    });

    test("0 Resolutions Media Listeners Test", function () {
        var columnResolutionList = [];
        var mediaListeners = this.easyScanLayout.initMediaListeners(columnResolutionList);
        ok(mediaListeners.length ===  0, "Test no bounds");
    });

    /*test("EasyScan Layout - Screen Reader attributes", function () {
        var btn = new sap.m.Button("btnId");
        btn.addCustomData(new CustomData({key:"role", value:"heading", writeToDom:true}));
        btn.addCustomData(new CustomData({key:"aria-label", value:"test", writeToDom:true}));
        var easyScan = new EasyScanLayout();
        easyScan.removeStyleClass("columns-blank");
        easyScan.addStyleClass("columns-block");
        easyScan.columnStyle = "columns-block";
        easyScan.addAggregation("content", btn);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        stop();
        easyScan.onAfterRendering = function () {

            var easyScanCol = testContainer.find(".easyScanLayoutColumn");
            var easyScanItem = testContainer.find(".easyScanLayoutItemWrapper");
            easyScanAfterRender();

            //Create and trigger focus on qunit
            var focusEvent = jQuery.Event("focus"),
                    jqItem = jQuery(easyScanItem);
            jqItem.trigger(focusEvent);

            <!-- Commented the following line as role=listitem is removed from the cards. See internal incident with ID: 1680054459  -->
            <!-- ok(easyScanItem.attr("role") == "listitem", "item role is define") -->
            ok(easyScanItem.attr("aria-setsize") == 1, "item size role is define");
            ok(easyScanItem.attr("aria-posinset") == 1, "item position is define");
            ok(easyScanItem.attr("aria-labelledby").indexOf("btnId") !== "-1", "attribute labelledby is define");
            ok(testContainer.find('.sapUshellEasyScanLayoutInner').attr("role") === "list", "list role is defined for the container");
            start();
            easyScan.destroy();
        }

        easyScan.placeAt('testContainer');
    });*/

    test("EasyScan Layout - disable drag and drop", function () {
        var easyScan = new EasyScanLayout({dragAndDropEnabled : false});
        easyScan.onAfterRendering();
        ok(easyScan.layoutDragAndDrop === undefined);
    });

    test("EasyScan Layout - Key Handle", function () {

        var btn = new sap.m.Button("btnId1");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        stop();
        easyScan.onAfterRendering = function () {
            start();
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;

            var keysHandlerStub = sinon.stub(keyboardNavigation, "tabButtonHandler");
            var event = {"keyCode": 9}; //TAB
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "tabButtonHandler was called once after pressing tab");

            keysHandlerStub = sinon.stub(keyboardNavigation, "shiftTabButtonHandler");
            event.shiftKey = true;
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "shiftTabButtonHandler was called once after pressing shift + tab");

            event.shiftKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "f7Handler");
            event.keyCode = 118; //F7
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "f7Handler was called once after pressing F7");

            keysHandlerStub = sinon.stub(keyboardNavigation, "arrowUpDownHandler");
            event.keyCode = 38; //Arrow UP
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "arrowUpDownHandler was called once after pressing arrow up");

            event.keyCode = 40; //Arrow DOWN
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledTwice, "arrowUpDownHandler was called once after pressing arrow down");

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlArrowHandler");
            event.ctrlKey = true;
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "ctrlArrowHandler was called once after pressing arrow down + ctrl");

            event.keyCode = 38; //Arrow UP
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledTwice, "ctrlArrowHandler was called once after pressing arrow up + ctrl");

            event.keyCode = 37; //Arrow LEFT
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledThrice, "ctrlArrowHandler was called once after pressing arrow left + ctrl");

            event.keyCode = 39; //Arrow RIGHT
            keyboardNavigation.keydownHandler(event);
            sinon.assert.callCount(keysHandlerStub, 4, "ctrlArrowHandler was called once after pressing arrow right + ctrl");

            event.ctrlKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "arrowRightLeftHandler");
            event.keyCode = 39; //Arrow RIGHT
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "arrowRightLeftHandler was called once after pressing arrow right");

            event.keyCode = 37; //Arrow LEFT
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledTwice, "arrowRightLeftHandler was called once after pressing arrow left");

            keysHandlerStub = sinon.stub(keyboardNavigation, "altPageUpAndHomeHandler");
            event.keyCode = 36; //Home
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "altPageUpAndHomeHandler was called once after pressing home button");
            event.keyCode = 33; //Page Up
            event.altKey = true;
            ok(keysHandlerStub.calledOnce, "altPageUpAndHomeHandler was called once after pressing pageup button");

            keysHandlerStub = sinon.stub(keyboardNavigation, "altPageDownAndEndHandler");
            event.keyCode = 35; //End
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "altPageDownAndEndHandler was called once after pressing end button");
            event.keyCode = 34; //Page Down
            event.altKey = true;
            ok(keysHandlerStub.calledOnce, "altPageDownAndEndHandler was called once after pressing pagedown button");

            event.altKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlHomeHandler");
            event.keyCode = 36; //Home
            event.ctrlKey = true;
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "ctrlHomeHandler was called once after pressing ctrl + home");

            keysHandlerStub = sinon.stub(keyboardNavigation, "ctrlEndHandler");
            event.keyCode = 35; //End
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "ctrlEndHandler was called once after pressing ctrl + end");

            event.ctrlKey = false;

            keysHandlerStub = sinon.stub(keyboardNavigation, "pageUpDownHandler");
            event.keyCode = 33; //Page Up
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledOnce, "pageUpDownHandler was called once after pressing page up");

            event.keyCode = 34; //Page Down
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledTwice, "pageUpDownHandler was called once after pressing page down");

            keysHandlerStub = sinon.stub(keyboardNavigation, "spacebarHandler");
            event.keyCode = 32; //Spacebar
            keyboardNavigation.keyupHandler(event);
            ok(keysHandlerStub.calledOnce, "spacebarHandler was called once after pressing spacebar");

            event.keyCode = 13; //enter
            keyboardNavigation.keydownHandler(event);
            ok(keysHandlerStub.calledTwice, "spacebarHandler was called once after pressing enter");

            easyScan.destroy();

        };
        easyScan.placeAt('testContainer');

    });

    test("EasyScan Layout - Ctrl-Arrow D&D Handle", function () {

        var btn = new sap.m.Button("btnId1");
        var btn25 = new sap.m.Button("btnId25");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn);
        easyScan.addAggregation("content", btn25);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        stop();
        easyScan.onAfterRendering = function () {
            start();
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;
            var event = {keyCode: null, ctrlKey: true, preventDefault: function(){}};
            event.preventDefault = function () {};

            event.keyCode = Keycodes.ARROW_RIGHT;
            keyboardNavigation.keydownHandler(event);
            event.keyCode = Keycodes.END;
            keyboardNavigation.keydownHandler(event);
            ok(easyScan.$().find(".easyScanLayoutItemWrapper:first").is(btn.$().parent()), "First item should not move");
            ok(setTimeout(function() { (jQuery(document.activeElement).index()) ==  1}, 500), "Focus stay on second item");

            event.ctrlKey = true;
            event.keyCode = Keycodes.ARROW_LEFT;
            keyboardNavigation.keydownHandler(event);
            ok(setTimeout(function() {btn25.$().parent().hasClass("dragHovered")},500) , "Second item is marked as dragged");
            ok(setTimeout(function() {(jQuery(document.activeElement).index()) == 0}, 500), "Focus move to first item");

            event.ctrlKey = false;
            event.keyCode = Keycodes.CONTROL;
            keyboardNavigation.keyupHandler(event);
            ok(setTimeout(function() {easyScan.$().find(".easyScanLayoutItemWrapper:first").is(btn25.$().parent())}, 500), "Second item was moved to first position");
            ok(setTimeout(function() {(jQuery(document.activeElement).index()) == 0}, 500), "Focus is on first item");

            ok(!btn25.$().parent().hasClass("dragHovered"), "Item is not marked as dragged");
            easyScan.destroy();

        };
        easyScan.placeAt('testContainer');

    });

    test("EasyScan Layout - F6,F7 Handle", function () {
        var btn = new sap.m.Button("btnId1");
        btn.addCustomData(new CustomData({
            key: "tabindex",
            value: "0",
            writeToDom: true
        }));

        var vBox = new sap.m.VBox({items: [btn]});
        var easyScan = new EasyScanLayout();
        easyScan.removeStyleClass("columns-blank");
        easyScan.addStyleClass("columns-block");
        easyScan.columnStyle = "columns-block";
        easyScan.addAggregation("content", vBox);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);
        stop();
        easyScan.onAfterRendering = function () {
            start();
            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;
            var event = {keyCode: null, preventDefault: function(){}};
            event.preventDefault = function () {};
            event.keyCode = Keycodes.F6;
            keyboardNavigation.keydownHandler(event);
            ok(jQuery(document.activeElement).hasClass("after"), "after element received focus");
            keyboardNavigation._ignoreSelfFocus = true;
            keyboardNavigation.afterFocusHandler();
            ok(jQuery(document.activeElement).hasClass("after"), "focus stayed on after element");
            keyboardNavigation.afterFocusHandler();
            ok(!jQuery(document.activeElement).hasClass("after"), "focus moved from after element");

            event.shiftKey = true;
            keyboardNavigation.keydownHandler(event);
            ok(jQuery(document.activeElement).is(easyScan.$().children().first()), "focus moved to layout");

            vBox.$().parent().focus();
            event.keyCode = Keycodes.F7;
            event.shiftKey = false;
            keyboardNavigation.keydownHandler(event);
            ok(jQuery(document.activeElement).is(btn.$()), "focus on internal button");
            keyboardNavigation.keydownHandler(event);
            ok(jQuery(document.activeElement).is(vBox.$().parent()), "focus on item");


            btn.$().focus();
            keyboardNavigation._ignoreSelfFocus = true;
            keyboardNavigation.layoutFocusHandler();
            ok(jQuery(document.activeElement).is(btn.$()), "focus does not changed");
            keyboardNavigation.layoutFocusHandler();
            ok(jQuery(document.activeElement).is(vBox.$().parent()), "focus changed to first item");

            keyboardNavigation.destroy();
            ok(!keyboardNavigation.jqElement, "keyboardNavigation jqElement deleted");
            ok(!keyboardNavigation.jqElement, "keyboardNavigation easyScanLayout deleted");
            easyScan.destroy();

            easyScan.destroy();
        };
        easyScan.placeAt('testContainer');

    });


    test("EasyScan Layout - tabIndex check", function () {
        var btn1 = new sap.m.Button("btnId1");
        var btn2 = new sap.m.Button("btnId2");
        var btn3 = new sap.m.Button("btnId3");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn1);
        easyScan.addAggregation("content", btn2);
        easyScan.addAggregation("content", btn3);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);

        stop();
        easyScan.onAfterRendering = function () {
            start();

            easyScanAfterRender();

            var easyScanItems = jQuery(".easyScanLayoutItemWrapper");

            ok(easyScanItems[0].getAttribute("tabindex") == 0, "tabindex value of the first item in the layout is '0'");

            //all other "tabindex" attributes value is "-1"
            ok(easyScanItems[1].getAttribute("tabindex") == -1, "tabindex value of the second item in the layout is '-1'");
            ok(easyScanItems[2].getAttribute("tabindex") == -1, "tabindex value of the third item in the layout is '-1'");
            easyScan.destroy();
        }
        easyScan.placeAt('testContainer');
    });

    test("EasyScan Layout - KBN focus change check", function () {

        var btn1 = new sap.m.Button("btnId1");
        btn1.addCustomData(new CustomData({key:"tabindex", value:"0", writeToDom:true}));

        var vbox1 = new sap.m.VBox({items: [btn1]});
        var vbox2= new sap.m.VBox({items: [ new sap.m.Button("btnId2")]});
        var vbox3 = new sap.m.VBox({items: [ new sap.m.Button("btnId3")]});
        var vbox4= new sap.m.VBox({items: [ new sap.m.Button("btnId4")]});
        var vbox5 = new sap.m.VBox({items: [ new sap.m.Button("btnId5")]});

        var easyScan = new EasyScanLayout();
        easyScan.removeStyleClass("columns-blank");
        easyScan.addStyleClass("columns-block");
        easyScan.columnStyle = "columns-block";
        easyScan.addAggregation("content", vbox1);
        easyScan.addAggregation("content", vbox2);
        easyScan.addAggregation("content", vbox3);
        easyScan.addAggregation("content", vbox4);
        easyScan.addAggregation("content", vbox5);
        var testContainer = jQuery('<div id="testContainer">').appendTo('body');
        var easyScanAfterRender = easyScan.onAfterRendering.bind(easyScan);

        stop();
        easyScan.onAfterRendering = function () {

            easyScanAfterRender();
            var keyboardNavigation = easyScan.keyboardNavigation;
            var easyScanItems = jQuery(".easyScanLayoutItemWrapper");

            //Create and trigger focus on qunit
            var focusEvent = jQuery.Event("focus"),
                    jqItem = jQuery(easyScanItems[0]);
            jqItem.trigger(focusEvent);

            var focusedElement = document.activeElement;

            var event = {"keyCode": 35}; //END
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "End button KBN"); }, 0);

            event = {"keyCode": 36}; //Home
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "Home button KBN");

            event = {"keyCode": 9}; //TAB
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "TAB button KBN");

            event = {"keyCode": 40}; //Down
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "Down button KBN"); }, 0);

            event = {"keyCode": 38}; //Up
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "UP button KBN");

            event = {"keyCode": 34}; //PageDown
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "Page Down button KBN"); }, 0);

            event = {"keyCode": 33}; //pageUp
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "Page Up button KBN");

            this.refreshColumnCount(2, this.getContent());
            focusedElement.focus();

            event = {"keyCode": 39}; //Right
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "Right button KBN"); }, 0);

            event = {"keyCode": 37}; //Left
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement,  "Left  button KBN");

            event = {"keyCode": 35, "ctrlKey": true}; // CTRL End
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "Ctrl End button KBN"); }, 0);

            event = {"keyCode": 36, "ctrlKey": true}; // CTRL Home
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "Ctrl Home button KBN");

            event = {"keyCode": 34, "altKey": true}; //CTRL PageDown
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            setTimeout(function() { ok(document.activeElement != focusedElement, "alt pageDown button KBN"); }, 0);

            event = {"keyCode": 33, "altKey": true}; // CTRL pageUp
            event.preventDefault = function(){};
            keyboardNavigation.keydownHandler(event);
            ok(document.activeElement == focusedElement, "alt pageUp button KBN");

            start();
            easyScan.destroy();
        }
        easyScan.placeAt('testContainer');
    });

    /*test("EasyScan Layout - Drag and Drop", function () {
        var btn1 = new sap.m.Button("btnId1");
        var easyScan = new EasyScanLayout();
        easyScan.addAggregation("content", btn1);
        var testContainer = jQuery('<div id="'+easyScan.sId+'" class="sapUshellEasyScanLayoutInner">').prependTo('body');
        easyScan.fireAfterRendering = function(){};
        easyScan.refreshColumnCount = function(){};
        easyScan.onAfterRendering();
        var dndObj = easyScan.layoutDragAndDrop;
        ok(typeof dndObj == "object", "Drag and drop object was created");

        var el1 = {
            posDnD: {top: 10, bottom: 110, left:  10, right: 30}
        };
        var el2 = {
            posDnD: {right: 90, left:  20, bottom: 49, top: 0}
        };
        var collided = dndObj.findCollision(50, 50, [el1, el2]);
        ok(typeof collided == "undefined", "No collision");

        el2 = {
            posDnD: {right: 90, left:  20, bottom: 51, top: 0}
        };
        var collided = dndObj.findCollision(50, 50, [el1, el2]);
        ok(collided === el2, "Second element collision");

        var collidedTop = dndObj.isCollisionTop(50,50, el2);
        ok(collidedTop === false, "collision was with bottom part");

        var collidedTop = dndObj.isCollisionTop(50,10, el2);
        ok(collidedTop === true, "collision was with top part");

        var el1 = 3;
        var el2 = 5;
        var resultArray = dndObj.dragAndDropSwapElement(el1, el2, [1, 2, el1, 4, el2]);
        //ok(resultArray[2] === el2, "element was moved");
        //ok(resultArray[4] === el1, "element was moved");

        dndObj.layoutOffset = {left: 0};
        //dndObj.jqLayout = $(".sapUshellEasyScanLayoutInner");
        var el1 = {posDnD: {right: 30, left:  10, bottom: 110, top: 10}};
        var el2 = {posDnD: {right: 120, left:  50, bottom: 49, top: 0}};
        var el3 = document.createElement("div");
        dndObj.aCardsOrder = [el1, el2];
        var actionObject = {moveX: 200, moveY: 200, element: el1};
        dndObj._dragMoveHandler(actionObject, el3);
        //ok(dndObj.aCardsOrder[0] === el1, "item not moved, no collision");
        var actionObject = {moveX: 20, moveY: 20, element: el1};
        dndObj._dragMoveHandler(actionObject, el3);
        //ok(dndObj.aCardsOrder[0] === el1, "item not moved, card collided with itself");
        var actionObject = {moveX: 60, moveY: 20, element: el1};
        dndObj._dragMoveHandler(actionObject, el3);
        //ok(dndObj.aCardsOrder[0] === el2, "item was moved");
    });*/

});
