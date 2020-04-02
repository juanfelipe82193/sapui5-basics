// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";

    /*global test, jQuery, sap, sinon */
    jQuery.sap.require("sap.ushell.resources");
    jQuery.sap.require("sap.ushell.services.Container");
    jQuery.sap.require("sap.ui.comp.smartform.SmartForm");
    jQuery.sap.require("sap.ui.comp.smartfield.SmartField");
    jQuery.sap.require('sap.ui.comp.valuehelpdialog.ValueHelpDialog');
    var defaultParameters,
        parametersMockObj;

    QUnit.module("sap.ushell.components.shell.UserSettings.DefaultParameters", {
        beforeEach: function (assert) {
            var done = assert.async();

            sap.ushell.bootstrap("local").then(function () {
                var deferredEditorParams = jQuery.Deferred();
                parametersMockObj = {
                    "UshellTest1" : {
                        "valueObject": {
                            "value": "InitialFromPlugin",
                            "extendedValue": {
                                "Ranges" : [{ "Sign" : "I", "Option": "E", "value" : "x"}]
                            }
                        },
                        "editorMetadata" : {
                            // metadata request only
                            "displayText" : "Test Default 1",
                            "description": "Description of the test default 1",
                            "groupId": "EXAMPLE-FIN-GRP1",
                            "groupTitle" : "FIN User Defaults (UShell examples)",
                            "parameterIndex" : 1
                        }
                    },
                    "storeChangedDataTest" : {
                        "valueObject": {
                            "value": "",
                            "extendedValue": undefined
                        },
                        "editorMetadata" : {
                            // metadata request only
                            "displayText" : "Test Default 1",
                            "description": "Description of the test default 1",
                            "groupId": "EXAMPLE-FIN-GRP1",
                            "groupTitle" : "FIN User Defaults (UShell examples)",
                            "parameterIndex" : 1
                        }
                    }
                };
                var editorGetParametersStub = sinon.stub(sap.ushell.Container.getService("UserDefaultParameters"), "editorGetParameters");
                editorGetParametersStub.returns(deferredEditorParams.promise());
                deferredEditorParams.resolve(parametersMockObj);
                defaultParameters = sap.ui.jsview("userPrefDefaultSettings", "sap.ushell.components.shell.UserSettings.DefaultParameters");

                done();
            });
        },

        afterEach: function () {
            defaultParameters.destroy();

            if (sap.ui.getCore().byId("saveButton")) {
                sap.ui.getCore().byId("saveButton").destroy();
            }

            delete sap.ushell.Container;
        }
    });

    QUnit.test("Init Default Parameters view", function (assert) {
        var done = assert.async();
        var expectedMockObj = {
            "UshellTest1" : {
                "valueObject": {
                    "value": "InitialFromPlugin",
                    "extendedValue": {
                        "Ranges" : [{ "Sign" : "I", "Option": "E", "value" : "x"}]
                    }
                },
                "editorMetadata" : {
                    // metadata request only
                    "displayText" : "Test Default 1",
                    "description": "Description of the test default 1",
                    "groupId": "EXAMPLE-FIN-GRP1",
                    "groupTitle" : "FIN User Defaults (UShell examples)",
                    "parameterIndex" : 1
                }
            },
            "storeChangedDataTest" : {
                "valueObject": {
                    "value": "",
                    "extendedValue": undefined
                },
                "editorMetadata" : {
                    // metadata request only
                    "displayText" : "Test Default 1",
                    "description": "Description of the test default 1",
                    "groupId": "EXAMPLE-FIN-GRP1",
                    "groupTitle" : "FIN User Defaults (UShell examples)",
                    "parameterIndex" : 1
                }
            }
        };
        setTimeout(function() {

            assert.ok(defaultParameters, true);
            assert.equal(jQuery.isEmptyObject(defaultParameters.oController.oChangedParameters), true);
            assert.deepEqual(parametersMockObj, expectedMockObj);
            done();
        });
    });

    QUnit.test("isValueDifferent method  Default Parameters view", function (assert) {
        var oValueObject1 = {
            "value": "InitialFromPlugin",
            "extendedValue": {
                "Ranges" : [{ "Sign" : "I", "Option": "E", "value" : "x"}]
            }
        },
            oValueObject2 = {
                "extendedValue": {
                    "Ranges" : [{ "Sign" : "I", "Option": "E", "value" : "x"}]
                }
            },
            oValueObject3 = {
                "extendedValue": {
                    "Ranges" : [{ "Sign" : "E", "Option": "E", "value" : "x"}]
                }
            },
            oValueObject4 = jQuery.extend({value: ""}, oValueObject2),
            oValueObject5 = {
                "value": "InitialFromPlugin",
                "extendedValue": {
                    "Ranges" : [{ "Sign" : "I", "Option": "BT", "value" : "x"}]
                }
            };

        assert.ok(!defaultParameters.oController.isValueDifferent(oValueObject1, oValueObject1), "Objects are supposed to be equal");
        assert.ok(!defaultParameters.oController.isValueDifferent(oValueObject2, oValueObject4), "Objects are supposed to be equal");
        assert.ok(defaultParameters.oController.isValueDifferent(oValueObject3, oValueObject4), "Objects aren't supposed to be equal");
        assert.ok(!defaultParameters.oController.isValueDifferent(oValueObject3, undefined), "Expected false when one of the objects is undefined");
        assert.ok(!defaultParameters.oController.isValueDifferent(undefined, undefined), "Expected false when one of the objects is undefined");
        assert.ok(!defaultParameters.oController.isValueDifferent(undefined, oValueObject2), "Expected false when one of the objects is undefined");
        assert.ok(defaultParameters.oController.isValueDifferent(oValueObject1, oValueObject5), "Objects are supposed to be different");


    });

    QUnit.test("storeChangedData method  Default Parameters view", function (assert) {
        var contentObj;
        defaultParameters.oController.getContent().done(function(result) {
            contentObj = result.oController;
        });
        var oModel = contentObj.oMdlParameter;


        assert.ok(!contentObj.oChangedParameters["UshellTest1"]);

        oModel.setProperty('/UshellTest1/valueObject/extendedValue', {});
        assert.ok(contentObj.oChangedParameters["UshellTest1"] === true);

    });

    QUnit.test("GetListofSupportedRangeOperations method", function (assert) {
        var opList = defaultParameters.oController.getListOfSupportedRangeOperations();
        assert.ok((jQuery.inArray("StartsWith", opList) === -1 && jQuery.inArray("EndsWith", opList) === -1) && jQuery.inArray("Initial", opList) === -1);
    });

    QUnit.test("onSave method editorSetValue called", function (assert) {
       var done = assert.async();
        defaultParameters.oController.getContent().done(function() {
            var editorSetValueStub = sinon.spy(sap.ushell.Container.getService("UserDefaultParameters"), "editorSetValue");
            defaultParameters.oController.oCurrentParameters["UshellTest1"].valueObject = {
                "value": "InitialFromPlugin",
                "extendedValue": {
                    "Ranges": [{"Sign": "I", "Option": "BT", "value": "x"}]
                }
            };
            defaultParameters.oController.oChangedParameters["UshellTest1"] = true;
            defaultParameters.oController.onSave();
            assert.ok(editorSetValueStub.calledOnce);
            done();
        });

    });

    QUnit.test("onSave method editorSetValue not called", function (assert) {
        var done = assert.async();
        var editorSetValueStub = sinon.spy(sap.ushell.Container.getService("UserDefaultParameters"), "editorSetValue");
        defaultParameters.oController.onSave();
        setTimeout(function() {
            assert.ok(!editorSetValueStub.called);
            done();
        });
    });

    QUnit.test("onSave resolves Promise in case of no change in settings", function (assert) {
        // Arrange
        var done = assert.async();
        defaultParameters.oController.oChangedParameters = {};

        // Act
        var oSaveResult = defaultParameters.oController.onSave();

        // Assert
        oSaveResult.then(function () {
            assert.ok(true, "The Promise is resolved.");

            done();
        });
    });
}());
