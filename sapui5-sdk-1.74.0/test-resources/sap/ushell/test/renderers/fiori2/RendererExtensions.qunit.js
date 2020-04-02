// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.RendererExtensions
 */
(function () {
    "use strict";
    /* eslint-disable */ // TBD: make ESLint conform

    /*global asyncTest, deepEqual, equal, expect, module, notDeepEqual,
     notEqual, notStrictEqual, ok, raises, start, strictEqual, stop, test,
     jQuery, sap, sinon */

    jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ui.model.json.JSONModel");
    jQuery.sap.require("sap.ui.model.Binding");
    var EventHub = sap.ui.requireSync("sap/ushell/EventHub");
    var Config = sap.ui.requireSync("sap/ushell/Config");
    var HeaderManager = sap.ui.requireSync("sap/ushell/components/HeaderManager");
    var StateHelper = sap.ui.requireSync("sap/ushell/components/StateHelper");
    var ShellHeadItem = sap.ui.requireSync("sap/ushell/ui/shell/ShellHeadItem");

    var attachThemeChangedStub,
        historyBackStub;


    function waitModelChanged () {
        return new Promise(function (fnResolve) {
            Config.wait("/core/shell/model/currentState").then(function () {
                Config.once("/core/shell/model/currentState").do(fnResolve);
            });
        });
    }

    module("sap.ushell.renderers.fiori2.RendererExtensions", {

        setup: function () {

            stop();
            sap.ushell.bootstrap("local").then(function () {
                attachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
                historyBackStub = sinon.stub(window.history, 'back');
                this.oRenderer = sap.ushell.Container.createRenderer("fiori2");
            }.bind(this));

            EventHub.once("RendererLoaded").do(function () {
                this.initialModelUserPref = jQuery.extend(true, {}, sap.ui.getCore().byId("shell").getModel().getProperty("/userPreferences"));
                this.initialModelCurrentState = jQuery.extend(true, {}, sap.ui.getCore().byId("shell").getModel().getProperty("/currentState"));
                start();
            }.bind(this));

            // Disable Recent Activity as the User Recent service is not available and this test is very integrated
            this.tempEnableRecentActivity = Config.last("/core/shell/enableRecentActivity");
            Config.emit("/core/shell/enableRecentActivity", false);
        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            //the model is build once and since the model property is updated in every test,
            // there is a need to restore the initial value of this property
            sap.ui.getCore().byId("shell").getModel().setProperty("/userPreferences", this.initialModelUserPref);
            sap.ui.getCore().byId("shell").getModel().setProperty("/currentState", this.initialModelCurrentState);
            var oToolAreaItem = sap.ui.getCore().byId("toolareaitemtest");
            if (oToolAreaItem) {
                oToolAreaItem.destroy();
            }
            var oToolArea = sap.ui.getCore().byId("shell-toolArea");
            if (oToolArea) {
                oToolArea.destroy();
            }
            this.oRenderer.destroy();
            delete sap.ushell.Container;
            attachThemeChangedStub.restore();
            historyBackStub.restore();

            Config.emit("/core/shell/enableRecentActivity", this.tempEnableRecentActivity);

            EventHub._reset();
            Config._reset();
        }
    });

    function simulateSelectLastEntry (aEntries) {
        if (aEntries.length === 0) {
            throw new Error("Expeced at least one entry.");
        }
        var iUserSettingOpened = aEntries.length - 1;
        var oUserSettingsOpened = {};
        oUserSettingsOpened[iUserSettingOpened] = true;
        EventHub.emit("UserSettingsOpened", oUserSettingsOpened);
    }

    //This is needed to make space for the addintional items added in test.
    function _cleanReservedHeadItemsBeforeTest() {
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions,
            aResrvedHeadItems = [
            sap.ui.getCore().byId("meAreaHeaderButton"),
            sap.ui.getCore().byId("backBtn"),
            sap.ui.getCore().byId("homeBtn")
        ];

        aResrvedHeadItems.forEach(function (oItem, iIndex){
            rendererExt.removeHeaderItem(oItem);

        });
    }

    function checkModelBooleanProperty(sPropertyName, bItemExpectedInHomeState, bItemExpectedInAppState) {
        var fnGetBaseState = sap.ushell.Container.getRenderer("fiori2").oShellModel.getBaseStateMember;
        var homeProperty = fnGetBaseState("home", sPropertyName);
        var appProperty = fnGetBaseState("app", sPropertyName);
        var minimalAppProperty = fnGetBaseState("minimal", sPropertyName);
        var standaloneAppProperty = fnGetBaseState("standalone", sPropertyName);
        var embeddedAppProperty = fnGetBaseState("embedded", sPropertyName);

        if (bItemExpectedInHomeState) {
            assert.ok(homeProperty, "the property value is as expected: /states/home/" + sPropertyName);
        }
        else {
            assert.ok(!homeProperty, "the property value is as expected: /states/home/" + sPropertyName);
        }

        if (bItemExpectedInAppState) {
            assert.ok(appProperty, "the property value is as expected: /states/app/" + sPropertyName);
            assert.ok(minimalAppProperty, "the property value is as expected: /states/minimal/" + sPropertyName);
            assert.ok(standaloneAppProperty, "the property value is as expected: /states/standalone/" + sPropertyName);
            assert.ok(embeddedAppProperty, "the property value is as expected: /states/embedded/" + sPropertyName);
        }
        else {
            assert.ok(!appProperty, "the property value is as expected: /states/app/" + sPropertyName);
            assert.ok(!minimalAppProperty, "the property value is as expected: /states/minimal/" + sPropertyName);
            assert.ok(!standaloneAppProperty, "the property value is as expected: /states/standalone/" + sPropertyName);
            assert.ok(!embeddedAppProperty, "the property value is as expected: /states/embedded/" + sPropertyName);
        }

    }

    function checkItemModelPropertiesById(oItemId, sPropertyName, bItemExpectedInHomeState, bItemExpectedInAppState, bItemsMultiplexed, bHeaderProperty) {
        var fnGetBaseState = bHeaderProperty ? HeaderManager._getBaseStateMember : sap.ushell.Container.getRenderer("fiori2").oShellModel.getBaseStateMember;
        var homePropertyList = fnGetBaseState("home", sPropertyName);
        var appPropertyList = fnGetBaseState("app", sPropertyName);
        var minimalAppPropertyList = fnGetBaseState("minimal", sPropertyName);
        var standaloneAppPropertyList = fnGetBaseState("standalone", sPropertyName);
        var embeddedAppPropertyList = fnGetBaseState("embedded", sPropertyName);

        if (bItemExpectedInHomeState) {
            assert.ok(homePropertyList.indexOf(oItemId) >= 0, "the new item is added to the model: /states/home/" + sPropertyName);
        } else {
            assert.ok(homePropertyList.indexOf(oItemId) < 0, "the new item is not added to the model: /states/home/" + sPropertyName);
        }

        //in the app state we need to check all the app states
        if (bItemExpectedInAppState) {
            if (bItemsMultiplexed) {
                assert.ok(appPropertyList.indexOf(oItemId) === -1, "the new item isn't added to the model: /states/app/" + sPropertyName + "due to exsistance of a 'Resrved' item");
            } else {
                assert.ok(appPropertyList.indexOf(oItemId) >=0, "the new item is added to the model: /states/app/" + sPropertyName);

            }
            assert.ok(minimalAppPropertyList.indexOf(oItemId) >=0, "the new item is added to the model: /states/minimal/" + sPropertyName);
            assert.ok(standaloneAppPropertyList.indexOf(oItemId )>=0, "the new item is added to the model: /states/standalone/" + sPropertyName);
        }
        else {
            if (bItemsMultiplexed) {
                assert.ok(minimalAppPropertyList.indexOf(oItemId) >= 0, "the new item is not added to the model: /states/minimal/" + sPropertyName);
                assert.ok(standaloneAppPropertyList.indexOf(oItemId) >= 0, "the new item is not added to the model: /states/standalone/" + sPropertyName);
                assert.ok(embeddedAppPropertyList.indexOf(oItemId) >= 0, "the new item is not added to the model: /states/embedded/" + sPropertyName);
            } else {
                assert.ok(appPropertyList.indexOf(oItemId) < 0, "the new item is not added to the model: /states/app/" + sPropertyName);
                assert.ok(minimalAppPropertyList.indexOf(oItemId) < 0, "the new item is not added to the model: /states/minimal/" + sPropertyName);
                assert.ok(standaloneAppPropertyList.indexOf(oItemId) < 0, "the new item is not added to the model: /states/standalone/" + sPropertyName);
                assert.ok(embeddedAppPropertyList.indexOf(oItemId) < 0, "the new item is not added to the model: /states/embedded/" + sPropertyName);
            }
        }
    }

    function checkItemModelProperties(oItem, sPropertyName, bItemExpectedInHomeState, bItemExpectedInAppState, bItemsMultiplexed, bHeaderProperty) {
        checkItemModelPropertiesById(oItem.getId(), sPropertyName, bItemExpectedInHomeState, bItemExpectedInAppState, bItemsMultiplexed, bHeaderProperty);
    }

    function checkActionSheetModelProperties(oButton, bItemExpectedInHomeState, bItemExpectedInAppState) {
        var fnGetBaseState = sap.ushell.Container.getRenderer("fiori2").oShellModel.getBaseStateMember;
        var homePropertyList = fnGetBaseState("home", "actions");
        var appShellActionsPropertyList = fnGetBaseState("app", "shellActions");
        var minimalAppShellActionsPropertyList = fnGetBaseState("minimal", "shellActions");
        var standaloneAppShellActionsPropertyList = fnGetBaseState("standalone", "shellActions");
        var embeddedAppShellActionsPropertyList = fnGetBaseState("embedded", "shellActions");
        var appActionsPropertyList = fnGetBaseState("app", "actions");
        var minimalAppActionsPropertyList = fnGetBaseState("minimal", "actions");
        var standaloneAppActionsPropertyList = fnGetBaseState("standalone", "actions");
        var embeddedAppActionsPropertyList = fnGetBaseState("embedded", "actions");
        if (bItemExpectedInHomeState) {
            assert.ok(homePropertyList.indexOf(oButton.getId()) > -1 , "the new item is added to the model: /states/home/actions");
        }
        else {
            assert.ok(homePropertyList.indexOf(oButton.getId()) < 0, "the new item is not added to the model: /states/home/actions");
        }

        //in the app state we need to check all the app states in the actions + shellActions property
        if (bItemExpectedInAppState) {
            assert.ok(minimalAppActionsPropertyList.indexOf(oButton.getId()) > -1, "the new item is added to the model: /states/minimal/actions");
            assert.ok(standaloneAppActionsPropertyList.indexOf(oButton.getId()) > -1, "the new item is added to the model: /states/standalone/actions");
            assert.ok(embeddedAppActionsPropertyList.indexOf(oButton.getId()) > -1, "the new item is added to the model: /states/embedded/actions");
        }
        else {
            assert.ok(appActionsPropertyList.indexOf(oButton.getId()) < 0, "the new item is not added to the model: /states/app/actions");
            assert.ok(minimalAppActionsPropertyList.indexOf(oButton.getId()) < 0, "the new item is not added to the model: /states/minimal/actions");
            assert.ok(standaloneAppActionsPropertyList.indexOf(oButton.getId()) < 0, "the new item is not added to the model: /states/standalone/actions");
            assert.ok(embeddedAppActionsPropertyList.indexOf(oButton.getId()) < 0, "the new item is not added to the model: /states/embedded/actions");
        }
    }

    function checkFooterExistInShellPage(oFooter, bBarExpected) {
        var oShell = sap.ui.getCore().byId("shell");
        var oView = sap.ui.getCore().byId("mainShell");
        var oFooterFromShell = oView.getOUnifiedShell().getFooter();

        if (bBarExpected) {
            assert.ok(oFooterFromShell.getId().indexOf(oFooter.getId()) == 0, "the page footer exist in page shell");
        }
        else {
            assert.ok(oFooterFromShell === null || oFooterFromShell.getId().indexOf(oFooter.getId()) < 0, "the page footer is not exist in page shell");
        }

    }

    test("test updating a model and the effect on its derived states", function () {
        var aExpectedAppStates = ["app", "minimal", "standalone", "embedded", "headerless"],
            aExpectedHomeStates = ["home", "embedded-home", "headerless-home"],
            aActualAppStates,
            aActualHomeStates;

        aActualAppStates = StateHelper.getModelStates('app', true);
        assert.ok(aActualAppStates[0] === 'app', "bDoNotPropagate is 'true' - expected retrieved state is: 'app'");
        aActualHomeStates = StateHelper.getModelStates('home', true);
        assert.ok(aActualHomeStates[0] === 'home', "bDoNotPropagate is 'true' - expected retrieved state is: 'home'");

        aActualAppStates = StateHelper.getModelStates('app', false);
        aExpectedAppStates.forEach(function (sState) {
            assert.ok(aActualAppStates.indexOf(sState) > '-1', 'the state: ' + sState + ' is missing from the Expexcted app states');
        });

        aActualHomeStates = StateHelper.getModelStates('home', false);
        aExpectedHomeStates.forEach(function (sState) {
            assert.ok(aActualHomeStates.indexOf(sState) > '-1', 'the state: ' + sState + ' is missing from the Expexcted app states');
        });
    });

    asyncTest("test setLeftPaneVisibility", function (assert) {
        var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
            isLeftPaneVisibility,
            oShell = sap.ui.getCore().byId("shell"),
            fnWaitCurrentStateChange = function () {
                return new Promise (function (fnChanged) {
                    Config.once("/core/shell/model/currentState").do(function () {
                        fnChanged();
                    });
                });
            };

        sap.ushell.components.applicationIntegration.AppLifeCycle.switchViewState("home");
        fnWaitCurrentStateChange()
            .then(function () {
                isLeftPaneVisibility = oShell.getModel().getProperty("/currentState/showPane");
                assert.ok(!isLeftPaneVisibility, "validate isLeftPaneVisibility false");

                oRenderer.setLeftPaneVisibility("home", true);
            })
            .then(fnWaitCurrentStateChange)
            .then(function () {
                isLeftPaneVisibility = oShell.getModel().getProperty("/currentState/showPane");
                assert.ok(isLeftPaneVisibility, "validate isLeftPaneVisibility true");
            })
            .then(fnWaitCurrentStateChange)
            .then(function () {
                oRenderer.oShellModel.updateStateProperty = sinon.spy();
                oRenderer.setLeftPaneVisibility("home",false);
            })
            .then(fnWaitCurrentStateChange)
            .then(function () {
                ok(oRenderer.oShellModel.updateStateProperty.callCount === 1, 'true');
                start();
            });

    });

    test("test existance of a rendererExt Class", function () {
        var instance = null;
        instance = sap.ushell.renderers.fiori2.RendererExtensions;

        assert.ok(instance, "rendererExt exists");
    });

    asyncTest("test add current state", function () {
        sap.ushell.components.applicationIntegration.AppLifeCycle.switchViewState("home");
        waitModelChanged()
            .then(function () {
                sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.footerbar.HideGroupsButton", {
                    id: "mshideGroupsBtn"
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").addSubHeader("sap.ushell.ui.footerbar.HideGroupsButton", {
                    id: "mshideGroupsBtn2"
                }, true, true);


                sap.ushell.Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {
                    id: "msfloatingActionBtn",
                    icon: 'sap-icon://edit'
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").addLeftPaneContent("sap.m.Button", {
                    id: "mslefttest"
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
                    id: "msheaditemtest"
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
                    id: "msheadenditemtest"
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").addToolAreaItem({id: "toolareaitemtest"}, true, true);
            })
            .then(waitModelChanged)
            .then(function () {
                assert.ok(sap.ui.getCore().byId("mshideGroupsBtn"), "renderer managed object for mshideGroupsBtn");
                assert.ok(sap.ui.getCore().byId("mshideGroupsBtn2"), "renderer managed object for mshideGroupsBtn2");
                assert.ok(sap.ui.getCore().byId("msfloatingActionBtn"), "renderer managed object for msfloatingActionBtn");
                assert.ok(sap.ui.getCore().byId("mslefttest"), "renderer managed object for mslefttest");
                assert.ok(sap.ui.getCore().byId("msheaditemtest"), "renderer managed object for msheaditemtest");
                assert.ok(sap.ui.getCore().byId("msheadenditemtest"), "renderer managed object for msheadenditemtest");
                assert.ok(sap.ui.getCore().byId("toolareaitemtest"), "renderer managed object for toolareaitemtest");
            })
            .then(waitModelChanged)
            .then(function () {
                sap.ushell.components.applicationIntegration.AppLifeCycle.isAppOfTypeCached = function () {
                    return true;
                };

                sap.ushell.components.applicationIntegration.AppLifeCycle.switchViewState("app");
            })
            .then(waitModelChanged)
            .then(function () {
                assert.ok(sap.ui.getCore().byId("mshideGroupsBtn"), "renderer managed object for mshideGroupsBtn, still available in home state");
                assert.ok(sap.ui.getCore().byId("mshideGroupsBtn2"), "renderer managed object for mshideGroupsBtn2, still available in home state");
                assert.ok(sap.ui.getCore().byId("msfloatingActionBtn"), "renderer managed object for msfloatingActionBtn, still available in home state");
                assert.ok(sap.ui.getCore().byId("mslefttest"), "renderer managed object for mslefttest, still available in home state");
                assert.ok(sap.ui.getCore().byId("msheaditemtest"), "renderer managed object for msheaditemtest, still available in home state");
                assert.ok(sap.ui.getCore().byId("msheadenditemtest"), "renderer managed object for msheadenditemtest, still available in home state");
                assert.ok(sap.ui.getCore().byId("toolareaitemtest"), "renderer managed object for toolareaitemtest, still available in home state");
                start();

            });

    });


    test("test all add without states", function () {
        sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.footerbar.HideGroupsButton", {
            id: "hideGroupsBtn"
        }, true, false);

        sap.ushell.Container.getRenderer("fiori2").addSubHeader("sap.ushell.ui.footerbar.HideGroupsButton", {
            id: "hideGroupsBtn2"
        }, true, false);


        sap.ushell.Container.getRenderer("fiori2").addFloatingActionButton("sap.ushell.ui.shell.ShellFloatingAction", {
            id: "floatingActionBtn",
            icon: 'sap-icon://edit'
        }, true, false);

        sap.ushell.Container.getRenderer("fiori2").addLeftPaneContent("sap.m.Button", {
            id: "lefttest"
        }, true, false);

        sap.ushell.Container.getRenderer("fiori2").addHeaderItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "headitemtest"
        }, true, false);

        sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", {
            id: "headenditemtest"
        }, true, false);


        checkItemModelPropertiesById("hideGroupsBtn", "actions", true, true);
        checkItemModelPropertiesById("hideGroupsBtn2", "subHeader", true, true);
        checkItemModelPropertiesById("floatingActionBtn", "floatingActions", true, true);
        checkItemModelPropertiesById("lefttest", "paneContent", true, true);
        checkItemModelPropertiesById("headenditemtest", "headEndItems", true, true, false, true);
    });

    test("Add tool area item without states", function() {
        sap.ushell.Container.getRenderer("fiori2").addToolAreaItem({id: "toolareaitemtest"}, true, false);
        checkItemModelPropertiesById("toolareaitemtest", "toolAreaItems", true, true);
    });

    test("test add Tool Area Item to app state", function () {
        sap.ushell.Container.getRenderer("fiori2").addToolAreaItem({id: "toolareaitemtest"}, true, false, ["app"]);
        checkItemModelPropertiesById("toolareaitemtest", "toolAreaItems", false, true);
    });

    test("test add Tool Area Item to home state", function () {
        sap.ushell.Container.getRenderer("fiori2").addToolAreaItem({id: "toolareaitemtest"}, true, false, ["home"]);
        checkItemModelPropertiesById("toolareaitemtest", "toolAreaItems", true, false);
    });

    test("test removeToolAreaItem without states", function () {
        var oRenderer = sap.ushell.Container.getRenderer("fiori2");
        oRenderer.addToolAreaItem({id: "toolareaitemtest"}, true, true);
        oRenderer.removeToolAreaItem("toolareaitemtest", true);
        checkItemModelPropertiesById("toolareaitemtest", "toolAreaItems", false, false);
    });

    [
        {
            description: "case: added and remove - app state",
            aStatesAdded: ["app"],
            aStatesRemove: ["app"],
            bInHomestate: false
        },
        {
            description: "added and removed - home state",
            aStatesAdded: ["home"],
            aStatesRemove: ["home"],
            bInHomestate: false
        },
        {
            description: "added to app/home state removed from home state only",
            aStatesAdded: ["home", "app"],
            aStatesRemove: ["home"],
            bInHomestate: true
        }
    ].forEach( function (oFix) {
        test("test removeToolAreaItem from different states " + oFix.description, function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");
            oRenderer.addToolAreaItem({id: "toolareaitemtest"}, true, false, oFix.aStatesAdded);
            oRenderer.removeToolAreaItem(["toolareaitemtest"], false, oFix.aStatesRemove);
            checkItemModelPropertiesById("toolareaitemtest", "toolAreaItems", false, oFix.bInHomestate);
        });
    });

    test("test showToolArea with different states", function () {
        var oRenderer = sap.ushell.Container.getRenderer("fiori2");
        oRenderer.showToolArea("home", true);
        checkModelBooleanProperty("toolAreaVisible", true, false);
        oRenderer.showToolArea("home", false);
        //TODO[Sasha]:Should it be visible in all app states if set to true in app???
        checkModelBooleanProperty("toolAreaVisible", false, false);
    });

    test("test addHeaderItem without states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        // 3 items can be in the headeritems aggregation
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
    });

    test("test addHeaderItem with 1 state", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home);
        checkItemModelProperties(headItem1, "headItems", true, false, false, true);
    });


    test("test addHeaderItem with 2 states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.App);
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
    });

    test("test addHeaderItem with 3 states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.App, rendererExt.LaunchpadState.App);
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
    });

    test("test addHeaderEndItem without states", function () {
        var headItem1 = new sap.ushell.ui.shell.ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
    });

    test("test addHeaderEndItem with 1 state", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home);
        checkItemModelProperties(headItem1, "headEndItems", true, false, false, true);
    });

    test("test addHeaderEndItem with 2 states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.App);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
    });

    test("test addHeaderEndItem with 3 states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.App, rendererExt.LaunchpadState.App);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
    });

    test("test addHeaderItem the second time - with 1 state", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new ShellHeadItem("firstItem1state");
        var headItem2 = new ShellHeadItem("secondItem1state");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.addHeaderItem(headItem2, rendererExt.LaunchpadState.Home);
        checkItemModelProperties(headItem2, "headItems", true, false, false, true);
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
        warningSpy.restore();
    });

    test("test addHeaderItem the second time - with all state", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new ShellHeadItem("firstItemAppstate");
        var headItem2 = new ShellHeadItem("secondItemAppstate");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.addHeaderItem(headItem2);
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
        checkItemModelProperties(headItem2, "headItems", true, true, true, true);
        warningSpy.restore();
    });

    test("test addHeaderEndItem the second time - with 1 state", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new ShellHeadItem("firstEndItem1state");
        var headItem2 = new ShellHeadItem("secondEndItem1state");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.addHeaderEndItem(headItem2, rendererExt.LaunchpadState.Home);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
        checkItemModelProperties(headItem2, "headEndItems", true, false, false, true);
        assert.ok(warningSpy.notCalled, "a warning was written in the log");
        warningSpy.restore();
    });

    test("test removeHeaderItem without states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem1);
        //if we add to app state and nested states of app (minimal, standalone), we need to remove it from nested state as well
        checkItemModelProperties(headItem1, "headItems", false, false, false, true);
    });

    test("test removeHeaderEndItem without states", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem1);
        checkItemModelProperties(headItem1, "headEndItems", false, false, false, true);
    });

    test("test removeHeaderItem with state", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem1, rendererExt.LaunchpadState.App);
        //if we add to app state and nested states of app (minimal, standalone), we need to remove it from nested state as well
        checkItemModelProperties(headItem1, "headItems", true, false, false, true);
    });

    test("test removeHeaderEndItem with state", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem1, rendererExt.LaunchpadState.App);
        checkItemModelProperties(headItem1, "headEndItems", true, false, false, true);
    });

    test("test addHeaderItem without states - with UI5 ShellHeadItem control", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderItem(headItem1);
        checkItemModelProperties(headItem1, "headItems", true, true, false, true);
    });

    test("test addHeaderEndItem without states - with UI5 ShellHeadItem control", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
    });

    test("test removeHeaderItem without states - with UI5 ShellHeadItem control", function () {

        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        //This is needed to make space for the addintional items added in test.
        _cleanReservedHeadItemsBeforeTest();
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem1);
        checkItemModelProperties(headItem1, "headItems", false, false, false, true);
    });

    test("test removeHeaderEndItem without states - with UI5 ShellHeadItem control", function () {
        var headItem1 = new ShellHeadItem();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem1);
        checkItemModelProperties(headItem1, "headEndItems", false, false, false, true);
    });


    test("test exceptions with illegal state", function () {
        var headItem1 = new ShellHeadItem();
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        assert.throws(
            function () {
                rendererExt.addHeaderItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "addHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.addHeaderEndItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "addHeaderEndItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "removeHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderEndItem(headItem1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "removeHeaderEndItem - the expected exception was thrown");
        assert.throws(
                function () {
                    rendererExt.addOptionsActionSheetButton(button1, "test")
                },
                function (err) {
                    return (err.message == "sLaunchpadState value is invalid");
                },
                "addOptionsActionSheetButton- the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeOptionsActionSheetButton(button1, "test")
            },
            function (err) {
                return (err.message == "sLaunchpadState value is invalid");
            },
            "removeOptionsActionSheetButton - the expected exception was thrown");
    });

    test("test exceptions with illegal item", function () {
        var item1 = {};
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        assert.throws(
            function () {
                rendererExt.addHeaderItem(item1)
            },
            function (err) {
                return (err.message === "oItem.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "I.getId is not a function");
            },
            "addHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.addHeaderEndItem(item1)
            },
            function (err) {
                return (err.message == "oItem.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "I.getId is not a function");
            },
            "addHeaderEndItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderItem(item1)
            },
            function (err) {
                return (err.message == "oItem.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "I.getId is not a function");
            },
            "removeHeaderItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeHeaderEndItem(item1)
            },
            function (err) {
                return (err.message == "oItem.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "I.getId is not a function");
            },
            "removeHeaderEndItem - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.addOptionsActionSheetButton(item1);
            },
            function (err) {
                return (err.message == "oButton.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "B.getId is not a function");
            },
            "addOptionsActionSheetButton- the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.removeOptionsActionSheetButton(item1);
            },
            function (err) {
                return (err.message == "oButton.getId is not a function" ||
                err.message === "Object doesn't support property or method 'getId'" ||
                err.message === "B.getId is not a function");
            },
            "removeOptionsActionSheetButton - the expected exception was thrown");
        assert.throws(
            function () {
                rendererExt.setFooter(item1);
            },
            function (err) {
                return (err.message == "oFooter value is invalid");
            },
            "setFooter - the expected exception was thrown");
    });

    test("test removeHeadItem with an item that do not exists", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new ShellHeadItem("firstItemAdd");
        var headItem2 = new ShellHeadItem("secondItemRemove");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        //This is needed to make space for the addintional items added in test.
        _cleanReservedHeadItemsBeforeTest();
        rendererExt.addHeaderItem(headItem1);
        rendererExt.removeHeaderItem(headItem2);
        checkItemModelProperties(headItem1, "headItems", true, false, true, true);
        checkItemModelProperties(headItem2, "headItems", false, false, false, true);
        assert.ok(warningSpy.calledWith("You cannot remove item: secondItemRemove, the item does not exists."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test removeEndHeadItem with an item that do not exists", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var headItem1 = new ShellHeadItem("firstEndItemAdd");
        var headItem2 = new ShellHeadItem("secondEndItemRemove");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addHeaderEndItem(headItem1);
        rendererExt.removeHeaderEndItem(headItem2);
        checkItemModelProperties(headItem1, "headEndItems", true, true, false, true);
        checkItemModelProperties(headItem2, "headEndItems", false, false, false, true);
        assert.ok(warningSpy.calledWith("You cannot remove item: secondEndItemRemove, the item does not exists."), "a warning was written in the log");
        warningSpy.restore();
    });

    asyncTest("test publishing public event", function () {
        expect(1);
        sap.ui.getCore().getEventBus().subscribe("sap.ushell.renderers.fiori2.Renderer", "testEvent", function () {
                assert.ok(true, "the event was thrown as expected");
                start();
            }
        );
        sap.ushell.renderers.fiori2.utils.publishExternalEvent("testEvent");
        setTimeout(function() {
        }, 100);
    });

    test("test addOptionsActionSheetButton without states", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1);
        checkActionSheetModelProperties(button1, true, true);
    });

    test("test addOptionsActionSheetButton with 1 state", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1, rendererExt.LaunchpadState.Home);
        checkActionSheetModelProperties(button1, true, false);
    });

    test("test addOptionsActionSheetButton with 2 states", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1, rendererExt.LaunchpadState.Home, rendererExt.LaunchpadState.App);
        checkActionSheetModelProperties(button1, true, true);
    });

    test("test addOptionsActionSheetButton with 2 buttons", function () {
        var button1 = new sap.m.Button();
        var button2 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1);
        checkActionSheetModelProperties(button1, true, true);
        rendererExt.addOptionsActionSheetButton(button2,rendererExt.LaunchpadState.Home);
        checkActionSheetModelProperties(button2, true, false);
    });

    test("test removeOptionsActionSheetButton without states", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1);
        rendererExt.removeOptionsActionSheetButton(button1);
        checkActionSheetModelProperties(button1, false, false);
    });

    test("test removeOptionsActionSheetButton with states", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1);
        rendererExt.removeOptionsActionSheetButton(button1,rendererExt.LaunchpadState.Home,rendererExt.LaunchpadState.App,rendererExt.LaunchpadState.App);
        checkActionSheetModelProperties(button1, false, false);
    });

    test("test removeOptionsActionSheetButton with 2 states", function () {
        var button1 = new sap.m.Button();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.addOptionsActionSheetButton(button1);
        rendererExt.removeOptionsActionSheetButton(button1,rendererExt.LaunchpadState.Home,rendererExt.LaunchpadState.App);
        checkActionSheetModelProperties(button1, false, false, true);
    });
