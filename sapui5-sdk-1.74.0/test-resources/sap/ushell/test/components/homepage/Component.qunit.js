// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.homepage.Component
 */
sap.ui.require([
    "sap/ushell/bootstrap/common/common.load.model",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/renderers/fiori2/RendererExtensions",
    "sap/ushell/services/Container",
    "sap/ushell/components/SharedComponentUtils",
    "sap/ushell/Config"
], function (oModelWrapper, JSONModel, RendererExtensions, Container, SharedComponentUtils, Config) {
    "use strict";

    /* global QUnit sinon hasher */

    var oComponent,
        sComponentName = "sap.ushell.components.homepage",
        fAddHeaderItemStub,
        fSetLeftPaneVisibilityStub,
        fAddOptionsActionSheetButtonStub,
        fGetConfigurationStub,
        oExpectedModel,
        oModelWrapperStub;

    window.hasher = {
        getHash: sinon.stub()
    };

    // Strip all functionality from localStorage in order to not read any value from local testing
    Object.defineProperty(window, "localStorage", {
        value: {}
    });

    QUnit.module("sap.ushell.components.homepage.Component", {
        beforeEach: function (assert) {
            var done = assert.async();

            sap.ushell.bootstrap("local").then(function () {
                jQuery.sap.flpmeasure = {
                    end: function () {},
                    start: function () {},
                    endFunc: function () {},
                    startFunc : function () {}
                };

                sap.ushell.Container.getRenderer = function () {
                    return {
                        createExtendedShellState : function () {},
                        applyExtendedShellState: function () {},
                        getModelConfiguration: function () {
                            return {
                                enableNotificationsUI: true
                            };
                        },
                        getCurrentViewportState: function () {
                            return 'Center';
                        },
                        addUserPreferencesEntry: function () {},
                        getRouter: sinon.stub().returns({
                            getRoute: sinon.stub().returns({
                                attachMatched: sinon.stub()
                            })
                        })
                    };
                };
                fAddHeaderItemStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "addHeaderItem");
                fSetLeftPaneVisibilityStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "setLeftPaneVisibility");
                fAddOptionsActionSheetButtonStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "addOptionsActionSheetButton");
                fGetConfigurationStub = sinon.stub(sap.ushell.renderers.fiori2.RendererExtensions, "getConfiguration").returns({
                    enableSetTheme: true,
                    enableHelp: true,
                    preloadLibrariesForRootIntent: false
                });

                oExpectedModel = new JSONModel({
                    data1: "test1",
                    data2: "test2"
                });
                oModelWrapperStub = sinon.stub(oModelWrapper, "getModel").returns(oExpectedModel);

                oComponent = sap.ui.component({
                    id: "applicationsap-ushell-components-homepage-component",
                    name: sComponentName
                });

                oComponent.getRootControl().loaded().then(function () {
                    done();
                });
            });
        },
        afterEach: function (assert) {
            delete sap.ushell.Container;
            oComponent.destroy();

            fAddHeaderItemStub.restore();
            fSetLeftPaneVisibilityStub.restore();
            fAddOptionsActionSheetButtonStub.restore();
            fGetConfigurationStub.restore();

            hasher.getHash.reset();
            var oHideGroupsBtn = sap.ui.getCore().byId("hideGroupsBtn");
            if (oHideGroupsBtn) {
                oHideGroupsBtn.destroy();
            }

            oModelWrapperStub.restore();
            Config._reset();
        }
    });

    QUnit.test("The component instance was created", function (assert) {
        assert.ok(oComponent,"Instance was created");
    });

    QUnit.test("The configuration originates from the model wrapper", function (assert) {
        assert.deepEqual(oComponent.getModel().getData(), oExpectedModel.getData(), "The model data comes from the model wrapper.");
    });

    QUnit.test("The dashboard view was created successfully", function (assert) {
        assert.ok(oComponent.getRootControl().getContent().length > 0, "The dashboard view was created successfully.");
    });

    QUnit.test("The configuration for homePageGroupDisplay - when nothing is defined in personalization or by admin", function (assert) {
        var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

        assert.strictEqual(sHomePageGroupDisplay, "scroll", "The correct value has been found.");
    });

    QUnit.test("The configuration for homePageGroupDisplay - when disabled by admin", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub,
            oGetPersonalizationSpy;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve();
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);
        oGetPersonalizationSpy = sinon.spy(SharedComponentUtils, "_getPersonalization");

        Config.emit("/core/home/enableHomePageSettings", false);
        Config.emit("/core/home/homePageGroupDisplay", "tabs");

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.strictEqual(oGetPersonalizationSpy.callCount, 0, "The function getPersonalization has not been called.");
            assert.strictEqual(sHomePageGroupDisplay, "tabs", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            oGetPersonalizationSpy.restore();
            done();
        });
    });

    QUnit.test("The configuration for homePageGroupDisplay - when defined in personalization, and enabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve("tabs");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);

        Config.emit("/core/home/enableHomePageSettings", true);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.equal(sHomePageGroupDisplay, "tabs", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for homePageGroupDisplay - when defined in personalization, but disabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve("tabs");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);

        Config.emit("/core/home/enableHomePageSettings", false);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");

        // Assert
        Config.once("/core/home/homePageGroupDisplay").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/homePageGroupDisplay");

            assert.equal(sHomePageGroupDisplay, "scroll", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when nothing is defined in personalization or by admin", function (assert) {
        var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

        assert.strictEqual(sHomePageGroupDisplay, "Responsive", "The correct value has been found.");
    });

    QUnit.test("The configuration for sizeBehavior - when disabled by admin", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub,
            oGetPersonalizationSpy;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve();
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);
        oGetPersonalizationSpy = sinon.spy(SharedComponentUtils, "_getPersonalization");

        Config.emit("/core/home/sizeBehaviorConfigurable", false);
        Config.emit("/core/home/sizeBehavior", "Small");

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.strictEqual(oGetPersonalizationSpy.callCount, 0, "The function getPersonalization has not been called.");
            assert.strictEqual(sHomePageGroupDisplay, "Small", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            oGetPersonalizationSpy.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when defined in personalization, and enabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve("Small");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);

        Config.emit("/core/home/sizeBehaviorConfigurable", true);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.equal(sHomePageGroupDisplay, "Small", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });

    QUnit.test("The configuration for sizeBehavior - when defined in personalization, but disabled by configuration", function (assert) {
        // Arrange
        var done = assert.async(),
            oPersonalizer,
            oGetPersonalizerStub;

        oPersonalizer = {
            getPersData: function () {
                return jQuery.Deferred().resolve("Small");
            }
        };
        oGetPersonalizerStub = sinon.stub(SharedComponentUtils, "getPersonalizer").returns(oPersonalizer);

        Config.emit("/core/home/sizeBehaviorConfigurable", false);

        // Act
        SharedComponentUtils.getEffectiveHomepageSetting("/core/home/sizeBehavior", "/core/home/sizeBehaviorConfigurable");

        // Assert
        Config.once("/core/home/sizeBehavior").do(function () {
            var sHomePageGroupDisplay = oComponent.getModel().getProperty("/sizeBehavior");

            assert.equal(sHomePageGroupDisplay, "Responsive", "The correct value has been found.");

            oGetPersonalizerStub.restore();
            done();
        });
    });
});
