// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.applicationIntegration.AppLifeCyclejs
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    'sap/ushell/components/applicationIntegration/application/Application',
    "sap/ushell/test/utils",
    "sap/ushell/services/Container",
    "sap/ushell/Config",
    "sap/ushell/components/container/ApplicationContainer",
    "sap/ushell/components/HeaderManager",
    "sap/ui/util/Mobile"
], function (AppLifeCycle, BlueBoxHandler, Application, utils, Container, Config, ApplicationContainerDummy, HeaderManager, Mobile) {
    "use strict";
    /* global equal deepEqual module ok stop test jQuery sap QUnit sinon asyncTest start assert */

    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.renderers.fiori2.History");
    jQuery.sap.require("sap.ushell.renderers.fiori2.Renderer");
    jQuery.sap.require("sap.ui.thirdparty.datajs");
    jQuery.sap.require("sap.ushell.ui.launchpad.LoadingDialog");
    jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");
    jQuery.sap.require("sap.ushell.EventHub");

    //jQuery.sap.require("sap.ushell.components.applicationIntegration.AppLifeCycle");

    module("sap.ushell.components.applicationIntegration.AppLifeCycle", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {
            HeaderManager.init();
        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            HeaderManager.destroy();
        }
    });

    test("check application Integration set statfull apps", function () {
        AppLifeCycle.parseStatefulContainerConfiguration({
            "GUI": true
        });


        ok(AppLifeCycle.applicationIsStatefulType("TR"), "TR was not found the Statefull Type list");
        ok(!AppLifeCycle.applicationIsStatefulType("GUI"), "GUI was found the Statefull Type list");
    });


    [
        {
            testDescription: "Validate handleControl for stateful att",
            isStatefulContainerSupported: false,
            openCallCount: 1,
            destroyCallCount: 0,
            oViewPortContainer: {
                getCurrentCenterPage: function () {
                    return "currentPage";
                },
                getViewPortControl: sinon.spy()
            }
        },
        {
            testDescription: "When `oViewPortContainer` is falsy it returns the falsy value",
            isStatefulContainerSupported: true,
            openCallCount: 1,
            destroyCallCount: 1,
            oViewPortContainer: {
                getCurrentCenterPage: function () {
                    return "currentPage";
                },
                getViewPortControl: sinon.spy()
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("validate application integration handleControl - " + oFixture.testDescription, function () {
            var stbIsStatefulContainerSupported = sinon.stub(BlueBoxHandler, "isStatefulContainerSupported").returns(oFixture.isStatefulContainerSupported),
                metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns({
                    compactContentDensity: true,
                    cozyContentDensity: true
                });


            AppLifeCycle.init("home", oFixture.oViewPortContainer, "Shell-home", false, {
                ownerComponent: "test"
            });

            AppLifeCycle.open = sinon.spy();
            AppLifeCycle.handleExitStateful = sinon.stub().returns(Promise.resolve());
            AppLifeCycle.handleControl("test-show", "app1", {}, {}, function () {
            }, true).then(function () {
                ok(AppLifeCycle.open.callCount === oFixture.openCallCount, 'check that open is called #' + oFixture.openCallCount + " times");
                ok(AppLifeCycle.handleExitStateful.callCount === oFixture.destroyCallCount, 'check that destroy is called #' + oFixture.destroyCallCount + " times");
                metaDataStub.restore();
                start();
            });

            stbIsStatefulContainerSupported.restore();
        });
    });

    test("check application Integration set StatefulContainer", function () {
        AppLifeCycle.parseStatefulContainerConfiguration({
            "GUI": true
        });


        AppLifeCycle.setStatefulContainer("TR", {
            container: "dummy"
        });

        ok(AppLifeCycle.getStatefulContainer("TR").container == "dummy", "TR was not found the in Statefull Type list");
    });

    QUnit.test("#_getViewPortControlByIntent", function (assert) {
        [
            {
                description: "When `oViewPortContainer` is falsy it returns the falsy value",
                oViewPortContainer: null
            },
            {
                description: "When `oViewPortContainer` is truthy it calls `getViewPortControl` on it",
                oViewPortContainer: {
                    getViewPortControl: sinon.spy()
                }
            }
        ].forEach(function (oFixture) {
            var oViewportControl;

            AppLifeCycle.init("home", oFixture.oViewPortContainer, "Shell-home", false, {
                ownerComponent: "test"
            });
            oViewportControl = AppLifeCycle.getControl();

            if (oFixture.oViewPortContainer) {
                assert.strictEqual(
                    AppLifeCycle.getViewPortContainer().getViewPortControl.called,
                    true,
                    oFixture.description
                );
            } else {
                assert.strictEqual(
                    oViewportControl,
                    null,
                    oFixture.description
                );
            }
        });
    });

    QUnit.test("#_getAppContainer returns an existing container if one is available", function (assert) {
        //var oRenderer = sap.ushell.Container.createRenderer("fiori2");
        //var oController = sap.ui.getCore().byId("mainShell").getController();
        var oResolvedNavigationTarget = {
            targetNavigationMode: "inplace",
            applicationType: "JS",
            url: "https://xxx.yyy"
        };
        var oExistingContainer, oApplicationContainer;

        oExistingContainer = {
            content: "testcontent"
        };

        AppLifeCycle.initShellUIService({
            ownerComponent: {},
            fnOnHierarchyChange: function () {},
            fnOnTitleChange: function () {},
            fnOnRelatedAppsChange: function () {},
            fnOnBackNavigationChange: function () {}

        });

        var metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns({
            compactContentDensity: true,
            cozyContentDensity: true
        });

        var stbgetInterface = sinon.stub(AppLifeCycle.getShellUIService(), "getInterface").returns({
            method: "implementation"
        });

        oExistingContainer = {};
        var stbapplicationIsStatefulType = sinon.stub(AppLifeCycle, "applicationIsStatefulType").returns(true);
        var stbgetStatefulContainer = sinon.stub(AppLifeCycle, "getStatefulContainer").returns(oExistingContainer);

        oApplicationContainer = AppLifeCycle.getAppContainer("application-Action-toappnavsample-component", oResolvedNavigationTarget, false);

        assert.strictEqual(oApplicationContainer, oExistingContainer, "An existing container is returned");

        stbapplicationIsStatefulType.restore();
        stbgetStatefulContainer.restore();
        stbgetInterface.restore();
        metaDataStub.restore();
        //oRenderer.destroy();
    });

    test("test getAppIcon", function () {
        var oMetadata, metaDataStub;

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        var sAppIcon = AppLifeCycle.getAppMeta().getAppIcon();
        equal(sAppIcon, "sap-icon://folder", "Icon default value as expected");

        metaDataStub.restore();
        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns({icon:"sap-icon://Fiori2/F0003"});

        sAppIcon = AppLifeCycle.getAppMeta().getAppIcon();
        equal(sAppIcon, "sap-icon://Fiori2/F0003", "Icon default value as expected");

        metaDataStub.restore();
    });

    var fnRequireAsyncToSync = function (aReq, fnCallBack) {
        var index = 0, sReq, aReqObjs = [], serIndex;

        if (typeof aReq === "string") {
            aReq = [aReq];
        }

        for (index = 0; index < aReq.length; index++) {
            sReq = aReq[index].replace(new RegExp('/', 'g'), '.');

            //validate that object is not loaded already.
            var aSegments = sReq.split("."),
                poiningObject = window,
                bIsFound = true;


            for (serIndex =  0; serIndex < aSegments.length; serIndex++) {
                poiningObject = poiningObject[aSegments[serIndex]];
                if (!poiningObject) {
                    bIsFound = false;
                    break;
                }
            }

            if (bIsFound === false) {
                jQuery.sap.require(sReq);
            }

            poiningObject = window;

            for (serIndex =  0; serIndex < aSegments.length; serIndex++) {
                poiningObject = poiningObject[aSegments[serIndex]];
            }

            aReqObjs.push(poiningObject);
        }
        if (aReqObjs.length === 1 && !fnCallBack) {
            return aReqObjs[0];
        }

        fnCallBack.apply(this, aReqObjs);

        return aReqObjs;
    };


    test("test setAppIcons", function () {
        var setIcons = sinon.spy(Mobile, "setIcons"),
            getFavIconHref,
            oMetadataConfig,
            oOriginalRequire = sap.ui.require;

        sap.ui.require = fnRequireAsyncToSync;

        //without meta config & ios
        sap.ui.Device.os.ios = true;
        AppLifeCycle.getAppMeta().setAppIcons();

        ok(setIcons.calledOnce === true, 'Test set icons called');
        ok(setIcons.args[0][0].favicon === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchpad_favicon.ico", 'Test favicon');
        ok(setIcons.args[0][0].phone === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchicons/57_iPhone_Desktop_Launch.png", 'Test phone');
        //ok(jQuery.sap.setIcons.args[0][0].precomposed === true ,'Test precomposed');

        //without meta config & not ios
        sap.ui.Device.os.ios = false;
        getFavIconHref = sinon.stub(AppLifeCycle.getAppMeta(), "getFavIconHref");
        getFavIconHref.returns("test");

        AppLifeCycle.getAppMeta().setAppIcons();

        ok(jQuery.sap.setIcons.callCount === 2, 'Test set icons called');
        ok(jQuery.sap.setIcons.args[1][0].favicon === jQuery.sap.getModulePath("sap.ushell") + "/themes/base/img/launchpad_favicon.ico", 'Test favicon');
        ok(jQuery.sap.setIcons.args[1][0].phone === "", 'Test phone');

        //ios with meta config
        oMetadataConfig = {
            homeScreenIconPhone: "homeScreenIconPhone",
            "homeScreenIconPhone@2": "homeScreenIconPhone@2",
            homeScreenIconTablet: "homeScreenIconTablet",
            "homeScreenIconTablet@2": "homeScreenIconTablet@2",
            favIcon: "favIcon",
            title: "title"
        };
        sap.ui.Device.os.ios = true;
        AppLifeCycle.getAppMeta().setAppIcons(oMetadataConfig);
        ok(setIcons.callCount === 3, 'Test set icons called');
        ok(setIcons.args[2][0].favicon === "favIcon", 'Test favicon');
        ok(setIcons.args[2][0].phone === "homeScreenIconPhone", 'Test phone');

        setIcons.restore();
        getFavIconHref.restore();
        sap.ui.require = oOriginalRequire;
    });

    test("change to compact display test ", function (assert) {
        var done = assert.async();
        var oMetadata = {
                compactContentDensity: true,
                cozyContentDensity: true
            },
            metaDataStub;

        sap.ushell.bootstrap("local").then(function () {
            metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
            metaDataStub.returns(oMetadata);

            oMetadata.compactContentDensity = undefined;
            oMetadata.cozyContentDensity = undefined;
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(true);
            ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
            ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:true, metadata.cozy:true ==> compact");
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(false);
            ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");
            ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:true, metadata.cozy:true ==> cozy");

            oMetadata.compactContentDensity = true;
            oMetadata.cozyContentDensity = false;
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority();
            ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
            ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:false, metadata.cozy:false ==> cozy");
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(false);
            ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(true);
            ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");


            oMetadata.compactContentDensity = false;
            oMetadata.cozyContentDensity = true;
            //sCotentDensity = "cozy";
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority();
            ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
            ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:compact, metadata.compact:false, metadata.cozy:true ==> cozy");
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(false);
            ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            ok(jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority(true);
            ok(jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");
            ok(!jQuery('body').hasClass('sapUiSizeCozy'), "requested mode:cozy, metadata.compact:false, metadata.cozy:false ==> cozy");

            var userStub = sinon.stub(sap.ushell.Container.getUser(), "getContentDensity");
            userStub.returns("cozy");
            sap.ui.Device.system.combi = true;
            sap.ui.Device.support.touch = true;
            oMetadata.compactContentDensity = true;
            oMetadata.cozyContentDensity = false;

            AppLifeCycle.getAppMeta()._applyContentDensityByPriority();
            ok(jQuery('body').hasClass('sapUiSizeCozy'), "user preferences should have priority 1");
            userStub.returns("compact");
            oMetadata.compactContentDensity = false;
            oMetadata.cozyContentDensity = true;
            AppLifeCycle.getAppMeta()._applyContentDensityByPriority();
            ok(jQuery('body').hasClass('sapUiSizeCompact'), "user preferences should have first priority");


            userStub.returns("cozy");
            AppLifeCycle.getAppMeta()._applyContentDensityClass(undefined).then(function () {
                ok(!jQuery('body').hasClass('sapUiSizeCompact'), "requested mode:Compact, metadata.compact:false, metadata.cozy:false ==> cozy");

                userStub.returns(undefined);
                userStub.restore();
                metaDataStub.restore();

                delete sap.ushell.Container;
                done();
            });
        });

    });

    //TODO: adjust test to persistency
    test("test density calculation", function () {
        //Keep original values
        var sOrigCombi = sap.ui.Device.system.combi;
        var sOrigTouch = sap.ui.Device.support.touch;

        //Change to combi device
        sap.ui.Device.system.combi = true;
        sap.ui.Device.support.touch = false;
        ok(AppLifeCycle.getAppMeta()._isCompactContentDensityByDevice(), "Non touch device should be in compact mode");

        sap.ui.Device.system.combi = false;
        sap.ui.Device.support.touch = true;
        ok(!AppLifeCycle.getAppMeta()._isCompactContentDensityByDevice(), "Non combi/touch device should be in cozy mode");

        //Restore to original values
        sap.ui.Device.system.combi = sOrigCombi;
        sap.ui.Device.support.touch = sOrigTouch;
    });

    test("test ShellUIService default values", function () {
        var oMetadata, metaDataStub;

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        AppLifeCycle.getElementsModel().init({}, AppLifeCycle.shellElements().create());
        var titleDefaultValue = AppLifeCycle.getAppMeta().getTitleDefaultValue();
        var hierarchyDefaultValue = AppLifeCycle.getAppMeta().getHierarchyDefaultValue();

        equal(titleDefaultValue, "", "titleDefaultValue was not as expected");
        ok(Array.isArray(hierarchyDefaultValue), "hierarchyDefaultValue was not as expected");
        ok(hierarchyDefaultValue.length === 0, "hierarchyDefaultValue was not as expected");

        metaDataStub.restore();
    });

    asyncTest("test ShellUIService default values for app-state", function () {


        var oMetadata = {
                title: "App Title",
                cozyContentDensity: true
            },
            metaDataStub,
            oHeirarchy = [
                {
                    icon: "sap-icon://home",
                    title: "Home",
                    intent: "#Shell-home"
                }
            ];

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        metaDataStub.returns(oMetadata);

        AppLifeCycle.getElementsModel().init({}, AppLifeCycle.shellElements().create());

        Config.emit("/core/shell/model/currentState/stateName", "app");
        Config.once("/core/shell/model/currentState").do(function () {
            var titleDefaultValue = AppLifeCycle.getAppMeta().getTitleDefaultValue();
            var hierarchyDefaultValue = AppLifeCycle.getAppMeta().getHierarchyDefaultValue("Shell-home");

            equal(titleDefaultValue, "App Title", "titleDefaultValue was not as expected");
            deepEqual(hierarchyDefaultValue, oHeirarchy, "hierarchyDefaultValue was as expected");

            Config.emit("/core/shell/model/currentState/stateName", "embedded");
            Config.once("/core/shell/model/currentState/stateName").do(function () {
                equal(titleDefaultValue, "App Title", "titleDefaultValue was not as expected");
                deepEqual(hierarchyDefaultValue, oHeirarchy, "hierarchyDefaultValue was as expected");

                metaDataStub.restore();
                Config.emit("/core/shell/model/currentState/stateName", undefined);
                start();
            });

        });
    });

    test("test _getDefaultFavIcon without a value in the parameter", function () {
        var oAppMeta = AppLifeCycle.getAppMeta(),
            oOriginalRequire = sap.ui.require;
        sap.ui.require = fnRequireAsyncToSync;
        var oParameters = sap.ui.require("sap.ui.core.theming.Parameters");

        var getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return 'none';
        });
        var sResult = oAppMeta._getDefaultFavIcon(oParameters);
        equal(sResult, "../../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico");
        getParameterStub.restore();

        getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return '';
        });
        var sResult = oAppMeta._getDefaultFavIcon(oParameters);
        equal(sResult, "../../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico");
        getParameterStub.restore();

        getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return undefined;
        });
        var sResult = oAppMeta._getDefaultFavIcon(oParameters);
        equal(sResult, "../../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico");
        getParameterStub.restore();

        getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return null;
        });
        var sResult = oAppMeta._getDefaultFavIcon(oParameters);
        equal(sResult, "../../../../../../resources/sap/ushell/themes/base/img/launchpad_favicon.ico");
        getParameterStub.restore();
        sap.ui.require = oOriginalRequire;
    });

    var fnRequireAsyncToSync = function (aReq, fnCallBack) {
        var index = 0, sReq, aReqObjs = [], serIndex;

        if (typeof aReq === "string") {
            aReq = [aReq];
        }

        for (index = 0; index < aReq.length; index++) {
            sReq = aReq[index].replace(new RegExp('/', 'g'), '.');

            //validate that object is not loaded already.
            var aSegments = sReq.split("."),
                poiningObject = window,
                bIsFound = true;


            for (serIndex =  0; serIndex < aSegments.length; serIndex++) {
                poiningObject = poiningObject[aSegments[serIndex]];
                if (!poiningObject) {
                    bIsFound = false;
                    break;
                }
            }

            if (bIsFound === false) {
                jQuery.sap.require(sReq);
            }

            poiningObject = window;

            for (serIndex =  0; serIndex < aSegments.length; serIndex++) {
                poiningObject = poiningObject[aSegments[serIndex]];
            }

            aReqObjs.push(poiningObject);
        }
        if (aReqObjs.length === 1 && !fnCallBack) {
            return aReqObjs[0];
        }

        fnCallBack.apply(this, aReqObjs);

        return aReqObjs;
    };

    test("test _getDefaultFavIcon with a value in the parameter", function () {
        var oOriginalRequire = sap.ui.require;
        sap.ui.require = fnRequireAsyncToSync;
        var oParameters = sap.ui.require("sap.ui.core.theming.Parameters");

        var getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return "url(../../someurl.jpeg)";
        });
        var sResult = AppLifeCycle.getAppMeta()._getDefaultFavIcon(oParameters);
        equal(sResult, "../../someurl.jpeg");
        getParameterStub.restore();

        var getParameterStub = sinon.stub(sap.ui.core.theming.Parameters, "get", function () {
            return "../../someurl.jpeg";
        });
        var sResult = AppLifeCycle.getAppMeta()._getDefaultFavIcon(oParameters);
        equal(sResult, "../../someurl.jpeg");
        getParameterStub.restore();
        sap.ui.require = oOriginalRequire;
    });

    //test("test getHierarchyDefaultValue setups home entry correctly", function () {
    //    var oController = AppLifeCycle.getElementsModel();
    //
    //    // Test case - Not in application.
    //    var aHierarchy = AppLifeCycle.getHierarchyDefaultValue();
    //    ok(aHierarchy && aHierarchy.length === 0, "Hierarchy is empty when not in application");
    //
    //    // Test case - in application, root intent not configured.
    //    oController.getModel().setProperty("/currentState",{ stateName: "app" });
    //
    //    var aHierarchy = AppLifeCycle.getHierarchyDefaultValue();
    //    ok(aHierarchy && aHierarchy.length > 0, "Hierarchy exists when in application");
    //    equal(aHierarchy[0].intent, "#", "Home entry has intent '#' when root intent is not configured");
    //});


    test("test application lifecycle store", function () {

        AppLifeCycle.init("home", null, "Shell-home", false, {
            ownerComponent: "test"
        }, 3);
        Config.emit("/core/shell/model/currentState/stateName", "home");
        var oApplicationModel = AppLifeCycle.shellElements().create();
        HeaderManager.init({}, oApplicationModel);
        AppLifeCycle.getElementsModel().init({}, oApplicationModel);

        var oMetadata = {
                title: "App Title",
                cozyContentDensity: true
            },
            metaDataStub;

        metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
        var compactStub = sinon.stub(AppLifeCycle.getAppMeta(), "_applyContentDensityByPriority");

        metaDataStub.returns(oMetadata);

        var cmp1 = {
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getUi5ComponentName: function () {
                    return "test";
                },
                getApplicationType: function () {
                    return "XXX";
                },
                createPostMessageRequest: function (sServiceName, oMsg) {
                    return {
                        serviceName: sServiceName,
                        oMsg: oMsg
                    };
                },
                postMessageToIframe: function (oMsg) {
                    return oMsg;
                },
                _getIFrame : function (oMsg) {
                    return {};
                },
                postMessageToCurrentIframe: function (oMessage) {
                    return ApplicationContainerDummy.prototype.postMessageToCurrentIframe.call(this, oMessage);
                },
                getRouter: function () {
                    return this.oRt;
                },
                restore: sinon.spy(),
                suspend: sinon.spy(),
                getId: function (){
                    return "testid1";
                }
            },
            cmp2 = {
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getUi5ComponentName: function () {
                    return "test";
                },
                getApplicationType: function () {
                    return "XXX";
                },
                createPostMessageRequest: function (sServiceName, oMsg) {
                    return {
                        serviceName: sServiceName,
                        oMsg: oMsg
                    };
                },
                postMessageToIframe: function (oMsg) {
                    return oMsg;
                },
                _getIFrame : function (oMsg) {
                    return {};
                },
                postMessageToCurrentIframe: function (oMessage) {
                    return ApplicationContainerDummy.prototype.postMessageToCurrentIframe.call(this, oMessage);
                },
                getRouter: function () {
                    return this.oRt;
                },
                restore: sinon.spy(),
                suspend: sinon.spy(),
                getId: function (){
                    return "testid2";
                }
            };

        AppLifeCycle.storeApp("testid1", { name: "oContainerTest",
            getUi5ComponentName: function () {
                return "cmp1testid1";
            },
            getApplicationType: function () {
                return "XXX";
            },
            createPostMessageRequest: function () {
                return "post1testid1";
            },
            postMessageToIframe: function (sMsg) {
                return {
                    serviceName: sMsg
                };
            },
            _getIFrame : function (oMsg) {
                return {};
            },
            postMessageToCurrentIframe: function (oMessage) {
                return ApplicationContainerDummy.prototype.postMessageToCurrentIframe.call(this, oMessage);
            }
        }, "testid1");
        AppLifeCycle.onComponentCreated({}, {}, {
            component: cmp1
        });
        AppLifeCycle.storeApp("testid2", { name: "oContainerTest",
            getUi5ComponentName: function () {
                return "cmp1testid2";
            },
            getApplicationType: function () {
                return "XXX";
            },
            createPostMessageRequest: function () {
                return "post1testid2";
            },
            postMessageToIframe: function (sMsg) {
                return {
                    serviceName: sMsg
                };
            },
            _getIFrame : function (oMsg) {
                return {};
            },
            postMessageToCurrentIframe: function (oMessage) {
                return ApplicationContainerDummy.prototype.postMessageToCurrentIframe.call(this, oMessage);
            }
        }, "testid2");
        AppLifeCycle.onComponentCreated({}, {}, {
            component: cmp2
        });
        AppLifeCycle.store("testid1");
        AppLifeCycle.store("testid2");
        AppLifeCycle.restore("testid1");
        AppLifeCycle.restore("testid2");
        AppLifeCycle.restore("testid1");

        //validate route call counts.
        ok(cmp1.oRt.stop.callCount == 1, "cmp1 stop called 1 time");
        ok(cmp1.oRt.initialize.callCount == 2, "cmp1 initialize called 2 times");
        ok(cmp2.oRt.stop.callCount == 1, "cmp2 stop called 1 time");
        ok(cmp2.oRt.initialize.callCount == 1, "cmp2 initialize called 1 times");

        ok(cmp1.suspend.callCount == 1, "cmp1 suspend called once");
        ok(cmp2.suspend.callCount == 1, "cmp2 suspend called once");
        ok(cmp1.restore.callCount == 2, "cmp1 restore called twice");
        ok(cmp2.restore.callCount == 1, "cmp2 restore called once");

        compactStub.restore();
        metaDataStub.restore();
    });

    [
        {
            testDescription: "broadcust post sap.ushell.services.Reflection.hashChange",

            fnRegisterCommHAndler: {
                "sap.ushell.services.Reflection": {
                    oRequestCalls: {
                        "hashChange": {
                            isActiveOnly: false,
                            distributionType: ["XXX"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    assert.strictEqual(oRespData.length, 2, "Validate broadcast to 2 applications: 1 BlueBox application + 1 application in focus");
                                    assert.strictEqual(oRespData[0].serviceName, "sap.ushell.services.Reflection.hashChange", "Validate first callback");
                                    assert.strictEqual(oRespData[1].serviceName, "post1testid1", "Validate first callback");
                                }).catch(function (oError) {
                                    assert.strictEqual(false, true, "boradcast response handler: Error");
                                });
                            }
                        }
                    },
                    oServiceCalls: {
                        "hashChange": {
                            //TODO
                        }
                    }
                }
            },

            oPostMessage: {
                sMessage: "sap.ushell.services.Reflection",
                sInterface: "hashChange",
                oData: {
                    value: "test1"
                }
            },
            oPostResp: {
                sMessage: "sap.ushell.services.Reflection.hashChange",
                sDescription: "Validate first message responce: post1testid1"
            }
        },
        {
            testDescription: "post sap.ushell.services.Reflection.hashChange",

            fnRegisterCommHAndler: {
                "sap.ushell.services.Reflection": {
                    oRequestCalls: {
                        "hashChange": {
                            isActiveOnly: true,
                            distributionType: ["XXX"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    assert.strictEqual(oRespData[0].serviceName, "sap.ushell.services.Reflection.hashChange", "hashChange response handler is called");
                                }).catch(function (oError) {
                                    assert.strictEqual(false, true, "hashChange response handler: Error");
                                });
                            }
                        }
                    },
                    oServiceCalls: {
                        "hashChange": {
                            //TODO
                        }
                    }
                }
            },

            oPostMessage: {
                sMessage: "sap.ushell.services.Reflection",
                sInterface: "hashChange",
                oData: {
                    value: "test1"
                }
            },
            oPostResp: {
                sMessage: "sap.ushell.services.Reflection.hashChange",
                sDescription: "hashChange application response"
            }
        },
        {
            testDescription: "post sap.ushell.services.test.foo",

            fnRegisterCommHAndler: {
                "sap.ushell.services.test": {
                    oRequestCalls: {
                        "foo": {
                            isActiveOnly: true,
                            distributionType: ["XXX"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    assert.strictEqual(oRespData[0].serviceName, "sap.ushell.services.test.foo", "foo response handler is called");
                                    assert.strictEqual(oRespData[0].oMsg.value, "footest1", "foo response handler is called");
                                }).catch(function (oError) {
                                    assert.strictEqual(false, true, "foo response handler: Error");
                                });
                            }
                        }
                    }
                }
            },
            oPostMessage: {
                sMessage: "sap.ushell.services.test",
                sInterface: "foo",
                oData: {
                    value: "footest1"
                }
            },
            oPostResp: {
                sMessage: "sap.ushell.services.test.foo",
                sDescription: "foo application response"
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("communication handle - " + oFixture.testDescription, function () {
            var oResolvedNavigationTarget = {
                targetNavigationMode: "inplace",
                applicationType: "JS",
                url: "https://xxx.yyy"
            }, orgPost = Application.postMessageToIframeApp;

            AppLifeCycle.initShellUIService({
                ownerComponent: {},
                fnOnHierarchyChange: function () {},
                fnOnTitleChange: function () {},
                fnOnRelatedAppsChange: function () {},
                fnOnBackNavigationChange: function () {}

            });

            var metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata").returns({
                    compactContentDensity: true,
                    cozyContentDensity: true
                }),
                stbgetInterface = sinon.stub(AppLifeCycle.getShellUIService(), "getInterface").returns({
                    method: "implementation"
                });

            var stbapplicationIsStatefulType = sinon.stub(AppLifeCycle, "applicationIsStatefulType").returns(true);
            var stbgetStatefulContainer = sinon.stub(AppLifeCycle, "getStatefulContainer").returns({});

            Application.postMessageToIframeApp = function (oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse) {
                var sService = sServiceName + "." + sInterface,
                    oMessage = oContainer.createPostMessageRequest(sService, oMessageBody);

                return oContainer.postMessageToCurrentIframe(oMessage, bWaitForResponse);
            };



            AppLifeCycle.getAppContainer("application-Action-toappnavsample-component", oResolvedNavigationTarget, false);

            AppLifeCycle.registerShellCommunicationHandler(oFixture.fnRegisterCommHAndler);

            AppLifeCycle.postMessageToIframeApp(oFixture.oPostMessage.sMessage, oFixture.oPostMessage.sInterface, oFixture.oPostMessage.oData).then (function (oResp) {
                assert.strictEqual(oResp[0].serviceName, oFixture.oPostResp.sMessage, oFixture.oPostResp.sDescription);

                stbapplicationIsStatefulType.restore();
                stbgetStatefulContainer.restore();
                stbgetInterface.restore();
                metaDataStub.restore();
                Application.postMessageToIframeApp = orgPost;

                start();
            });
        });
    });


    QUnit.test("Test getInMemoryInstance", function (assert) {

        [
            {
                sInstanceName: "testid4",
                sInstanceHash: "testid4?xxx=yyy",
                expectedCmpName: "oContainerTest4",
                expectedCmpNameDesc: "validate component oContainerTest4",
                isInstSupportedDesc: "validate intent supported",
                isInstSupported: true,
                storageSize: 2,
                expected: {
                    callCount: 3
                },
                description: "storage size 2"
            },
            {
                sInstanceName: "testid5",
                sInstanceHash: "testid5?xxx=yyy",
                expectedCmpName: "oContainerTest5",
                expectedCmpNameDesc: "validate component oContainerTest5",
                isInstSupportedDesc: "validate intent supported",
                isInstSupported: false,
                storageSize: 3,
                expected: {
                    callCount: 2
                },
                description: "storage size 3"
            }
        ].forEach(function (oFixture) {
            var oMetadata = {
                    title: "App Title",
                    cozyContentDensity: true
                },
                metaDataStub;

            AppLifeCycle.init("home", null, "Shell-home", false, {
                ownerComponent: "test"
            }, oFixture.storageSize);

            metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
            metaDataStub.returns(oMetadata);

            AppLifeCycle.getElementsModel().init({}, AppLifeCycle.shellElements().create());
            var cmp1 = {
                restore: sinon.spy(),
                suspend: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                getId: function (){
                    return "testid1";
                }
            }, cmp2 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid2";
                }
            }, cmp3 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid3";
                }
            }, cmp4 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid4";
                }
            }, cmp5 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid5";
                }
            };

            var stbAppDestroy = sinon.stub(AppLifeCycle, "destroy").returns(true);

            AppLifeCycle.storeApp("testid1", {
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "test1";
                }
            }, "testid1");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp1,
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }
            });
            AppLifeCycle.storeApp("testid2", { name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid2");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp2,
                getUi5ComponentName: function () {
                    return "cmp2test1";
                }
            });

            AppLifeCycle.storeApp("testid3", { name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid3");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp3,
                getUi5ComponentName: function () {
                    return "cmp3test1";
                }
            });

            AppLifeCycle.storeApp("application-testid4", { name: "oContainerTest4",
                getUi5ComponentName: function () {
                    return "cmp4test4";
                }}, "testid4", "testid4?xxx=yyy");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp4,
                getUi5ComponentName: function () {
                    return "cmp4test1";
                }
            });

            AppLifeCycle.storeApp("application-testid5", { name: "oContainerTest5",
                getUi5ComponentName: function () {
                    return "cmp5test1";
                }}, "testid5", "testid5?xxx=zzzz");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp5
            });

            var oInst = AppLifeCycle.getInMemoryInstance(oFixture.sInstanceName, oFixture.sInstanceHash);

            ok(oInst.container.name == oFixture.expectedCmpName, oFixture.expectedCmpNameDesc);
            ok(oInst.isInstanceSupported == oFixture.isInstSupported, oFixture.isInstSupportedDesc);

            stbAppDestroy.restore();
            metaDataStub.restore();
        });
    });

    QUnit.test("Test Integration with Storage", function (assert) {

        [
            {
                storageSize: 2,
                expected: {
                    callCount: 3
                },
                description: "storage size 2"
            },
            {
                storageSize: 3,
                expected: {
                    callCount: 2
                },
                description: "storage size 3"
            }
        ].forEach(function (oFixture) {
            var oMetadata = {
                    title: "App Title",
                    cozyContentDensity: true
                },
                metaDataStub;

            AppLifeCycle.init("home", {
                removeCenterViewPort: function () {

                }
            }, "Shell-home", false, {
                ownerComponent: "test"
            }, undefined, {
                limit: {
                    desktop: oFixture.storageSize,
                    tablet: oFixture.storageSize,
                    phone: oFixture.storageSize
                }
            });

            metaDataStub = sinon.stub(sap.ushell.services.AppConfiguration, "getMetadata");
            metaDataStub.returns(oMetadata);

            AppLifeCycle.getElementsModel().init({}, AppLifeCycle.shellElements().create());
            var cmp1 = {
                restore: sinon.spy(),
                suspend: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                getId: function (){
                    return "testid1";
                }
            }, cmp2 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid2";
                }
            }, cmp3 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid3";
                }
            }, cmp4 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid4";
                }
            }, cmp5 = {
                restore: sinon.spy(),
                oRt: {
                    stop: sinon.spy(),
                    initialize: sinon.spy()
                },
                getRouter: function () {
                    return this.oRt;
                },
                suspend: sinon.spy(),
                getId: function (){
                    return "testid5";
                }
            };

            var stbAppDestroy = sinon.stub(AppLifeCycle, "evict").returns(true);

            AppLifeCycle.storeApp("testid1", {
                destroy: function () {},
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "test1";
                }
            }, "testid1");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp1,
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }
            });
            AppLifeCycle.storeApp("testid2", {
                destroy: function () {},
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid2");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp2,
                getUi5ComponentName: function () {
                    return "cmp2test1";
                }
            });

            AppLifeCycle.storeApp("testid3", {
                destroy: function () {},
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid3");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp3,
                getUi5ComponentName: function () {
                    return "cmp3test1";
                }
            });

            AppLifeCycle.storeApp("testid4", {
                destroy: function () {},
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid4");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp4,
                getUi5ComponentName: function () {
                    return "cmp4test1";
                }
            });

            AppLifeCycle.storeApp("testid5", {
                destroy: function () {},
                name: "oContainerTest",
                getUi5ComponentName: function () {
                    return "cmp1test1";
                }}, "testid5");
            AppLifeCycle.onComponentCreated({}, {}, {
                component: cmp5
            });

            assert.strictEqual(
                stbAppDestroy.callCount,
                oFixture.expected.callCount,
                "Number Evicted elements expected[" + oFixture.expected.callCount + "]" + oFixture.description
            );

