// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for MeArea.controller
 */
sap.ui.require([
    "sap/ushell/Config",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ushell/test/utils",
    "sap/ushell/components/shell/MeArea/MeArea.controller",
    "sap/m/MessageBox"
], function (
    Config,
    AppLifeCycle,
    testUtils,
    MeAreaController,
    MessageBox
) {
    "use strict";

    var oController,
        oShellConfig = null,
        oAppLifeCycleGetModelStub,
        oRenderer = {
            getShellConfig: function () {
                return oShellConfig || {};
            },
            showActionButton: sinon.spy(),
            hideActionButton: sinon.spy(),
            getEndUserFeedbackConfiguration: function () {
                return {};
            },
            addUserProfilingEntry: sinon.spy()
        };

    QUnit.module("MeArea.controller functionality", {
        beforeEach: function () {
            oAppLifeCycleGetModelStub = sinon.stub(AppLifeCycle, "getElementsModel").returns({ getModel: function () { } });
            sap.ushell.Container = sap.ushell.Container || {};
            sap.ushell.Container.getUser = function () {
                return {
                    getFullName: sinon.spy(),
                    getId: sinon.spy(),
                    getEmail: sinon.spy()
                };
            };

            sap.ushell.Container.getRenderer = function () {
                return oRenderer;
            };
            sap.ushell.Container.getService = sinon.spy();
            // disable EndUserFeedback
            testUtils.resetConfigChannel();
            Config.emit("/core/extension/EndUserFeedback", false);
            oController = new MeAreaController();
        },
        afterEach: function () {
            if (oController) {
                oController.onExit();
            }
            oShellConfig = null;
            oAppLifeCycleGetModelStub.restore();
        }
    });

    QUnit.test("Filter not existing actions", function (assert) {
        var oLastStub = sinon.stub(Config, "last"),
            oExpectedActions = ["openCatalogBtn", "userSettingsBtn"];

        oLastStub.withArgs("/core/shell/model/currentState/actions")
            .returns(["openCatalogBtn", "userSettingsBtn"].concat(["fake1", "fake2"]));

        oController.onInit();

        assert.deepEqual(oController.oModel.getProperty("/actions"), oExpectedActions, "Not created actins item should be filtered");
        oLastStub.restore();
    });

    QUnit.test("Create RecentActivitiesButton and FrequentActivitiesButton when enableRecentActivity is true", function (assert) {
        oShellConfig = { enableRecentActivity: true };

        Config.emit("/core/shell/model/currentState/showRecentActivity", true);

        var createRecentActivityStub = sinon.stub(oController, "_createRecentActivitiesButton");
        var createFrequentUsedStub = sinon.stub(oController, "_createFrequentActivitiesButton");

        oController.onInit();

        assert.ok(createRecentActivityStub.calledOnce, "_createRecentActivitiesButton should be called");
        assert.ok(createFrequentUsedStub.calledOnce, "_createRecentActivitiesButton should be called");

        createRecentActivityStub.restore();
        createFrequentUsedStub.restore();
    });

    QUnit.test("Create logout button is not called when disableSignOut is true", function (assert) {
        oShellConfig = { disableSignOut: true };

        var createLogoutButtonStub = sinon.stub(oController, "_createLogoutButton");

        oController.onInit();

        assert.ok(createLogoutButtonStub.notCalled, "_createLogoutButton should not be called");

        createLogoutButtonStub.restore();
    });

    QUnit.test("_createRecentActivitiesButton create button and add to the actions when tracking is enabled", function (assert) {
        var configOnStub = sinon.stub(Config, "on").returns({
            do: function (callback) {
                callback(true);
            }
        });
        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createRecentActivitiesButton();

        assert.ok(sap.ui.getCore().byId("recentActivitiesBtn"), "recentActivitiesBtn was created");
        assert.ok(oRenderer.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(oRenderer.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(sap.ushell.Container.getRenderer().showActionButton.getCall(0).args[0], "recentActivitiesBtn", "the id is correct");
        configOnStub.restore();
    });

    QUnit.test("_createRecentActivitiesButton don't create the button when tracking is disabled", function (assert) {
        var configOnStub = sinon.stub(Config, "on").returns({
            do: function (callback) {
                callback(false);
            }
        });

        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createRecentActivitiesButton();

        assert.ok(!sap.ui.getCore().byId("recentActivitiesBtn"), "recentActivitiesBtn should not be created");
        assert.ok(oRenderer.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(oRenderer.hideActionButton.calledOnce, "the button should be removed from model");
        configOnStub.restore();
    });

    QUnit.test("_createFrequentActivitiesButton create button and add to the actions when tracking is enabled", function (assert) {
        var configOnStub = sinon.stub(Config, "on").returns({
            do: function (callback) {
                callback(true);
            }
        });
        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createFrequentActivitiesButton();

        assert.ok(sap.ui.getCore().byId("frequentActivitiesBtn"), "frequentActivitiesBtn was created");
        assert.ok(oRenderer.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(oRenderer.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(sap.ushell.Container.getRenderer().showActionButton.getCall(0).args[0], "frequentActivitiesBtn", "the id is correct");
        configOnStub.restore();
    });

    QUnit.test("_createFrequentActivitiesButton don't create the button when tracking is disabled", function (assert) {
        var configOnStub = sinon.stub(Config, "on").returns({
            do: function (callback) {
                callback(false);
            }
        });

        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createFrequentActivitiesButton();

        assert.ok(!sap.ui.getCore().byId("frequentActivitiesBtn"), "frequentActivitiesBtn should not be created");
        assert.ok(oRenderer.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(oRenderer.hideActionButton.calledOnce, "the button should be removed from model");
        configOnStub.restore();
    });

    QUnit.test("_createSupportTicketButton create button and add to the actions when SupportTicket is enable", function (assert) {
        var sButtonId = "ContactSupportBtn",
            configOnStub = sinon.stub(Config, "on").returns({
                do: function (callback) {
                    callback(true);
                }
            });
        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createSupportTicketButton(true);

        assert.ok(sap.ui.getCore().byId(sButtonId), sButtonId + " was created");
        assert.ok(oRenderer.showActionButton.calledOnce, "the button should be added to actions in model");
        assert.ok(oRenderer.hideActionButton.notCalled, "the button should be added to actions in model");
        assert.equal(sap.ushell.Container.getRenderer().showActionButton.getCall(0).args[0], sButtonId, "the id is correct");
        configOnStub.restore();
    });

    QUnit.test("_createSupportTicketButton don't create the button when SupportTicket is disabled", function (assert) {
        var sButtonId = "ContactSupportBtn",
            configOnStub = sinon.stub(Config, "on").returns({
                do: function (callback) {
                    callback(false);
                }
            });

        oRenderer.showActionButton = sinon.spy();
        oRenderer.hideActionButton = sinon.spy();

        oController._createSupportTicketButton(true);

        assert.ok(!sap.ui.getCore().byId(sButtonId), sButtonId + " should not be created");
        assert.ok(oRenderer.showActionButton.notCalled, "the button should not be added to actions in model");
        assert.ok(oRenderer.hideActionButton.calledOnce, "the button should be removed from model");
        configOnStub.restore();
    });

    QUnit.test("EndUserFeedback service is enabled", function (assert) {
        // Arrange
        var fnDone = assert.async(),
            fnOnStub = sinon.stub(Config, "on").returns({
                do: function (callback) {
                    callback(true);
                }
            });
        sap.ushell.Container.getServiceAsync = function () {
            return Promise.resolve({
                isEnabled: function () {
                    return jQuery.Deferred().resolve();
                }
            });
        };

        var fnAddDanglingControlStub = sinon.stub(oController, "_addDanglingControl"),
            oConfig = { moveGiveFeedbackActionToShellHeader: false };

        // Act
        oController._createEndUserFeedbackButton(oConfig);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(fnAddDanglingControlStub.callCount, 1, "The EndUserFeedback button was added to the dangling controls");
            fnAddDanglingControlStub.restore();
            fnDone();
        });
        fnOnStub.restore();
        sap.ushell.Container.getServiceAsync = undefined;
    });

    QUnit.test("EndUserFeedback service is disabled", function (assert) {
        // Arrange
        var fnOnStub = sinon.stub(Config, "on").returns({
            do: function (callback) {
                callback(false);
            }
        }),
            fnAddDanglingControlStub = sinon.stub(oController, "_addDanglingControl");

        // Act
        oController._createEndUserFeedbackButton();

        // Assert
        assert.strictEqual(fnAddDanglingControlStub.callCount, 0, "The EndUserFeedback button was not added to the dangling controls");
        fnOnStub.restore();
        fnAddDanglingControlStub.restore();
    });

    QUnit.test("MessageBox should be open when click on logout button", function (assert) {
        var fnDone = assert.async(),
            sButtonId = "logoutBtn";

        sap.ushell.Container.getGlobalDirty = sinon.stub().returns({
            done: function (callback) {
                callback(false);
            }
        });
        sap.ushell.Container.DirtyState = {};
        var oMessageBoxStub = sinon.stub(MessageBox, "show");

        oController.onInit();
        sap.ui.getCore().byId(sButtonId).firePress();

        setTimeout(function () {
            assert.ok(oMessageBoxStub.calledOnce, "MessageBox should be shown");
            oMessageBoxStub.restore();
            delete sap.ushell.Container.getGlobalDirty;
            fnDone();
        }, 100);
    });

    QUnit.module("The function _createAppFinderButton", {
        beforeEach: function () {
            sap.ushell.Container = {};
            sap.ushell.Container.getUser = function () {
                return {
                    getFullName: sinon.stub(),
                    getId: sinon.stub(),
                    getEmail: sinon.stub()
                };
            };

            this.oShellConfig = {};
            this.oGetShellConfigStub = sinon.stub(oRenderer, "getShellConfig");
            this.oGetShellConfigStub.returns(this.oShellConfig);

            sap.ushell.Container.getRenderer = function () {
                return oRenderer;
            };

            this.oController = new MeAreaController();

            this.oConfigStub = sinon.stub(Config, "last");
            this.oConfigStub.withArgs("/core/shell/model/currentState/actions")
                .returns(["openCatalogBtn", "userSettingsBtn"].concat(["fake1", "fake2"]));

            this.createAppFinderButtonStub = sinon.stub(this.oController, "_createAppFinderButton");
        },
        afterEach: function () {
            this.oController.destroy();
            this.oConfigStub.restore();
            this.oGetShellConfigStub.restore();
            delete sap.ushell.Container;

        }
    });
    // test when spaces enabled and personalization disabled && moveAppFinderActionToShellHeader true -> no button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is true, there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = false;
        this.oShellConfig.moveAppFinderActionToShellHeader = true;

        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
    });

    // test when spaces enabled and personalization disabled && moveAppFinderActionToShellHeader false -> button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is false, " +
        "there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = false;
        this.oShellConfig.moveAppFinderActionToShellHeader = false;
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.createAppFinderButtonStub.called, "AppFinder button was created");
    });

    // test when spaces disabled and personalization enabled && moveAppFinderActionToShellHeader true -> no button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is false, " +
        "there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = false;
        this.oShellConfig.moveAppFinderActionToShellHeader = true;
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(true);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
    });

    // test when spaces disabled and personalization enabled && moveAppFinderActionToShellHeader false -> button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is false, " +
        "there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = true;
        this.oShellConfig.moveAppFinderActionToShellHeader = false;
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        this.oController.onInit();

        // Assert
        assert.ok(this.createAppFinderButtonStub.called, "AppFinder button was created");
    });

    // test when spaces disabled and personalization disabled && moveAppFinderActionToShellHeader true -> no button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is false, " +
        "there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = false;
        this.oShellConfig.moveAppFinderActionToShellHeader = true;
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
    });

    // test when spaces disabled and personalization disabled && moveAppFinderActionToShellHeader false -> no button
    QUnit.test("When spaces are enabled and personalization is disabled while the flag moveAppFinderActionToShellHeader is false, " +
        "there should be no AppFinder button in the MeArea.", function (assert) {
        // Arrange
        this.oShellConfig.enablePersonalization = false;
        this.oShellConfig.moveAppFinderActionToShellHeader = false;
        this.oConfigStub.withArgs("/core/spaces/enabled").returns(false);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.createAppFinderButtonStub.callCount, 0, "AppFinder button was not created");
    });



});
