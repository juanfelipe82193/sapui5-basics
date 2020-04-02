// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.footerbar.AboutButton
 */
sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/ui/footerbar/AboutButton",
    "sap/ui/VersionInfo",
    "sap/base/Log"
], function (Resources, AboutButton, VersionInfo, Log) {
    "use strict";
    /* global QUnit sinon */

    QUnit.module("sap.ushell.ui.footerbar.AboutButton", {
        beforeEach: function () {
            this.oAboutDialog = new AboutButton();
        },
        afterEach: function () {
            this.oAboutDialog.destroy();
        }
    });

    QUnit.test("init: should instantiate the about dialog", function (assert) {
        assert.strictEqual(this.oAboutDialog.getIcon(), "sap-icon://hint", "dialog icon is correct");
        assert.strictEqual(this.oAboutDialog.getText(), Resources.i18n.getText("about"), "dialog title is correct");
        assert.strictEqual(this.oAboutDialog.getTooltip(), Resources.i18n.getText("about"), "dialog tooltip is correct");
    });

    [
        {
            testDescription: "the sap-fiori-id and the sap-ach are not given"
        },
        {
            testDescription: "the sap-fiori-id is given but not the sap-ach",
            "sap-fiori-id": ["12345"],
            expectedId: "12345"
        },
        {
            testDescription: "the sap-ach is given but not the sap-fiori-id",
            "sap-ach": ["URL-54321"],
            expectedAch: "URL-54321"
        },
        {
            testDescription: "the sap-fiori-id and the sap-ach are given",
            "sap-fiori-id": ["12345"],
            "sap-ach": ["URL-54321"],
            expectedId: "12345",
            expectedAch: "URL-54321"
        }
    ].forEach(function (oFixture) {
        QUnit.test("showAboutDialog: displays the correct content when " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnDone = assert.async(),
                sVersion = "1.74.0",
                sBuildTimestamp = "201911260442",
                oLoadStub = sinon.stub(VersionInfo, "load").resolves({
                    version: sVersion,
                    buildTimestamp: sBuildTimestamp
                }),
                oShowAboutDialogPromise;

            // make sure no application is set in the AppConfiguration Service
            var oAppConfig = jQuery.sap.getObject("sap.ushell.services.AppConfiguration");
            if (oAppConfig) {
                oAppConfig.setCurrentApplication();
            }

            var iAsyncCallbackCounter = 0;

            var oFakeCurrentApplication = {
                getTechnicalParameter: function (sParameterName) {
                    return new Promise(function (fnSuccess, fnFail) {
                        fnSuccess(oFixture[sParameterName]);
                    }).then(function (aResult) {
                        oShowAboutDialogPromise.then(function () {
                            iAsyncCallbackCounter++;
                            if (iAsyncCallbackCounter === 2) {
                                setTimeout(function () {
                                    asyncTests();
                                }, 0);
                            }
                        });
                        return aResult;
                    });
                }
            };

            sap.ushell.Container = {
                getService: function () {},
                getLogonSystem: function () {
                    return {
                        getProductVersion: function () {},
                        getClientRole: function () {}
                    };
                }
            };

            var oGetServiceStub = sinon
                .stub(sap.ushell.Container, "getService")
                .withArgs("AppLifeCycle")
                .returns({
                    getCurrentApplication: sinon.stub().returns(oFakeCurrentApplication)
                });

            // Act
            // Show the dialog
            oShowAboutDialogPromise = this.oAboutDialog.showAboutDialog();
            oShowAboutDialogPromise.then(function () {
                // Assert
                assert.strictEqual(oGetServiceStub.callCount, 1, "sap.ushell.Container.getService was called once");
                assert.deepEqual(oGetServiceStub.getCall(0).args, ["AppLifeCycle"], "sap.ushell.Container.getService was called with the expected argument");
            }.bind(this));

            function asyncTests () {
                // Get the about dialog content form
                var dialogFormContent = sap.ui.getCore().byId("aboutDialogFormID").getContent(),
                    translationBundle = Resources.i18n,
                    ui5Version = (sVersion || "") + (" (" + (sBuildTimestamp || "") + ")") || "",
                    userAgent = navigator.userAgent || "",
                    sProductVersion = "",
                    sClientRole = "";

                // Check if the content of the Dialog was correct
                assert.strictEqual(dialogFormContent[0].getMetadata()._sClassName, "sap.m.Label", "content #0 is a label");
                assert.strictEqual(dialogFormContent[0].getText(), translationBundle.getText("technicalName"), "value of content #0 is correct");
                assert.strictEqual(dialogFormContent[1].getMetadata()._sClassName, "sap.m.Text", "content #1 is a text");
                assert.strictEqual(dialogFormContent[1].getText(), "", "value of content #1 is correct");
                assert.strictEqual(dialogFormContent[2].getMetadata()._sClassName, "sap.m.Label", "content #2 is a label");
                assert.strictEqual(dialogFormContent[2].getText(), translationBundle.getText("fioriVersionFld"), "value of content #2 is correct");
                assert.strictEqual(dialogFormContent[3].getMetadata()._sClassName, "sap.m.Text", "content #3 is a text");
                assert.strictEqual(dialogFormContent[3].getText(), "", "value of content #3 is correct");
                assert.strictEqual(dialogFormContent[4].getMetadata()._sClassName, "sap.m.Label", "content #4 is a label");
                assert.strictEqual(dialogFormContent[4].getText(), translationBundle.getText("sapui5Fld"), "value of content #4 is correct");
                assert.strictEqual(dialogFormContent[5].getMetadata()._sClassName, "sap.m.Text", "content #5 is a text");
                assert.strictEqual(dialogFormContent[5].getText(), ui5Version, "value of content #5 is correct");
                assert.strictEqual(dialogFormContent[6].getMetadata()._sClassName, "sap.m.Label", "content #6 is a label");
                assert.strictEqual(dialogFormContent[6].getText(), translationBundle.getText("userAgentFld"), "value of content #6 is correct");
                assert.strictEqual(dialogFormContent[7].getMetadata()._sClassName, "sap.m.Text", "content #7 is a text");
                assert.strictEqual(dialogFormContent[7].getText(), userAgent, "value of content #7 is correct");
                assert.strictEqual(dialogFormContent[8].getMetadata()._sClassName, "sap.m.Label", "content #8 is a label");
                assert.strictEqual(dialogFormContent[8].getText(), translationBundle.getText("productVersionFld"), "value of content #8 is correct");
                assert.strictEqual(dialogFormContent[9].getMetadata()._sClassName, "sap.m.Text", "content #9 is a text");
                assert.strictEqual(dialogFormContent[9].getText(), sProductVersion, "value of content #9 is correct");
                assert.strictEqual(dialogFormContent[10].getMetadata()._sClassName, "sap.m.Label", "content #10 is a label");
                assert.strictEqual(dialogFormContent[10].getText(), translationBundle.getText("clientRoleFld"), "value of content #10 is correct");
                assert.strictEqual(dialogFormContent[11].getMetadata()._sClassName, "sap.m.Text", "content #11 is a text");
                assert.strictEqual(dialogFormContent[11].getText(), sClientRole, "value of content #11 is correct");

                var contentPosition = 11;

                if (oFixture.expectedId) {
                    contentPosition++;
                    assert.strictEqual(dialogFormContent[contentPosition].getMetadata()._sClassName, "sap.m.Label", "Check form field type #" + contentPosition);
                    assert.strictEqual(dialogFormContent[contentPosition].getText(), translationBundle.getText("fioriAppId"), "Check form field value #" + contentPosition);
                    contentPosition++;
                    assert.strictEqual(dialogFormContent[contentPosition].getMetadata()._sClassName, "sap.m.Text", "Check form field type #" + contentPosition);
                    assert.strictEqual(dialogFormContent[contentPosition].getText(), oFixture.expectedId, "Check form field value #" + contentPosition);
                }

                if (oFixture.expectedAch) {
                    contentPosition++;
                    assert.strictEqual(dialogFormContent[contentPosition].getMetadata()._sClassName, "sap.m.Label", "Check form field type #" + contentPosition);
                    assert.strictEqual(dialogFormContent[contentPosition].getText(), translationBundle.getText("sapAch"), "Check form field value #" + contentPosition);
                    contentPosition++;
                    assert.strictEqual(dialogFormContent[contentPosition].getMetadata()._sClassName, "sap.m.Text", "Check form field type #" + contentPosition);
                    assert.strictEqual(dialogFormContent[contentPosition].getText(), oFixture.expectedAch, "Check form field value #" + contentPosition);
                }

                // Destroy the about dialog
                sap.ui.getCore().byId("aboutContainerDialogID").destroy();

                oLoadStub.restore();
                fnDone();
            }
        });
    });

    QUnit.test("_getClientRoleDescription: returns a description text to the given client role", function (assert) {
        //Arrange
        sap.ushell.Container = {
            getLogonSystem: function () {
                return {
                    getClientRole: function () {
                        return "T";
                    }
                };
            }
        };
        sinon.stub(Resources.i18n, "getText").withArgs("clientRoleTest").returns("Test");

        //Act
        var sResult = this.oAboutDialog._getClientRoleDescription();

        //Assert
        assert.strictEqual(sResult, "Test", "The correct description text has been retreived from the message bundle.");
    });

    QUnit.module("_getUI5VersionInfo", {
        beforeEach: function () {
            this.oVersionInfoStub = sinon.stub(VersionInfo, "load");
            this.oAboutDialog = new AboutButton();
        },
        afterEach: function () {
            this.oVersionInfoStub.restore();
            this.oAboutDialog.destroy();
        }
    });

    QUnit.test("_getUI5VersionInfo: resolves the promise with the VersionInfo when it is properly loaded", function (assert) {
        // Arrange
        var oTestVersionInfo = {
            version: "1.whatever",
            buildTimestamp: "1234"
        };
        this.oVersionInfoStub.resolves(oTestVersionInfo);

        // Act
        var oResultPromise = this.oAboutDialog._getUI5VersionInfo();

        // Assert
        return oResultPromise.then(function (result) {
            assert.deepEqual(result, oTestVersionInfo, "Promise resolved with the correct VersionInfo");
        }.bind(this));
    });

    QUnit.test("_getUI5VersionInfo: resolves the promise with an empty object and logs an error if the VersionInfo could not be loaded", function (assert) {
        // Arrange
        var oLogErrorStub = sinon.stub(Log, "error");
        this.oVersionInfoStub.rejects();

        // Act
        var oResultPromise = this.oAboutDialog._getUI5VersionInfo();

        // Assert
        return oResultPromise.then(function (result) {
            assert.deepEqual(result, {}, "Promise resolved with the correct VersionInfo");
            assert.strictEqual(oLogErrorStub.firstCall.args[0], "VersionInfo could not be loaded", "Error was logged");
        }.bind(this));
    });
}, /* bExport= */false);
