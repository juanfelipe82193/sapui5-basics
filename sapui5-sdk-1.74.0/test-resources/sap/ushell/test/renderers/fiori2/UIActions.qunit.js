// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.UIActions
 */
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require('sap.ushell.UIActions');

    module("sap.ushell.UIActions", {
        setup: function () {

            var workingArea = '<div id="root">' +
                    '<div id="wrapper">' +
                        '<div id="container" style="width: 500px; height: 500px; position: absolute; background-color: red;"> </div>' +
                    '</div>' +
                '</div>';

            jQuery('body').append(workingArea);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            jQuery('#root').remove();
        }
    });

    test("create a new instance of UIActions Class", function () {
        var instance = null;
        instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : "D"
        });

        QUnit.assert.ok(instance, "create a new instance");

    });

    test("create and delete UIAction element validation", function () {
        var instance = null;
        var deleteCallback = sinon.spy();

        instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : "D"
        });

        instance.delete = deleteCallback;

        QUnit.assert.ok(instance, "create a new instance");
        instance.delete();
        QUnit.assert.ok(deleteCallback.calledOnce, "new instance deleted");

    });

    test("create a new instance of UIActions Class with empty mandatory parameters", function (assert) {
        var instance;
        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "",
                    containerSelector : "#container",
                    draggableSelector : "D"
                });
            },
            "create new UIActions object with empty rootSelector parameter should throw an exception."
        );

        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "#root",
                    containerSelector : "",
                    draggableSelector : "D"
                });
            },
            "create new UIActions object with empty containerSelector parameter should throw an exception."
        );

        assert.throws(
            function() {
                instance = new sap.ushell.UIActions({
                    rootSelector : "#root",
                    containerSelector : "#container",
                    draggableSelector : ""
                });
            },
            "create new UIActions object with empty draggableSelector parameter should throw an exception."
        );
    });

    asyncTest("touchstart on draggable element", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        try {
            var event = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            document.getElementById('root').dispatchEvent(event);

            setTimeout(function () {
                QUnit.assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called once");
                QUnit.assert.ok(touchStartCallback.args[0][1] === draggableDOMRef, "make sure touchstart callback is called with draggable element");
                start();

                instance.disable();
                instance = null;
            }, 100);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("mousedown on draggable element", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mousedownEvent.initEvent('mousedown', true, true);
        draggableDOMRef.dispatchEvent(mousedownEvent);

        setTimeout(function() {
            QUnit.assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called once");
            QUnit.assert.ok(mouseDownCallback.args[0][1] === draggableDOMRef, "make sure mousedown callback is called with draggable element");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });

    asyncTest("touchstart on non-draggable element", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        try {
            var event = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: document.getElementById('container')}]});

            document.getElementById('root').dispatchEvent(event);

            setTimeout(function () {
                QUnit.assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called");
                start();

                instance.disable();
                instance = null;
            }, 100);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("mousedown on non-draggable element", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        var event = document.createEvent('Event');
        event.initEvent('mousedown', true, true);
        document.getElementById('root').dispatchEvent(event);

        setTimeout(function(){
            QUnit.assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called");
            start();

            instance.disable();
            instance = null;
        }, 100);
    });

    asyncTest("check double tap", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchStartCallback = sinon.spy();
        var doubleTapCallback = sinon.spy();

        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            doubleTapCallback : doubleTapCallback,
            doubleTapDelay : 500,//ms,
            switchModeDelay : 1500,
            debug : true,
            isTouch : true
        }).enable();

        try {
            var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});
            var touchendEvent = jQuery.extend(new UIEvent('touchend'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]}, {
                    changedTouches: [{
                        pageX: 10,
                        pageY: 10
                    }]
                });

            setTimeout(function () {
                rootElement.dispatchEvent(touchstartEvent);
                setTimeout(function () {
                    rootElement.dispatchEvent(touchendEvent);
                    setTimeout(function () {
                        rootElement.dispatchEvent(touchstartEvent);
                        setTimeout(function () {
                            rootElement.dispatchEvent(touchendEvent);
                            setTimeout(function () {
                                QUnit.assert.ok(touchStartCallback.calledTwice, "make sure touchstart callback is called twice");
                                QUnit.assert.ok(doubleTapCallback.calledOnce, "make sure doubleTap callback is called");
                                start();

                                instance.disable();
                                instance = null;
                            }, 100);
                        }, 50);
                    }, 50);
                }, 50);
            }, 50);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("check double click", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseDownCallback = sinon.spy();
        var doubleClickCallback = sinon.spy();

        var instance1 = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            doubleTapCallback : doubleClickCallback,
            doubleTapDelay : 10000,//ms,
            switchModeDelay : 1500,
            debug : true,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mousedownEvent.initEvent('mousedown', true, true);

        var mouseupEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mouseupEvent.initEvent('mouseup', true, true);

        setTimeout(function(){
            draggableDOMRef.dispatchEvent(mousedownEvent);
            setTimeout(function(){
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function(){
                    draggableDOMRef.dispatchEvent(mousedownEvent);
                    setTimeout(function(){
                        draggableDOMRef.dispatchEvent(mouseupEvent);
                        setTimeout(function(){
                            QUnit.assert.ok(mouseDownCallback.calledTwice, "make sure mousedown callback is called twice");
                            QUnit.assert.ok(doubleClickCallback.calledOnce, "make sure doubleClick callback is called");
                            start();

                            instance1.disable();
                            instance1 = null;
                        }, 100);
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    });

    asyncTest("check touchEnd after drag and clone disappearance", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchEndCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            endCallback : touchEndCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            isTouch : true
        }).enable();

        try {
            var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            var touchmoveEvent = jQuery.extend(new UIEvent('touchmove'),
                {touches: [{pageX: 11, pageY: 11, target: draggableDOMRef}]});

            var touchendEvent = jQuery.extend(new UIEvent('touchend'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]}, {
                    changedTouches: [{
                        pageX: 11,
                        pageY: 11
                    }]
                });

            rootElement.dispatchEvent(touchstartEvent);
            setTimeout(function () {
                rootElement.dispatchEvent(touchmoveEvent);
                setTimeout(function () {
                    rootElement.dispatchEvent(touchendEvent);
                    setTimeout(function () {
                        QUnit.assert.ok(touchEndCallback.calledOnce, "make sure touchend callback is called");
                        QUnit.assert.ok(jQuery('#root').find('.clone').length === 0, "make sure the clone disappeared");
                        start();

                        instance.disable();
                        instance = null;
                    }, 100);
                }, 50);
            }, 50);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("check mouseup after drag and clone disappearance", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseUpCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            endCallback : mouseUpCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            moveTolerance : 1,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mousedownEvent.initEvent('mousedown', true, true);

        var mousemoveEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mousemoveEvent.initEvent('mousemove', true, true);

        var mouseupEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mouseupEvent.initEvent('mouseup', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function() {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function() {
                draggableDOMRef.dispatchEvent(mouseupEvent);
                setTimeout(function() {
                    QUnit.assert.ok(mouseUpCallback.calledOnce, "make sure mouseup callback is called");
                    QUnit.assert.ok(jQuery('#root').find('.clone').length === 0, "make sure the clone disappeared");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        }, 50);
    });

    asyncTest("check switch to drag mode and clone creation", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchDragCallback = sinon.spy();
        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            dragCallback : touchDragCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            isTouch : true
        }).enable();

        try {
            var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            var touchmoveEvent = jQuery.extend(new UIEvent('touchmove'),
                {touches: [{pageX: 11, pageY: 11, target: draggableDOMRef}]});

            rootElement.dispatchEvent(touchstartEvent);
            setTimeout(function () {
                rootElement.dispatchEvent(touchmoveEvent);
                setTimeout(function () {
                    QUnit.assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called");
                    QUnit.assert.ok(touchDragCallback.calledOnce, "make sure touchdrag callback is called");
                    QUnit.assert.ok(jQuery('#root').find('.clone').length === 1, "make sure a clone was created");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("check switch to drag mode and clone creation (with mouse)", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var dragCallback = sinon.spy();
        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            dragCallback : dragCallback,
            cloneClass : "clone",
            switchModeDelay : 10,//ms
            moveTolerance : 1,
            isTouch : false
        }).enable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mousedownEvent.initEvent('mousedown', true, true);

        var mousemoveEvent = jQuery.extend(document.createEvent('Event'), {pageX: 15, pageY:15});
        mousemoveEvent.initEvent('mousemove', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);
        setTimeout(function() {
            draggableDOMRef.dispatchEvent(mousemoveEvent);
            setTimeout(function() {
                draggableDOMRef.dispatchEvent(mousemoveEvent);
                setTimeout(function() {
                    QUnit.assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called");
                    QUnit.assert.ok(dragCallback.calledOnce, "make sure mousemove callback is called");
                    QUnit.assert.ok(jQuery('#root').find('.clone').length === 1, "make sure a clone was created");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 50);
        }, 50);
    });

    asyncTest("check UIActions disabled", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true
        }).enable();

        instance.disable();

        try {
            var event = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            rootElement.dispatchEvent(event);

            setTimeout(function () {
                QUnit.assert.ok(touchStartCallback.notCalled, "make sure touchstart callback is not called when the UIActions is disabled");

                instance.enable();
                rootElement.dispatchEvent(event);

                setTimeout(function () {
                    QUnit.assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called when the UIActions is enabled again");
                    start();

                    instance.disable();
                    instance = null;
                }, 100);
            }, 100);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("check UIActions disabled (with mouse events)", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var mouseDownCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : mouseDownCallback,
            isTouch : false
        }).enable();

        instance.disable();

        var mousedownEvent = jQuery.extend(document.createEvent('Event'), {pageX: 10, pageY:10, which:1});
        mousedownEvent.initEvent('mousedown', true, true);

        draggableDOMRef.dispatchEvent(mousedownEvent);

        setTimeout(function(){
            QUnit.assert.ok(mouseDownCallback.notCalled, "make sure mousedown callback is not called when the UIActions is disabled");

            instance.enable();
            draggableDOMRef.dispatchEvent(mousedownEvent);

            setTimeout(function() {
                QUnit.assert.ok(mouseDownCallback.calledOnce, "make sure mousedown callback is called when the UIActions is enabled again");
                start();

                instance.disable();
                instance = null;
            }, 100);
        }, 100);
    });

    asyncTest("Do not call drag methods on scroll", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);

        var draggableDOMRef = document.getElementById('draggable0');
        var rootElement = document.getElementById('root');

        var touchStartCallback = sinon.spy();
        var doubleTapCallback = sinon.spy();

        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            doubleTapCallback : doubleTapCallback,
            doubleTapDelay : 500,//ms,
            switchModeDelay : 1500,
            debug : true,
            isTouch : true
        }).enable();


        try {
            var touchstartEvent = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            var touchendEvent = jQuery.extend(new UIEvent('touchend'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]}, {
                    changedTouches: [{
                        pageX: 10,
                        pageY: 10
                    }]
                });

            var dragEndUIHandler = instance.onDragEndUIHandler = sinon.spy();
            var dragStartUIHandler = instance.onDragStartUIHandler = sinon.spy();
            setTimeout(function () {
                rootElement.dispatchEvent(touchstartEvent);
                setTimeout(function () {
                    start();
                    rootElement.dispatchEvent(touchendEvent);
                    QUnit.assert.ok(dragEndUIHandler.callCount === 1, "make sure onDragEndUIHandler called once");
                    QUnit.assert.ok(dragStartUIHandler.callCount === 0, "make sure onDragStartUIHandler never called");
                    instance = null;
                }, 50);
            }, 50);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

    asyncTest("touchstart on elementToCapture selector element", function () {
        var draggable = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable);
        var draggableDOMRef = document.getElementById('draggable0');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true,
            elementToCapture: ".draggable"
        }).enable();

        try {
            var event = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef}]});

            document.getElementById('draggable0').dispatchEvent(event);

            setTimeout(function () {
                QUnit.assert.ok(touchStartCallback.calledOnce, "make sure touchstart callback is called once");
                QUnit.assert.ok(touchStartCallback.args[0][1] === draggableDOMRef, "make sure touchstart callback is called with draggable element");
                start();

                instance.disable();
                instance = null;
            }, 100);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });
    asyncTest("touchstart on 2 different elementToCapture selector element", function () {
        var draggable0 = '<div class="draggable" id="draggable0" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        var draggable1 = '<div class="draggable" id="draggable1" style="width: 100px; height: 100px; position: absolute; background-color: blue"></div>';
        jQuery('#container').append(draggable0);
        jQuery('#container').append(draggable1);
        var draggableDOMRef1 = document.getElementById('draggable0'),
            draggableDOMRef2 = document.getElementById('draggable1');

        var touchStartCallback = sinon.spy();
        var instance = new sap.ushell.UIActions({
            rootSelector : "#root",
            containerSelector : "#container",
            draggableSelector : ".draggable",
            startCallback : touchStartCallback,
            isTouch : true,
            elementToCapture: ".draggable"
        }).enable();

        try {
            var event1 = jQuery.extend(new UIEvent('touchstart'),
                {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef1}]}),
                event2 = jQuery.extend(new UIEvent('touchstart'),
                    {touches: [{pageX: 10, pageY: 10, target: draggableDOMRef2}],
                     changedTouches: []});

            document.getElementById('draggable0').dispatchEvent(event1);
            document.getElementById('draggable1').dispatchEvent(event2);

            setTimeout(function () {
                QUnit.assert.ok(touchStartCallback.calledTwice, "make sure touchstart callback is called twice");
                QUnit.assert.ok(touchStartCallback.args[0][1] === draggableDOMRef1, "make sure touchstart callback is called with draggable element");
                QUnit.assert.ok(touchStartCallback.args[1][1] === draggableDOMRef2, "make sure touchstart callback is called with draggable element");
                start();

                instance.disable();
                instance = null;
            }, 100);
        } catch (err) {
            ok(err.message === "Object doesn't support this action", "touchstart event is not supported in this browser");
            start();
            instance.disable();
            instance = null;
        }
    });

}());