// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.SendAsEmailButton
 */
(function () {
    "use strict";
    /* module, ok, test, jQuery, sap, start, sinon */

    jQuery.sap.require("sap.ushell.ui.footerbar.SendAsEmailButton");
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.ui.footerbar.SendAsEmailButton", {
        /**
         * This method is called before each test
         */
        setup: function () {
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(start);
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("SendAsEmail without AppState && with synchronize getFLPUrl() Test", function () {
        var SendAsEmailButton = new sap.ushell.ui.footerbar.SendAsEmailButton();

        var _getFLPUrl = sinon.stub(sap.ushell.Container, "getFLPUrl",
            function () {
                return "http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpadIsolation.html?sap-isolation-enabled=true#Shell-home";
            });

        var _setAppStateToPublic = sinon.stub(SendAsEmailButton, "setAppStateToPublic",
            function () {
            });

        var _sendEmail = sinon.stub(SendAsEmailButton, "sendEmail",
            function () {
            });

        SendAsEmailButton.sendAsEmailPressed();

        ok(_setAppStateToPublic.calledOnce === true, "Check that setAppStateToPublic called only one time");
        ok(_sendEmail.calledOnce === true, "Check that sendEmail called only one time");
        ok(SendAsEmailButton.getIcon() == "sap-icon://email" , "Check dialog icon");

        _getFLPUrl.restore();
        _setAppStateToPublic.restore();
        _sendEmail.restore();
    });

    test("SendAsEmail with AppState && with synchronize getFLPUrl() Test", function () {
        var SendAsEmailButton = new sap.ushell.ui.footerbar.SendAsEmailButton();
        var AppState = sap.ushell.Container.getService("AppState");

        var _getFLPUrl = sinon.stub(sap.ushell.Container, "getFLPUrl",
            function () {
                return "http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpadIsolation.html?sap-isolation-enabled=true#BookmarkState-Sample&/sap-xapp-state=ASGKFJFK85DQWVJGE9UIUUPMWXSNZ9N48MHXAWPI/sap-iapp-state=ASTM5GCQGTCUHL2BL45RVQ2A176222SPUBB7NLQY";
            });

        sinon.spy(SendAsEmailButton, "setAppStateToPublic");

        var _makeStatePersistent = sinon.stub(AppState, "makeStatePersistent",
            function (sKey, iPersistencyMethod) {
            });

        var _sendEmail = sinon.stub(SendAsEmailButton, "sendEmail",
            function () {
            });

        SendAsEmailButton.sendAsEmailPressed();

        ok(SendAsEmailButton.setAppStateToPublic.calledOnce, "setAppStateToPublic");
        ok(AppState.makeStatePersistent.calledTwice, "makeStatePersistent");
        ok(_sendEmail.calledOnce === true, "Check that sendEmail called only one time");

        _getFLPUrl.restore();
        _makeStatePersistent.restore();
        _sendEmail.restore();
    });

    asyncTest("SendAsEmail without AppState && with a-synchronize getFLPUrl() Test", function () {
        var SendAsEmailButton = new sap.ushell.ui.footerbar.SendAsEmailButton();
        var promise;
        var AppState = sap.ushell.Container.getService("AppState");

        var _getFLPUrl = sinon.stub(sap.ushell.Container, "getFLPUrl",
            function () {
                return new jQuery.Deferred().resolve("http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpadIsolation.html?sap-isolation-enabled=true#Shell-home").promise();
            });

        sinon.spy(SendAsEmailButton, "setAppStateToPublic");

        var _makeStatePersistent = sinon.stub(AppState, "makeStatePersistent",
            function (sKey, iPersistencyMethod) {
            });

        var _sendEmail = sinon.stub(SendAsEmailButton, "sendEmail",
            function () {
                promise = new jQuery.Deferred().resolve().promise();
            });

        SendAsEmailButton.sendAsEmailPressed();

        promise.done(function () {
            start();
            ok(SendAsEmailButton.setAppStateToPublic.calledOnce, "setAppStateToPublic");
            ok(!_makeStatePersistent.called, "makeStatePersistent");

            _getFLPUrl.restore();
            _makeStatePersistent.restore();
            _sendEmail.restore();
        });
    });

    asyncTest("SendAsEmail with AppState && with a-synchronize getFLPUrl() Test", function () {
        var SendAsEmailButton = new sap.ushell.ui.footerbar.SendAsEmailButton();
        var promise1,
            promise2;
        var AppState = sap.ushell.Container.getService("AppState");

        var _getFLPUrl = sinon.stub(sap.ushell.Container, "getFLPUrl",
            function () {
                return new jQuery.Deferred().resolve("http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpadIsolation.html?sap-isolation-enabled=true#BookmarkState-Sample&/sap-xapp-state=ASGKFJFK85DQWVJGE9UIUUPMWXSNZ9N48MHXAWPI/sap-iapp-state=ASTM5GCQGTCUHL2BL45RVQ2A176222SPUBB7NLQY").promise();
            });

        sinon.spy(SendAsEmailButton, "setAppStateToPublic");

        var _makeStatePersistent = sinon.stub(AppState, "makeStatePersistent",
            function (sKey, iPersistencyMethod) {
                promise1 = new Promise(function(resolve, reject) {
                    resolve();
                });
            });

        var _sendEmail = sinon.stub(SendAsEmailButton, "sendEmail",
            function () {
                promise2 = new Promise(function(resolve, reject) {
                    resolve();
                });
            });

        SendAsEmailButton.sendAsEmailPressed();

        Promise.all([promise1, promise2]).then(function () {
            start();
            ok(SendAsEmailButton.setAppStateToPublic.calledOnce, "setAppStateToPublic");
            ok(_makeStatePersistent.calledTwice, "makeStatePersistent");

            _getFLPUrl.restore();
            _makeStatePersistent.restore();
            _sendEmail.restore();
        });
    });

}());
