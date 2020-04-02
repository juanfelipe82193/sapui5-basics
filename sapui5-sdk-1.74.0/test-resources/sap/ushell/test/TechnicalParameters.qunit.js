// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.services.TechnicalParameters
 */
sap.ui.require([
    "sap/ushell/TechnicalParameters"
], function (oTechnicalParameters) {
    "use strict";

    /* global QUnit sinon */

    function createFakeComponent(oConfig) {
        return {
            getMetadata: function () {
                return {
                    getManifestEntry: function (sPath) {
                        switch (sPath) {
                            case '/sap.fiori/registrationIds':
                                return oConfig.manifestRegistrationIds;
                            case '/sap.app/ach':
                                return oConfig.manifestAch;
                            default:
                                return;
                        }
                    }
                };
            },
            getComponentData: function () {
                return {
                    technicalParameters: oConfig.technicalParameters
                };
            }
        };
    }

    QUnit.module("sap.ushell.TechnicalParameters", {
        beforeEach: function () {},
        afterEach: function () {}
    });

    QUnit.test("module exports an object", function (assert) {
        assert.strictEqual(
            Object.prototype.toString.apply(oTechnicalParameters),
            "[object Object]",
            "got an object back"
        );
    });

    [
        {
            testDescription: "UI5 application with no exisiting technical parameter in reserved parameters and manifest",
            sParameterName: "sap-fiori-id",
            oComponent: createFakeComponent({
                technicalParameters: {},
                manifestRegistrationIds: []
            }),
            sApplicationType: "UI5",
            expectedResult: [],
            expectedReject: false
        },
        {
            testDescription: "UI5 application with exisiting technical parameter in reserved parameters",
            sParameterName: "sap-fiori-id",
            oComponent: createFakeComponent({
                technicalParameters: { "sap-fiori-id": ["12345"] },
                manifestRegistrationIds: []
            }),
            sApplicationType: "UI5",
            expectedResult: ["12345"],
            expectedReject: false
        },
        {
            testDescription: "UI5 application with exisiting technical parameter in manifest",
            sParameterName: "sap-fiori-id",
            oComponent: createFakeComponent({
                technicalParameters: {},
                manifestRegistrationIds: ["12345"]
            }),
            sApplicationType: "UI5",
            expectedResult: ["12345"],
            expectedReject: false
        },
        {
            testDescription: "UI5 application with exisiting technical parameter in reserved parameters and manifest",
            sParameterName: "sap-fiori-id",
            oComponent: createFakeComponent({
                technicalParameters: { "sap-fiori-id": ["A12345"] },
                manifestRegistrationIds: ["B12345"]
            }),
            sApplicationType: "UI5",
            expectedResult: ["A12345"],
            expectedReject: false
        },
        {
            testDescription: "non UI5 application with exisiting technical parameter",
            sParameterName: "sap-fiori-id",
            oApplicationContainer: {
                getReservedParameters: function () {
                    return {
                        "sap-fiori-id": ["12345"]
                    };
                }
            },
            sApplicationType: "TR",
            expectedResult: ["12345"],
            expectedReject: false
        },
        {
            testDescription: "from a non UI5 application with no exisiting technical parameter",
            sParameterName: "sap-fiori-id",
            oApplicationContainer: {
                getReservedParameters: function () {
                    return {};
                }
            },
            sApplicationType: "TR",
            expectedResult: undefined,
            expectedReject: false
        },
        {
            testDescription: "with unknown technical parameter",
            sParameterName: "unknownParameter",
            expectedResult: "unknownParameter is not a known technical parameter",
            expectedReject: true
        },
        {
            testDescription: "with no technical parameter",
            expectedResult: "undefined is not a known technical parameter",
            expectedReject: true
        },
        {
            testDescription: "with an internal parameter",
            sParameterName: "sap-ui-app-id-hint",
            expectedResult: "sap-ui-app-id-hint is reserved for shell internal usage only",
            expectedReject: true
        },
        {
            testDescription: "with a simple UI5 parameter",
            sParameterName: "sap-ui-fl-max-layer",
            oComponent: createFakeComponent({
                technicalParameters: { "sap-ui-fl-max-layer": ["foo"] },
                manifestRegistrationIds: []
            }),
            expectedResult: ["foo"],
            expectedReject: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("getParameterValue: returns the correct array of values when " + oFixture.testDescription, function (assert) {
            // Arrange
            var fnDone = assert.async(),
                fnErrorLogStub = sinon.stub(jQuery.sap.log, "error");

            var sNot = oFixture.expectedReject ? "" : " not";

            // Act
            oTechnicalParameters.getParameterValue(oFixture.sParameterName, oFixture.oComponent, oFixture.oApplicationContainer, oFixture.sApplicationType)
                .then(function (aResult) {
                    assert.ok(!oFixture.expectedReject, "Promise did" + sNot + " reject");

                    // Assert
                    assert.deepEqual(aResult, oFixture.expectedResult, "The returned array was as expected");
                    assert.strictEqual(fnErrorLogStub.callCount, 0, "Error was not logged");

                    fnDone();
                }, function (sError) {
                    assert.ok(oFixture.expectedReject, "Promise did" + sNot + " reject");
                    assert.deepEqual(sError, oFixture.expectedResult, "The returned error was as expected");

                    fnDone();
                });

            fnErrorLogStub.restore();
        });
    });

    QUnit.module("Handle parameters");

    QUnit.test("getParameterNames: returns all the technical Parameters", function (assert) {
        // Arrange
        var aExpectedResult = ["sap-navigation-scope", "sap-fiori-id", "sap-ui-fl-max-layer", "sap-ui-fl-control-variant-id", "sap-ui-app-id-hint", "sap-ach", "sap-prelaunch-operations"],
            aReturnedResult = [];

        // Act
        aReturnedResult = oTechnicalParameters.getParameterNames();

        // Assert
        assert.deepEqual(aReturnedResult, aExpectedResult, "The returned array was as expected");
    });

    QUnit.test("Calls getParameters with oFilterOptions=undefined", function (assert) {
        // Act
        var aResult = oTechnicalParameters.getParameters();

        // Assert
        assert.strictEqual(aResult.length, 7, "The correct number of parameters is returned");
    });

    QUnit.test("Calls getParameters with defined oFilterOptions", function (assert) {
        // Arrange
        var oFilterOptions = {injectFrom: "startupParameter"};
        var aExpectedResultNames = ["sap-fiori-id", "sap-ui-fl-max-layer", "sap-ui-fl-control-variant-id", "sap-ui-app-id-hint", "sap-ach"];
        // Act
        var aResults = oTechnicalParameters.getParameters(oFilterOptions);
        aResults = aResults.map(function (oResult) {
            return oResult.name;
        });
        // Assert
        assert.deepEqual(aResults, aExpectedResultNames, "The correct parameters are returned");
    });

});