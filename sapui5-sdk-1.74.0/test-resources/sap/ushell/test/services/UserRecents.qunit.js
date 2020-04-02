// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.URLParsing
 */
sap.ui.require([
    "sap/ushell/resources",
    "sap/ushell/services/AppType",
    "sap/ushell/services/_Personalization/WindowAdapter"
], function (resources, AppType, WindowAdapter) {
    "use strict";
    /*global asyncTest, deepEqual, module, ok, equal, start, test, sinon*/

    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var sCachedConfig;
    var oUserRecentsService;

    module("sap.ushell.services.UserRecents", {
        setup: function () {
            delete sap.ushell.Container;
            // the config has tof be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // avoid loading default dependencies (scaffolding lib) in unit test
            window["sap-ushell-config"] = window["sap-ushell-config"] || {};
            window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
            window["sap-ushell-config"].services.Ui5ComponentLoader = {
                config: {
                    loadDefaultDependencies: false
                }
            };
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container.getServiceAsync("UserRecents").then(function (userRecentsService) {
                        oUserRecentsService = userRecentsService;
                        start();
                });
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);
            oUserRecentsService = null;
        }
    });


    test("getServiceUserRecents", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);
        deepEqual(typeof oUserRecentsService, "object");
    });


    test("getRecentsApps", function (assert) {
        var done = assert.async();
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentApps().done(function (aRecentApps) {
            ok(aRecentApps !== undefined, "Recent Apps return");

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentApps.length, 6, "Amount of Recent app equal max limit = 6");

            //validate RecentApps is ordered by time stamp
            deepEqual(aRecentApps[0].title, "My Leave Request", "RecentApps is ordered by time stamp correctly");
            done();
        });
    });


    test("getRecentSearches", function (assert) {
        var done = assert.async();
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getRecentSearches().done(function (aRecentSeraches) {
            ok(aRecentSeraches !== undefined, "Recent Apps return");

            //validate amount of apps equal Max limit = 6
            deepEqual(aRecentSeraches.length, 10, "Amount of Recent searches equal max limit = 10");

            //validate RecentSeraches is ordered by time stamp
            deepEqual(aRecentSeraches[0].sTerm, "Sally", "RecentSeraches is ordered by time stamp correctly");
            done();
        });
    });

    // ====================== User Apps Usage ====================

    // TODO: re-enable tests after refactoring; need to stub Ui5ComponentLoader service
    // to avoid native promise
