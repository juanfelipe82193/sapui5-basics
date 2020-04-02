// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/ui/footerbar/ContactSupportButton",
    "sap/ushell/UserActivityLog",
    "sap/ushell/ui/AppContainer",
    "sap/ushell/services/Container"],
    function (ContactSupportButton, UserActivityLog, ViewPortContainer) {

        "use strict";
        /* global asyncTest module ok start stop */

        module("sap.ushell.adapters.local.SupportTicketAdapterTest",
            {
                setup: function () {
                    stop();
                    sap.ushell.bootstrap("local").then(function () {
                        var oModel = new sap.ui.model.json.JSONModel({
                            currentState: {}
                        });
                        oModel.setProperty("/currentState/stateName", "home");
                        this.oViewPortContainer = new ViewPortContainer({id: "viewPortContainer"});
                        this.oViewPortContainer.setModel(oModel);
                        UserActivityLog.activate();
                        start();
                    }.bind(this));
                },
               /**
                * This method is called after each test. Add every restoration code
                * here.
                */
                teardown: function () {
                    delete sap.ushell.Container;
                    this.oViewPortContainer.destroy();
                }
            });

        asyncTest("Check user input text received", function () {
            var supportDialog,
                oTextArea,
                oSendButton;

            // avoid creating the real local SupportTicketAdapter
            jQuery.sap.declare("sap.ushell.adapters.local.SupportTicketAdapter");
            sap.ushell.adapters.local.SupportTicketAdapter = function () {
                this.createTicket = function (oSupportObject) {
                    ok(oSupportObject.text, "new test");

                    var oDeferred = new jQuery.Deferred(),
                        sTicketId = "1234567";

                    oDeferred.resolve(sTicketId);
                    return oDeferred.promise();
                };
            };

            supportDialog = new ContactSupportButton();
            supportDialog.showContactSupportDialog();

            setTimeout(function () {
                oTextArea = sap.ui.getCore().byId("textArea");
                oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");

                oTextArea.setValue("new test");
                oSendButton.firePress();
                supportDialog.oDialog.destroy();
                start();
            }, 150);
        });

        asyncTest("Check client context data - error collection", function () {
            var supportDialog,
                oSendButton;

            // avoid creating the real local SupportTicketAdapter
            jQuery.sap.declare("sap.ushell.adapters.local.SupportTicketAdapter");
            sap.ushell.adapters.local.SupportTicketAdapter = function () {
                this.createTicket = function (oSupportObject) {
                    var sClientContext = oSupportObject.clientContext,
                        logs = sClientContext.userLog,
                        foundOne = 0,
                        foundTwo = 0,
                        logIndex,
                        log,
                        oDeferred = new jQuery.Deferred(),
                        sTicketId;

                    for (logIndex in logs) {
                        if (logs.hasOwnProperty(logIndex)) {
                            log = logs[logIndex];
                            if (log.type === "ERROR") {
                                if (log.messageText.indexOf("test error one") !== -1) {
                                    foundOne = 1;
                                } else if (log.messageText.indexOf("test error two") !== -1) {
                                    foundTwo = 1;
                                }
                            }
                        }
                    }
                    ok(foundOne && foundTwo, "not found");
                    sTicketId = "1234567";
                    oDeferred.resolve(sTicketId);
                    return oDeferred.promise();
                };
            };

            //Invoke two errors
            jQuery.sap.log.error("test error one");
            jQuery.sap.log.error("test error two");

            supportDialog = new ContactSupportButton();
            supportDialog.showContactSupportDialog();

            setTimeout(function () {
                oSendButton = sap.ui.getCore().byId("contactSupportSendBtn");
                oSendButton.firePress();
                supportDialog.oDialog.destroy();
                start();
            }, 150);
        });
    }, /* bExport= */ false);