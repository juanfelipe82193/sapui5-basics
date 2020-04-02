sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global",
    "sap/ovp/cards/CommonUtils",
    "/sap/ovp/ui/ObjectStream",
    "/sap/m/Button",
    "/sap/ovp/ui/CustomData"
],function (utils, mockservers, jquery, CommonUtils, ObjectStream, Button, CustomData) {
            "use strict";
            /* jQuery, sap */
            //jQuery.sap.require("ObjectStream");
            //jQuery.sap.require("Button");
            //jQuery.sap.require("CustomData");
            //jQuery.sap.require("sap.ovp.test.qunit.cards.utils");

            var utils = utils;

            module("sap.ovp.app.Component", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                    //jQuery.sap.require("sap.ovp.test.mockservers");
                    mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);
                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                    mockservers.close();
                }
            });

            test("Test Object Stream - optimized updateContent", function(){

                var oData = {
                    title: "someTitle",
                    content: [1, 2, 3]
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                var setBiningContextSpy = sinon.spy();
                this.factory = function(){
                    var btn = new Button();
                    btn.setBindingContext = setBiningContextSpy;
                    return btn;
                };
                var factorySpy = sinon.spy(this, "factory");
                this.oObjectStream = new ObjectStream({
                    title: new sap.m.Link({
                        text: "{/title}",
                        subtle: true
                    }),
                    content: {
                        path: "/content",
                        length: 20,
                        factory: factorySpy
                    }
                });

                this.oObjectStream.setModel(oModel);

                equal(factorySpy.callCount, 3, "factory call count");
                equal(setBiningContextSpy.callCount, 3, "setBinding call count");

                oModel.setProperty("/content", [1, 2]);
                equal(factorySpy.callCount, 3, "factory call count");
                equal(setBiningContextSpy.callCount, 5, "setBinding call count");

                oModel.setProperty("/content", [1, 2, 3]);
                equal(factorySpy.callCount, 4, "factory call count");
                equal(setBiningContextSpy.callCount, 8, "setBinding call count");

                var getContextsSpy = sinon.spy(this.oObjectStream.getBinding("content"), "getContexts");
                oModel.refresh(true);

                equal(getContextsSpy.callCount, 1, "getContexts call count");
                equal(getContextsSpy.args[0][1], 20, "getContexts second argument length");

            });

            test("Test Object Stream - Screen Reader attribute test", function(){
                var oData = {
                    title: "someTitle",
                    content: []
                };
                var oModel = new sap.ui.model.json.JSONModel(oData);
                var setBiningContextSpy = sinon.spy();
                this.factory = function(){
                    var btn = new Button();
                    btn.setBindingContext = setBiningContextSpy;
                    return btn;
                };
                var factorySpy = sinon.spy(this, "factory");
                this.oObjectStream = new ObjectStream({
                    title: new sap.m.Link({
                        text: "Test",
                        subtle: true
                    }),
                    content: {
                        path: "/content",
                        length: 20,
                        factory: factorySpy
                    }
                });

                this.oObjectStream.setModel(oModel);
                var btn = new Button("btnId");
                btn.addCustomData(new CustomData({key:"role", value:"heading", writeToDom:true}));
                btn.addCustomData(new CustomData({key:"aria-label", value:"test", writeToDom:true}));
                var btn2 = new Button("btnId2");
                btn2.addCustomData(new CustomData({key:"role", value:"heading", writeToDom:true}));
                btn2.addCustomData(new CustomData({key:"aria-label", value:"test", writeToDom:true}));

                btn.setHeight = function (){};
                btn2.setHeight = function (){};

                this.oObjectStream.addAggregation("content", btn);
                this.oObjectStream.setPlaceHolder(btn2);
                var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

                this.oObjectStream.onAfterRendering = function () {
                    this._afterOpen();

                    //Get elements
                    var objectStreamHtml = this.getDomRef();
                    var objectStreamHeaderHtml = jQuery(objectStreamHtml).get(0).childNodes[0];
                    var objectStreamCloseHtml = jQuery(objectStreamHtml).find(".sapOvpObjectStreamClose");
                    var objectStreamScrollHtml = jQuery(objectStreamHtml).find(".sapOvpObjectStreamScroll");
                    var objectStreamItemsHtml = jQuery(objectStreamHtml).find(".sapOvpObjectStreamItem");
                    var objectStreamItemHtml = objectStreamItemsHtml.get(0);

                    //Create and trigger focus on qunit
                    var focusEvent = jQuery.Event("focus"),
                            jqItem = jQuery(objectStreamItemHtml);
                    jqItem.trigger(focusEvent);

                    ok(objectStreamHtml.getAttribute("role") == "dialog", "object Stream role is define");
                    ok(objectStreamCloseHtml.attr("role") == "button", "object Stream close role is define");
                    ok(objectStreamCloseHtml.attr("aria-label") == "close", "object Stream close aria-label is define");
                    ok(objectStreamScrollHtml.attr("role") == "list", "object Stream content role is define");
                    ok(objectStreamItemsHtml.attr("role") == "listitem", "item role is define");
                    ok(objectStreamItemsHtml.attr("aria-setsize") == 1, "item size role is define");
                    ok(objectStreamItemsHtml.attr("aria-posinset") == 1, "item position is define");
                    //ok(jQuery(objectStreamItemHtml).attr("aria-labelledby") == "btnId ", "attribute labelledby is define");
                };

                this.oObjectStream.open(1);

                var keysHandlerStub = sinon.spy(this.oObjectStream, "_startScroll");
                this.oObjectStream._startScroll("left");
                ok(keysHandlerStub.calledOnce, "scroll handler was called once after scrolling left");

                this.oObjectStream._startScroll("right");
                ok(keysHandlerStub.calledTwice, "scroll handler was called once more after scrolling right");

                this.oObjectStream.exit();
            });

            test("Test Object Stream - Key Down Handle", function(){

                var cardTestData = {
                };
                var oModel = new sap.ui.model.json.JSONModel(cardTestData);
                var setBiningContextSpy = sinon.spy();
                this.factory = function(){
                    var btn = new Button();
                    btn.setBindingContext = setBiningContextSpy;
                    return btn;
                };
                var factorySpy = sinon.spy(this, "factory");
                var objectStream = new ObjectStream({
                    title: new sap.m.Link({
                        text: "Test",
                        subtle: true
                    }),
                    content: {
                        path: "/content",
                        length: 20,
                        factory: factorySpy
                    }
                });

                var btn = new Button("btnId");
                btn.setWidth = function(width) {
                };
                btn.setHeight = function(width) {
                };
                var btn2 = new Button("btnId2");
                btn2.setWidth = function(width) {
                };
                btn2.setHeight = function(width) {
                };
                objectStream.addAggregation("content", btn);
                objectStream.setPlaceHolder(btn2);
                var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');

                objectStream.onAfterRendering = function () {

                    this._afterOpen();

                    var keyboardNavigation = objectStream.keyboardNavigation;

                    var keysHandlerStub = sinon.spy(keyboardNavigation, "tabButtonHandler");
                    var event = {"keyCode": 9}; //TAB
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "tabButtonHandler was called once after pressing tab");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "shiftTabButtonHandler");
                    event.shiftKey = true;
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "shiftTabButtonHandler was called once after pressing shift + tab");

                    event.shiftKey = false;

                    keysHandlerStub = sinon.stub(keyboardNavigation, "f7Handler");
                    event.keyCode = 118; //F7
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "f7Handler was called once after pressing F7");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "leftRightHandler");
                    event.keyCode = 37; //Arrow LEFT
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "leftRightHandler was called once after pressing arrow left");

                    event.keyCode = 39; //Arrow RIGHT
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledTwice, "leftRightHandler was called once after pressing arrow right");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "homeEndHandler");
                    event.keyCode = 36; //Home
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "homeEndHandler was called once after pressing home button");

                    event.keyCode = 35; //End
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledTwice, "homeEndHandler was called once after pressing end button");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "pageUpDownHandler");
                    event.keyCode = 33; //Page Up
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "pageUpDownHandler was called once after pressing page up");

                    event.keyCode = 34; //Page Down
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledTwice, "pageUpDownHandler was called once after pressing page down");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "enterHandler");
                    event.keyCode = 32; //Spacebar
                    keyboardNavigation.keydownHandler(event);

                    event.keyCode = 13; //enter
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledTwice, "Spacebar and enter handler were called once after pressing the respective buttons");

                    keysHandlerStub = sinon.spy(keyboardNavigation, "f6Handler");
                    event.keyCode = 117; //F6
                    keyboardNavigation.keydownHandler(event);
                    ok(keysHandlerStub.calledOnce, "F6 handler was called once after pressing page down");
                };

                objectStream.placeAt('testContainer');
                objectStream.open(200);

                objectStream.exit();
            });

            test("EasyScan Layout - KBN focus change check", function () {
                var btn1 = new Button("btnId1");
                var btn2 = new Button("btnId2");
                var btn3 = new Button("btnId3");
                var btn4 = new Button("btnId4");
                var btn5 = new Button("btnId5");

                var cardTestData = {
                };
                var oModel = new sap.ui.model.json.JSONModel(cardTestData);
                var setBiningContextSpy = sinon.spy();
                this.factory = function(){
                    var btn = new Button();
                    btn.setBindingContext = setBiningContextSpy;
                    return btn;
                };
                var factorySpy = sinon.spy(this, "factory");
                var objectStream = new ObjectStream({
                    title: new sap.m.Link({
                        text: "Test",
                        subtle: true
                    }),
                    content: {
                        path: "/content",
                        length: 20,
                        factory: factorySpy
                    }
                });

                btn1.setHeight = function (){};
                btn2.setHeight = function (){};
                btn3.setHeight = function (){};
                btn4.setHeight = function (){};
                btn5.setHeight = function (){};

                objectStream.addAggregation("content", btn1);
                objectStream.addAggregation("content", btn2);
                objectStream.addAggregation("content", btn3);
                objectStream.addAggregation("content", btn4);
                objectStream.setPlaceHolder(btn5);
                var testContainer = jQuery('<div id="testContainer" style="display: none;">').appendTo('body');
                stop();
                objectStream.onAfterRendering = function () {
                    this._afterOpen();
                    var keyboardNavigation = this.keyboardNavigation;
                    var objectStreamItems = jQuery(".sapOvpObjectStreamItem");

                    //Create and trigger focus on qunit
                    var focusEvent = jQuery.Event("focus"),
                            jqItem = jQuery(objectStreamItems[0]);
                    jqItem.trigger(focusEvent);

                    var focusedElement = document.activeElement;

                    var event = {"keyCode": 35}; //END
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement != focusedElement, "End button KBN");

                    event = {"keyCode": 36}; //Home
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement == focusedElement, "Home button KBN");

                    event = {"keyCode": 40}; //Down
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement != focusedElement, "Down button KBN");

                    event = {"keyCode": 38}; //Up
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement == focusedElement, "UP button KBN");
                    
                    event = {"keyCode": 39}; //Right
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement != focusedElement, "Right button KBN");

                    event = {"keyCode": 37}; //Left
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement == focusedElement,  "Left  button KBN");

                    event = {"keyCode": 34}; //PageDown
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement != focusedElement, "Page Down button KBN");

                    focusedElement = document.activeElement;

                    event = {"keyCode": 33}; //pageUp
                    event.preventDefault = function(){};
                    keyboardNavigation.keydownHandler(event);
                    ok(document.activeElement != focusedElement, "Page Up button KBN");

                    start();
                }

                objectStream.placeAt('testContainer');
                objectStream.open(200);
                objectStream.exit();
            });
        });