//    // tests are failing due to a timing issue; needs further investigation
//    test("appsUsageEnable", function () {
//        _testAppUsageFlow(true);
//    });
//
//
//    // rather a unit test on REnderer._logOpenAppAction
//    // Here the hack is in the ShellController, there a uni
//    test("appsUsageDisable", function () {
//        var bActive = false;
//        jQuery.sap.getObject("sap-ushell-config.renderers.fiori2", 0).componentData = {
//            config: {
//                enableTilesOpacity: bActive,
//                applications: {
//                    "Action-toappnavsample" : {}
//                },
//                rootIntent : "Shell-home"
//            }
//        };
//
//        hasher.setHash("");
//        delete sap.ushell.Container;
//        sap.ushell.bootstrap("local");
//
//        var clock = sinon.useFakeTimers("setTimeout"),
//            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//        ok(oUserRecentsService !== undefined, "the UserRecentsService present");
//        // ECMA6 Native promises can not be simulated via useFakeTimers,
//        // as they don't use setTimout to force asynchronicity
//        // we need to make this a full asyncTest
//        //In the following test, I expected the callback for the resolved promise to be invoked while inside the test. Apparently, native promises doesn't invoke callbacks synchronously, but schedules them to be called in a manner similar to setTimeout(callback, 0). However, it doesn't actually use setTimeout, so sinon's implementation of fake timers doesn't trigger the callback when calling tick().
//        stop();
//        var oRenderer;
//        var callCount = bActive ? 1 : 0;
//        var stub = sinon.stub(oUserRecentsService, "addAppUsage");
//        oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        // here we only test that this is called.
//        var originalFunction = oRenderer.getComponentInstance().shellCtrl._logOpenAppAction;
//        oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = function(sIntent) {
//            if (sIntent === "Action-toappnavsample") {
//              originalFunction(sArg);
//              clock.tick(1000);
//              equal(stub.callCount,callCount, "Called correct time: " + callCount);
//              start();
//              stub.restore();
//              clock.restore();
//              oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = originalFunction;
//              oRenderer.destroy();
//            }
//        };
//        hasher.setHash("Action-toappnavsample");
//        //clock.tick(1000);
//     });
//
//    function _testAppUsageFlow(bActive) {
//        jQuery.sap.getObject("sap-ushell-config.renderers.fiori2", 0).componentData = {
//            config: {
//                enableTilesOpacity: bActive,
//                applications: {
//                    "Action-toappnavsample" : {}
//                },
//                rootIntent : "Action-toappnavsample"
//            }
//        };
//
//        delete sap.ushell.Container;
//        sap.ushell.bootstrap("local");
//
//        var clock = sinon.useFakeTimers("setTimeout"),
//            oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//        ok(oUserRecentsService !== undefined, "the UserRecentsService present");
//        // ECMA6 Native promises can not be simulated via useFakeTimers,
//        // as they don't use setTimout to force asynchronicity
//        // we need to make this a full asyncTest
//        //In the following test, I expected the callback for the resolved promise to be invoked while inside the test. Apparently, native promises doesn't invoke callbacks synchronously, but schedules them to be called in a manner similar to setTimeout(callback, 0). However, it doesn't actually use setTimeout, so sinon's implementation of fake timers doesn't trigger the callback when calling tick().
//        stop();
//        var oRenderer;
//        var callCount = bActive ? 1 : 0;
//        var stub = sinon.stub(oUserRecentsService, "addAppUsage", function() {
//            start();
//            clock.tick(1000);
//            equal(stub.callCount,callCount, "Called correct time" + callCount);
//            stub.restore();
//            oRenderer.destroy();
//            clock.restore();
//        });
//        oRenderer = sap.ushell.Container.createRenderer("fiori2");
//        // here we only test that this is called.
//        var originalFunction = oRenderer.getComponentInstance().shellCtrl._logOpenAppAction;
//        oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = function(sArg) {
//            originalFunction(sArg);
//            clock.tick(1000);
//            oRenderer.getComponentInstance().shellCtrl._logOpenAppAction = originalFunction;
//        };
//        clock.tick(1000);
//    }

    test("getAppsUsage", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
        ok(oUserRecentsService !== undefined);

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return");
        });
    });

    asyncTest("MultiAppUsageSameDay", function () {
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        var hash1 = "app_1";
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);
        oUserRecentsService.addAppUsage(hash1);

        var hash2 = "app_2";
        oUserRecentsService.addAppUsage(hash2);

        var hash3 = "app_3";
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);
        oUserRecentsService.addAppUsage(hash3);

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {

            start();
            ok(aUserAppsUsage !== undefined, "User Apps Usage return");

            ok(aUserAppsUsage.usageMap.app_1 === 3, "app_1 usage = 3");
            ok(aUserAppsUsage.usageMap.app_2 === 1, "app_2 usage = 1");
            ok(aUserAppsUsage.usageMap.app_3 === 5, "app_3 usage = 5");

            //validate min & max values (min = 1, max = 5)
            deepEqual(aUserAppsUsage.minUsage, 1, "Min value of User Apps Usage = 1");
            ok(aUserAppsUsage.maxUsage >= 5, "Max value of User Apps Usage = 5");
        });
    });

    test("AppUsageDifferentDays", function (assert) {
        var done = assert.async();
        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        var hash4 = "app_4";
        var hash5 = "app_5";

        var clock = sinon.useFakeTimers(new Date(2014, 4, 1, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 2, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 3, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        clock.restore();

        clock = sinon.useFakeTimers(new Date(2014, 4, 4, 8, 0, 0).getTime());
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash4);
        oUserRecentsService.addAppUsage(hash5);
        clock.restore();

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return");

            //validate amount of app_4 = 6
            deepEqual(aUserAppsUsage.usageMap[hash4], 6, "Amount of User Apps Usage = 6");
            //validate amount of app_5 = 3
            deepEqual(aUserAppsUsage.usageMap[hash5], 3, "Amount of User Apps Usage = 3");
            done();
        });
    });

    test("InvalidAppUsageHash", function (assert) {
        var done = assert.async();

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
            ok(aUserAppsUsage !== undefined, "User Apps Usage return");

            var currentAppsCount = Object.keys(aUserAppsUsage.usageMap).length;

            var hash = null;
            oUserRecentsService.addAppUsage(hash);
            hash = "";
            oUserRecentsService.addAppUsage(hash);
            hash = " ";
            oUserRecentsService.addAppUsage(hash);
            hash = undefined;
            oUserRecentsService.addAppUsage(hash);
            hash = {a: "1", b: "2", c: "3"}; //object
            oUserRecentsService.addAppUsage(hash);
            hash = function () { };
            oUserRecentsService.addAppUsage(hash);
            hash = 1; //digit
            oUserRecentsService.addAppUsage(hash);
            hash = true; // boolean
            oUserRecentsService.addAppUsage(hash);

            oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
                //validate amount of apps  = same as before additions
                deepEqual(Object.keys(aUserAppsUsage.usageMap).length, currentAppsCount, "Amount of User Apps Usage Didn't change");
                done();
            });
        });
    });

    test("set / get recent activity", function (assert) {
        var done = assert.async();
        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var oActivity = {
                title: "BO application",
                appType: AppType.FACTSHEET,
                appId: "#Action-toappnavsample",
                url: "#Action-toappnavsample&1837"
            };

            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity.length === 4, "we have 4 recent activities in the recent activity list");
            /*eslint-disable no-extra-bind*/
            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return");
                    ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    done();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    test("update activity that is already in the recent activity list", function (assert) {
        var done = assert.async();
        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var oActivity = {
                title: "title on desktop 2",
                appType: AppType.APP,
                appId: "#PurchaseOrder-display",
                url: "#PurchaseOrder-display&/View1"
            };

            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

            oActivity.timestamp = aRecentActivity[aRecentActivity.length - 1].timestamp;
            deepEqual(aRecentActivity[aRecentActivity.length - 1], oActivity, "Least recent activity is oActivity");
            ok(aRecentActivity[0].appId !== oActivity.appId, "most recent activity is not oActivity");

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return");
                    ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

                    oActivity.timestamp = aRecentActivity[0].timestamp;
                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    done();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    asyncTest("update existing activity with type 'Application' in the recent activity with same entry of different type ('OVP') ", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {

            /*
             the first (most recent) entry of the existing entries has same appId and Url as the entry we are about to add
             this comes to test the merging behavior of the User Recent

                     appId : "#PurchaseOrder-display"
                     appType : AppType.APP
                     title : "title on desktop 2"
                     url : "#PurchaseOrder-display&/View1"

             As the entry we are about to add is of different type then 'Application' (it is OVP)
             we expect the item to be overriden
             */

            var oExistingActivityWithDifferentType = {
                title: "title on desktop 2",
                appType: AppType.OVP,
                appId: "#PurchaseOrder-display",
                url: "#PurchaseOrder-display&/View1",
                icon: "somIconUri"
            };

            var oExistingEntryBeforeAddingEntry = aRecentActivity[0];

            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

            // see that the entries are with same appId and Url --> considered as equal
            ok(oExistingActivityWithDifferentType.appId === oExistingEntryBeforeAddingEntry.appId, "appId should be identical");
            ok(oExistingActivityWithDifferentType.url === oExistingEntryBeforeAddingEntry.url, "url should be identical");

            // we set the timestamp so this entry would be the first one after the update
            oExistingActivityWithDifferentType.timestamp = aRecentActivity[aRecentActivity.length - 1].timestamp;

            oUserRecentsService.addActivity(oExistingActivityWithDifferentType).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {

                    //validate amount of apps  = same as before additions (as item was overriden)
                    ok(aRecentActivity !== undefined, "User Recent activity return");
                    ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

                    ok(oExistingActivityWithDifferentType.appId === aRecentActivity[0].appId, "appId should be identical");
                    ok(oExistingActivityWithDifferentType.url === aRecentActivity[0].url, "url should be identical");

                    ok(aRecentActivity[0].appType !== oExistingEntryBeforeAddingEntry.appType, "appType should not be the same");
                    ok(aRecentActivity[0].appType === oExistingActivityWithDifferentType.appType, "appType should be the same");
                    ok(aRecentActivity[0].icon === "somIconUri", "icon property not set correctly");

                    start();
                }.bind(this));
            }.bind(this));
        });
    });

    asyncTest("update existing activity with type which is not application ('Factsheet') in the recent activity with same entry of type 'Application' ", function () {

        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");

        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {

            /*
             the first entry of the existing entries will have the same appId and Url as the entry we are about to add
             this comes to test the merging behavior of the User Recent.
             As the entry we are about to add is of type 'Application' we expect the item NOT to be overriden
             */

            var oExistingActivityWithDifferentType = {
                title: "title on desktop 2",
                appType: "Application",
                appId: aRecentActivity[0].appId,
                url: aRecentActivity[0].url
            };

            var oExistingEntryBeforeAddingEntry = aRecentActivity[0];

            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity !== undefined, "User Recent activity return");
            ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

            // we set the timestamp so this entry would be the first one after the update
            oExistingActivityWithDifferentType.timestamp = aRecentActivity[aRecentActivity.length - 1].timestamp;

            oUserRecentsService.addActivity(oExistingActivityWithDifferentType).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {

                    //validate amount of apps  = same as before additions (as item was overriden)
                    ok(aRecentActivity !== undefined, "User Recent activity return");
                    ok(aRecentActivity.length === 5, "we have 5 recent activities in the recent activity list");

                    ok(oExistingActivityWithDifferentType.appId === aRecentActivity[0].appId, "appId should be identical");
                    ok(oExistingActivityWithDifferentType.url === aRecentActivity[0].url, "url should be identical");

                    ok(aRecentActivity[0].appType === oExistingEntryBeforeAddingEntry.appType, "appType should be the same");
                    ok(aRecentActivity[0].appType !== oExistingActivityWithDifferentType.appType, "appType should not be the same");
                    ok(aRecentActivity[0].icon, "icon property should on added entry");

                    oExistingEntryBeforeAddingEntry.timestamp = aRecentActivity[0].timestamp;
                    deepEqual(aRecentActivity[0], oExistingEntryBeforeAddingEntry, "Most recent activity is oActivity");
                    start();
                }.bind(this));
            }.bind(this));
        });
    });

    test("add an activity that has a url not starting with '#'", function (assert) {
        var done = assert.async();
        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var oActivity = {
                title: "BO application",
                appType: AppType.FACTSHEET,
                appId: "#Action-toappnavsample",
                url: "http://xxx.com?a=1"
            };

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    done();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

//    asyncTest("Add application that is supported on tablet and mobile to recent activities", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        this.oActivity = {
//            icon: "xxx",
//            title: "xxx",
//            appType: "app",
//            appId: "#xxx-tabletmobile",
//            url: "xxx-xxx&1"
//        };
//
//        this.originalIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
//
//        oUserRecentsService.addActivity(this.oActivity).done(function () {
//            //***test desktop scenario***
//            sap.ui.Device.system.desktop = true;
//            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                var oDeferred = new jQuery.Deferred();
//                oDeferred.resolve(
//                    {
//                        "#xxx-tabletmobile": {"supported": false}
//                    });
//                return oDeferred.promise();
//            };
//            oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                ok(aRecentActivity !== undefined, "User Recent activity return");
//                ok(aRecentActivity.length === 4, "There are 4 items in the recent activity list");
//
//                //***test tablet scenario***
//                sap.ui.Device.system.desktop = false;
//                sap.ui.Device.system.tablet = true;
//                sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                    var oDeferred = new jQuery.Deferred();
//                    oDeferred.resolve(
//                        {
//                            "#xxx-tabletmobile": {"supported": true}
//                        });
//                    return oDeferred.promise();
//                };
//                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                    ok(aRecentActivity !== undefined, "User Recent activity return");
//                    ok(aRecentActivity.length === 1, "There is 1 item in the recent activity list");
//
//
//                    //***test phone scenario***
//                    sap.ui.Device.system.tablet = false;
//                    sap.ui.Device.system.phone = true;
//                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                        var oDeferred = new jQuery.Deferred();
//                        oDeferred.resolve(
//                            {
//                                "#xxx-tabletmobile": {"supported": true}
//                            });
//                        return oDeferred.promise();
//                    };
//                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                        //validate amount of apps  = same as before additions
//                        ok(aRecentActivity !== undefined, "User Recent activity return");
//                        ok(aRecentActivity.length === 1, "There is 1 item in the recent activity list");
//
//                        start();
//                        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = this.originalIsIntentSupported;
//                        sap.ui.Device.system.desktop = true;
//                        sap.ui.Device.system.phone = false;
//                    }.bind(this));
//                }.bind(this));
//            }.bind(this));
//        }.bind(this));
//    });
//
//    asyncTest("Add application that is supported on all devices to recent activities", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        this.oActivity = {
//            icon: "xxx",
//            title: "xxx",
//            appType: "app",
//            appId: "#xxx-desktoptabletmobile",
//            url: "xxx-xxx&2"
//        }
//
//        this.originalIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
//
//        oUserRecentsService.addActivity(this.oActivity).done(function () {
//            //***test desktop scenario***
//            sap.ui.Device.system.desktop = true;
//            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                var oDeferred = new jQuery.Deferred();
//                oDeferred.resolve(
//                    {
//                        "#xxx-desktoptabletmobile": {"supported": true}
//                    });
//                return oDeferred.promise();
//            };
//            oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                ok(aRecentActivity !== undefined, "User Recent activity return");
//                ok(aRecentActivity.length === 5, "There is 5 item in the recent activity list");
//
//                //***test tablet scenario***
//                sap.ui.Device.system.desktop = false;
//                sap.ui.Device.system.tablet = true;
//                sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                    var oDeferred = new jQuery.Deferred();
//                    oDeferred.resolve(
//                        {
//                            "#xxx-desktoptabletmobile": {"supported": true}
//                        });
//                    return oDeferred.promise();
//                };
//                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                    ok(aRecentActivity !== undefined, "User Recent activity return");
//                    ok(aRecentActivity.length === 2, "There are 2 items in the recent activity list"); // #xxx-desktoptabletmobile & #xxx-tabletmobile
//
//
//                    //***test phone scenario***
//                    sap.ui.Device.system.tablet = false;
//                    sap.ui.Device.system.phone = true;
//                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
//                        var oDeferred = new jQuery.Deferred();
//                        oDeferred.resolve(
//                            {
//                                "#xxx-desktoptabletmobile": {"supported": true}
//                            });
//                        return oDeferred.promise();
//                    };
//                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
//                        //validate amount of apps  = same as before additions
//                        ok(aRecentActivity !== undefined, "User Recent activity return");
//                        ok(aRecentActivity.length === 2, "There are 2 items in the recent activity list"); // #xxx-desktoptabletmobile & #xxx-tabletmobile
//
//                        start();
//                        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = this.originalIsIntentSupported;
//                        sap.ui.Device.system.desktop = true;
//                        sap.ui.Device.system.phone = false;
//                    }.bind(this));
//                }.bind(this));
//            }.bind(this));
//        }.bind(this));
//    });

    test("set multi recent activities of the same application", function (assert) {
        var done = assert.async();
        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "New application",
                    appType: "Application",
                    appId: "#new-app",
                    url: "#new-app"
            }, numberRecentActivities = aRecentActivity.length, // 1 from the previous test
                numberAddedActivities = 0;

            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#new-app": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aRecentActivity !== undefined, "User Recent activity return");

            var addActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    //validate amount of apps  = same as before additions
                    numberAddedActivities++;
                    if (numberAddedActivities < 10) {
                        addActivityFn();
                    }
                    if (numberAddedActivities == 10) {
                        testActivityFn();
                    }
                }.bind(this));
            }.bind(this);

            testActivityFn = function () {
                oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                    //validate amount of apps  = same as before additions
                    ok(aRecentActivity !== undefined, "User Recent activity return");
                    ok(aRecentActivity.length === numberRecentActivities + 1, "we have 2 recent activities in the recent activity list");
                    aRecentActivity[0].timestamp = oActivity.timestamp;
                    deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                    done();
                }.bind(this));
            }.bind(this);

            addActivityFn();
        }.bind(this));
    });


    test("set more then 30 recent activities with a different application id", function (assert) {
        var done = assert.async();
        oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "OVP application",
                    appType: "OVP",
                    appId: "#Action-todefaultapp",
                    url: "#Action-todefaultapp&1899"
            }, //numberRecentActivities = aRecentActivity.length,
                numberAddedActivities = 0;

            ok(aRecentActivity !== undefined, "User Recent activity return");

            var addActivityFn = function () {
                oActivity.url += "x";
                oUserRecentsService.addActivity(oActivity).done(function () {
                    //validate amount of apps  = same as before additions
                    numberAddedActivities++;
                    if (numberAddedActivities < 40) {
                        addActivityFn();
                    }

                    if (numberAddedActivities == 40) {
                        testActivityFn();
                    }
                }.bind(this));
            }.bind(this);

            testActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getRecentActivity().done(function (aRecentActivity) {
                        //validate amount of apps  = same as before additions
                        ok(aRecentActivity !== undefined, "User Recent activity return");
                        equal(aRecentActivity.length, 30, "30 datasets");
                        aRecentActivity[0].timestamp = oActivity.timestamp;
                        deepEqual(aRecentActivity[0], oActivity, "Most recent activity is oActivity");
                        done();
                    }.bind(this));
                }.bind(this));
            }.bind(this);

            addActivityFn();
        }.bind(this));
    });

