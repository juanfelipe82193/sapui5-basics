// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for AppConfiguration
 */
sap.ui.require([
    "sap/ushell/services/AppType",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/test/utils",
    "sap/ushell/EventHub",
    "sap/base/i18n/ResourceBundle",
    "sap/base/util/ObjectPath"
], function (AppType, AppConfiguration, testUtils, EventHub, ResourceBundle, ObjectPath) {
    "use strict";
    /* global module test ok sinon equals hasher start */
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");

    var historyBackStub,
        hasherStub,
        addMetadataSpy;

    module("AppConfiguration", {
        setup: function () {
            historyBackStub = sinon.stub(window.history, 'back');
            if (!sap.ushell.Container) {
                stop();
                sap.ushell.bootstrap("local").then(start);
            }
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            testUtils.restoreSpies(
                    historyBackStub,
                    hasherStub,
                    addMetadataSpy
            );
            delete sap.ushell.Container;
        }
    });

    var demoAppData = {
            "additionalInformation": "SAPUI5.Component=AppScflTest",
            "applicationType": "URL",
            "url": "/ushell/test-resources/sap/ushell/demoapps/AppScflTest?test=testParam",
            "description": "AppScflTest "
        };

    var getFavicon = function () {
            var favicon,
                nodeList = document.getElementsByTagName("link"),
                i;

            for (i = 0; i < nodeList.length; i++) {
                if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
                    favicon = nodeList[i].getAttribute("href");
                }
            }
            return favicon;
        },
        getMetadataObject = function (applicationUrl, oComponentHandle) {
            var oSrvc = AppConfiguration;
            return oSrvc.getMetadata({
                additionalInformation: "SAPUI5.Component=componentName",
                applicationType: "URL",
                url: applicationUrl,
                componentHandle : oComponentHandle
            });
        };

    test("getService", function () {
        var oSrvc = AppConfiguration;

        ok(oSrvc === AppConfiguration);
    });

    test("get Application name", function () {
        var oSrvc = AppConfiguration;
        ok(oSrvc.getApplicationName(demoAppData) === "AppScflTest");
    });

    test("get Application url", function () {
        var oSrvc = AppConfiguration;
        ok(oSrvc.getApplicationUrl(demoAppData) === "/ushell/test-resources/sap/ushell/demoapps/AppScflTest/");
    });

    /*
    // Disable the test until clarified why it fails in Jenkins only
    test("add Application settings button twice", function (assert) {
        var oSrvc = AppConfiguration,
            oApp = {url:"app"},
            oRenderer,
            oContainer,
            done = assert.async();

        oContainer = sap.ushell.Container.createRenderer("fiori2");
        oRenderer = sap.ushell.Container.getRenderer("fiori2");
        //the requests queue used for requests that should be performed only after the application is renderered and is empty at the initial state.
        var q = oSrvc.getApplicationRequestQueue();
        equals(q.length, 0, "the request queue should be 0");
        oSrvc.setCurrentApplication(oApp);
        oSrvc.setApplicationInInitMode();
        oSrvc.addApplicationSettingsButtons([new sap.m.Button({text: "addTwiceButtonTest", id: "addTwiceButtonTest"})]);
        q = oSrvc.getApplicationRequestQueue();
        //the application has not yet renderered, so the queue is filled with one request
        equals(q.length, 1, "the request queue should be 1");

        EventHub.emit("AppRendered", oApp);

        EventHub.wait("AppRendered").then(function () {
            //no the application is renderered and the queue should get read , causes it to get empty
            equals(q.length, 0, "the request queue should be 0");
            oSrvc.addApplicationSettingsButtons([new sap.m.Button({text: "addTwiceButtonTest2", id: "addTwiceButtonTest2"})]);
            q = oSrvc.getApplicationRequestQueue();
            //in this case, the application is already renderered and a button is added during its run time, hence the queue should not get filled.
            equals(q.length, 0, "the request queue should be 0");
            oRenderer.destroy();
            oContainer.destroy();
            done();
        });
    });
    */

    test("Application initialization flow with API calls to addApplicationSettingsButton", function (assert) {
        var oSrvc = AppConfiguration,
            oApp1 = {url:"app1"},
            oApp2 = {url:"app2"},
            aButtons = [new sap.m.Button({text: "addButtonTest", id: "addButtonTest"})],
            oRenderer,
            oContainer,
            done = assert.async();

        sap.ui.Device.system.phone = true;
        oContainer = sap.ushell.Container.createRenderer("fiori2");
        oRenderer = sap.ushell.Container.getRenderer("fiori2");
        var showActionButtonStub = sinon.stub(oRenderer, "showActionButton");
        oSrvc.setCurrentApplication(oApp1);
        //mock core-ext-light loading
        sap.ui.getCore().byId("mainShell").getController()._loadCoreExt = sinon.spy();
        EventHub.emit("AppRendered", oApp1);

        EventHub.wait("AppRendered").then(function () {
            //check scenario where the current app is already opened
            //in this case the API should be called with no delay
            oSrvc.addApplicationSettingsButtons(aButtons);
            equals(showActionButtonStub.callCount, 1, "showActionButton should be called as app is already opened");

            //check scenario where the current app is not opened
            //in this case the API should be called with delay
            oSrvc.setCurrentApplication(oApp2);
            oSrvc.setApplicationInInitMode();
            oSrvc.addApplicationSettingsButtons(aButtons);
            equals(showActionButtonStub.callCount, 1, "showActionButton should not be called as app is not yet opened");

            //trigger the application open event so the api will get called
            oSrvc.setApplicationInInitMode();
            EventHub.emit("AppRendered", oApp2);
            EventHub.wait("AppRendered").then(function () {
                EventHub.once("AppRendered")
                .do(function () {
                //check scenario where the current app is not opened and failed in its initialization flow
                //after calling the API's, we check that those API's calles are not trigger on a different
                //app in this case the API should be called with delay
                oSrvc.setCurrentApplication(oApp1);
                oSrvc.addApplicationSettingsButtons(aButtons);
                equals(showActionButtonStub.callCount, 2, "showActionButton should be called when app is opened");
                            //set current app to different one as App1 failed
                oSrvc.setApplicationInInitMode();
                oSrvc.setCurrentApplication(oApp2);
                //trigger the application open event so the api will get called
                EventHub.emit("AppRendered", oApp2);
                EventHub.wait("AppRendered").then(function () {

                    EventHub.once("AppRendered")
                    .do(function () {
                        equals(showActionButtonStub.callCount, 2, "showActionButton should not be called as API was called by a different app");

                        showActionButtonStub.restore();
                        oRenderer.destroy();
                        oContainer.destroy();
                        sap.ui.Device.system.phone = false;
                        done();
                    });
                });
                });
            });

        });
    });

    test("set Window Title", function () {
        var oSrvc = AppConfiguration,
            newTitleName = "RenamedTitle";
        oSrvc.setWindowTitle(newTitleName);
        ok(document.title === newTitleName);
    });

    test("set Window Favicon", function () {
        var oSrvc = AppConfiguration,
            oFavIconProperties;

        oFavIconProperties = {'favicon': '/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico'};
        oSrvc.setIcons(oFavIconProperties);
        ok(getFavicon() === oFavIconProperties.favicon);
    });

    /**
     * Tested function: getMetadataObject
     *
     * Reading metadata from the component configuration when manifest does not exist
     */
    test("Get metadata from application configuration", function () {
        var oMetadata,
        // the method will no longer load a component,
        // this is done by UI5ComponentLoader
        //
            // Stub for the function sap.ui.component.load that returns the component object,
            // including the component's configuration and manifest
            fakeComponentHandle = {
                getMetadata : function () {
                    return {
                        getConfig: function () {
                            return {
                                "title": "Configuration title",
                                "icon" : "Configuration icon URL"
                            };
                        },
                        getVersion: function () {return "version"; },
                        getComponentName : function () {return "Lib Name"; },
                        getManifest: function () {
                            return undefined;
                        },
                        getManifestEntry: function (key) {
                            return undefined;
                        }
                    };
                }
            };

        oMetadata = getMetadataObject("applicationUrl1", fakeComponentHandle);

        ok(oMetadata !== undefined);
        oMetadata = undefined;
    });

    /**
     * Tested function: getMetadataObject
     *
     * Verifies that component-configuration metadata is translated correctly in case that translation is required
     *
     * Value translation is required if the component configuration includes another property whose key is composed of the original key + the string "Resource".
     * e.g. For translating the value of the property "title" - there's another configuration property: "titleResource": "TITLE_KEY".
     * The value (e.g. "TITLE_KEY") is the translation key in the resource bundle
     *
     */
    test("Get translated metadata from application configuration", function () {
        var oMetadata,

            // Stub for the function sap.ui.component.load that returns the component object,
            // including the component's configuration and manifest
            oFakeComponentHandle = {
                getMetadata : function () {
                    return {
                        getConfig: function () {
                            return {
                                "title": "Configuration title",
                                "titleResource": "TITLE_KEY",
                                "icon": "Configuration icon URL",
                                "resourceBundle": "Resource_bundle_URL.properties"
                            };
                        },
                        getVersion: function () {return "version"; },
                        getComponentName : function () {return "Lib Name"; },
                        getManifest: function () {
                            return undefined;
                        },
                        getManifestEntry: function (key) {
                            return undefined;
                        }
                    };
                }
            },
            stubResourceBundle = sinon.stub(ResourceBundle, "create").returns({
                getText: function (key) {
                    var oTranslations = {
                            "TITLE_KEY" : "translated configuration title"
                        };

                    return oTranslations[key];
                }
            });

        window.hasher = window.hasher || { getHash: function() {} };
        hasherStub = sinon.stub(hasher, "getHash").returns("aaa-bbb");

        oMetadata = getMetadataObject("applicationUrl2", oFakeComponentHandle);

        ok(oMetadata !== undefined);
        ok(oMetadata.title == "translated configuration title");

        oMetadata = undefined;
        stubResourceBundle.restore();
        hasherStub.restore();
    });

    /**
     * Tested function: getMetadataObject
     *
     * Reading metadata from the manifest, if exists.
     * As for properties that does not exist in the manifest (in this test - the property "tablet") -
     * the value is taken from the component configuration (property name: "homeScreenIconTablet").
     */
    test("Get metadata from application manifest", function () {
        var oMetadata,
            manifestForTest = {
                "_version": "100.100.000",
                "sap.ui": {
                    "technology": "UI5",
                    "icons": {
                        "icon": "Icon URL from manifest",
                        "favIcon": "Favicon URL from manifest",
                        "phone": "Phone app pic from manifest",
                        "phone@2": "Phone app pic2 from manifest",
                        // Tablet app pic property is removed form the manifest on purpose
                        //  in order to verify that the value is taken from the application configuration
                        // "tablet": "Tablet app pic from manifest",
                        "tablet@2": "Tablet app pic2 from manifest"
                    }
                },
                "sap.ui5": {},
                "sap.fiori": {},
                "sap.app": {
                    "title": "Title from manifest"
                }
            },

            // Stub for the function sap.ui.component.load that returns the component object,
            // including the component's configuration and manifest
            oFakeComponentHandle = {
                getMetadata : function () {
                    return {
                        getConfig: function () {
                            return {
                                "title": "Title from configuration",
                                "icon" : "Icon URL from configuration",
                                "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png"
                            };
                        },
                        getVersion: function () {return "version"; },
                        getComponentName : function () {return "Lib Name"; },
                        getManifest: function () {
                            return manifestForTest;
                        },
                        getManifestEntry: function (key) {
                            if (key  == "sap.app") {
                                return manifestForTest["sap.app"];
                            } else if (key == "sap.ui") {
                                return manifestForTest["sap.ui"];
                            } else if (key == "sap.fiori") {
                                return manifestForTest["sap.fiori"];
                            }
                        }
                    };
                }
            };

        window.hasher = window.hasher || { getHash: function() {} };
        hasherStub = sinon.stub(hasher, "getHash").returns("aaa-bbb2");

        oMetadata = getMetadataObject("applicationUrl3", oFakeComponentHandle);

        ok(oMetadata !== undefined);
        ok(oMetadata.title == "Title from manifest");
        ok(oMetadata["homeScreenIconTablet@2"] == "applicationUrl3/Tablet app pic2 from manifest");
        ok(oMetadata.homeScreenIconTablet == "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png");

        oMetadata = undefined;
        //stubLoadedComponent.restore();
        hasherStub.restore();
    });

    test("Test App caching", function () {
        var oSrvc = AppConfiguration,
            oComponentHandle = {
                getMetadata : function () {
                    return {
                        getConfig: function () {
                            return {
                                "title": "App Caching Test Title",
                                "icon" : "App Caching Test URL"
                            };
                        },
                        getVersion: function () {return "version"; },
                        getComponentName : function () {return "Lib Name"; },
                        getManifest: function () {
                            return undefined;
                        },
                        getManifestEntry: function (key) {
                            return undefined;
                        }
                    };
                }
            },
            oRetrievedMetaData,
            oAppData = {
                title: "testApp",
                additionalInformation: "SAPUI5.Component=componentName",
                applicationType: "URL",
                url: "/some/url",
                componentHandle : oComponentHandle
            };

        window.hasher = window.hasher || { getHash: function() {} };
        hasherStub = sinon.stub(hasher, "getHash").returns('aaa-bbb3?a=1&b=2');
        addMetadataSpy = sinon.spy(oSrvc, "addMetadata");

        oRetrievedMetaData = oSrvc.getMetadata(oAppData);
        ok(addMetadataSpy.calledOnce, 'App metadata was added');
        ok(oRetrievedMetaData.title === 'App Caching Test Title', 'Verify title in metadata');
        ok(oRetrievedMetaData.icon === 'App Caching Test URL', 'Verify title in metadata');

        hasherStub.restore();
        //Simulate navigation to the save app (same hash) but the parameters are in a different order.
        hasherStub = sinon.stub(hasher, "getHash").returns('aaa-bbb3?b=2&a=1');
        oSrvc.getMetadata(oAppData);
        ok(addMetadataSpy.callCount === 1, 'App metadata should not be added as it was already cached');

        hasherStub.restore();
        //Simulate navigation to the save app (hash is similar) but one parameter was removed.
        hasherStub = sinon.stub(hasher, "getHash").returns('aaa-bbb3?a=1');
        oSrvc.getMetadata(oAppData);
        ok(addMetadataSpy.callCount === 2, 'App metadata should be added as it the parameters of the hash are different');

        hasherStub.restore();
    });

    test("Test App caching - metadata is updated if not complete", function (assert) {
        // due to the complex life cycle and the global nature of the AppConfiguration service, application metadata is
        // mainly filled by side effects; this should be cleaned up completely; for now, we ensure that there are no stale
        // cache entries with incomplete UI5 component metadata if the metadata was requested before the UI5 component was loaded
        // see internal BCP 241372 / 2016

        var oSrvc = AppConfiguration,

        manifestForTest = {
                "_version": "100.100.000",
                "sap.ui": {
                    "technology": "UI5"
                },
                "sap.ui5": {},
                "sap.fiori": {},
                "sap.app": {
                    "title": "Title from manifest"
                }
            },

            // Stub for the function sap.ui.component.load that returns the component object,
            // including the component's configuration and manifest
            oFakeComponentHandle = {
                getMetadata : function () {
                    return {
                        getConfig: function () {
                            return {
                                "title": "Title from configuration",
                                "fullWidth" : true,
                                "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png"
                            };
                        },
                        getVersion: function () {return "version"; },
                        getComponentName : function () {return "Lib Name"; },
                        getManifest: function () {
                            return manifestForTest;
                        },
                        getManifestEntry: function (key) {
                            if (key  == "sap.app") {
                                return manifestForTest["sap.app"];
                            } else if (key == "sap.ui") {
                                return manifestForTest["sap.ui"];
                            } else if (key == "sap.fiori") {
                                return manifestForTest["sap.fiori"];
                            }
                        }
                    };
                }
            },
            addMetadataSpy = sinon.spy(oSrvc, "addMetadata"),
            oRetrievedMetaData,
            oAppData = {
                text: "Title from app data",
                additionalInformation: "SAPUI5.Component=componentName",
                applicationType: "URL",
                url: "/some/url",
                componentHandle : undefined     // initially undefined
            };

        // need a unique hash because the service is a singleton
        window.hasher = window.hasher || { getHash: function() {} };
        hasherStub = sinon.stub(hasher, "getHash").returns('test-MetadataUpdateIfNotComplete?a=1&b=2');

        // first call to getMetadata - should fill cache, but metadata should be incomplete
        oRetrievedMetaData = oSrvc.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 1, 'Expected addMetaData was called once');
        assert.strictEqual(oRetrievedMetaData.complete, false, 'Expected metadata complete flag set to false if requested before ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.title, 'Title from app data', 'Expected title from application data if requested before ui5 component loaded');
        assert.ok(!oRetrievedMetaData.fullWidth, 'Expected fullWidth to be falsy if requested before ui5 component loaded');

        // second call to getMetadata - should fill cache, but metadata should still be incomplete
        oRetrievedMetaData = oSrvc.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 2, 'Expected addMetaData was called twice');
        assert.strictEqual(oRetrievedMetaData.complete, false, 'Expected metadata complete flag set to false if requested before ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.title, 'Title from app data', 'Expected title from application data if requested before ui5 component loaded');
        assert.ok(!oRetrievedMetaData.fullWidth, 'Expected fullWidth to be falsy if requested before ui5 component loaded');

        // now set the component handle and call getMetadata again - should be set to complete now and contain metadata from component
        oAppData.componentHandle = oFakeComponentHandle;

        oRetrievedMetaData = oSrvc.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 3, 'Expected addMetaData was called 3 times');
        assert.strictEqual(oRetrievedMetaData.complete, true, 'Expected metadata complete flag set to true if requested after ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.title, 'Title from manifest', 'Expected title from component manifest if requested after ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.fullWidth, true, 'Expected fullWidth from component manifest (config) if requested after ui5 component loaded');

        // now we call getMetadata once again and expect that addMetadata is not called anymore, because the data is now complete and fetched from cache
        oRetrievedMetaData = oSrvc.getMetadata(oAppData);

        assert.strictEqual(addMetadataSpy.callCount, 3, 'Expected addMetaData was called 3 times');
        assert.strictEqual(oRetrievedMetaData.complete, true, 'Expected metadata complete flag set to true if requested after ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.title, 'Title from manifest', 'Expected title from component manifest if requested after ui5 component loaded');
        assert.strictEqual(oRetrievedMetaData.fullWidth, true, 'Expected fullWidth from component manifest (config) if requested after ui5 component loaded');
    });

    test("Test processing of the app hash", function () {
        var oSrvc = AppConfiguration;

        ok(oSrvc._processKey('test-intent') === 'test-intent', 'test hash processing when the Intent is parameterless');
        ok(oSrvc._processKey('test-intent?b=2&a=1&c=3&e=5&d=4') === 'test-intent?a=1&b=2&c=3&d=4&e=5', 'test hash processing - assure the parameters are lexicographically ordered');
        ok(oSrvc._processKey('test-intent?a={coordinate: {x: 1, y: 3}}') === 'test-intent?a={coordinate: {x: 1, y: 3}}', 'test hash processing - parameters with object structure');
    });

    test("Test Add Recent Activity general functionality with app icon", function (assert) {
        //Add a new recent activity entry, verify that entry is added
        //All the properties are matching the newly added entry.
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            bObject1IsPresent,
            bObject2IsPresent,
            iNumOfEntries,
            oRecentEntry1,
            sTitle = "Functionality test with icon",
            sAppType = AppType.OVP,
            sAppId = "#UI2Fiori2SampleApps-AppScflTest",
            sUrl = "UI2Fiori2SampleApps-AppScflTest&34567",
            sIcon = "sap-icon//pool";

        var oApplicationObject1 = {
            icon: sIcon,
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function (oItem) {
                if (oItem.appId === oApplicationObject1.appId) {
                    bObject1IsPresent = true;
                }
            });

            oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
                oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                    aActivity.forEach(function(oItem) {
                        if (oItem.appId === "#UI2Fiori2SampleApps-AppScflTest") {
                            if (oItem.url === "UI2Fiori2SampleApps-AppScflTest&34567") {
                                oRecentEntry1 = oItem;
                                bObject2IsPresent = true;
                            }
                        }

                    });
                    assert.ok(!bObject1IsPresent, "New entry was not initially in the recent activity list");
                    assert.ok(bObject2IsPresent, "New entry is added to the recent activity list");
                    assert.ok(aActivity.length === iNumOfEntries + 1, "New entry was added");
                    assert.ok(oRecentEntry1.icon === sIcon, "The icon is properly set");
                    assert.ok(oRecentEntry1.appType ===  sAppType, "The appType is properly set");
                    assert.ok(oRecentEntry1.title ===  sTitle, "The title is properly set");
                    done();
                });
            });
        });
    });


    test("Test Add Recent Activity by BO application new entry", function (assert) {
        //A New entry should be created in the recent activities.
        //One object is already exists in the service mock configuration
        //With the same app id Action-toappnavsample, but different url
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            bObject1IsPresent,
            bObject2IsPresent,
            iNumOfEntries,
            oRecentEntry1,
            oRecentEntry2,
            sTitle = "BO application",
            sAppType = "FactSheet",
            sAppId = "#Action-toappnavsample",
            sUrl = "#Action-toappnavsample&12245";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };

        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function(oItem) {
                if (oItem.appId === sAppId) {
                    oRecentEntry1 = oItem;
                }
            });
        });

        oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
            oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                aActivity.forEach(function(oItem) {
                    if (oItem.appId === sAppId) {
                        if (oItem.url === sUrl) {
                            oRecentEntry2 = oItem;
                            bObject2IsPresent = true;
                        } else {
                            bObject1IsPresent = true;
                        }
                    }

                });
                oApplicationObject1.timestamp = oRecentEntry2.timestamp;
                assert.ok(oRecentEntry2.appId === oRecentEntry1.appId, "New entry is added with the same app id");
                assert.ok(oRecentEntry2.url !== oRecentEntry1.url, "New entry is added with different url");
                assert.ok(aActivity.length === iNumOfEntries + 1, "New entry is added");
                assert.ok(bObject2IsPresent && bObject1IsPresent, "Both enties are in the list");
                assert.deepEqual(oRecentEntry2, oApplicationObject1, "Most recent activity is oApplicationObject1");
                done();
            });
        });

    });
    test("Test Add Recent Activity by BO application update entry", function (assert) {
        //Existing entry should be updated with newer timestamp
        //One object is already exists in the service mock configuration
        //With the same app id and same url
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            oRecentEntry1,
            oRecentEntry2,
            iNumOfEntries,
            sTitle = "BO application",
            sAppType = "FactSheet",
            sAppId = "#Action-toappnavsample",
            sUrl = "#Action-toappnavsample&/View2";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };
        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function(oItem) {
                if (oItem.url === oApplicationObject1.url) {
                    oRecentEntry1 = oItem;
                }
            });
        });
        oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
            oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                aActivity.forEach(function(oItem) {
                   if (oItem.url === sUrl) {
                       oRecentEntry2 = oItem;
                   }
                });
                assert.ok(oRecentEntry2.url === oRecentEntry1.url, "The url is the same");
                assert.ok(oRecentEntry2.timestamp > oRecentEntry1.timestamp, "The timestamp is different");
                assert.ok(aActivity.length === iNumOfEntries, "Number of activities is the same");
                done();
            });
        });

    });
    test("Test Add Recent Activity by Search application", function (assert) {
        //In this case the search query is exactly like the one that already exists,
        //Should be overitten with newer timestamp - the comparison is done by title
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            oObject1,
            iNumOfEntries,
            sTitle = "Search query",
            sAppType = "Search",
            sAppId = "#Action-todefaultapp",
            sUrl = "#Action-search&/searchterm=Sample%20App";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };
        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function (oItem) {
                if (oItem.url === sUrl) {
                    oObject1 = oItem;
                }
            });
            oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
                oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                    aActivity.forEach(function (oItem) {
                        if (oItem.url === sUrl) {
                            assert.ok(oItem.timestamp > oObject1.timestamp, "The entry is updated with new timestamp");
                            assert.ok(oItem.title === sTitle, "Title is the same for both entries");
                            assert.ok(aActivity.length === iNumOfEntries, "No new entry was added");
                            done();
                        }
                    });

                });
            });
        });

    });
    test("Test Add Recent Activity by Search application with different search query", function (assert) {
        //In this case the search query is exactly like the one that already exists,
        //Should be overitten with newer timestamp - the comparison is done by title
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            oObject1,
            oObject2,
            iNumOfEntries,
            bObject2IsPresent,
            bObject1IsPresent,
            sTitle = "Search query",
            sAppType = "Search",
            sAppId = "#Action-todefaultapp",
            sUrl = "#Action-todefaultapp&1267";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };
        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function (oItem) {
                if (oItem.appId === sAppId) {
                    oObject1 = oItem;
                }
            });
        });
        oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
            oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                aActivity.forEach(function (oItem) {
                    if (oItem.appId === sAppId) {
                        if (oItem.url === sUrl) {
                            oObject2 = oItem;
                            bObject2IsPresent = true;
                        } else {
                            bObject1IsPresent = true;
                        }
                    }
                });

                assert.ok(oObject2.timestamp > oObject1.timestamp, "New entry is added with different timestamp");
                assert.ok(oObject2.title === sTitle, "The title of both entries is the same");
                assert.ok(aActivity.length === iNumOfEntries + 1, "New entry is added to the list");
                assert.ok(bObject2IsPresent && bObject1IsPresent, "Both enties are in the list");
                done();


            });
        });
    });
    test("Test Add Recent Activity overrides entries with default appId", function (assert) {
        //In this case the entry with the sam appId should be overriden
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            iNumOfEntries,
            oRecentEntry1,
            sTitle = "BO application",
            sAppType = "FactSheet",
            sAppId = "#Action-toappnavsample",
            sUrl = "#Action-toappnavsample&/View2";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };
        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function(oItem) {
                if (oItem.url === sUrl) {
                    oRecentEntry1 = oItem;
                }
            });

        });
        oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {

                oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                    aActivity.forEach(function (oItem) {
                        if (oItem.url === sUrl) {
                            assert.ok(oItem.title === sTitle, true);
                            assert.ok(oItem.timestamp > oRecentEntry1.timestamp, true);
                            assert.ok(oItem.appType === sAppType);
                            assert.ok(aActivity.length === iNumOfEntries, true);
                            done();
                        }
                    });

            });
        });
    });

    test("Test Add Recent Activity, same appId, different url updates the existing entry", function (assert) {
        //Existing entry should be updated with newer timestamp
        //One object is already exists in the service mock configuration
        //With the same app id and same url
        var oAppConfigSrvc = AppConfiguration,
            done = assert.async(),
            oUserRecentSrvc = sap.ushell.Container.getService("UserRecents"),
            oRecentEntry1,
            oRecentEntry2,
            iNumOfEntries,
            sTitle = "Sample application",
            sAppType = "Application",
            sAppId = "#PurchaseOrder-display",
            sUrl = "#PurchaseOrder-display&128888";

        var oApplicationObject1 = {
            title: sTitle,
            appType: sAppType,
            appId: sAppId,
            url: sUrl
        };
        oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
            iNumOfEntries = aActivity.length;
            aActivity.forEach(function(oItem) {
                if (oItem.appId === sAppId && oItem.appType === sAppType) {
                    oRecentEntry1 = oItem;
                }
            });
        });
        oAppConfigSrvc.addActivity(oApplicationObject1).done(function () {
            oUserRecentSrvc.getRecentActivity().done(function (aActivity) {
                aActivity.forEach(function(oItem) {
                    if (oItem.appId === sAppId && oItem.appType === sAppType) {
                        oRecentEntry2 = oItem;
                    }
                });
                assert.ok(oRecentEntry2.url !== oRecentEntry1.url, "The url is not the same");
                assert.ok(oRecentEntry2.timestamp > oRecentEntry1.timestamp, "The timestamp is different");
                assert.ok(aActivity.length === iNumOfEntries, "Number of activities is the same");
                done();
            });
        });

    });

    test("Test getSettingsControlAsync", function (assert) {
        var oAppConfigurationSrvc = AppConfiguration,
            oReturnedConstructor = function () {
                var oConstructedObject = {
                    attribute1 : "value1"
                };
                return oConstructedObject;
            },
            oRequireStub = sinon.stub(sap.ui, "require", function (aResourcePath, fCallback) {
                if (aResourcePath[0] === "sap/ushell/ui/footerbar/SettingsButton") {
                    fCallback(oReturnedConstructor);
                }
            });

        oAppConfigurationSrvc.getSettingsControlAsync().done(function (oSettingsControlInstance) {
            ok(oSettingsControlInstance.attribute1 == "value1", "The constructed object has the correct property");
            oRequireStub.restore();
        });
    });

    test("Test getSettingsControl", function (assert) {
        var oAppConfigurationSrvc = AppConfiguration,
            oReturnedConstructor = function () {
                var oConstructedObject = {
                    attribute1 : "value1"
                };
                return oConstructedObject;
            },
            oOldRequireStub = sinon.stub(jQuery.sap, "require").returns({}),
            oGetObjectStub,
            oRequireStub = sinon.stub(sap.ui, "require", function (sResourcePath) {
                if (sResourcePath === "sap/ushell/ui/footerbar/SettingsButton") {
                    return oReturnedConstructor;
                }
            }),
            oSettingsControlInstance;

            oSettingsControlInstance = oAppConfigurationSrvc.getSettingsControl();
            ok(oSettingsControlInstance.attribute1 == "value1", "The constructed object has the correct property");
            oSettingsControlInstance = undefined;

            // Testing 2nd scenarion: sap.ui.require returned undefined
            oRequireStub.restore();
            oRequireStub = sinon.stub(sap.ui, "require").returns(undefined);
            oGetObjectStub = sinon.stub(ObjectPath, "get").returns(oReturnedConstructor);

            oSettingsControlInstance = oAppConfigurationSrvc.getSettingsControl();
            ok(oOldRequireStub.calledOnce === true, "jQuery.sap.require called once");
            ok(oOldRequireStub.args[0][0] === "sap.ushell.ui.footerbar.SettingsButton", "jQuery.sap.require called with old-style path sap.ushell.ui.footerbar.SettingsButton");

            ok(oGetObjectStub.calledOnce === true, "ObjectPath.get called once");
            ok(oGetObjectStub.args[0][0] === "sap.ushell.ui.footerbar.SettingsButton", "jQuery.sap.getObject called with old-style path sap.ushell.ui.footerbar.SettingsButton");
            ok(oSettingsControlInstance.attribute1 == "value1", "The constructed object has the correct property");

            oRequireStub.restore();
            oOldRequireStub.restore();
    });
});
