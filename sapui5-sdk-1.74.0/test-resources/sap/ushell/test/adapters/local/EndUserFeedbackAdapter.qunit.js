// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global asyncTest, deepEqual, equal, module, ok, start, stop, jQuery, sap */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
    jQuery.sap.require("sap.ushell.UserActivityLog");
    jQuery.sap.require("sap.ushell.ui.AppContainer");
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.adapters.local.EndUserFeedbackAdapter",
        {
            setup: function () {
                // Wait until bootstrap is finished
                stop();
                sap.ushell.bootstrap("local").done(function () {
                    start();
                });
                var oModel = new sap.ui.model.json.JSONModel({
                    currentState: {}
                });
                oModel.setProperty("/currentState/stateName", "home");
                if (sap.ui.getCore().byId("viewPortContainer")) {
                    sap.ui.getCore().byId("viewPortContainer").destroy();
                }
                this.oViewPortContainer = new sap.ushell.ui.AppContainer({id: "viewPortContainer"});
                this.oViewPortContainer.setModel(oModel);
                sap.ushell.UserActivityLog.activate();
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown: function () {
                delete sap.ushell.Container;
                this.oViewPortContainer.destroy();
            }
        }
        );

    asyncTest("Send Feedback", function () {
        var oEndUserFeedbackSrv = sap.ushell.Container.getService("EndUserFeedback"),
            oEndUserFeedbackStorage,
            oInputEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10", // length max. 32 | type String
                        value: 3 //rating from 1..5 | type Integer
                    }
                ],
                clientContext: {
                    userDetails: {
                        userId: "Hugo001",
                        eMail: "hugo@nodomain.com"
                    },
                    navigationData: {
                        formFactor: "desktop",
                        navigationHash: "#Action-toappnavsample~AnyContext",
                        applicationInformation: {
                            url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?date=Wed%20Oct%2001%202014%2013%3a20%3a56%20GMT%200200%20%28W.%20Europe%20Daylight%20Time%29&zval=xx0xx1xx2xx3",
                            additionalInformation: "aaa",
                            applicationType: "URL"
                        }
                    }
                },
                isAnonymous: true
            },
            oExpectedEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10", // length max. 32 | type String
                        value: 3 //rating from 1..5 | type Integer
                    }
                ],
                additionalInformation: "aaa",
                applicationType: "URL",
                url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                navigationIntent: "#Action-toappnavsample~AnyContext",
                formFactor: "desktop",
                isAnonymous: true,
                userId: "",
                eMail: ""
            },
            oActualEndUserFeedbackData;

        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            start();
            ok(typeof iNrOfFeedbacks === "number", "sendFeedback returns a number.");
            equal(iNrOfFeedbacks, 333, "fixed number");
            oEndUserFeedbackStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session, "com.sap.ushell.adapters.local.EndUserFeedback");
            oActualEndUserFeedbackData = JSON.parse(oEndUserFeedbackStorage.get(iNrOfFeedbacks));
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage");
        }).fail(function (sMessage) {
            start();
            ok(false, "Create feedback failed: " + sMessage);
        });
    });
    asyncTest("Get legal text for end user feedback dialog", function () {
        var oEndUserFeedbackSrv = sap.ushell.Container.getService("EndUserFeedback");

        oEndUserFeedbackSrv.getLegalText().done(function (sLegalText) {
            start();
            ok(typeof sLegalText === "string", "getLegalText returns a string.");
            equal(sLegalText, "This is the legal text \n in the users language.\n with multiple line breaks.", "fixed text");
        }).fail(function (sMessage) {
            start();
            ok(false, "Cannot retrieve legal text: " + sMessage);
        });
    });


}());