//  Remarked as it is not stable and need to be invesitgated
//
//  test("SaveDataForMoreThanMaxDaysLimit", function () {
//
//        var oUserRecentsService = sap.ushell.Container.getService("UserRecents");
//
//        var hash = "app_6";
//        var daysLimit = 30;
//        var clock;
//
//        for (var i = 1; i <= daysLimit + 1; i++)
//  {
/// clock = sinon.useFakeTimers(new Date(2014, 4, i, 8, 0, 0).getTime());// 01/05/2014 8:00 - 31/05/2014 8:00
//
// oUserRecentsService.addAppUsage(hash);
//  }
//
//        oUserRecentsService.getAppsUsage().done(function (aUserAppsUsage) {
//      clock.restore();
//            ok(aUserAppsUsage !== undefined, "User Apps Usage return" );
//
//            //validate amount of app_6 = 30
//            deepEqual(aUserAppsUsage.usageMap[hash], 30, "Amount of User Apps Usage = 30");
//        });
//    });

    test("AppType display name corresponds to type", function () {
        equal(AppType.getDisplayName(AppType.OVP), resources.i18n.getText("Apptype.OVP"), "Translated text for OVP is \"" + resources.i18n.getText("Apptype.OVP") + "\"");
        equal(AppType.getDisplayName(AppType.SEARCH), resources.i18n.getText("Apptype.SEARCH"), "Translated text for SEARCH is \"" + resources.i18n.getText("Apptype.SEARCH") + "\"");
        equal(AppType.getDisplayName(AppType.FACTSHEET), resources.i18n.getText("Apptype.FACTSHEET"), "Translated text for FACTSHEET is \"" + resources.i18n.getText("Apptype.FACTSHEET") + "\"");
        equal(AppType.getDisplayName(AppType.COPILOT), resources.i18n.getText("Apptype.COPILOT"), "Translated text for COPILOT is \"" + resources.i18n.getText("Apptype.COPILOT") + "\"");
        equal(AppType.getDisplayName(AppType.URL), resources.i18n.getText("Apptype.URL"), "Translated text for URL is \"" + resources.i18n.getText("Apptype.URL") + "\"");
        equal(AppType.getDisplayName(AppType.APP), resources.i18n.getText("Apptype.APP"), "Translated text for APP is \"" + resources.i18n.getText("Apptype.APP") + "\"");
        equal(AppType.getDisplayName("None-standard"), resources.i18n.getText("Apptype.APP"), "Translated text for non-standard app type is \"" + resources.i18n.getText("Apptype.APP") + "\"");
    });

    module("sap.ushell.services.UserRecents", {
        setup: function () {
            delete sap.ushell.Container;
            // the config has tof be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // avoid loading default dependencies (scaffolding lib) in unit test
            window["sap-ushell-config"] = window["sap-ushell-config"] || {};
            window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
            window["sap-ushell-config"].services.Ui5ComponentLoader = {
                config: {
                    loadDefaultDependencies: false
                }
            };
            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container.getServiceAsync("UserRecents").then(function (userRecentsService) {
                    oUserRecentsService = userRecentsService;
                    start();
                });
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);
            oUserRecentsService = null;

            //clear personalization cache
            var oPersCache = WindowAdapter.prototype;
            if (oPersCache && oPersCache.data) {
                oPersCache.data = {};
            }
        }
    });

    test("Add frequent activity once", function (assert) {
        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var oActivity = {
                title: "title on desktop 2",
                appType: AppType.FACTSHEET,
                appId: "#Action-toappnavsample",
                url: "#Action-toappnavsample&/View2"
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");
            var initialNumOfEntries = aFrequentActivity.length;

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                    //validate amount of apps  = same as before
                    ok(aFrequentActivity !== undefined, "User Frequent activity return");
                    ok(aFrequentActivity.length === initialNumOfEntries, "The activity was not added to the Frequently Used list");

                    done();
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    test("Add frequent activity twice", function (assert) {
        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var oActivity = {
                title: "BO application",
                appType: AppType.FACTSHEET,
                appId: "#Action-toappnavsample",
                url: "#Action-toappnavsample&1837"
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");
            var initialNumOfEntries = aFrequentActivity.length;

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                        //validate amount of apps  = same as before + 1
                        ok(aFrequentActivity !== undefined, "User Frequent activity return");
                        ok(aFrequentActivity.length === initialNumOfEntries + 1, "The activity was added to the Frequently Used list");

                        done();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });


    test("Update activity that is already in the frequent activity list", function (assert) {
        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var oActivity = {
                title: "Search application",
                appType: AppType.SEARCH,
                appId: "#Action-todefaultapp",
                url: "#Action-search&/searchterm=Sample%20App"
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");
            var initialNumOfEntries = aFrequentActivity.length;

            ok(aFrequentActivity[0].appId !== oActivity.appId, "most frequent activity is not oActivity");

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                        //validate amount of apps  = same as before
                        ok(aFrequentActivity !== undefined, "User Frequent activity return");
                        ok(aFrequentActivity.length === initialNumOfEntries, "the number of frequent activities in the list was not changed");

                        done();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    test("Set multi frequent activities of the same application", function (assert) {
        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "New application2",
                    appType: AppType.APP,
                    appId: "#new-app2",
                    url: "#new-app2"
                }, numberFrequentActivities = aFrequentActivity.length, // 1 from the previous test
                numberAddedActivities = 0;

            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#new-app2": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");

            var addActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {

                    numberAddedActivities++;
                    if (numberAddedActivities < 12) {
                        addActivityFn();
                    }
                    if (numberAddedActivities == 12) {
                        testActivityFn();
                    }
                }.bind(this));
            }.bind(this);

            testActivityFn = function () {
                oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                    //validate amount of apps  = same as before + 1
                    ok(aFrequentActivity !== undefined, "User Frequent activity return");
                    ok(aFrequentActivity.length === numberFrequentActivities + 1, "Only one activity was added to the frequent activities list");
                    deepEqual(aFrequentActivity[0].appId, oActivity.appId, "Most frequent activity is oActivity");
                    done();
                }.bind(this));
            }.bind(this);

            addActivityFn();
        }.bind(this));
    });

    test("Set more than 30 frequent activities with a different application id", function (assert) {
        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var testActivityFn,
                oActivity = {
                    title: "OVP application2",
                    appType: AppType.OVP,
                    appId: "#Action-todefaultapp2",
                    url: "#Action-todefaultapp&18992"
                },
                numberAddedActivities = 0;

            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#Action-todefaultapp2": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");

            var addActivityFn = function () {
                oActivity.url += "x";
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.addActivity(oActivity).done(function () { //Add twice for it to get to the frequently used list
                        numberAddedActivities++;
                        if (numberAddedActivities < 40) {
                            addActivityFn();
                        }
                        if (numberAddedActivities == 40) {
                            testActivityFn();
                        }
                    }.bind(this));
                }.bind(this));
            }.bind(this);

            testActivityFn = function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                        //validate amount of apps  = 30
                        ok(aFrequentActivity !== undefined, "User Frequent activity return");
                        equal(aFrequentActivity.length, 30, "30 datasets");
                        equal(aFrequentActivity[0].appId, oActivity.appId, "Most frequent activity is oActivity");
                        done();
                    }.bind(this));
                }.bind(this));
            }.bind(this);

            addActivityFn();
        }.bind(this));
    });

    module("sap.ushell.services.UserRecents", {
        setup: function () {
            delete sap.ushell.Container;
            // the config has tof be reset after the test
            if (!sCachedConfig) {
                sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            }

            // avoid loading default dependencies (scaffolding lib) in unit test
            window["sap-ushell-config"] = window["sap-ushell-config"] || {};
            window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
            window["sap-ushell-config"].services.Ui5ComponentLoader = {
                config: {
                    loadDefaultDependencies: false
                }
            };

            stop(); // suspend qUnit execution until the bootstrap finishes loading
            sap.ushell.bootstrap("local").done(function () {
                sap.ushell.Container.getServiceAsync("UserRecents").then(function (userRecentsService) {
                        oUserRecentsService = userRecentsService;
                        start();
                });
            });
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            delete sap.ushell.Container;
            window["sap-ushell-config"] = JSON.parse(sCachedConfig);

            //clear personalization cache
            var oPersCache = WindowAdapter.prototype;
            if (oPersCache && oPersCache.data) {
                oPersCache.data = {};
            }
            oUserRecentsService = null;
        }
    });

    test("Test activity that was not used for 30 days", function (assert) {
        var mockData = {
                recentDay: "2016/5/21",
                recentUsageArray: [{ aUsageArray: [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    desktop: true,
                    iCount: 5,
                    iTimestamp: 1378478828152,
                    oItem: {
                        title: "New application3",
                        appType: AppType.APP,
                        appId: "#new-app3",
                        url: "#new-app3",
                        timestamp: 1378478828152 }

                }]
            };

        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"]["ITEM#RecentActivity"] = mockData;

        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var oActivity = {
                title: "New application3",
                appType: AppType.APP,
                appId: "#new-app3",
                url: "#new-app3"
            };
            var bFound = false;
            for (var i = 0; i < aFrequentActivity.length; i++) {
                if (aFrequentActivity[i].appId === oActivity.appId) {
                    bFound = true;
                }
            }
            ok(bFound === false, "The application should not be in the frequently used apps");
            done();

        }.bind(this));
    });


    test("Test activity that was used every day", function (assert) {
        var mockData = {
            recentDay: "2016/5/21",
            recentUsageArray: [{ aUsageArray: [5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
                desktop: true,
                iCount: 295,
                iTimestamp: 1378478828152,
                oItem: {
                    title: "New application4",
                    appType: AppType.APP,
                    appId: "#new-app4",
                    url: "#new-app4",
                    timestamp: 1378478828152 }

            },
            {
                aUsageArray: [0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
                desktop: true,
                iCount: 291,
                iTimestamp: 1378478828152,
                oItem: {title: "New application5",
                    appType: AppType.APP,
                    appId: "#new-app5",
                    url: "#new-app5",
                    timestamp: 1378478828152 }

            }]
        };


        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"]["ITEM#RecentActivity"] = mockData;

        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
            var oActivity = {
                title: "New application4",
                appType: AppType.APP,
                appId: "#new-app4",
                url: "#new-app4"
            };

            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#new-app4": {"supported": true},
                        "#new-app5": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");
            ok(aFrequentActivity[0].appId != oActivity.appId, "most frequent activity is not oActivity");
            var initialNumOfEntries = aFrequentActivity.length;

            oUserRecentsService.addActivity(oActivity).done(function () {
                oUserRecentsService.addActivity(oActivity).done(function () {
                    oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                        //validate amount of apps  = same as before
                        ok(aFrequentActivity !== undefined, "User Frequent activity return");
                        ok(aFrequentActivity.length === initialNumOfEntries, "the number of frequent activities in the list was not changed");
                        ok(aFrequentActivity[0].appId === oActivity.appId, "most frequent activity is oActivity");

                        done();
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    });

    test("Test no activity saved before", function (assert) {

        // resetting the mock data
        var mockData;
        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"]["ITEM#RecentActivity"] = mockData;

        var done = assert.async();
        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {

            var oActivity1 = {
                title: "New application1",
                appType: AppType.APP,
                appId: "#new-app1",
                url: "#new-app1"
            };
            var oActivity2 = {
                title: "New application2",
                appType: AppType.APP,
                appId: "#new-app2",
                url: "#new-app2"
            };

            // override isIntentSupported
            var fOrigIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
                var oDeferred = new jQuery.Deferred();
                oDeferred.resolve(
                    {
                        "#new-app1": {"supported": true},
                        "#new-app2": {"supported": true}
                    });
                return oDeferred.promise();
            };

            ok(aFrequentActivity !== undefined, "User Frequent activity return");
            ok(aFrequentActivity.length === 0, "No activities");

            // (1) - add activity1 for the first time
            oUserRecentsService.addActivity(oActivity1).done(function () {

                // (1.1) - see that we have no frequent activities (as atcivity1 was added only once)
                oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                    ok(aFrequentActivity !== undefined, "User Frequent activity return");
                    ok(aFrequentActivity.length === 0, "No activities");

                    // (1.2) - add activity1 one more time
                    oUserRecentsService.addActivity(oActivity1).done(function () {

                        // (1.3) - see that now we have once frequent activity which is activity1 as it was added twice
                        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                            ok(aFrequentActivity !== undefined, "User Frequent activity return");
                            ok(aFrequentActivity.length === 1, "One activity");
                            ok(aFrequentActivity[0].appId === oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

                            // (2) - add activity2 for the first time
                            oUserRecentsService.addActivity(oActivity2).done(function () {

                                // (2.1) - see that we still have only one activity (as activity2 was added only once)
                                oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {
                                    ok(aFrequentActivity.length === 1, "One activity");
                                    ok(aFrequentActivity[0].appId === oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

                                    // (2.2) - add activity2 one more time
                                    oUserRecentsService.addActivity(oActivity2).done(function () {

                                        // (2.3) - see that we have two activities (as activity2 was added twice)
                                        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {

                                            // (2.4) - see that the order of the returned activities matches the order of usage
                                            // NOTE that now the order of activities had changed
                                            ok(aFrequentActivity.length === 2, "Two activity");
                                            ok(aFrequentActivity[0].appId === oActivity2.appId, "most frequent activity is activity with app " + oActivity2.appId);
                                            ok(aFrequentActivity[1].appId === oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);

                                            // (3) - add activity2 one more time
                                            oUserRecentsService.addActivity(oActivity2).done(function () {

                                                // (3.1) - see that the order of the returned activities matches the order of usage
                                                ok(aFrequentActivity.length === 2, "Two activity");
                                                ok(aFrequentActivity[0].appId === oActivity2.appId, "most frequent activity is activity with app " + oActivity2.appId);
                                                ok(aFrequentActivity[1].appId === oActivity1.appId, "most frequent activity is activity with app " + oActivity1.appId);


                                                // (4) - now add activity1 again
                                                oUserRecentsService.addActivity(oActivity1).done(function () {

                                                    // (4.1) - see that the order had changed again
                                                    oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {

                                                        // (3.1) - see that the order of the returned activities matches the order of usage
                                                        ok(aFrequentActivity.length === 2, "Two activity");
                                                        ok(aFrequentActivity[0].appId === oActivity1.appId, "most frequent activity is activity with app " + oActivity2.appId);
                                                        ok(aFrequentActivity[1].appId === oActivity2.appId, "most frequent activity is activity with app " + oActivity1.appId);

                                                        done();
                                                        // restore the overriden method
                                                        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = fOrigIsIntentSupported;
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });


    test("Test migration of previous data to current data - check backwards compatability", function (assert) {

        // use Mock Data of previous data-structure and check that functionality with previous data is not affected
        var mockData = [
            { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 2, "iTimestamp": 1378478828152, "oItem": {"icon": "sap-icon://search", "title": "Search application - just to test long text wrapping", "appType": AppType.SEARCH, "appId": "#Action-todefaultapp", url: "#Action-search&/searchterm=Sample%20App", "timestamp": 1378478828152}},
            { desktop: undefined, tablet: undefined, mobile: undefined, "iCount": 1, "iTimestamp": 1378478828146, "oItem": {"title": "title on desktop 2", "appType": AppType.APP, "appId": "#Action-toappnavsample", url: "#Action-toappnavsample?a=122", "timestamp": 1378478828152}}
        ];
        jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config", 0).personalizationData["sap.ushell.personalization#sap.ushell.services.UserRecents"]["ITEM#RecentActivity"] = mockData;

        // override isIntentSupported
        var fOrigIsIntentSupported = sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported;
        sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = function () {
            var oDeferred = new jQuery.Deferred();
            oDeferred.resolve(
                {
                    "#new-app1": {"supported": true},
                    "#Action-toappnavsample": {"supported": true}
                });
            return oDeferred.promise();
        };

        // new activity to add
        var oNewActivity = {
            title: "New application1",
            appType: AppType.App,
            appId: "#new-app1",
            url: "#new-app1"
        };

        // existing activity to add
        var oExistingActivity = {
            title: "title on desktop 2",
            appType: AppType.APP,
            appId: "#Action-toappnavsample",
            url: "#Action-toappnavsample?a=122"
        };

        var done = assert.async();
        // add the 2 activities
        oUserRecentsService.addActivity(oNewActivity).done(function () {
            oUserRecentsService.addActivity(oExistingActivity).done(function () {

                // see that nothing was affected and API's had worked as expected
                // we expect no results as - when moving to the new data structure, all counts are initialized to 0.
                oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {

                    // see that we still have 2 activities as the new activity added only once
                    // check also that the order of the activities now is updated
                    ok(aFrequentActivity.length === 0, "No activities");

                    // now add again the new activity
                    oUserRecentsService.addActivity(oNewActivity).done(function () {
                        // see that now we have only one - the new-activity
                        oUserRecentsService.getFrequentActivity().done(function (aFrequentActivity) {

                            ok(aFrequentActivity.length === 1, "one activity");
                            ok(aFrequentActivity[0].appId === oNewActivity.appId, "most frequent activity is activity with app " + oNewActivity.appId);

                            done();
                            // restore the overriden method
                            sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported = fOrigIsIntentSupported;
                        });
                    });
                });
            });
        });
    });

});
