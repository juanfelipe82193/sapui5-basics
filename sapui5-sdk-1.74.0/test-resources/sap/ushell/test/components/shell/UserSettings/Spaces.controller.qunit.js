// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.test.components.shell.UserSettings.Spaces.controller
 */
/* global QUnit, sinon */
sap.ui.require([
    "sap/ui/core/mvc/Controller",
    "sap/ushell/components/shell/UserSettings/Spaces.controller",
    "sap/ushell/Config",
    "sap/ushell/resources",
    "sap/ui/Device"
], function (Controller, SpacesController, Config, resources, Device) {
    "use strict";

    QUnit.module("The onInit function", {
        beforeEach: function (assert) {
            this.oConfigLastStub = sinon.stub(Config, "last");
            this.oConfigLastStub.withArgs("/core/spaces/enabled").returns(true);

            this.bDevicePhone = Device.system.phone;

            this.oTranslationModelStub = sinon.stub();
            this.oGetTranslationModelStub = sinon.stub(resources, "getTranslationModel");

            this.oUserInfoStub = Promise.resolve();
            sap.ushell.Container = {
                getServiceAsync: sinon.stub().withArgs("UserInfo").returns(Promise.resolve(this.oUserInfoStub))
            };

            // Create controller and view access
            this.oController = new SpacesController();
            this.oViewStub = {
                setModel: sinon.stub()
            };
            sinon.stub(this.oController, "getView").returns(this.oViewStub);
        },
        afterEach: function () {
            this.oConfigLastStub.restore();
            this.oGetTranslationModelStub.restore();

            Device.system.phone = this.bDevicePhone;
        }
    });

    QUnit.test("Initializes everything nicely", function (assert) {
        //Act
        this.oController.onInit();

        //Assert
        var done = assert.async();
        this.oController.oUserInfoServicePromise.then(function () {
            assert.strictEqual(this.oController.oModel.getProperty("/isSpacesEnabled"), true, "The spaces enabled flag is set");
            assert.strictEqual(this.oViewStub.setModel.callCount, 2, "Two models are set on the view");
            assert.deepEqual(this.oController.oUserInfoServicePromise, this.oUserInfoStub, "The user info service is intialized");
            done();
        }.bind(this));
    });

    QUnit.test("Sets the display properties correctly for desktop and tablet", function (assert) {
        //Arrange
        Device.system.phone = false;

        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(this.oController.oModel.getProperty("/textAlign"), "End", "Text align is set correctly");
        assert.strictEqual(this.oController.oModel.getProperty("/labelWidth"), "12rem", "Label width is set correctly");
    });

    QUnit.test("Sets the display properties correctly for phone", function (assert) {
        //Arrange
        Device.system.phone = true;

        //Act
        this.oController.onInit();

        //Assert
        assert.strictEqual(this.oController.oModel.getProperty("/textAlign"), "Begin", "Text align is set correctly");
        assert.strictEqual(this.oController.oModel.getProperty("/labelWidth"), "auto", "Label width is set correctly");
    });

    QUnit.module("The onSave function", {
        beforeEach: function (assert) {

            // Create controller
            this.oController = new SpacesController();

            // Prepare model
            this.oController.bSpacesEnabledSavedValue = false;
            this.oController.oModel = {
                getProperty: sinon.stub().withArgs("/isSpacesEnabled").returns(true),
                setProperty: sinon.stub()
            };

            // Prepare user access
            this.oUser = {
                setChangedProperties: sinon.stub(),
                resetChangedProperty: sinon.stub()
            };

            this.oUserPreferencesPromise = jQuery.Deferred();

            // Prepare access to user info service
            this.oController.oUserInfoServicePromise = Promise.resolve({
                getUser: sinon.stub().returns(this.oUser),
                updateUserPreferences: sinon.stub().withArgs(this.oUser)
                    .returns(this.oUserPreferencesPromise)
            });
        }
    });

    QUnit.test("Saves the spaces enabled setting if it has changed", function (assert) {
        //Arrange
        var oExpectedResult = {
            refresh: true
        };
        this.oUserPreferencesPromise.resolve();

        //Act
        var oSavePromise = this.oController.onSave();

        //Assert
        var done = assert.async();
        oSavePromise.done(function (oResult) {
            assert.strictEqual(this.oUser.setChangedProperties.getCall(0).args[0].name,
                "SPACES_ENABLEMENT", "The setting is stored in the correct property");
            assert.strictEqual(this.oUser.resetChangedProperty.getCall(0).args[0], "spacesEnabled",
                "The correct user property was reset");
            assert.strictEqual(this.oController.bSpacesEnabledSavedValue, true, "The stored settings value was updated");
            assert.deepEqual(oResult, oExpectedResult, "A promise that resolves to {refresh: true} is returned.");
            done();
        }.bind(this));
    });

    QUnit.test("Doesn't save the spaces enabled setting if it has not changed", function (assert) {
        //Arrange
        this.oController.oModel.getProperty.withArgs("/isSpacesEnabled").returns(false)

        //Act
        var oSavePromise = this.oController.onSave();

        //Assert
        var done = assert.async();
        oSavePromise.done(function (oResult) {
            assert.ok(this.oUser.setChangedProperties.notCalled, "Nothing is saved");
            assert.strictEqual(oResult, undefined, "A promise that resolves to undefined is returned.");
            done();
        }.bind(this));
    });

    QUnit.test("Resets the spaces enabled setting if saving fails", function (assert) {
        //Arrange
        this.oUserPreferencesPromise.reject("Error Message");

        //Act
        var oSavePromise = this.oController.onSave();

        //Assert
        var done = assert.async();
        oSavePromise.fail(function () {
            assert.deepEqual(this.oController.oModel.setProperty.args[0], ["/isSpacesEnabled", false],
                "The switch is reset to its original setting");
            assert.strictEqual(this.oUser.resetChangedProperty.args[0][0], "spacesEnabled",
                "The spaces enabled property is reset");
            done();
        }.bind(this));
    });

    QUnit.module("The onCancel function", {
        beforeEach: function (assert) {
            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.Spaces"
            }).then(function (oController) {
                this.oController = oController;

                oController.oModel = {
                    setProperty: sinon.stub()
                };

                done();
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
        }
    });

    QUnit.test("Resets the spaces enabled button to its original state", function (assert) {
        //Arrange
        this.oController.bSpacesEnabledSavedValue = true;

        //Act
        this.oController.onCancel();

        //Assert
        assert.deepEqual(this.oController.oModel.setProperty.args[0], ["/isSpacesEnabled", true], "The space enabled button is reset");
    });

    QUnit.module("The getContent function", {
        beforeEach: function (assert) {
            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.Spaces"
            }).then(function (oController) {
                this.oController = oController;
                this.oView = { "The": "View" };
                this.oController.getView = sinon.stub().returns(this.oView);
                done();
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
        }
    });

    QUnit.test("Returns the view", function (assert) {
        //Act
        var oGetContentPromise = this.oController.getContent();

        //Assert
        var done = assert.async();
        oGetContentPromise.done(function (oView) {
            assert.deepEqual(oView, this.oView, "The view is returned");
            done();
        }.bind(this));
    });

    QUnit.module("The getValue function", {
        beforeEach: function (assert) {
            var done = assert.async();

            Controller.create({
                name: "sap.ushell.components.shell.UserSettings.Spaces"
            }).then(function (oController) {
                this.oController = oController;
                done();
            }.bind(this));
        },
        afterEach: function () {
            this.oController.destroy();
            this.oController = null;
        }
    });

    QUnit.test("Returns a reloved promise", function (assert) {
        //Act
        var oGetValuePromise = this.oController.getValue();

        //Assert
        var done = assert.async();
        oGetValuePromise.done(function () {
            assert.ok(true, "A resolved promise is returned");
            done();
        });
    });
});