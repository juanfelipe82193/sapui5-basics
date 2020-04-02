// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

if (window.blanket) {
    window.blanket.options("sap-ui-cover-only", /ThemeSelector\.controller\.js/);
}

QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/components/shell/UserSettings/ThemeSelector.controller",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Component",
    "sap/ushell/User"
], function (ThemeSelectorController, Controller, Component, User) {
    "use strict";

    QUnit.start();
    function makePromiseMock() {
        return {
            done: sinon.stub(),
            fail: sinon.stub()
        };
    }

    /* global QUnit sinon */

    QUnit.module("The onInit function", {
        beforeEach: function(assert) {
            this.oGetServiceStub = sinon.stub();
            this.oGetUserStub = sinon.stub();

            this.oUser = {
                getTheme: sinon.stub()
            };
            this.oGetUserStub.returns(this.oUser);

            window.sap.ushell = {
                Container: {
                    getService: this.oGetServiceStub,
                    getUser: this.oGetUserStub
                },
                User: User
            };

            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.ThemeSelector"
            }).then(function(oController) {
                this.oController = oController;
                done();
            }.bind(this));
        },

        afterEach: function() {
            this.oController.destroy();
            this.oController = null;

            this.oGetServiceStub = null;
            this.oGetUserStub = null;

            delete window.sap.ushell;
        }
    });

    QUnit.test("Retrieves the UserInfo service instance", function (assert) {
        // Arrange
        var oUserInfo = {};
        this.oGetServiceStub.withArgs("UserInfo").returns(oUserInfo);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oGetServiceStub.callCount, 1, "The getService function has been called once.");
        assert.strictEqual(this.oGetUserStub.callCount, 1, "The getUser function has been called once.");
        assert.strictEqual(this.oController.userInfoService, oUserInfo, "The correct value has been assigned.");
    });

    QUnit.test("Retrieves the current theme from the user object", function (assert) {
        // Arrange
        var sTheme = "TheTheme!";
        this.oUser.getTheme.returns(sTheme);

        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oController.currentThemeId, sTheme, "The correct value has been assigned.");
        assert.strictEqual(this.oController.origThemeId, sTheme, "The correct value has been assigned.");
        assert.strictEqual(this.oController.aThemeList, null, "The correct value has been assigned.");
    });

    QUnit.test("Initializes the isContentLoaded field", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();

        // Assert
        assert.strictEqual(this.oController.isContentLoaded, false, "The correct value has been assigned.");
    });

    QUnit.test("Initializes the aSapThemeMap field", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();

        // Assert
        assert.deepEqual(this.oController.aSapThemeMap, {
            base: "sapUshellBaseIconStyle",
            sap_bluecrystal: "sapUshellBlueCrystalIconStyle",
            sap_belize_hcb: "sapUshellHCBIconStyle",
            sap_belize_hcw: "sapUshellHCWIconStyle",
            sap_belize: "sapUshellBelizeIconStyle",
            sap_belize_plus: "sapUshellPlusIconStyle",
            sap_fiori_3_hcb: "sapUshellHCBIconStyle",
            sap_fiori_3_hcw: "sapUshellHCWIconStyle",
            sap_fiori_3: "sapUshellQuartzLightIconStyle",
            sap_fiori_3_dark: "sapUshellQuartzDarkIconStyle"
        }, "The correct value has been assigned.");
    });

    QUnit.test("Initializes the oPersonalizers field", function (assert) {
        // Arrange
        // Act
        this.oController.onInit();

        // Assert
        assert.deepEqual(this.oController.oPersonalizers, {}, "The correct value has been assigned.");
    });

    QUnit.module("The onSave function", {
        beforeEach: function(assert) {
            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.ThemeSelector"
            }).then(function(oController) {
                this.oController = oController;

                this.oIsSwitchEnabledStub = sinon.stub(this.oController, "isContentDensitySwitchEnabled");
                done();
            }.bind(this));
        },

        afterEach: function() {
            this.oController.destroy();
            this.oController = null;
        }
    });

    QUnit.test("Calls the function onSaveThemes and treats the returned promise", function (assert) {
        // Arrange
        var oPromiseMock = {
            done: sinon.stub(),
            fail: sinon.stub()
        };
        var oOnSaveThemesStub = sinon.stub(this.oController, "onSaveThemes").returns(oPromiseMock);

        // Act
        this.oController.onSave();

        // Assert
        assert.strictEqual(oOnSaveThemesStub.callCount, 1, "The onSaveThemes function has been called once.");
        assert.strictEqual(oPromiseMock.done.callCount, 1, "The done function has been called once.");
        assert.strictEqual(oPromiseMock.fail.callCount, 1, "The fail function has been called once.");
    });

    QUnit.test("Calls the function writeToPersonalization if the tile size changed", function (assert) {
        // Arrange
        var oPromiseMock = makePromiseMock();
        sinon.stub(this.oController, "onSaveThemes").returns(makePromiseMock());

        this.oController.tileSizeChanged = true;
        this.oController.currentTileSize = "ExtraLarge";
        var oWriteToPersonalizationStub = sinon.stub(this.oController, "writeToPersonalization").returns(oPromiseMock);

        // Act
        this.oController.onSave();

        // Assert
        assert.strictEqual(oWriteToPersonalizationStub.callCount, 1, "The writeToPersonalization function has been called once.");
        assert.strictEqual(oWriteToPersonalizationStub.firstCall.args[0], "flp.settings.FlpSettings", "The writeToPersonalization function has been called with the correct parameter.");
        assert.strictEqual(oWriteToPersonalizationStub.firstCall.args[1], "sizeBehavior", "The writeToPersonalization function has been called with the correct parameter.");
        assert.strictEqual(oWriteToPersonalizationStub.firstCall.args[2], "ExtraLarge", "The writeToPersonalization function has been called with the correct parameter.");
        assert.strictEqual(oPromiseMock.done.callCount, 1, "The done function has been called once.");
        assert.strictEqual(oPromiseMock.fail.callCount, 1, "The fail function has been called once.");
        assert.strictEqual(this.oController.tileSizeChanged, false, "The field tileSizeChanged has been reset.");
    });

    QUnit.test("Calls the function onSaveContentDensity if the isContentDensitySwitchEnabled returns a truthy value", function (assert) {
        // Arrange
        var oPromiseMock = makePromiseMock();
        sinon.stub(this.oController, "onSaveThemes").returns(makePromiseMock());
        sinon.stub(this.oController, "writeToPersonalization");
        this.oIsSwitchEnabledStub.returns(true);
        var oOnSaveContentDensityStub = sinon.stub(this.oController, "onSaveContentDensity");
        oOnSaveContentDensityStub.returns(oPromiseMock);

        // Act
        this.oController.onSave();

        // Assert
        assert.strictEqual(oOnSaveContentDensityStub.callCount, 1, "The writeToPersonalization function has been called once.");
        assert.strictEqual(oPromiseMock.done.callCount, 1, "The done function has been called once.");
        assert.strictEqual(oPromiseMock.fail.callCount, 1, "The fail function has been called once.");
    });

    QUnit.module("The writeToPersonalization function", {
        beforeEach: function(assert) {
            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.ThemeSelector"
            }).then(function(oController) {
                this.oController = oController;

                this.oSetPersDataStub = sinon.stub();
                var oPersonalizer = {
                    setPersData: this.oSetPersDataStub
                };
                this.oGetPersonalizerStub = sinon.stub(this.oController, "getPersonalizer").returns(oPersonalizer);
                done();
            }.bind(this));
        },

        afterEach: function() {
            this.oController.destroy();
            this.oController = null;
            this.oGetPersonalizerStub = null;
            this.oSetPersDataStub = null;
        }
    });

    QUnit.test("Returns the result of the function call to setPersData", function (assert) {
        // Arrange
        var oReturnValue = {};
        var oContainer = {};
        var oItem = {};
        var oValue = {};
        this.oSetPersDataStub.returns(oReturnValue);

        // Act
        var oResult = this.oController.writeToPersonalization(oContainer, oItem, oValue);

        // Assert
        assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[0], oContainer, "The function getPersonalizer has been called with the correct parameter.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[1], oItem, "The function getPersonalizer has been called with the correct parameter.");
        assert.strictEqual(this.oSetPersDataStub.callCount, 1, "The function setPersData has been called once.");
        assert.strictEqual(this.oSetPersDataStub.firstCall.args[0], oValue, "The function setPersData has been called with the correct parameter.");
        assert.strictEqual(oResult, oReturnValue, "The function setPersData has returned the correct value.");
    });

    QUnit.test("Returns a rejected promise if setPersData throws an error", function (assert) {
        // Arrange
        this.oSetPersDataStub.throws({});

        // Act
        var oResult = this.oController.writeToPersonalization();

        // Assert
        assert.strictEqual(typeof oResult.then, "function", "The returned object has a 'then' function.");
        assert.strictEqual(typeof oResult.fail, "function", "The returned object has a 'fail' function.");
        assert.strictEqual(typeof oResult.done, "function", "The returned object has a 'done' function.");
    });

    QUnit.test("Logs error messages if setPersData throws an error", function (assert) {
        // Arrange
        var oError = {
            name: "!ErrorName!",
            message: "!ErrorMessage!"
        };
        this.oSetPersDataStub.throws(oError);
        var oLogErrorStub = sinon.stub(jQuery.sap.log, "error");

        // Act
        this.oController.writeToPersonalization();

        // Assert
        assert.strictEqual(oLogErrorStub.callCount, 2, "The function jQuery.sap.log.error has been called twice.");
        assert.strictEqual(oLogErrorStub.firstCall.args[0], "Personalization service does not work:", "The function jQuery.sap.log.error has been called with the correct parameter.");
        assert.strictEqual(oLogErrorStub.secondCall.args[0], "!ErrorName!: !ErrorMessage!", "The function jQuery.sap.log.error has been called with the correct parameter.");

        // Cleanup
        oLogErrorStub.restore();
    });

    QUnit.module("The getPersonalizer function", {
        beforeEach: function(assert) {
            var done = assert.async();

            this.oGetServiceStub = sinon.stub();
            window.sap.ushell = {
                Container: {
                    getService: this.oGetServiceStub
                }
            };

            this.oGetComponentStub = sinon.stub(Component, "getOwnerComponentFor");
            this.oGetComponentStub.returns("SomeComponentInstance");

            this.oGetPersonalizerStub = sinon.stub();

            this.oPersonalizationService = {
                constants: {
                    keyCategory: {
                        FIXED_KEY: "FIXED_KEY"
                    },
                    writeFrequency: {
                        LOW: "LOW"
                    }
                },
                getPersonalizer: this.oGetPersonalizerStub
            };

            this.oGetServiceStub.withArgs("Personalization").returns(this.oPersonalizationService);

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.ThemeSelector"
            }).then(function(oController) {
                this.oController = oController;
                done();
            }.bind(this));
        },

        afterEach: function() {
            this.oController.destroy();
            this.oController = null;
            this.oGetServiceStub = null;

            this.oGetComponentStub.restore();
            this.oGetComponentStub = null;

            delete window.sap.ushell;
        }
    });

    QUnit.test("Returns an already existing Personalizer instance with matching container and item ID", function (assert) {
        // Arrange
        var oPersonalizer = {};
        this.oController.oPersonalizers = {
            "some.container.ID-some.item.ID": oPersonalizer
        };

        // Act
        var oResult = this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
    });

    QUnit.test("Returns the result of the getPersonalizer function call if no Personalizer exists yet", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        var oResult = this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(this.oGetPersonalizerStub.callCount, 1, "The function getPersonalizer has been called once.");
        assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[0], {
            container: "some.container.ID",
            item: "some.item.ID"
        }, "The function getPersonalizer has been called with the correct 1st parameter.");
        assert.deepEqual(this.oGetPersonalizerStub.firstCall.args[1], {
            keyCategory: "FIXED_KEY",
            writeFrequency: "LOW",
            clientStorageAllowed: true
        }, "The function getPersonalizer has been called with the correct 2nd parameter.");
        assert.strictEqual(this.oGetPersonalizerStub.firstCall.args[2], "SomeComponentInstance", "The function getPersonalizer has been called with the correct 3rd parameter.");
        assert.strictEqual(oResult, oPersonalizer, "The correct object reference has been returned.");
    });

    QUnit.test("Stores the Personalizer instance in an internal map", function (assert) {
        // Arrange
        this.oController.oPersonalizers = {};
        var oPersonalizer = {};
        this.oGetPersonalizerStub.returns(oPersonalizer);

        // Act
        this.oController.getPersonalizer("some.container.ID", "some.item.ID");

        // Assert
        assert.strictEqual(this.oController.oPersonalizers["some.container.ID-some.item.ID"], oPersonalizer, "The correct object reference has been stored.");
    });
});