/*
    test("test removeOptionsActionSheetButton with logout button, a button that was not added with this API", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        //the contact support button button is initialize when the action sheet is pressed
        var actionBtn =  sap.ui.getCore().byId('actionsBtn');
        actionBtn.firePress();
        var ContactSupportBtn = sap.ui.getCore().byId('ContactSupportBtn');
        rendererExt.removeOptionsActionSheetButton(ContactSupportBtn);

        //checkActionSheetModelProperties(ContactSupportBtn, true, true, true);
        assert.ok(warningSpy.calledWith("You cannot remove button: ContactSupportBtn from the launchpad state: home, the button was not added using 'sap.ushell.renderers.fiori2.RendererExtensions.addOptionsActionSheetButton'."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You cannot remove button: ContactSupportBtn from the launchpad state: app, the button was not added using 'sap.ushell.renderers.fiori2.RendererExtensions.addOptionsActionSheetButton'."), "a warning was written in the log");
        assert.ok(warningSpy.calledWith("You cannot remove button: ContactSupportBtn from the launchpad state: catalog, the button was not added using 'sap.ushell.renderers.fiori2.RendererExtensions.addOptionsActionSheetButton'."), "a warning was written in the log");
        warningSpy.restore();

        var oShell = sap.ui.getCore().byId("shell");
        var homePropertyList = oShell.getModel().getProperty("/states/home/actions");
        var catalogPropertyList = oShell.getModel().getProperty("/states/catalog/actions");
        var appPropertyList = oShell.getModel().getProperty("/states/app/shellActions");
        var minimalAppPropertyList = oShell.getModel().getProperty("/states/minimal/shellActions");
        var standaloneAppPropertyList = oShell.getModel().getProperty("/states/standalone/shellActions");
        var embeddedAppPropertyList = oShell.getModel().getProperty("/states/embedded/shellActions");

        assert.ok(homePropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/home/actions");
        assert.ok(catalogPropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/catalog/actions");
        assert.ok(appPropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/app/shellActions");
        assert.ok(minimalAppPropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/minimal/shellActions");
        assert.ok(standaloneAppPropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/standalone/shellActions");
        assert.ok(embeddedAppPropertyList.indexOf("ContactSupportBtn") >= 0, "the new item is added to the model: /states/embedded/shellActions");
    });*/

    test("test setFooter", function () {
        var footer = new sap.m.Bar();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.setFooter(footer);
        checkFooterExistInShellPage(footer, true);
    });

    test("test setFooter the second time", function () {
        var warningSpy = sinon.spy(jQuery.sap.log, "warning");
        var footer1 = new sap.m.Bar("firstFooter");
        var footer2 = new sap.m.Bar("secondFooter");
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.setFooter(footer1);
        rendererExt.setFooter(footer2);
        checkFooterExistInShellPage(footer2, true);
        checkFooterExistInShellPage(footer1, false);
        assert.ok(warningSpy.calledWith("You can only set one footer. Replacing existing footer: firstFooter, with the new footer: secondFooter."), "a warning was written in the log");
        warningSpy.restore();
    });

    test("test destroyFooter", function () {
        var footer = new sap.m.Bar();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        rendererExt.setFooter(footer);
        rendererExt.removeFooter();
        checkFooterExistInShellPage(footer, false);
    });

    test("test addUserPreferencesEntry - input validations", function ()  {
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry();
            },
            function (err) {
                return (err.message == "object oConfig was not provided");
            },
            "addUserPreferencesEntry - the expected exception - object configuration was not provided  - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry(null);
            },
            function (err) {
                return (err.message == "object oConfig was not provided");
            },
            "addUserPreferencesEntry - the expected exception - object configuration was not provided  - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry(undefined);
            },
            function (err) {
                return (err.message == "object oConfig was not provided");
            },
            "addUserPreferencesEntry - the expected exception - object configuration was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry("test");
            },
            function (err) {
                return (err.message == "object oConfig was not provided");
            },
            "addUserPreferencesEntry - the expected exception - object configuration was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": "testId", value : "test"});
            },
            function (err) {
                return (err.message == "title was not provided");
            },
            "addUserPreferencesEntry - the expected exception - title was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": "testId", "title": null, value : "test"});
            },
            function (err) {
                return (err.message == "title was not provided");
            },
            "addUserPreferencesEntry - the expected exception - title was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": "testId", "title" : undefined, value : "test"});
            },
            function (err) {
                return (err.message == "title was not provided");
            },
            "addUserPreferencesEntry - the expected exception - title was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": "testId", "title" : "test"});
            },
            function (err) {
                return (err.message == "value was not provided");
            },
            "addUserPreferencesEntry - the expected exception - value was not provided - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : "test", "value" : null});
            },
            function (err) {
                return (err.message == "value was not provided");
            },
            "addUserPreferencesEntry - the expected exception - value type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : "test", "value" : undefined});
            },
            function (err) {
                return (err.message == "value was not provided");
            },
            "addUserPreferencesEntry - the expected exception - value type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": "", "title" : "test", "value" : "test"});
            },
            function (err) {
                return (err.message == "entryHelpID type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - entryHelpID type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": 1, "title" : "test", "value" : "test"});
            },
            function (err) {
                return (err.message == "entryHelpID type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - entryHelpID type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"entryHelpID": null, "title" : "test", "value" : "test"});
            },
            function (err) {
                return (err.message == "entryHelpID type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - entryHelpID type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : test, "value" : "test"});
            },
            function (err) {
                return (err.message == "title type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - title type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : "test", "value" : "test", onSave: "test"});
            },
            function (err) {
                return (err.message == "onSave type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - onSave type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : "test", "value" : "test", content: "test"});
            },
            function (err) {
                return (err.message == "content type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - content type is invalid - was thrown");
        assert.throws(
            function () {
                rendererExt.addUserPreferencesEntry({"title" : "test", "value" : "test", onCancel: "test"});
            },
            function (err) {
                return (err.message == "onCancel type is invalid");
            },
            "addUserPreferencesEntry - the expected exception - onCancel type is invalid - was thrown");

    });

    test("test addUserPreferencesEntry - positive test - add entry with mandatory fields", function (assert) {
        var fnDone = assert.async();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oShell = sap.ui.getCore().byId("shell");
        var userPrefEntriesArrayDefault = oShell.getModel().getProperty("/userPreferences/entries");
        var userPrefEntriesArrayDefaultLength = userPrefEntriesArrayDefault.length;
        var newEntry = {title: "testTitle", value: "testValue"};
        rendererExt.addUserPreferencesEntry(newEntry);
        var newEntryInModel = {
            "entryHelpID": undefined,
            "title": "testTitle",
            "editable": false,
            "valueArgument" : "testValue",
            "valueResult" : null,
            "onSave": undefined,
            "onCancle" : undefined,
            "contentFunc":undefined,
            "contentResult": null
        };

        Config.once("/core/shell/model").do(function () {
            var userPrefEntriesArrayNew = oShell.getModel().getProperty("/userPreferences/entries");
            assert.ok(JSON.stringify(userPrefEntriesArrayNew[userPrefEntriesArrayDefaultLength]) == JSON.stringify(newEntryInModel), "the new entry is added to the model: /userPreferences/entries");
            fnDone();
        });
    });

    test("test addUserPreferencesEntry - positive test - add entry with all fields, check model", function (assert) {
        var fnDone = assert.async();
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oShell = sap.ui.getCore().byId("shell");
        var userPrefEntriesArrayDefault = oShell.getModel().getProperty("/userPreferences/entries");
        var userPrefEntriesArrayDefaultLength = userPrefEntriesArrayDefault.length;
        var newEntry = {
            "entryHelpID": "testId",
            "title": "testTitle",
            "value" : function() {return jQuery.Deferred().resolve("testValue")},
            "onSave": function() {return jQuery.Deferred().resolve("testOnSave")},
            "onCancel" : function() {return jQuery.Deferred().resolve("testOnCancel")},
            "content" : function() {return jQuery.Deferred().resolve(new sap.m.Button())}
        };
        rendererExt.addUserPreferencesEntry(newEntry);

        var newEntryInModel = {
            "entryHelpID": "testId",
            "title": "testTitle",
            "editable": true,
            "valueArgument" : function() {return jQuery.Deferred().resolve("testValue")},
            "valueResult" : null,
            "onSave": function() {return jQuery.Deferred().resolve("testOnSave")},
            "onCancel" : function() {return jQuery.Deferred().resolve("testOnCancel")},
            "contentFunc": function() {return jQuery.Deferred().resolve("testContent")},
            "contentResult": null
        };

        Config.once("/core/shell/model").do(function () {
            var userPrefEntriesArrayNew = oShell.getModel().getProperty("/userPreferences/entries");
            //the new entry is added in the end of the array
            assert.ok(JSON.stringify(userPrefEntriesArrayNew[userPrefEntriesArrayDefaultLength]) == JSON.stringify(newEntryInModel), "the new entry is added to the model: /userPreferences/entries");
            fnDone();
        });
    });

    asyncTest("test addUserPreferencesEntry - positive test - add entry with all fields - check value and content arguments", function (assert) {
        function waitConfigHasOneEntry () {
            return new Promise(function (fnDone) {
                var oDoable = Config.on("/core/shell/model/userPreferences/entries");
                oDoable.do(function (aEntries) {
                    if (aEntries === 0) {
                        return;
                    }
                    oDoable.off();
                    fnDone();
                });
            });
        }


        expect(3);

        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oShell = sap.ui.getCore().byId("shell");
        var userPrefEntriesArrayDefault = oShell.getModel().getProperty("/userPreferences/entries");
        var newEntry = {
            "entryHelpID": "testId",
            "title": "testTitle",
            "value" : function () { return jQuery.Deferred().resolve("testValue"); },
            "onSave": function () { return jQuery.Deferred().resolve("testOnSave"); },
            "onCancel": function () { return jQuery.Deferred().resolve("testOnCancel"); },
            "content": function () {
                var button = new sap.m.Button("contentButton");
                return jQuery.Deferred().resolve(button);
            }
        };
        rendererExt.addUserPreferencesEntry(newEntry);

        waitConfigHasOneEntry()
            .then(function () {
                var UserPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton();

                var oModel = Config.createModel("/core/shell/model/userPreferences", sap.ui.model.json.JSONModel);
                UserPrefButton.setModel(oModel);
                UserPrefButton.showUserPreferencesDialog(); // the valueArgument is called

                var entryList = sap.ui.getCore().byId("userPrefEnteryList");
                var entryListItems = entryList.getItems();

                assert.strictEqual(entryListItems.length, 1, "there is one entry in the list");

                entryListItems[0].firePress(); // the contentFunc is called

                Config.once("/core/shell/model/userPreferences").do(function () {
                    var userPrefEntriesArrayNew = oShell.getModel().getProperty("/userPreferences/entries");
                    var contentResult = userPrefEntriesArrayNew[0].contentResult;

                    assert.strictEqual(contentResult, "contentButton", "contentResult contains id of the control");

                    var valueResult = userPrefEntriesArrayNew[0].valueResult;
                    assert.ok((valueResult == "testValue"));
                    UserPrefButton._dialogCancelButtonHandler();//close the dialog
                    start();
                });
            });
    });

    asyncTest("test addUserPreferencesEntry - positive test - add entry with all fields - check save", function () {
        expect(1);
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oModel = Config.createModel("/core/shell/model/userPreferences", sap.ui.model.json.JSONModel);
        var UserPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton();
        UserPrefButton.setModel(oModel);
        var callback = sinon.spy();

        var onSaveFunction = function() {
            callback();
            return jQuery.Deferred().promise();
        };

        var newEntry = {
            "entryHelpID": "testId",
            "title": "testTitle",
            "value" : function() {return jQuery.Deferred().resolve("testValue")},
            "onSave": onSaveFunction
        };

        rendererExt.addUserPreferencesEntry(newEntry);
        UserPrefButton.showUserPreferencesDialog();

        simulateSelectLastEntry(oModel.getProperty("/entries"));

        UserPrefButton._dialogSaveButtonHandler(); // the onSave is called
        UserPrefButton.destroy();

        setTimeout(function() {
            assert.ok(callback.called, "the onSave function was called");
            start();
        } , 50);
    });

    test("test addUserPreferencesEntry - positive test - add entry with all fields - check cancel", function () {
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oModel = Config.createModel("/core/shell/model/userPreferences", sap.ui.model.json.JSONModel);
        var UserPrefButton = new sap.ushell.ui.footerbar.UserPreferencesButton();
        UserPrefButton.setModel(oModel);
        var callback = sinon.spy();

        var onCancelFunction = function() {
            callback();
            return jQuery.Deferred().promise();
        };

        var newEntry = {
            "entryHelpID": "testId",
            "title": "testTitle",
            "value" : function() {return jQuery.Deferred().resolve("testValue")},
            "onCancel": onCancelFunction
        };

        rendererExt.addUserPreferencesEntry(newEntry);
        UserPrefButton.showUserPreferencesDialog();

        simulateSelectLastEntry(oModel.getProperty("/entries"));

        UserPrefButton._dialogCancelButtonHandler(); // the onSave is called
        UserPrefButton.destroy();

        assert.ok(callback.called, "the onCancel function was called");
    });

    test("test setHeaderTitle - positive Test", function (assert) {
        var rendererExt = sap.ushell.renderers.fiori2.RendererExtensions;
        var oShell = sap.ui.getCore().byId("shell");
        var done = assert.async();
        rendererExt.setHeaderTitle("testTitle");
        window.setTimeout(function () {
            assert.ok(oShell.getHeader().getTitle() == "testTitle", "the title is added to the model: /title/");
            done();
        }, 50);
    });

}());
