// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.renderers.fiori2.Shell
 */
QUnit.config.autostart = false;
sap.ui.require([
    "jquery.sap.global",
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/services/AppType",
    "sap/ushell/ui/launchpad/ActionItem",
    "sap/m/Button",
    "sap/m/Bar",
    "sap/ushell/components/appfinder/AppFinder.controller",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/components/HeaderManager",
    "sap/ushell/shells/demo/fioriDemoConfig",
    "sap/ushell/services/Container",
    "sap/ushell/resources"
], function (
    jQuery,
    EventHub,
    Config,
    AppConfiguration,
    AppType,
    ActionItem,
    Button,
    Bar,
    AppFinderController,
    AppLifeCycle,
    HeaderManager
) {
    "use strict";

    /*global QUnit, sinon */

    QUnit.module("sap.ushell.renderers.fiori2.Renderer", {
        before: function () {
            // Disable the _handleAppFinderNavigation function which might cause errors due to race conditions after
            // the test is already done and cleaned up.
            // This is the easiest way of achieving isolation without a huge refactoring of the App Finder Controller.
            this.fnOriginalHandleNavigation = AppFinderController.prototype._handleAppFinderNavigation;
            AppFinderController.prototype._handleAppFinderNavigation = function () {};

            // Disable Recent Activity as the User Recent service is not available and this test is very integrated
            this.tempEnableRecentActivity = Config.last("/core/shell/enableRecentActivity");
            Config.emit("/core/shell/enableRecentActivity", false);
        },
        after: function () {
            AppFinderController.prototype._handleAppFinderNavigation = this.fnOriginalHandleNavigation;
            this.fnOriginalHandleNavigation = null;

            Config.emit("/core/shell/enableRecentActivity", this.tempEnableRecentActivity);
        },

        beforeEach: function () {
            this.sCachedConfig = JSON.stringify(window["sap-ushell-config"]);
            jQuery.sap.getObject("services.NavTargetResolution.config", 0, JSON.parse(this.sCachedConfig)).resolveLocal = [
                {
                    linkId: "Shell-home",
                    resolveTo: {
                        additionalInformation: "SAPUI5.Component=sap.ushell.components.flp",
                        applicationType: "URL",
                        url: jQuery.sap.getResourcePath("sap/ushell/components/flp"),
                        loadCoreExt: false, // avoid loading of core-ext-light and default dependencies
                        loadDefaultDependencies: false
                    }
                }
            ];

            window.location.hash = "";

            // Do not bootstrap here; config must be set before

            if (window.hasher && window.hasher.getHash()) {
                window.hasher.setHash("");
            }
            this.oHistoryBackStub = sinon.stub(window.history, "back");
            this.oAttachThemeChangedStub = sinon.stub(sap.ui.getCore(), "attachThemeChanged");
        },
        afterEach: function (assert) {
            var done = assert.async();

            // Wait for service to be loaded before cleaning up to avoid race condition
            sap.ushell.Container.getServiceAsync("ShellNavigation").then(function () {
                this.oHistoryBackStub.restore();
                window["sap-ushell-config"] = JSON.parse(this.sCachedConfig);
                if (this.oRendererControl) {
                    this.oRendererControl.destroy();
                    this.oRendererControl = null;
                }
                if (this.oRenderer) {
                    this.oRenderer.getShellController().destroy();
                    this.oRenderer.destroy();
                    this.oRenderer = null;
                }
                delete sap.ushell.Container;
                this.oAttachThemeChangedStub.restore();
                if (jQuery.sap.getUriParameters.restore) {
                    jQuery.sap.getUriParameters.restore();
                }
                // clear the sticky events so that they don't influence the next test
                EventHub._reset();

                done();
            }.bind(this));
        }
    });

    function _getContainerConfiguration () {
        var oBaseConfig = JSON.parse(this.sCachedConfig);
        oBaseConfig.renderers = {
            fiori2: {
                componentData: {
                    config: {
                        changeOpacity: "off",
                        applications: {
                            "Shell-home": {}
                        },
                        rootIntent: "Shell-home"
                    }
                }
            }
        };
        jQuery.sap.getObject("services.NavTargetResolution.config", 0, oBaseConfig).resolveLocal = [
            {
                linkId: "Shell-home",
                resolveTo: {
                    additionalInformation: "SAPUI5.Component=sap.ushell.components.flp",
                    applicationType: "URL",
                    url: jQuery.sap.getResourcePath("sap/ushell/components/flp"),
                    loadCoreExt: false, // avoid loading of core-ext-light and default dependencies
                    loadDefaultDependencies: false
                }
            }
        ];
        return oBaseConfig;
    }

    QUnit.test("disable search", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            sap.ushell.Container.getRenderer("fiori2").getShellController().getView().getViewData = function () {
                return {
                    config: {
                        enableSearch: false,
                        openSearchAsDefault: false
                    }
                };
            };

            var sComponentName = "sap.ushell.components.shell.Search";
            var oComponent = sap.ui.component({
                id: "applicationsap-ushell-components-search-component",
                name: sComponentName,
                componentData: {}
            });


            var search = sap.ui.getCore().byId("sf");
            assert.notOk(search, "verify search field is hidden");

            oComponent.destroy();

            done();
        });
    });

   QUnit.test("enable search", function (assert) {
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            sap.ushell.Container.getRenderer("fiori2").getShellController().getView().getViewData = function () {
                return {
                    config: {
                        enableSearch: true,
                        openSearchAsDefault: true
                    }
                };
            };

            var sComponentName = "sap.ushell.components.shell.Search";
            var oComponent = sap.ui.component({
                id: "applicationsap-ushell-components-search-component",
                name: sComponentName,
                componentData: {}
            });

            oComponent._searchShellHelperDeferred.done(function (oRes) {
                var oSearchField = sap.ui.getCore().byId("sf");
                assert.ok(oSearchField, "verify search field is visible");

                oComponent.destroy();

                done();
            });
        });
    });

    QUnit.test("test Button-ActionItem conversion", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                oButton = new Button({
                    id: "test_test",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                }),
                oAction;

            oRenderer.convertButtonsToActions([oButton.getId()]);
            oAction = sap.ui.getCore().byId("test_test");
            assert.ok(oAction instanceof ActionItem === true, "sap.m.Button should be converted to Action Item");
            oRenderer.hideActionButton(oAction.getId());

            oRenderer.destroy();
            oContainer.destroy();
            oAction.destroy();

            done();
        });
    });

    QUnit.test("test hideActionButton API", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                oButton = new Button({
                    id: "testActionId",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                }),
                aActions;

            oRenderer.showActionButton([oButton.getId()], true, undefined, false);
            aActions = Config.last("/core/shell/model/currentState/actions");
            assert.ok(aActions.indexOf("testActionId") > -1);

            oRenderer.hideActionButton(["testActionId"], true, undefined);
            aActions = Config.last("/core/shell/model/currentState/actions");
            assert.strictEqual(aActions.indexOf("testActionId"), -1);

            oRenderer.destroy();
            oContainer.destroy();

            done();
        });
    });


    //check that when a sap.m.button is added to user action as disabled, is added correctly and converted to sap.ushell.ui.launchpad.ActionItem
    QUnit.test("test addDisabledActionButton", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                oButton = new Button({
                    id: "disabledBtn",
                    text: "testAction",
                    icon: "iconName",
                    press: function () {
                        return true;
                    }
                }),
                aActions;

            oButton.setEnabled(false);
            oRenderer.showActionButton([oButton.getId()], true, undefined, false);
            aActions = Config.last("/core/shell/model/currentState/actions");
            assert.ok(aActions.indexOf("disabledBtn") > -1);

            var oConvertedButton = sap.ui.getCore().byId("disabledBtn");
            assert.strictEqual(oConvertedButton.getEnabled(), false);

            var oMetadata = oConvertedButton.getMetadata();
            assert.strictEqual(oMetadata.getName(), "sap.ushell.ui.launchpad.ActionItem");

            oRenderer.destroy();
            oContainer.destroy();

            done();
        });
    });

    QUnit.test("correct state name after navigating to an application", function (assert) {
        var done = assert.async();
        var oConfig = _getContainerConfiguration.call(this);

        oConfig.renderers.fiori2.componentData.config.appState = "standalone";

        window["sap-ushell-config"] = oConfig;

        sap.ushell.bootstrap("local").done(function () {
            jQuery.sap.require("sap.ui.core.routing.Router");
            window.hasher.setHash("#xxxx-yyy~navResCtx?navigationMode=newWindowThenEmbedded&additionalInformation=&applicationType=URL&url=http%253A%252F%252Fwalla.co.il");
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            var oExpectedConfigValues = {
                "/core/shell/model/currentState/stateName": "standalone"
            };

            Object.keys(oExpectedConfigValues).forEach(function (sConfigPath) {
                var vExpectedValue = oExpectedConfigValues[sConfigPath];

                assert.strictEqual(Config.last(sConfigPath), vExpectedValue, "got expected config value after renderer creation for " + sConfigPath);
            });

            window.hasher.setHash("");

            done();
        });
    });

    [
        "#Shell-home",
        "#Shell-appfinder",
        "#Shell-home?sap-system=XYZ",
        "#Shell-appfinder?sap-system=XYZ"
    ].forEach(function (sHash) {

        QUnit.test("Check correct current application is set after " + sHash + " is navigated", function (assert) {
            var done = assert.async();
            var fnErrorMessageSpy;

            window["sap-ushell-config"] = _getContainerConfiguration.call(this);

            sap.ushell.bootstrap("local").done(function () {
                jQuery.sap.require("sap.ui.core.routing.Router");
                window.hasher.setHash(sHash);
                this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
                var oShellView = sap.ui.getCore().byId("mainShell");
                fnErrorMessageSpy = sinon.spy(oShellView.getController(), "hashChangeFailure");

                AppConfiguration.setCurrentApplication({
                    "some_previous_application": true
                });
            }.bind(this));

            EventHub.once("RendererLoaded").do(function () {
                var oRenderer = sap.ushell.Container.getRenderer("fiori2");

                assert.ok(oRenderer, "can get the renderer");

                if (!oRenderer) {
                    return;
                }

                var oPromise = new Promise(function (resolve) {
                    var bNavigationAlreadyHandled = typeof oRenderer.getCurrentCoreView() === "string";
                    if (bNavigationAlreadyHandled) {
                        resolve();
                        return;
                    }

                    var oRouter = oRenderer.getRouter();
                    var fnAttachRouteMatched = function (sRoute) {
                        var oRoute = oRouter.getRoute(sRoute);

                        oRoute.attachEventOnce("matched", resolve);
                    };

                    fnAttachRouteMatched("home");
                    fnAttachRouteMatched("appfinder");
                    fnAttachRouteMatched("openFLPPage");
                });

                oPromise.then(function () {
                    var oCurrentApplication = AppConfiguration.getCurrentApplication();

                    assert.strictEqual(fnErrorMessageSpy.callCount, 0, "0 error messages have been displayed");
                    assert.strictEqual(oCurrentApplication, null, "the current application was set to null (i.e., core component was routed)");

                    fnErrorMessageSpy.restore();
                    done();
                });
            });
        });
    });

    QUnit.test("Check ShellNavigation.setIsInitialNavigation is called with parameter false when navigate to shell home and current application is not null", function (assert) {
        var done = assert.async(),
            sHash = "shell-home",
            oIsInititalNavigtaionStub,
            fnErrorMessageSpy,
            oGetCurrentApplicationSpy;

        window["sap-ushell-config"] = _getContainerConfiguration.call(this);

        sap.ushell.bootstrap("local").done(function () {
            jQuery.sap.require("sap.ui.core.routing.Router");
            window.hasher.setHash(sHash);
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
            var oShellView = sap.ui.getCore().byId("mainShell");
            fnErrorMessageSpy = sinon.spy(oShellView.getController(), "hashChangeFailure");
            oGetCurrentApplicationSpy = sinon.spy(AppConfiguration, "getCurrentApplication");
            oIsInititalNavigtaionStub = sinon.stub(sap.ushell.Container.getService("ShellNavigation"), "setIsInitialNavigation");

            AppConfiguration.setCurrentApplication({
                "some_previous_application": true
            });
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");

            assert.ok(oRenderer, "can get the renderer");

            if (!oRenderer) {
                return;
            }

            var oPromise = new Promise(function (resolve) {
                var bNavigationAlreadyHandled = typeof oRenderer.getCurrentCoreView() === "string";
                if (bNavigationAlreadyHandled) {
                    resolve();
                    return;
                }

                var oRouter = oRenderer.getRouter();
                var fnAttachRouteMatched = function (sRoute) {
                    var oRoute = oRouter.getRoute(sRoute);

                    oRoute.attachEventOnce("matched", resolve);
                };

                fnAttachRouteMatched("home");
                fnAttachRouteMatched("appfinder");
            });

            oPromise.then(function () {

                assert.equal(oGetCurrentApplicationSpy.callCount, 1, "getCurrentApplication is called once");
                assert.equal(oIsInititalNavigtaionStub.callCount, 1, "isInititalNavigtaionStub is called");
                assert.equal(oIsInititalNavigtaionStub.firstCall.args[0], false, "isInititalNavigtaionStub is called with paramter false");

                fnErrorMessageSpy.restore();
                done();
            });
        });
    });

    QUnit.test("Headerless application state & personalization enablement 1", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "headerless";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            // first test is to see that personalization is off due to the headerless mode
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");
            setTimeout(function () {
                assert.strictEqual(Config.last("/core/shell/model/personalization"), false, "verify personalization is off due to appstate headerless mode");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("addUserAction: given existing control", function (assert) {
        var done = assert.async();

        var oAddActionButtonParameters = {
                oControlProperties: {
                    id: "SomeExistingButton"
                },
                bIsVisible: true,
                bCurrentState: {}
            },
            oAddUserActionPromise,
            oButton = new Button({
                id: "SomeExistingButton"
            });

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.wait("RendererLoaded").then(function () {
            EventHub.once("RendererLoaded").do(function () {
                this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

                oAddUserActionPromise = this.oRenderer.addUserAction(oAddActionButtonParameters);
                oAddUserActionPromise.done(function (oControl) {
                    assert.strictEqual(oControl, oButton, "oRenderer.addUserAction returned the correct control");

                    oButton.destroy();
                    done();
                });
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("addUserAction: given control type", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            var oAddActionButtonParameters = {
                    controlType: "sap.m.Button",
                    bIsVisible: true,
                    bCurrentState: {}
                },
                oAddUserActionPromise;

            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
            EventHub.once("RendererLoaded").do(function () {
                this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

                oAddUserActionPromise = this.oRenderer.addUserAction(oAddActionButtonParameters);
                setTimeout(function () {
                    oAddUserActionPromise.done(function (oControl) {
                        assert.strictEqual(oControl.getActionType(), "standard", "oRenderer.addUserAction returned sap.ushell.ui.launchpad.ActionItem with standard actionType");
                    });

                    done();
                }, 100);
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("addUserAction: No control or control type given", function (assert) {
        var done = assert.async();
        var oAddActionButtonParameters = {},
            oAddUserActionPromise;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oAddUserActionPromise = this.oRenderer.addUserAction(oAddActionButtonParameters);
            setTimeout(function () {
                oAddUserActionPromise.fail(function (sMsg) {
                    assert.strictEqual(sMsg, "You must specify control type in order to create it", "oRenderer.addUserAction promise rejected and returned error message");
                });

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("Merged application state & personalization enablement 1", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "merged";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            // first test is to see that personalization is off due to the merged mode
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            setTimeout(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate merged mode");

                done();
            }, 100);
        });

    });

    QUnit.test("Headerless application state & personalization enablement 2", function (assert) {
        var done = assert.async();
        // second test is to see that personalization is off due to headerless mode (even though configuration indicates that personalization if enabled)
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "headerless";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate headerless mode even when configuration allows personalization");
                assert.strictEqual(HeaderManager._getBaseStateMember("headerless", "headerVisible"), false, "verify header visibility is false");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("Merged application state & personalization enablement 2", function (assert) {
        var done = assert.async();
        // second test is to see that personalization is off due to merged mode (even though configuration indicates that personalization if enabled)
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "merged";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            setTimeout(function () {
                var bEnablePers = Config.last("/core/shell/model/personalization");

                assert.strictEqual(bEnablePers, false, "verify personalization is off due to appstate merged mode even when configuration allows personalization");
                assert.strictEqual(HeaderManager._getBaseStateMember("merged", "headerVisible"), true, "verify header visibility is true");

                done();
            }, 100);
        });
    });

    QUnit.test("Headerless application state & personalization enablement 3", function (assert) {
        var done = assert.async();
        // third test is to see that personalization is off due to non-headerless mode BUT configuration set personalization off
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization = false;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                assert.strictEqual(Config.last("/core/shell/model/personalization"), false, "verify personalization is off due to non-headerless mode BUT configuration set personalization off");
                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("Merged application state & personalization enablement 4", function (assert) {
        var done = assert.async();
        // fourth test is to see that personalization is off due to non-merged mode BUT configuration set personalization off
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "merged";
        config.renderers.fiori2.componentData.config.enablePersonalization = false;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            setTimeout(function () {
                assert.strictEqual(Config.last("/core/shell/model/personalization"), false, "verify personalization is off due to non-merged mode BUT configuration set personalization off");
                done();
            }, 100);
        });
    });

    QUnit.test("Headerless application state & personalization enablement 5", function (assert) {
        var done = assert.async();
        // fifth test is to see that personalization is off due to non-headerless mode BUT configuration simply do not have personalization property
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "standalone";
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                assert.strictEqual(Config.last("/core/shell/model/personalization"), false, "verify personalization is off due to non-headerless mode BUT configuration simply do not have personalization property");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("Headerless application state & personalization enablement 6", function (assert) {
        var done = assert.async();
        // sixth test is to see that personalization is on due to non-headerless mode and configuration enables personalization
        var oConfig = _getContainerConfiguration.call(this);
        oConfig.renderers.fiori2.componentData.config.enablePersonalization = true;
        oConfig.renderers.fiori2.componentData.config.appState = "standalone";
        sap.ui.require(["sap/ushell/Config"], function (oConfig) {
            oConfig._reset();
        });
        window["sap-ushell-config"] = oConfig;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                assert.strictEqual(Config.last("/core/shell/model/personalization"), true, "verify personalization is on due to non-headerless mode and configuration enables personalization");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("test logRecentActivity API", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                oRecentEntry = {},
                oUserRecentsSrvc = sap.ushell.Container.getService("UserRecents");

            oRenderer.oShellModel.getModel().setProperty("/enableTrackingActivity", true);

            // add theURL to recent activity log
            oRecentEntry.title = "URL tile text";
            oRecentEntry.appType = AppType.URL;
            oRecentEntry.url = "https://www.google.com";
            oRecentEntry.appId = "https://www.google.com";

            oRenderer.logRecentActivity(oRecentEntry).then(function () {
                oUserRecentsSrvc.getRecentActivity().done(function (aActivity) {
                    assert.strictEqual(aActivity[0].title, "URL tile text");
                    assert.strictEqual(aActivity[0].appType, AppType.URL);
                    assert.strictEqual(aActivity[0].url, "https://www.google.com");
                    assert.strictEqual(aActivity[0].appId, "https://www.google.com");

                    oRenderer.destroy();
                    oContainer.destroy();
                    done();
                });
            });
        });
    });

    QUnit.test("create custom shell", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                var oShell = sap.ui.getCore().byId("shell"),
                    oModel,
                    oCurrentState;

                sap.ushell.Container.getRenderer("fiori2").createExtendedShellState("test1", function () {
                    sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                        id: "testx1",
                        text: "testx1",
                        icon: "sap-icon://edit",
                        tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                        press: function () {
                            sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                        }
                    }, true, true);
                });

                sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState("test1");

                oModel = oShell.getModel();
                oCurrentState = Config.last("/core/shell/model/currentState");

                assert.ok(oCurrentState.actions.indexOf("testx1") > -1, "Validate testx1 in actions");
                assert.ok(oCurrentState.actions.indexOf("ContactSupportBtn") > -1, "Validate ContactSupportBtn in actions");
                assert.ok(oCurrentState.actions.indexOf("EndUserFeedbackBtn") > -1, "Validate EndUserFeedbackBtn in actions");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("shell api, validate apply extended shell state override current shell.", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "standalone";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                var oShell = sap.ui.getCore().byId("shell");

                sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                    id: "base1",
                    text: "base1",
                    icon: "sap-icon://edit",
                    tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                    press: function () {
                        sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, true);

                sap.ushell.Container.getRenderer("fiori2").createExtendedShellState("test1", function () {
                    sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                        id: "testx1",
                        text: "testx1",
                        icon: "sap-icon://edit",
                        tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                        press: function () {
                            sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                        }
                    }, true, true);
                });

                sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState("test1");

                var oModel = oShell.getModel();
                var oCurrentState = Config.last("/core/shell/model/currentState");

                assert.ok(oCurrentState.actions.indexOf("testx1") > -1, "Validate testx1 in actions");
                assert.ok(oCurrentState.actions.indexOf("ContactSupportBtn") > -1, "Validate ContactSupportBtn in actions");
                assert.ok(oCurrentState.actions.indexOf("EndUserFeedbackBtn") > -1, "Validate EndUserFeedbackBtn in actions");
                assert.ok(oCurrentState.actions.indexOf("base1") > -1, "Validate base1 at action[4]");

                done();
            }, 100);
        }.bind(this));
    });

    QUnit.test("shell api, validate apply extended shell state override base shell state home.", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "home";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                var oShell = sap.ui.getCore().byId("shell");
                var oActionButton = sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                    id: "homebase1",
                    text: "homebase1",
                    icon: "sap-icon://edit",
                    tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                    press: function () {
                        sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                    }
                }, true, false, ["home"]);

                sap.ushell.Container.getRenderer("fiori2").createExtendedShellState("test1", function () {
                    sap.ushell.Container.getRenderer("fiori2").addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                        id: "testx1",
                        text: "testx1",
                        icon: "sap-icon://edit",
                        tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                        press: function () {
                            sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                        }
                    }, true, true);
                });

                sap.ushell.Container.getRenderer("fiori2").applyExtendedShellState("test1");

                var oModel = oShell.getModel();
                var oCurrentState = Config.last("/core/shell/model/currentState");

                assert.strictEqual(oCurrentState.actions[0], "openCatalogBtn", "Validate openCatalogBtn at action[0]");
                assert.strictEqual(oCurrentState.actions[1], "userSettingsBtn", "Validate userSettingsBtn at action[1]");
                assert.strictEqual(oCurrentState.actions[2], "ContactSupportBtn", "Validate ContactSupportBtn at action[2]");
                assert.strictEqual(oCurrentState.actions[3], "EndUserFeedbackBtn", "Validate EndUserFeedbackBtn at action[3]");
                assert.strictEqual(oCurrentState.actions[4], "homebase1", "Validate homebase1 at action[4]");
                assert.strictEqual(oCurrentState.actions[5], "testx1", "Validate testx1 at action[5]");

                sap.ushell.Container.getRenderer("fiori2").hideActionButton([oActionButton.getId()], false, ["home"]);
                done();
            }, 100);
        }.bind(this));
    });

    /**
     * Verify that the renderer API function setFloatingContainerContent eventually calls the shell.controller function _setShellItem,
     * with the crrect PropertyString and statuses
     */
    QUnit.test("Floating container - test setFloatingContainerContent", function (assert) {
        var done = assert.async(),
            oShellModel,
            oButton,
            oWrapperDomElement,
            oDomNode,
            setFloatingContainerContentStub;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oShellModel = AppLifeCycle.getElementsModel();
            oButton = new Button("testButton", {test: "testButton"});
            setFloatingContainerContentStub = sinon.stub(oShellModel, "setFloatingContainerContent");
            oWrapperDomElement = document.createElement("DIV");
            oWrapperDomElement.className = "sapUshellShellFloatingContainerWrapper";
            oDomNode = document.getElementById("qunit");
            oDomNode.appendChild(oWrapperDomElement);

            var oShellView = sap.ui.getCore().byId("mainShell");
            oShellView.createPostCoreExtControls();

            sap.ushell.Container.getRenderer("fiori2").setFloatingContainerContent(oButton, false, ["home", "app"]);

            assert.strictEqual(setFloatingContainerContentStub.callCount, 1, "Shell controller function _setShellItem called once");
            assert.strictEqual(setFloatingContainerContentStub.args[0][0], "floatingContainerContent", "Shell controller function _setShellItem called with PropertyString: floatingContainerContent");
            assert.strictEqual(setFloatingContainerContentStub.args[0][3][0], "home", "Shell controller function _setShellItem called with 1st status: home");
            assert.strictEqual(setFloatingContainerContentStub.args[0][3][1], "app", "Shell controller function _setShellItem called with 2nd status: app");

            setFloatingContainerContentStub.restore();
            done();
        }.bind(this));
    });

    /**
     * Verify that the renderer API function setFloatingContainerVisibility eventually calls ShellView.OUnifiedShell function setFloatingContainerVisible
     * with the correct boolean parameter
     */
    QUnit.test("Floating container - test setFloatingContainerVisible", function (assert) {
        var done = assert.async(),
            oShellView,
            oUnifiedShell,
            oShellSetVisibilityStub;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oShellView = sap.ui.getCore().byId("mainShell");
            oUnifiedShell = oShellView.getOUnifiedShell();
            oShellSetVisibilityStub = sinon.stub(oUnifiedShell, "setFloatingContainerVisible").returns();

            sap.ushell.Container.getRenderer("fiori2").setFloatingContainerVisibility(true);

            assert.strictEqual(oShellSetVisibilityStub.calledOnce, true, "ShellView.getOUnifiedShell().setFloatingContainerVisible called once");
            assert.strictEqual(oShellSetVisibilityStub.args[0][0], true, "ShellView.OUnifiedShell function setFloatingContainerVisible called with the correct boolean parameter");

            oShellSetVisibilityStub.restore();
            done();
        }.bind(this));
    });

    /**
     * Verify that the renderer API function getFloatingContainerVisiblity eventually calls ShellView.OUnifiedShell function getFloatingContainerVisible
     */
    QUnit.test("Floating cotnainer - test getFloatingContainerVisible", function (assert) {
        var done = assert.async(),
            oShellView,
            oUnifiedShell,
            oShellGetVisibilityStub;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oShellView = sap.ui.getCore().byId("mainShell");
            oUnifiedShell = oShellView.getOUnifiedShell();
            oShellGetVisibilityStub = sinon.stub(oUnifiedShell, "getFloatingContainerVisible");

            sap.ushell.Container.getRenderer("fiori2").getFloatingContainerVisiblity(true);

            assert.strictEqual(oShellGetVisibilityStub.callCount, 1, "ShellView.getOUnifiedShell().setFloatingContainerVisible called once");

            oShellGetVisibilityStub.restore();
            done();
        }.bind(this));
    });

    QUnit.test("shell api, custom merge function.", function (assert) {
        var done = assert.async();
        var config = _getContainerConfiguration.call(this);

        config.renderers.fiori2.componentData.config.appState = "home";
        config.renderers.fiori2.componentData.config.enablePersonalization = true;
        window["sap-ushell-config"] = config;
        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            setTimeout(function () {
                var oShell = sap.ui.getCore().byId("shell");

                this.oRenderer.createExtendedShellState("test1", function () {
                    this.oRenderer.addActionButton("sap.ushell.ui.launchpad.ActionItem", {
                        id: "testx1",
                        text: "testx1",
                        icon: "sap-icon://edit",
                        tooltip: sap.ushell.resources.i18n.getText("activateEditMode"),
                        press: function () {
                            sap.ushell.components.homepage.ActionMode.toggleActionMode(oModel, "Menu Item");
                        }
                    }, true, true);
                }.bind(this));

                this.oRenderer.applyExtendedShellState("test1", function (oCustomStateJSON) {
                    this.oRenderer.showHeaderItem(oCustomStateJSON.headItems, true);
                    this.oRenderer.showToolAreaItem(oCustomStateJSON.toolAreaItems, true);
                    this.oRenderer.showHeaderEndItem(oCustomStateJSON.headEndItems, true);
                    this.oRenderer.showSubHeader(oCustomStateJSON.subHeader, true);
                    this.oRenderer.showActionButton(oCustomStateJSON.actions, true, undefined, true);
                    this.oRenderer.showLeftPaneContent(oCustomStateJSON.paneContent, true);
                    this.oRenderer.showFloatingActionButton(oCustomStateJSON.floatingActions, true);
                }.bind(this));

                var oModel = oShell.getModel();
                var oCurrentState = Config.last("/core/shell/model/currentState");

                assert.strictEqual(oCurrentState.actions[0], "openCatalogBtn", "Validate openCatalogBtn at action[0]");
                assert.strictEqual(oCurrentState.actions[1], "userSettingsBtn", "Validate userSettingsBtn at action[1]");
                assert.strictEqual(oCurrentState.actions[2], "ContactSupportBtn", "Validate ContactSupportBtn at action[2]");
                assert.strictEqual(oCurrentState.actions[3], "EndUserFeedbackBtn", "Validate EndUserFeedbackBtn at action[3]");
                assert.strictEqual(oCurrentState.actions[4], "testx1", "Validate testx1 at action[4]");

                done();
            }.bind(this), 100);
        }.bind(this));
    });

    /**
     * test EdnUserFeedback UI API
     */
    QUnit.test("Renderer API - EndUserFeedback", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            var oRenderer = sap.ushell.Container.getRenderer("fiori2"),
                oShellView = sap.ui.getCore().byId("mainShell"),
                oController = oShellView.getController(),
                oEndUserFeedbackConfiguration = oController.oEndUserFeedbackConfiguration;

            assert.strictEqual(oEndUserFeedbackConfiguration.anonymousByDefault, true, "Initial value of oEndUserFeedbackConfiguration.anonymousByDefault is true");
            assert.strictEqual(oEndUserFeedbackConfiguration.showLegalAgreement, true, "Initial value of oEndUserFeedbackConfiguration.showLegalAgreement is true");

            oRenderer.makeEndUserFeedbackAnonymousByDefault(false);
            oRenderer.showEndUserFeedbackLegalAgreement(false);

            assert.strictEqual(oEndUserFeedbackConfiguration.anonymousByDefault, false, "After API call - Value of oEndUserFeedbackConfiguration.anonymousByDefault is false");
            assert.strictEqual(oEndUserFeedbackConfiguration.showLegalAgreement, false, "After API call - Value of oEndUserFeedbackConfiguration.showLegalAgreement is false");

            oRenderer.destroy();
            oContainer.destroy();
            done();
        });
    });


    /**
     * test setHeaderVisibility API
     */
    QUnit.test("Renderer API - setHeaderVisibility", function (assert) {
        var done = assert.async();
        var oContainer;

        sap.ushell.bootstrap("local").then(function () {
            oContainer = sap.ushell.Container.createRenderer("fiori2");
        });

        EventHub.once("RendererLoaded").do(function () {
            var oRenderer = sap.ushell.Container.getRenderer("fiori2");

            AppLifeCycle.switchViewState("home");

            var bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, true, "Header visibility = true by default");

            oRenderer.setHeaderVisibility(false, true);
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API");
            AppLifeCycle.switchViewState("app");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, true, "Header visibility = true after changing the state");
            AppLifeCycle.switchViewState("home");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, true, "Header visibility = false after changing the state to home");

            oRenderer.setHeaderVisibility(false, false, ["home"]);
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API on state home");
            AppLifeCycle.switchViewState("app");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, true, "Header visibility = true after changing the state toa app");
            AppLifeCycle.switchViewState("home");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = false after changing the state to home again");

            oRenderer.setHeaderVisibility(false, false, ["home", "app"]);
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = false after calling the API on state home and app");
            AppLifeCycle.switchViewState("app");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = true after changing the state toa app");
            AppLifeCycle.switchViewState("home");
            bHeaderVisible = Config.last("/core/shellHeader/headerVisible");
            assert.strictEqual(bHeaderVisible, false, "Header visibility = true after changing the state to home again");

            oRenderer.destroy();
            oContainer.destroy();
            done();
        });
    });

    QUnit.test("Header Items - test showSeparator", function (assert) {
        var done = assert.async(),
            oControl;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            //check default behavior for Fiori1
            sap.ushell.Container.getRenderer("fiori2").addHeaderItem(undefined, {id: "headerItem"}, false, true);
            sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem(undefined, {id: "headerEndItem"}, false, true);

            oControl = sap.ui.getCore().byId("headerItem");
            assert.strictEqual(oControl.getShowSeparator(), false, "default showSeparator flag should be true");
            oControl.destroy();
            oControl = sap.ui.getCore().byId("headerEndItem");
            assert.strictEqual(oControl.getShowSeparator(), false, "default showSeparator flag should be true");
            oControl.destroy();

            //check default behavior for Fiori2
            sap.ushell.Container.getRenderer("fiori2").addHeaderItem(undefined, {id: "headerItem"}, false, true);
            sap.ushell.Container.getRenderer("fiori2").addHeaderEndItem(undefined, {id: "headerEndItem"}, false, true);

            oControl = sap.ui.getCore().byId("headerItem");
            assert.strictEqual(oControl.getShowSeparator(), false, "in Fiori2 showSeparator flag should be false");
            oControl.destroy();
            oControl = sap.ui.getCore().byId("headerEndItem");
            assert.strictEqual(oControl.getShowSeparator(), false, "in Fiori2 showSeparator flag should be false");
            oControl.destroy();

            done();
        }.bind(this));
    });

    QUnit.test("Header Items Triggers - Current State: test Triggers on event", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            var fnValidate = sinon.spy();

            //create contitional.
            this.oRenderer.createTriggers([{
                sName: "testevent",
                fnRegister: function () {
                    //fnRegister
                    sap.ui.getCore().getEventBus().subscribe("launchpad", "xxx", fnValidate, this);
                },
                fnUnRegister: function () {
                    //fnUnRegister
                    sap.ui.getCore().getEventBus().unsubscribe("launchpad", "xxx", fnValidate, this);
                }
            }], true);

            assert.strictEqual(fnValidate.callCount, 0, "Validate fnValidate is not called!");
            sap.ui.getCore().getEventBus().publish("launchpad", "xxx", {});
            assert.strictEqual(fnValidate.callCount, 1, "Validate fnValidate is called!");

            done();
        }.bind(this));
    });

    QUnit.test("Header Items Triggers - Home State: test Triggers on event", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            var fnValidate = sinon.spy();

            //create contitional.
            this.oRenderer.createTriggers([{
                sName: "testevent",
                fnRegister: function () {
                    //fnRegister
                    sap.ui.getCore().getEventBus().subscribe("launchpad", "xxx", fnValidate, this);
                },
                fnUnRegister: function () {
                    //fnUnRegister
                    sap.ui.getCore().getEventBus().unsubscribe("launchpad", "xxx", fnValidate, this);
                }
            }], false, ["home"]);

            assert.strictEqual(fnValidate.callCount, 0, "Validate fnValidate is not called!");
            sap.ui.getCore().getEventBus().publish("launchpad", "xxx", {});
            assert.strictEqual(fnValidate.callCount, 1, "Validate fnValidate is called!");

            done();
        }.bind(this));
    });

    QUnit.test("Header Items - showSignOut item", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");
            var aActions = Config.last("/core/shell/model/currentState/actions");
            assert.strictEqual(aActions.indexOf("logoutBtn"), -1, "Signout should not be in the model");

            this.oRenderer.showSignOutItem(true);

            aActions = Config.last("/core/shell/model/currentState/actions");
            assert.ok(aActions.indexOf("logoutBtn") >= 0, "Signout should be in the model!");

            done();
        }.bind(this));
    });

    QUnit.test("Header Items - showSettings item", function (assert) {
        var done = assert.async();

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            AppLifeCycle.switchViewState("blank");
            var aActions = Config.last("/core/shell/model/currentState/actions");
            assert.strictEqual(aActions.indexOf("userSettingsBtn"), -1, "userSettingsBtn should not be in the model");

            this.oRenderer.showSettingsItem(true);

            aActions = Config.last("/core/shell/model/currentState/actions");
            assert.ok(aActions.indexOf("userSettingsBtn") >= 0, "userSettingsBtn should be in the model!");

            done();
        }.bind(this));
    });

    QUnit.test("Header Items - check argumentDeprication: 'controlType'", function (assert) {
        var done = assert.async();
        var oControl;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            // Check adding Header Item without providing deprecated arg 'controlType'.
            sap.ushell.Container.getRenderer("fiori2").addHeaderItem({id: "headerItem"}, false, true);
            oControl = sap.ui.getCore().byId("headerItem");
            assert.ok(oControl, "addHeaderItem is created when not providing depreecated arg 'controlType'");
            oControl.destroy();

            // Check backwards compatibility -  adding Header Item with providing depreecated arg 'controlType'.
            sap.ushell.Container.getRenderer("fiori2").addHeaderItem("testControlType", {id: "headerItem2"}, false, true);
            oControl = sap.ui.getCore().byId("headerItem2");
            assert.ok(oControl, "addHeaderItem is created when providing depreecated arg 'controlType' - backwards compatibility");
            oControl.destroy();
            done();
        });
    });

    QUnit.test("Renderer API - setFooterControl", function (assert) {
        var done = assert.async();
        var oControl;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");
            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oControl = this.oRenderer.setFooterControl("sap.m.Bar", {id: "testFooterId"});

            assert.ok(oControl, "footer is created");
            assert.strictEqual(this.oRenderer.lastFooterId, "testFooterId", "oRenderer.lastFooterId initialized to the created footer id");

            this.oRenderer.removeFooter();
            oControl = sap.ui.getCore().byId("testFooterId");
            assert.notOk(oControl, "oConterol was destroyed - does not exist");
            assert.notOk(this.oRenderer.lastFooterId, "oRenderer.lastFooterId parameter was set to undefined");

            done();
        }.bind(this));
    });

    QUnit.test("Renderer API - setFooter", function (assert) {
        var done = assert.async();
        var oControl;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");

            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oControl = new Bar({id: "testFooterId"});
            this.oRenderer.setFooter(oControl);

            assert.notOk(this.oRenderer.lastFooterId, "oRenderer.lastFooterId parameter is undefined");

            this.oRenderer.removeFooter();
            assert.ok(oControl, "footer wasn't destroyed by the removeFooter API");
            oControl.destroy();

            done();
        }.bind(this));
    });

    QUnit.test("Renderer API - removeFooter", function (assert) {
        var done = assert.async();
        var oControl;

        sap.ushell.bootstrap("local").then(function () {
            this.oRendererControl = sap.ushell.Container.createRenderer("fiori2");
        }.bind(this));

        EventHub.once("RendererLoaded").do(function () {
            AppLifeCycle.switchViewState("home");

            this.oRenderer = sap.ushell.Container.getRenderer("fiori2");

            oControl = this.oRenderer.setFooterControl("sap.m.Bar", {id: "testFooterId"});

            assert.ok(oControl, "The footer was created");
            assert.strictEqual(this.oRenderer.lastFooterId, "testFooterId", "oRenderer.lastFooterId parameter initialized to testFooterId");

            oControl.destroy();
            this.oRenderer.removeFooter();

            assert.notOk(this.oRenderer.lastFooterId, "The footer control was destroyed before calling the removeFooter function, the function initialized the oRenderer.lastFooterId parameter without trying to destroy the footer control");
            done();
        }.bind(this));
    });

    QUnit.start();
});