//            ok(stbAppDestroy.args[0][0] == "testid1", "evicted one application");

            stbAppDestroy.restore();
            metaDataStub.restore();
        });
    });


    [
        {
            testDescription: "No stateful support",
            isGUICap: false,
            isFLPCap: false,
            descriptionGUICap: "Expected No stateful support also for GUI",
            descriptionFLPCap: "Expected No stateful support also for FLP",
            oTarget: {
                appCapabilities: {
                    statefulContainer: {
                        enabled: false
                    }
                }
            }
        },
        {
            testDescription: "FLP only stateful support",
            isGUICap: false,
            isFLPCap: true,
            descriptionGUICap: "Expected No stateful support also for GUI",
            descriptionFLPCap: "Expected No stateful support also for FLP",
            oTarget: {
                appCapabilities: {
                    statefulContainer: {
                        enabled: true
                    }
                }
            }
        },
        {
            testDescription: "GUI stateful support",
            isGUICap: true,
            isFLPCap: false,
            descriptionGUICap: "Expected No stateful support also for GUI",
            descriptionFLPCap: "Expected No stateful support also for FLP",
            oTarget: {
                appCapabilities: {
                    statefulContainer: {
                        enabled: true,
                        protocol: "GUI"
                    }
                }
            }
        },
        {
            testDescription: "GUI stateful support",
            isGUICap: false,
            isFLPCap: true,
            descriptionGUICap: "Expected No stateful support also for GUI",
            descriptionFLPCap: "Expected No stateful support also for FLP",
            oTarget: {
                appCapabilities: {
                    statefulContainer: {
                        enabled: true,
                        protocol: "FLP"
                    }
                }
            }
        }
    ].forEach(function (oFixture) {
        asyncTest("test capabilities - " + oFixture.testDescription, function () {
            AppLifeCycle.initShellUIService({
                ownerComponent: {},
                fnOnHierarchyChange: function () {},
                fnOnTitleChange: function () {},
                fnOnRelatedAppsChange: function () {},
                fnOnBackNavigationChange: function () {}

            });

            ok(AppLifeCycle.isGUICapabilityEnabled(oFixture.oTarget) === oFixture.isGUICap, oFixture.descriptionGUICap);
            ok(AppLifeCycle.isFLPCapabilityEnabled(oFixture.oTarget) === oFixture.isFLPCap, oFixture.descriptionFLPCap);
            start();
        });
    });
});
