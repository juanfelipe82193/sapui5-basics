 // Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.EndUserFeedback and customizable
 * extensions
 */
sap.ui.require([
    "sap/ushell/utils",
    "sap/ushell/test/utils",
    "sap/ushell/services/EndUserFeedback"
], function (utils, testUtils, EndUserFeedback) {
    "use strict";
    /*global deepEqual, equal, module, ok, strictEqual, stop, test, jQuery, sap, sinon, window */

    jQuery.sap.require("sap.ushell.services.Container");



    module(
        "sap.ushell.services.EndUserFeedback",
        {
            setup : function () {
                /**/
            },
            /**
             * This method is called after each test. Add every restoration code
             * here.
             */
            teardown : function () {
                delete sap.ushell.Container;
            }
        }
    );

    [   {   sUrlInput: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?date=Wed%20Oct%2001%202014%2013%3a20%3a56%20GMT%200200%20%28W.%20Europe%20Daylight%20Time%29&zval=xx0xx1xx2xx3",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        },
        {   sUrlInput: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?param1=value1&param2=value2#Action-toappnavsample~AnyContext?additionalInfo=&ApplType",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        },
        {   sUrlInput: "https://ADDRESS:8080/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
            sUrlExpectedOutcome: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample"
        }
    ].forEach(function (oFixture) {
        test("getPathOfURL: input URL -> " + oFixture.sUrlInput, function (assert) {
            var done = assert.async();
            sap.ushell.bootstrap("local").then(function () {
                sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oService) {
                    var sUrlReturned = oService.getPathOfURL(oFixture.sUrlInput);
                    strictEqual(sUrlReturned, oFixture.sUrlExpectedOutcome, "Url path of " + oFixture.sUrlInput + " returned as expected -> returned URL: " + sUrlReturned);
                    done();
                }); 
            });
        });
    });

    test("service ensabled by default - factory instantiation", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oService) {
                oService.isEnabled().done(function () {
                    ok("Service is enabled");
                    done();
                })
                .fail(testUtils.onError);
            }); 
        });
    });


    test("service disabled if set in Config", function (assert) {
        var done = assert.async();
        var oUshellConfig = testUtils.overrideObject({}, {
                "/services/EndUserFeedback/config/enabled": false
            });

        testUtils.resetConfigChannel(oUshellConfig);

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oService) {
                oService.isEnabled().fail(function () {
                    ok("service is disbled!");
                    done();
                })
                .done(testUtils.onError);  
            });
        });
    });

    test("service enabled if set in Config", function (assert) {
        var done = assert.async();

        var oUshellConfig = testUtils.overrideObject({}, {
                "/services/EndUserFeedback/config/enabled": true
            });
        testUtils.resetConfigChannel(oUshellConfig);

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.getServiceAsync("EndUserFeedback").then(function (oService) {
                oService.isEnabled().done(function () {
                    ok("Service is enabled");
                    done();
                })
                .fail(testUtils.onError);
            }); 
        });
    });

    test("Send Feedback - Anonymous true", function (assert) {
        var done = assert.async();
        var count = 2; // We have 2 sendFeedback calls and do not know which finishes first
        function _continue () {
            count--;
            if (count === 0) {
                done();
            }
        }
        var oTestAdapter,
            oAdapterSendFeedbackSpy,
            oEndUserFeedbackSrv,
            oInputEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                clientContext: {
                    userDetails : {
                        userId : "Hugo001",
                        eMail : "hugo@nodomain.com"
                    },
                    navigationData: {
                        formFactor: "desktop",
                        navigationHash: "#Action-toappnavsample~AnyContext?additionalInfo=&ApplType",
                        applicationInformation: {
                            url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample?date=Wed%20Oct%2001%202014%2013%3a20%3a56%20GMT%200200%20%28W.%20Europe%20Daylight%20Time%29&zval=xx0xx1xx2xx3",
                            additionalInformation : "aaa",
                            applicationType : "URL"
                        }
                    }
                },
                isAnonymous: true
            },
            oExpectedEndUserFeedbackData = {
                feedbackText: "Unit test feedback message",
                ratings: [
                    {
                        questionId: "Q10",      // length max. 32 | type String
                        value: 3                 //rating from 1..5 | type Integer
                    }
                ],
                additionalInformation : "aaa",
                applicationType : "URL",
                url: "/sap/bc/ui5_demokit/test-resources/sap/ushell/demoapps/AppNavSample",
                navigationIntent: "#Action-toappnavsample~AnyContext",
                formFactor: "desktop",
                isAnonymous: true,
                userId : "", //Should be blank in case isAnonymous is true
                eMail : "" //Should be blank in case isAnonymous is true
            },
            oActualEndUserFeedbackData;
        /**
         * overwrites the function of the EnduserFeedback adapter
         *
         * @param {JSON} oFeedbackObject
         * JSON object containing the input fields required for the EndUserFeedback
         */
        oTestAdapter = {};
        oTestAdapter.sendFeedback = function (oFeedbackObject) {
            var oDeferred, iNrOfFeedbacks = 333;
            oDeferred = new jQuery.Deferred();

            utils.call(function () {
                oDeferred.resolve(iNrOfFeedbacks);
            }, testUtils.onError, true);
            return oDeferred.promise();
        };

        oEndUserFeedbackSrv = new EndUserFeedback(oTestAdapter);
        oAdapterSendFeedbackSpy = sinon.spy(oTestAdapter, "sendFeedback");
        //parameters for navigationIntent and URL will be sent
        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            ok(typeof iNrOfFeedbacks === "number", "sendFeedback returns a number.");
            equal(iNrOfFeedbacks, 333, "fixed number");
            oActualEndUserFeedbackData = oAdapterSendFeedbackSpy.args[0][0];
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage - with parameters for URL & navIntent have been sent");
        }).fail(function (sMessage) {
            ok(false, "Create feedback failed: " + sMessage);
        }).always(_continue);
        ok(oAdapterSendFeedbackSpy.calledOnce, "Method sendFeedback of EndUserFeedback service has been called ");

        oInputEndUserFeedbackData.clientContext.navigationData.navigationHash = oExpectedEndUserFeedbackData.navigationIntent;
        oInputEndUserFeedbackData.clientContext.navigationData.applicationInformation.url = oExpectedEndUserFeedbackData.url;
        //no parameters for navigationIntent and URL will be sent
        oEndUserFeedbackSrv.sendFeedback(oInputEndUserFeedbackData).done(function (iNrOfFeedbacks) {
            oActualEndUserFeedbackData = oAdapterSendFeedbackSpy.args[0][0];
            deepEqual(oActualEndUserFeedbackData, oExpectedEndUserFeedbackData, "Feedback data stored in session storage - no parameters for URL & navIntent have been sent");
        }).fail(function (sMessage) {
            ok(false, "Create feedback failed: " + sMessage);
        }).always(_continue);
    });

});
