// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.UsageAnalytics
 * Contains tests for UsageAnalytics service API:
 * - userEnabled
 * - init
 * - setCustomAttributes
 * - logCustomEvent
 */

sap.ui.require([
    "sap/ushell/services/UsageAnalytics"
], function (UsageAnalytics) {
    "use strict";
    /*global module,
     ok, sinon, test, swa, stop, start,
     jQuery, sap*/
    jQuery.sap.require("sap.ushell.services.Container");

    module("sap.ushell.services.UsageAnalytics", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").then(start);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
        }
    });

    test("userEnabled", function () {
        // prepare test
        var userStub = sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: true
            });
        });
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                        }
                    }
                }
            },
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        ok(oSrvc.userEnabled() === true, "userEnabled configuration flag is read correctly");

        oConfig = {
            "services": {
                "UsageAnalytics": {
                    config: {
                        enabled: false,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                    }
                }
            }
        };
        oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");
        oSrvc._trackCustomEvent = sinon.stub();
        oSrvc.logCustomEvent("type", "value", ["firstStringValue", "secondStringValue"]);
        ok(oSrvc._trackCustomEvent.calledOnce === false, "swa.trackCustomEvent never called when service enable flag = false");

        oConfig = {
            "services": {
                "UsageAnalytics": {
                    config: {
                        enabled: true,
                        pubToken: ""
                    }
                }
            }
        };
        oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");
        ok(oSrvc.userEnabled() === false, "userEnabled returns false when bupToken is in the service configuration is an empty string");

        oConfig = {
            "services": {
                "UsageAnalytics": {
                    config: {
                        enabled: true
                    }
                }
            }
        };
        oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");
        ok(oSrvc.userEnabled() === false, "userEnabled returns false when no pubToken was found in the service configurtioon");
        userStub.restore();
    });

    test("init with set permitted false", function () {
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            logClickEvents: false,
                            logPageLoadEvents: false,
                            setUsageAnalyticsPermitted: false
                        }
                    }
                }
            },
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");
        oSrvc._handlingTrackingScripts = sinon.spy();
        oSrvc.init();
        ok(swa.clicksEnabled === false, "swa.clicksEnabled is according to the value in the configuration");
        ok(swa.pageLoadEnabled === false, "swa.pageLoadEnabled is according to the value in the configuration");

        oConfig = {
            "services": {
                "UsageAnalytics": {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                        setUsageAnalyticsPermitted: false
                    }
                }
            }
        };
        oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");
        oSrvc._handlingTrackingScripts = sinon.spy();
        oSrvc.init();
        ok(swa.clicksEnabled === true, "swa.clicksEnabled is according to the default value when no relevant configuration exists");
        ok(swa.pageLoadEnabled === true, "swa.pageLoadEnabled is according to the default value when no relevant configuration exists");
    });

    test("init with tracking false", function () {
        // prepare test
        sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: false
            });
        });
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            logClickEvents: false,
                            logPageLoadEvents: false,
                            setUsageAnalyticsPermitted: true
                        }
                    }
                }
            },
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        oSrvc.showLegalPopup = sinon.spy();
        oSrvc._handlingTrackingScripts = sinon.spy();
        oSrvc.init();

        ok(oSrvc._handlingTrackingScripts.calledOnce === false, "make the swa scripts are not loaded");
        ok(oSrvc.showLegalPopup.calledOnce === false, "make sure popup is not open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [true]");
    });

    test("init with tracking true", function () {
        // prepare test
        sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: true
            });
        });
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            logClickEvents: false,
                            logPageLoadEvents: false,
                            setUsageAnalyticsPermitted: true
                        }
                    }
                }
            },
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        oSrvc.showLegalPopup = sinon.spy();
        oSrvc._handlingTrackingScripts = sinon.spy();
        oSrvc.init();

        ok(oSrvc._handlingTrackingScripts.calledOnce, "make the swa scripts are loaded");
        ok(oSrvc.showLegalPopup.calledOnce === false, "make sure popup is not open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [true]");
    });

    test("init", function () {
        // prepare test
        sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: null
            });
        });
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            logClickEvents: false,
                            logPageLoadEvents: false,
                            setUsageAnalyticsPermitted: true
                        }
                    }
                }
            },
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        oSrvc.start = sinon.spy();
        oSrvc.showLegalPopup = sinon.spy();
        oSrvc._handlingTrackingScripts = sinon.spy();
        oSrvc.init();

        ok(oSrvc._handlingTrackingScripts.calledOnce === false, "make the swa scripts are not loaded");
        ok(oSrvc.showLegalPopup.calledOnce, "make sure popup is open when  setUsageAnalyticsPermitted [true] and trackUsageAnalytics [null]");
    });

    test("setCustomAttributes", function () {
        var oConfig = {
                "services": {
                    "UsageAnalytics": {
                        config: {
                            enabled: true,
                            pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce",
                            setUsageAnalyticsPermitted: false
                        }
                    }
                }
            },
            userStub = sinon.stub(sap.ushell.Container, "getUser", function () {
                return new sap.ushell.User({ // default values
                    id: "DEFAULT_USER",
                    firstName: "Default",
                    lastName: "User",
                    fullName: "Default User",
                    accessibility: false,
                    isJamActive: false,
                    language: "en",
                    bootTheme: {
                        theme: "sap_bluecrystal",
                        root: ""
                    },
                    setAccessibilityPermitted: true,
                    setThemePermitted: true,
                    trackUsageAnalytics: true
                });
            }),
            oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        // Verify simple setting of a single string to field custom3, and verify that is can't be set again
        oSrvc.setCustomAttributes({attribute1: "StringValue11"});
        oSrvc.setCustomAttributes({attribute1: "StringValue12"});
        ok(swa.custom5.ref === "StringValue11", "swa.custom3 contains an object with the 1st string and not the 2nd one");

        // Call to setCustomAttributes, with a string and a function
        oSrvc.setCustomAttributes({
            attribute2: "StringValue21",
            attribute3: function () {
                return "x";
            }
        });
        ok(swa.custom5.ref === "StringValue11", "swa.custom3 contains an object with the 1st string");
        ok(swa.custom6.ref === "StringValue21", "swa.custom4 contains an object with the given string");
        ok(swa.custom7.ref === "customFunction3", "swa.custom4 contains an object with ref = customFunction3");
        ok(jQuery.isFunction(window.customFunction3) === true, "customFunction3 exists on the window as a function");
        userStub.restore();
    });

    test("logCustomEvent", function () {
        var userStub = sinon.stub(sap.ushell.Container, "getUser", function () {
            return new sap.ushell.User({ // default values
                id: "DEFAULT_USER",
                firstName: "Default",
                lastName: "User",
                fullName: "Default User",
                accessibility: false,
                isJamActive: false,
                language: "en",
                bootTheme: {
                    theme: "sap_bluecrystal",
                    root: ""
                },
                setAccessibilityPermitted: true,
                setThemePermitted: true,
                trackUsageAnalytics: true
            });
        });
        var oConfig = {
            "services": {
                "UsageAnalytics": {
                    config: {
                        enabled: true,
                        pubToken: "ea073910-5fe9-4175-b35e-ac130a7afcce"
                    }
                }
            }
        };

        var oSrvc = new UsageAnalytics(null, null, oConfig.services.UsageAnalytics);
        oSrvc.setLegalText("bla");

        oSrvc.init();
        oSrvc._isAnalyticsScriptLoaded = sinon.stub().returns(true);

        swa.trackCustomEvent = sinon.spy();


        // First call to logCustomEvent - verify passing of eventType and eventValue
        oSrvc.logCustomEvent("type1", "value1", ["firstStringValue", "secondStringValue"]);

        ok(swa.trackCustomEvent.args[0][0] === "type1", "First Arg for swa.trackCustomEvent is event type");
        ok(swa.trackCustomEvent.args[0][1] === "value1", "Second Arg for swa.trackCustomEvent is event value");
        ok(swa.trackCustomEvent.args[0][2] === "firstStringValue", "Third Arg for swa.trackCustomEvent is (CustomEventValue2) firstStringValue");
        ok(swa.trackCustomEvent.args[0][3] === "secondStringValue", "Third Arg for swa.trackCustomEvent is (CustomEventValue3) secondStringValue");
        userStub.restore();
    });

});
