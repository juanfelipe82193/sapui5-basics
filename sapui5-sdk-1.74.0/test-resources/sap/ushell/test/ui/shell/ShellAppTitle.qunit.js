// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.require([
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/services/Container",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ushell/ui/shell/ShellAppTitle"
], function (AppLifeCycle, Container, EventHub, Config, ShellAppTitle) {
    "use strict";

    /* global module, ok, strictEqual, test, QUnit, jQuery, sinon*/

    var oStateEnum = {
            SHELL_NAV_MENU_ONLY: 0,
            ALL_MY_APPS_ONLY: 1,
            SHELL_NAV_MENU: 2,
            ALL_MY_APPS: 3
        },
        oAllMyAppsStateEnum = {
            FIRST_LEVEL: 0,
            SECOND_LEVEL: 1,
            DETAILS: 2,
            FIRST_LEVEL_SPREAD: 3
        };

    module("sap.ushell.ui.shell.ShellAppTitle", {
        /**
         * This method is called before each test
         */
        setup: function () {
        },
        /**
         * This method is called after each test. Add every restoration code here
         *
         */
        teardown: function () {
            EventHub._reset();
        }
    });

    test("Constructor Test", function () {

        jQuery.sap.require("sap.ushell.resources");
        var text = "application title",
            shellAppTitle = new ShellAppTitle({text: text}),
            oShellNavigationMenu;

        ok(shellAppTitle.getText() === text, "Check text");
        ok(!shellAppTitle.getNavigationMenu(), "Check navigation menu is empty");

        oShellNavigationMenu = new sap.ushell.ui.shell.ShellNavigationMenu("shellNavMenu");
        shellAppTitle.setNavigationMenu(oShellNavigationMenu);

        ok(shellAppTitle.getNavigationMenu() === "shellNavMenu", "Check association assignment to the navigation menu");

        oShellNavigationMenu.destroy();
        shellAppTitle.destroy();
    });

    QUnit.test("getControlVisibilityAndState Test", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            var oNavMenu = {},
                oSetPropertySpy = sinon.spy(),
                bIsAllMyAppsEnabled = true,
                oGetServiceStub = sinon.stub(sap.ushell.Container, "getService", function (sName) {
                    if (sName === "AllMyApps") {
                        return {
                            isEnabled: function () {
                                return bIsAllMyAppsEnabled;
                            }
                        };
                    }
                }),
                oShellAppTitle = new ShellAppTitle({ text: "text" }),
                fnGetModelStub = sinon.stub(oShellAppTitle, "getModel").returns({ setProperty: oSetPropertySpy }),
                oIsNavMenuEnableStub = sinon.stub(oShellAppTitle, "_isNavMenuEnabled").returns(true),
                bTitleVisible;

            // Test 1
            // Shell state = "home"
            // _isNavMenuEnabled = true
            // AllMyAppsEnabled = true
            Config.emit("/core/shell/model/currentState/stateName", "home");
            bTitleVisible = oShellAppTitle._getControlVisibilityAndState(oNavMenu);

            ok(bTitleVisible === true,
                "bTitleVisible is true when: 1.Shell state is home, 2._isNavMenuEnabled = true, 3.AllMyAppsEnabled = true");
            ok(oSetPropertySpy.calledOnce === true, "Model setProperty called once");
            ok(oSetPropertySpy.args[0][0] === "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
            ok(oSetPropertySpy.args[0][1] === oStateEnum.SHELL_NAV_MENU,
                "Model property ShellAppTitleState was set to SHELL_NAV_MENU");

            // Test 2
            // Shell state = "minimal"
            // _isNavMenuEnabled = true
            Config.emit("/core/shell/model/currentState/stateName", "minimal");
            oIsNavMenuEnableStub.restore();
            oIsNavMenuEnableStub = sinon.stub(oShellAppTitle, "_isNavMenuEnabled").returns(true);
            oSetPropertySpy.reset();
            bTitleVisible = oShellAppTitle._getControlVisibilityAndState(oNavMenu);

            ok(bTitleVisible === true, "bTitleVisible is true when: 1.Shell state is minimal, 2._isNavMenuEnabled = true");
            ok(oSetPropertySpy.calledOnce === true, "Model setProperty called once");
            ok(oSetPropertySpy.args[0][0] === "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
            ok(oSetPropertySpy.args[0][1] === oStateEnum.SHELL_NAV_MENU_ONLY,
                "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");

            // Test 3
            // Shell state = "app"
            // _isNavMenuEnabled = false
            // AllMyAppsEnabled = true
            Config.emit("/core/shell/model/currentState/stateName", "app");
            oIsNavMenuEnableStub.restore();
            oIsNavMenuEnableStub = sinon.stub(oShellAppTitle, "_isNavMenuEnabled").returns(false);
            oSetPropertySpy.reset();
            bTitleVisible = oShellAppTitle._getControlVisibilityAndState(oNavMenu);

            ok(bTitleVisible === true,
                "bTitleVisible is true when: 1.Shell state is app, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
            ok(oSetPropertySpy.calledOnce === true, "Model setProperty called once");
            ok(oSetPropertySpy.args[0][0] === "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
            ok(oSetPropertySpy.args[0][1] === oStateEnum.ALL_MY_APPS_ONLY, "Model property ShellAppTitleState was set to ALL_MY_APPS_ONLY");

            // Test 4
            // Shell state = "minimal"
            // _isNavMenuEnabled = false
            // AllMyAppsEnabled = true
            Config.emit("/core/shell/model/currentState/stateName", "minimal");
            oIsNavMenuEnableStub.restore();
            oIsNavMenuEnableStub = sinon.stub(oShellAppTitle, "_isNavMenuEnabled").returns(false);
            oSetPropertySpy.reset();
            bTitleVisible = oShellAppTitle._getControlVisibilityAndState(oNavMenu);

            ok(bTitleVisible === false,
                "bTitleVisible is false when: 1.Shell state is  not app|home, 2._isNavMenuEnabled = false, 3.AllMyAppsEnabled = true");
            ok(oSetPropertySpy.calledOnce === true, "Model setProperty called once");
            ok(oSetPropertySpy.args[0][0] === "/ShellAppTitleState", "setProperty for ShellAppTitleState was called");
            ok(oSetPropertySpy.args[0][1] === oStateEnum.SHELL_NAV_MENU_ONLY,
                "Model property ShellAppTitleState was set to SHELL_NAV_MENU_ONLY");

            oIsNavMenuEnableStub.restore();
            oGetServiceStub.restore();
            fnGetModelStub.restore();
            delete sap.ushell.Container;

            done();
        });
    });

    test("popoverBackButton Test", function () {
        var oShellAppTitle = new ShellAppTitle({text: "text"}),
            oModel = new sap.ui.model.json.JSONModel(),
            oModelSetPropertyStub,
            oAllMyAppsView,
            oAllMyAppsPopoverCloseSpy = sinon.spy(),
            oNavMenuPopoverOpenBySpy = sinon.spy(),
            oGetCurrentStateResult = oAllMyAppsStateEnum.FIRST_LEVEL,
            oSwitchToInitialStateSpy = sinon.spy(),
            oHandleSwitchToMasterAreaOnPhoneSpy = sinon.spy(),
            oUpdateHeaderButtonsStateSpy = sinon.spy(),
            oAllMyAppsControllerStub,
            oOrigDeviceSystemPhone = sap.ui.Device.system.phone;

        oShellAppTitle.setModel(oModel);

        oModel.setProperty("/ShellAppTitleState", oStateEnum.SHELL_NAV_MENU);
        oModelSetPropertyStub = sinon.stub(oModel, "setProperty").returns();

        oAllMyAppsView = sap.ui.view("allMyAppsView", {
            type: sap.ui.core.mvc.ViewType.JS,
            viewName: "sap.ushell.renderers.fiori2.allMyApps.AllMyApps",
            viewData: {
                _fnGetShellModel: oModel
            },
            height: "100%",
            visible: false
        });

        oShellAppTitle.oAllMyAppsPopover = { close: oAllMyAppsPopoverCloseSpy };
        oShellAppTitle.oNavMenuPopover = { openBy: oNavMenuPopoverOpenBySpy };

        oShellAppTitle.setAllMyApps(oAllMyAppsView);

        oAllMyAppsControllerStub = sinon.stub(oShellAppTitle, "getAllMyAppsController").returns({
            getStateEnum: function () {
                return oAllMyAppsStateEnum;
            },
            getCurrentState: function () {
                return oGetCurrentStateResult;
            },
            switchToInitialState: oSwitchToInitialStateSpy,
            handleSwitchToMasterAreaOnPhone: oHandleSwitchToMasterAreaOnPhoneSpy,
            updateHeaderButtonsState: oUpdateHeaderButtonsStateSpy
        });

        // Test 1:
        // ShellAppTitle state is ALL_MY_APPS (not ALL_MY_APPS_ONLY)
        // AllMyApps State is FIRST_LEVEL
        oShellAppTitle._popoverBackButtonPressHandler();

        ok(oModelSetPropertyStub.calledOnce === true, "Back from AllMyApps: Model setProperty called");
        ok(oModelSetPropertyStub.args[0][0] === "/ShellAppTitleState",
            "Back from AllMyApps: Model setProperty called for property ShellAppTitleState");
        ok(oModelSetPropertyStub.args[0][1] === oStateEnum.SHELL_NAV_MENU,
            "Back from AllMyApps: Model setProperty called for setting ShellAppTitleStat to SHELL_NAV_MENU");
        ok(oAllMyAppsPopoverCloseSpy.calledOnce === true, "Back from AllMyApps: AllMyApps Popover Close called");
        ok(oNavMenuPopoverOpenBySpy.calledOnce === true, "Back from AllMyApps: NavMenu Popover Open called");

        // Test 2:
        // AllMyApps State is SECOND_LEVEL
        oGetCurrentStateResult = oAllMyAppsStateEnum.SECOND_LEVEL;
        oShellAppTitle._popoverBackButtonPressHandler();

        ok(oSwitchToInitialStateSpy.calledOnce === true, "Back from SECOND_LEVEL: SwitchToInitialState called");

        // Test 3:
        // On Phone
        // AllMyApps State is DETAILS
        oGetCurrentStateResult = oAllMyAppsStateEnum.DETAILS;
        sap.ui.Device.system.phone = true;
        oShellAppTitle._popoverBackButtonPressHandler();

        ok(oHandleSwitchToMasterAreaOnPhoneSpy.calledOnce === true,
            "Back from DETAILS state on Phone: handleSwitchToMasterAreaOnPhone called");

        sap.ui.Device.system.phone = oOrigDeviceSystemPhone;
        oAllMyAppsControllerStub.restore();
        oAllMyAppsView.destroy();
    });

    QUnit.test("Renderer Test", function (assert) {
        jQuery.sap.getObject("sap-ushell-config", 0).renderers = {
            fiori2: {
                componentData: {
                    config: {
                        rootIntent: "Shell-home"
                    }
                }
            }
        };

        var fnDone = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var shell = sap.ui.getCore().byId("shell"),
                oShellHeader = shell.getHeader(),
                oAppTitle = oShellHeader.getAppTitle(),
                // prepare event data to simulate ShellUIService callback on the shell-controller for setting title
                sNavMenu,
                oNavMenu,
                oHierarchyItem,
                expectedRes,
                oRelatedAppMiniTile;

            EventHub.emit("CoreResourcesComplementLoaded");

            // To avoid problems with the Scheduler, we need to fake the loading of MessagePopoverInit
            // which normally would be triggered by the shell.controller
            EventHub.on("StepDone").do(function (sStepName) {
                if (sStepName === "UsageAnalytics") {
                    EventHub.emit("StepDone", "MessagePopoverInit");
                }
            });

            EventHub.join(
                // need to wait until Nav Menu gets created as it is post-core-ext control now....
                EventHub.once("loadRendererExtensions"),
                // Sometimes the test runs before the initial title got set,
                // leading to the title set by the test being overwritten by e.g. "Home"
                EventHub.once("TitleChanged")
            )
                .do(function () {
                    var eventData = "Application's title";
                    var oEvent = {
                        getParameters: function () { return { data: eventData }; }
                    };
                    AppLifeCycle.getAppMeta().onTitleChange(oEvent);

                    Config.wait("/core/shellHeader").then(function () {
                        Config.once("/core/shellHeader").do(function () {
                            sNavMenu = oAppTitle.getNavigationMenu();
                            oNavMenu = sap.ui.getCore().byId(sNavMenu);
                            ok(!(oNavMenu.getItems() && oNavMenu.getItems().length > 0), "check that no hierarchy items exist on nav menu");
                            // (1) check text was modified in app title
                            strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

                            // (2) see that navigation menu exists but no hierarchy items added

                            // prepare event data to simulate ShellUIService callback on the shell-controller for setting hierarchy which was changed
                            eventData = [{
                                title: "Item",
                                subtitle: "Item 2",
                                icon: "someIconURI"
                            }];

                            // trigger the event callback
                            Config.wait("/core/shellHeader").then(function () {
                                Config
                                    .once("/core/shellHeader")
                                    .do(function () {
                                        AppLifeCycle.getAppMeta().onHierarchyChange(oEvent);
                                    })
                                    .do(function () {
                                        Config
                                            .wait("/core/shellHeader")
                                            .then(function () {
                                                Config
                                                    .once("/core/shellHeader")
                                                    .do(function () {
                                                        // (4) check that title was not changed
                                                        strictEqual(oAppTitle.getText(), "Application's title", "Check application title");

                                                        // (5) check that a hierarchy item was created
                                                        ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created on the navigation menu");

                                                        // (6) validate the hierarchy item which was created according to the factory method as created within the shell-view
                                                        oHierarchyItem = oNavMenu.getItems()[0];
                                                        expectedRes = eventData[0];
                                                        ok(oHierarchyItem instanceof sap.m.StandardListItem, "check that hierarchy item created");
                                                        ok(oHierarchyItem.getProperty("title") === expectedRes.title, "check that hierarchy property assigned");
                                                        ok(oHierarchyItem.getProperty("description") === expectedRes.subtitle, "check that hierarchy property assigned");
                                                        ok(oHierarchyItem.getProperty("icon") === expectedRes.icon, "check that hierarchy property assigned");


                                                        // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
                                                        eventData = [{
                                                            title: "App 1",
                                                            subtitle: "App1 subtitle",
                                                            icon: "someIconURI",
                                                            intent: "#someintent1"
                                                        }, {
                                                            title: "Item",
                                                            subtitle: "Item 2",
                                                            icon: "someIconURI",
                                                            intent: "#someintent2"
                                                        }];

                                                        // trigger the event callback
                                                        AppLifeCycle.getAppMeta().onRelatedAppsChange(oEvent);

                                                        Config.wait("/core/shell/model/currentState").then(function () {
                                                            Config
                                                                .once("/core/shellHeader")
                                                                .do(function (oCurrentState) {

                                                                    strictEqual(oCurrentState.application.hierarchy.length, 1, "/core/shell/model/application/hierarchy contains the expected number of entries");

                                                                    var oNavMenuItems = oNavMenu.getItems();
                                                                    var oNavMenuMiniTiles = oNavMenu.getMiniTiles();

                                                                    // (7) check that title was not changed
                                                                    ok(oAppTitle.getText() === "Application's title", "Check application title");

                                                                    // (8) check that a hierarchy item was not modified AND relatedApps created correctly
                                                                    strictEqual(Object.prototype.toString.apply(oNavMenuItems), "[object Array]", "got nav menu items as an array");
                                                                    strictEqual(Object.prototype.toString.apply(oNavMenuMiniTiles), "[object Array]", "got nav menu mini tiles as an array");
                                                                    strictEqual(oNavMenuItems.length, 1, "check that hierarchy item created was not changed due to setting related apps");
                                                                    strictEqual(oNavMenuMiniTiles.length, 2, "check that related apps hierarchy item created on the navigation menu");

                                                                    // (9) validate the related Apps items which was created according to the factory method as created within the shell-view
                                                                    oRelatedAppMiniTile = oNavMenuMiniTiles[0];
                                                                    expectedRes = eventData[0];
                                                                    ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                    ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                    oRelatedAppMiniTile = oNavMenu.getMiniTiles()[1];
                                                                    expectedRes = eventData[1];
                                                                    ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                    ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                    ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                    // prepare event data to simulate ShellUIService callback on the shell-controller for setting Related-Apps which were changed
                                                                    eventData = [
                                                                        {
                                                                            title: "App 1",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 2",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 3",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 4",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 5",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 6",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 7",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 8 ",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 9",
                                                                            subtitle: "App1 subtitle",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent1"
                                                                        },
                                                                        {
                                                                            title: "App 10",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        },
                                                                        {
                                                                            title: "App 11",
                                                                            subtitle: "Item 2",
                                                                            icon: "someIconURI",
                                                                            intent: "#someintent2"
                                                                        }
                                                                    ];

                                                                    // trigger the event callback
                                                                    AppLifeCycle.getAppMeta().onRelatedAppsChange(oEvent);

                                                                    Config.wait("/core/shell/model/currentState").then(function () {
                                                                        Config
                                                                            .once("/core/shell/model/currentState")
                                                                            .do(function () {
                                                                                // (10) check that a hierarchy item was not modified due to related apps change
                                                                                ok(oNavMenu.getItems() && oNavMenu.getItems().length === 1, "check that hierarchy item created was not changed due to setting related apps");

                                                                                // (11) MAKE SURE no more than 9 related apps reside on the navigation menu although event passed 11 related apps in array
                                                                                ok(oNavMenu.getMiniTiles() && oNavMenu.getMiniTiles().length === 9, "check that related apps hierarchy item created on the navigation menu");

                                                                                oRelatedAppMiniTile = oNavMenu.getMiniTiles()[8];
                                                                                expectedRes = eventData[8];

                                                                                // (12) MAKE SURE last related app created is the 9th related app from the event data
                                                                                ok(oRelatedAppMiniTile instanceof sap.ushell.ui.shell.NavigationMiniTile, "check that related app item created");
                                                                                ok(oRelatedAppMiniTile.getProperty("title") === expectedRes.title, "check that related app property assigned");
                                                                                ok(oRelatedAppMiniTile.getProperty("subtitle") === expectedRes.subtitle, "check that related app property assigned");
                                                                                ok(oRelatedAppMiniTile.getProperty("icon") === expectedRes.icon, "check that related app property assigned");
                                                                                ok(oRelatedAppMiniTile.getProperty("intent") === expectedRes.intent, "check that related app property assigned");

                                                                                fnDone();
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


});
