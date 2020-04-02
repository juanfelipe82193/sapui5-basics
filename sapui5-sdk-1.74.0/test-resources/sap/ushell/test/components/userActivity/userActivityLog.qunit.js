// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Test User Activity Log
 *
 * @version 1.74.0
 */
(function () {
    "use strict";
    /*global module, ok, start, stop, test, jQuery, sap, sinon, window, strictEqual */

    jQuery.sap.declare("sap.ushell.test.components.userActivity.userActivityLog");

    jQuery.sap.require("sap.ushell.UserActivityLog");
    jQuery.sap.require("sap.ushell.services.Container");
    //clear local storage before running the tests
    if (window.sessionStorage) {
        window.sessionStorage.clear();
    }

    var oEventHub = sap.ui.require("sap/ushell/EventHub");

    module("sap.ushell.test.components.userActivity.userActivityLog", {
        setup : function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        /**
        * This method is called after each test. Add every restoration code
        * here.
        */
        teardown : function () {
            delete sap.ushell.Container;
            sessionStorage.setItem("sap.ushell.UserActivityLog.loggingQueue", "");
            sessionStorage.setItem("sap.ushell.UserActivityLog.lastNavigationActionData", "");
            delete jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter", 0).module;
            sap.ushell.UserActivityLog.deactivate();
            oEventHub._reset();
        }
    });

    test("Activation", function () {
        sap.ushell.UserActivityLog.activate(true);
        var userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        //ok(!userActivityLog);
        //sap.ushell.UserActivityLog.activate(true);
        //userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(userActivityLog);
    });

    /**
     * Checks that User Log size (number of entries) does not exceed the maximum (i.e. 30)
     */
    test("User Log size", function () {
        var index,
            userActivityLog,
            firstLogStruct,
            LastLogStruct;
        sap.ushell.UserActivityLog.activate(true);

        for (index = 0; index < 60; index = index + 1) {
            sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ACTION, "message", index);
        }

        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(userActivityLog.userLog.length == 30);

        firstLogStruct = userActivityLog.userLog[0];
        LastLogStruct = userActivityLog.userLog[29];

        ok(firstLogStruct.messageID == 30);
        ok(LastLogStruct.messageID == 59);
    });

    /**
     * Checks that jQuery.sap.log.error messages are logged
     */
    test("Error logging", function () {
        var userActivityLog,
            logStruct,
            iNumLogsAfterActivation;

        sap.ushell.UserActivityLog.activate(true);
        iNumLogsAfterActivation = sap.ushell.UserActivityLog.getMessageInfo().userLog.length;

        // Create log error messages
        jQuery.sap.log.error("0_Error", "Details_0");
        jQuery.sap.log.error("1_Error", "Details_1");
        jQuery.sap.log.error("2_Error", "Details_2");

        jQuery.sap.log.error("3_Error");
        jQuery.sap.log.error("4_Error");
        jQuery.sap.log.error("5_Error");

        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(userActivityLog.userLog.length - iNumLogsAfterActivation === 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        ok(logStruct.messageText == "1_Error , Details_1");

        logStruct = userActivityLog.userLog[3 + iNumLogsAfterActivation];
        ok(logStruct.messageText == "3_Error");
    });

    /**
     * Checks that Message Service error messages are logged
     */
    test("Message logging", function () {
        var messageService,
            userActivityLog,
            logStruct,
            iNumLogsAfterInit;

        sap.ushell.UserActivityLog.activate(true);

        // Create error messages using Message service
        messageService = sap.ushell.Container.getService("Message");

        sap.ushell.Container.getService("Message").init(jQuery.proxy(function () {}, this));

        iNumLogsAfterInit = sap.ushell.UserActivityLog.getMessageInfo().userLog.length;

        messageService.error("6_Message", "Title_6");
        messageService.error("7_Message", "Title_7");
        messageService.error("8_Message", "Title_8");

        messageService.error("9_Message");
        messageService.error("10_Message");
        messageService.error("11_Message");

        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(userActivityLog.userLog.length - iNumLogsAfterInit === 6);

        logStruct = userActivityLog.userLog[1 + iNumLogsAfterInit];
        ok(logStruct.messageText == "Title_7 , 7_Message");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterInit];
        ok(logStruct.messageText == "10_Message");
    });

    /**
     * Checks UserActivityLog.addMessage API
     */
    test("Add Message API", function () {
        var userActivityLog,
            logStruct,
            str = "",
            strLength = 0,
            index,
            iNumLogsAfterActivation;

        sap.ushell.UserActivityLog.activate(true);
        iNumLogsAfterActivation = sap.ushell.UserActivityLog.getMessageInfo().userLog.length;

         // Use UserActivityLog addMessage API
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ACTION, "12_Action", "12__Action_ID");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ACTION, "13_Action", "13__Action_ID");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ACTION, "14_Action");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ACTION, "15_Action");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ERROR,  "16_Error", "16_Error_ID");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ERROR,  "17_Error", "17_Error_ID");
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ERROR,  "18_Error");

        // Test addMessage with large message text
        for (index = 0; index < 250; index = index + 1) {
            str = str + "1234567890";
            strLength = strLength + 10;
        }
        sap.ushell.UserActivityLog.addMessage(sap.ushell.UserActivityLog.messageType.ERROR,  str);

        // Test addMessage with non-existing message type
        sap.ushell.UserActivityLog.addMessage("NonExistingType",  "20_Error");

        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(userActivityLog.userLog.length - iNumLogsAfterActivation == 8);

        logStruct = userActivityLog.userLog[0 + iNumLogsAfterActivation];
        ok(logStruct.messageText == "12_Action");
        ok(logStruct.messageID == "12__Action_ID");

        logStruct = userActivityLog.userLog[4 + iNumLogsAfterActivation];
        ok(logStruct.messageText == "16_Error");
        ok(logStruct.messageID == "16_Error_ID");

        logStruct = userActivityLog.userLog[6 + iNumLogsAfterActivation];
        ok(logStruct.messageText == "18_Error");
      //  ok(userActivityLog.userLog.length == 7);
        ok(!logStruct.messageID);

        logStruct = userActivityLog.userLog[7 + iNumLogsAfterActivation];
        ok(logStruct.messageText.length == strLength);
    });

    /**
     * Checks that LPD events (i.e. user actions) are logged as "Actions"
     */
    test("Add Message By LPD Events", function () {
        var userActivityLog,
            logStruct,
            indexOfActionName,
            iNumLogsAfterActivation;

        sap.ushell.UserActivityLog.activate(true);
        iNumLogsAfterActivation = sap.ushell.UserActivityLog.getMessageInfo().userLog.length;

        sap.ui.getCore().getEventBus().publish("launchpad", "createGroupAt");
        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        logStruct = userActivityLog.userLog[0 + iNumLogsAfterActivation];
        ok(logStruct.type === "ACTION");
        indexOfActionName = logStruct.messageText.indexOf("Create Group");
        ok(indexOfActionName !== -1);

        sap.ui.getCore().getEventBus().publish("launchpad", "addBookmarkTile", {title : "bookmarkTitle", url : "bookmarkUrl"});
        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        logStruct = userActivityLog.userLog[1 + iNumLogsAfterActivation];
        ok(logStruct.type === "ACTION");
        indexOfActionName = logStruct.messageText.indexOf("Add Bookmark");
        ok(indexOfActionName !== -1);

        ok(userActivityLog.userLog.length - iNumLogsAfterActivation === 2);
    });

    /**
     * Checks if the received form factor is one of general form factor types of UI5
     */
    test("Test MessageInfo Form Factor filled", function () {
        var userActivityLog;
        sap.ushell.UserActivityLog.activate(true);
        userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
        ok(["phone", "tablet", "desktop"].indexOf(userActivityLog.formFactor) >= 0, "form factor valid");
    });

    /**
     * Checks that LaunchPage service functions failures are logged
     */
    test("Service fail logging", function (assert) {
        var done = assert.async(),
            iNumLogsAfterActivation;

        sap.ushell.UserActivityLog.activate(true);
        iNumLogsAfterActivation = sap.ushell.UserActivityLog.getMessageInfo().userLog.length;

        jQuery.sap.declare("sap.ushell.adapters.demo.UserActivityLogLaunchPageAdapter");
        sap.ushell.adapters.demo.UserActivityLogLaunchPageAdapter = function () {
            this.addBookmark = function (oParameters) {
                var oDeffered = new jQuery.Deferred();
                oDeffered.reject();
                return oDeffered.promise();
            };
        };

        var oLaunchPageAdapterConfig = jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter", 0);
        oLaunchPageAdapterConfig.module = "sap.ushell.adapters.demo.UserActivityLogLaunchPageAdapter";
        delete sap.ushell.Container;
        sap.ushell.bootstrap("local").then(function () {
            var launchPageSrv = sap.ushell.Container.getService("LaunchPage"),
            oParameters = {title : "bookmarkTitle", url : "bookmarkUrl"},
            userActivityLog,
            logStruct;
            launchPageSrv.addBookmark(oParameters);
            userActivityLog = sap.ushell.UserActivityLog.getMessageInfo();
            logStruct = userActivityLog.userLog[0 + iNumLogsAfterActivation];
            ok(userActivityLog.userLog.length - iNumLogsAfterActivation === 1);
            ok(logStruct.messageText == "Fail to add bookmark for URL: bookmarkUrl and Title: bookmarkTitle");
            done();
        });

    });

    test("Navigation Hash is stored after pressing on tile", function () {
        var orignHash = "origin-hash";
        var emptyFunction = function () {};

        this.getMetadata = function () {
            return {
                getName : function () {
                    return "sap.ushell.ui.launchpad.Tile";
                }
            };
        };

        this.getDebugInfo = function (){};
        this.getId = function (){};
        this.getBindingContext = function () {
          return {
              getPath : function () {},
              getModel : function () {
                  return { getProperty : function () {
                      return { title : "title"};
                  }};
              }};
        };
        this.addMessage = function () {};
        this.messageType = {
            ACTION : ""
        };
        this._getLastNavActionFromStorage = function () {
            return {};
        };
        this._putInSessionStorage = function () {
            return {};
        };

        var getCoreStub = sinon.stub(sap.ui.getCore(), 'byId').returns({
            getModel : function () {
                return {
                    getData: function () {
                        return {
                            title: "title"
                        };
                    }
                };
            }
        });

        var putInLocalStorageStub = sinon.stub(this, '_putInSessionStorage');

        window.hasher = {
            getHash : function () {
                return orignHash;
            }
        };

        var fnTilePressed = sap.ushell.UserActivityLog._tileOnTapDecorator.apply(this, [emptyFunction]);

        fnTilePressed.apply(this);

        var args = putInLocalStorageStub.args[0][1];
        var resultHash = JSON.parse(args).navigationHash;

        ok(resultHash === "#" + orignHash, "hash from url is - " + orignHash + ", and hash returned from function is - " + resultHash);

        getCoreStub.restore();
        putInLocalStorageStub.restore();
    });

    /*
     * Test that _handleActionEventHub works correctly.  This can only be
     * tested indirectly, by checking that
     * sap.ushell.UserActivityLog.addMessage was called with the right
     * parameters _and_ the eventbus didn't publish the event (just in case a
     * "subscribe" was forgotten in the code)
     */
    test("_handleActionEventHub works properly", function (assert){
        // arrange
        var done = assert.async(),
            oSpyEventHub,
            // stop the EventBus from emiting the "showCatalog" event but still allow
            // it to publish other events
            oSpyEventBus = (function () {
                var fnOldBus = sap.ui.getCore().getEventBus().publish;
                return sinon.stub(sap.ui.getCore().getEventBus(), "publish", function (args) {
                    if (args === "showCatalog") {
                        return undefined;
                    } else {
                        fnOldBus(args);
                    }
                });
            })();
            sap.ushell.UserActivityLog.activate(true);

            oSpyEventHub = sinon.spy(sap.ushell.UserActivityLog, "addMessage");

            // act
            oEventHub.emit("showCatalog",  {sId: "showCatalog", oData: Date.now()});

            // assert
            oEventHub.once("showCatalog").do(function (oData) {
                strictEqual(oSpyEventHub.callCount, 1, "_handleAction was called");
                ok(oSpyEventHub.args[0][1] === "Show Catalog", "_handleAction was called with the right parameters");
                oSpyEventHub.restore();
                oSpyEventBus.restore();
                done();
            });
    });
}());
