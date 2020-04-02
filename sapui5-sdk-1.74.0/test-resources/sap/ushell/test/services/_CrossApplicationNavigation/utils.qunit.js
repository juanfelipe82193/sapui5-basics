// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for ClientSideTargetResolution's Utils
 */
sap.ui.require([
    "sap/ushell/services/_CrossApplicationNavigation/utils",
    "sap/ushell/test/utils",
    "sap/ushell/utils",
    "sap/ushell/services/Container",
    "sap/ushell/TechnicalParameters"
], function (oUtils, testUtils, utils, oContainer, TechnicalParameters) {
    "use strict";

    /* global QUnit sinon start */

    QUnit.module("Utils", {
        setup: function () {
        },
        teardown: function () {
            testUtils.restoreSpies(
            );
        }
    });

    [
        {
            testDescription: "parameters expressed in conventional format (no array)",
            oGetLinksParams: {
                p1: "v1"
            },
            expectedParameters: [{
                name: "p1",
                value: "v1",
                options: {}
            }]
        },
        {
            testDescription: "parameters expressed in conventional format (array)",
            oGetLinksParams: {
                p1: ["v1"]
            },
            expectedParameters: [{
                name: "p1",
                value: ["v1"],
                options: {}
            }]
        },
        {
            testDescription: "parameters expressed in extended format (single value)",
            oGetLinksParams: {
                p1: {
                    value: "v1"
                }
            },
            expectedParameters: [{
                name: "p1",
                value: "v1",
                options: {}
            }]
        },
        {
            testDescription: "parameters expressed in extended format (multiple values, with options)",
            oGetLinksParams: {
                p1: {
                    value: "v1"
                },
                p2: {
                    value: "v2",
                    p2OptionName: "p2OptionValue"
                },
                p3: ["v3"]
            },
            expectedParameters: [{
                name: "p1",
                value: "v1",
                options: {}
            }, {
                name: "p2",
                value: "v2",
                options: {
                    p2OptionName: "p2OptionValue"
                }
            }, {
                name: "p3",
                value: ["v3"],
                options: {}
            }]
        }
    ].forEach(function (oFixture) {

        function sortByNameField (oA, oB) {
            if (oA.name === oB.name) {
                return 0;
            }
            return oA.name < oB.name ? -1 : 1;
        }

        QUnit.test("parseGetLinksParameters when " + oFixture.testDescription, function (assert) {
            assert.deepEqual(
                oUtils.parseGetLinksParameters(oFixture.oGetLinksParams).sort(sortByNameField),
                oFixture.expectedParameters.sort(sortByNameField),
                "parses parameters as expected"
            );
        });
    });

    [
        {
            testDescription: "input is null",
            oGetLinksParams: null,
            expectedDefinition: {}
        },
        {
            testDescription: "input is an empty object",
            oGetLinksParams: {},
            expectedDefinition: {}
        },
        {
            testDescription: "input in mixed format is given",
            oGetLinksParams: {
                 p1: "v1", // single value
                 p2: ["v2"], // array-wrapped value
                 p3: { // "extended" format
                     value: ["v3", "v4"],
                     required: true
                 }
            },
            expectedDefinition: {
                 p1: "v1",
                 p2: ["v2"],
                 p3: ["v3", "v4"]
            }
        }
    ].forEach(function (oFixture) {
        QUnit.test("extractGetLinksParameterDefinition when " + oFixture.testDescription, function (assert) {

            assert.deepEqual(
                oUtils.extractGetLinksParameterDefinition(oFixture.oGetLinksParams),
                oFixture.expectedDefinition,
                "extracts the expected definition"
            );
        });
    });

    QUnit.module("_injectStickyParameter", {
        setup: function () {
            stop();
            sap.ushell.bootstrap("local").done(function () {
                start();
            });
            this.oGetParametersStub = sinon.stub(TechnicalParameters, "getParameters");
            this.oGetParameterValueSyncStub = sinon.stub(TechnicalParameters, "getParameterValueSync");
            this.oInjectParametersStub = sinon.stub(oUtils, "_injectParameters");
        },
        teardown: function () {
            delete sap.ushell.Container;
            this.oGetParametersStub.restore();
            this.oGetParameterValueSyncStub.restore();
            this.oInjectParametersStub.restore();
        }
    });

    QUnit.test("Returns input parameters if app life cycle is undefined", function (assert) {
        // Arrange
        var oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns({}),
        oParams = {
            args: {"foo": "bar"}
        };

        // Act
        var vResult = oUtils._injectStickyParameters(oParams);

        // Assert
        assert.deepEqual(vResult, oParams.args, "Correct parameters are returned");
        oGetServiceStub.restore();
    });

    QUnit.test("Returns input parameters if current application is undefined", function (assert) {
        // Arrange
        var oGetCurrentApplicationStub = sinon.stub(sap.ushell.Container.getService("AppLifeCycle"), "getCurrentApplication").returns({}),
        oParams = {
            args: {"foo": "bar"}
        };

        // Act
        var vResult = oUtils._injectStickyParameters(oParams);

        // Assert
        assert.deepEqual(vResult, oParams.args, "Correct parameters are returned");
        oGetCurrentApplicationStub.restore();
    });

    QUnit.test("Calls getParameters of TechnicalParameter", function (assert) {
        // Arrange
        var oAppLifeCycle = {
                getCurrentApplication: function () {
                    return { "app": "1" };
                }
            },
            oParams = {
                args: {"foo": "bar"},
                appLifeCycle: {
                    getCurrentApplication: function () {
                        return { container: "1" };
                    }
                },
                technicalParameters: TechnicalParameters
            },
            oTechParams = [
                {
                    "name": "sap-navigation-scope",
                    "injectFrom": "inboundParameter",
                    "sticky": true,
                    "stickyName": "sap-navigation-scope-filter"
                }
            ],
            oParamValue = "green",
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        oUtils._injectStickyParameters(oParams);

        // Assert
        assert.equal(this.oGetParametersStub.callCount, 1, "getParameters is called correctly");
        oGetServiceStub.restore();
    });

    QUnit.test("Fetches application containers for non-UI5 apps", function (assert) {
            // Arrange
            var oAppLifeCycle = {
                getCurrentApplication: function () {
                    return {
                        "app": "1",
                        applicationType: "Non-UI5"
                    };
                }
            },
            oParams = {
                args: {"foo": "bar"},
                technicalParameters: TechnicalParameters,
                appLifeCycle: {
                    getCurrentApplication: function () {
                        return { container: "appContainer" };
                    }
                }
            },
            oTechParams = [
                {
                    "name": "sap-navigation-scope",
                    "injectFrom": "inboundParameter",
                    "sticky": true,
                    "stickyName": "sap-navigation-scope-filter"
                }
            ],
            oParamValue = "green",
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        oUtils._injectStickyParameters(oParams);

        // Assert
        assert.equal(this.oGetParameterValueSyncStub.callCount, 1, "getParameterValueSync is called correctly");
        assert.strictEqual(this.oGetParameterValueSyncStub.getCall(0).args[2], "appContainer", "Correct application container is used");
        oGetServiceStub.restore();
    });

    QUnit.test("Application containers is empty for UI5 apps", function (assert) {
        // Arrange
        var oAppLifeCycle = {
                getCurrentApplication: function () {
                    return {
                        "app": "1",
                        applicationType: "UI5",
                        container: "container1"
                    };
                }
            },
            oParams = {
                args: {"foo": "bar"},
                technicalParameters: TechnicalParameters
            },
            oTechParams = [
                {
                    "name": "sap-navigation-scope",
                    "injectFrom": "inboundParameter",
                    "sticky": true,
                    "stickyName": "sap-navigation-scope-filter"
                }
            ],
            oParamValue = "green",
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        oUtils._injectStickyParameters(oParams);

        // Assert
        assert.equal(this.oGetParameterValueSyncStub.callCount, 1, "getParameterValueSync is called correctly");
        assert.deepEqual(this.oGetParameterValueSyncStub.getCall(0).args[2], {}, "Application container is an empty object");
        oGetServiceStub.restore();
    });

    QUnit.test("Calls _injectParameters", function (assert) {
        // Arrange
        var oAppLifeCycle = {
                getCurrentApplication: function () {
                    return {
                        "app": "1",
                        applicationType: "UI5",
                        container: "container1"
                    };
                }
            },
            oParams = {
                args: {"foo": "bar"},
                technicalParameters: TechnicalParameters
            },
            oTechParams = [
                {
                    "name": "sap-navigation-scope",
                    "injectFrom": "inboundParameter",
                    "sticky": true,
                    "stickyName": "sap-navigation-scope-filter"
                }
            ],
            oParamValue = "green",
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        oUtils._injectStickyParameters(oParams);

        // Assert
        var oArgsEntries = ["type", "inject", "args"];
        assert.equal(this.oInjectParametersStub.callCount, 1, "_injectParameter is called once");
        assert.deepEqual(Object.keys(this.oInjectParametersStub.getCall(0).args[0]), oArgsEntries, "injectParameter is called with correct parameters");
        oGetServiceStub.restore();
    });

    QUnit.test("Returns the result of _injectParameters", function (assert) {
        // Arrange
        var oAppLifeCycle = {
                getCurrentApplication: function () {
                    return {
                        "app": "1",
                        applicationType: "UI5",
                        container: "container1"
                    };
                }
            },
            oParams = {
                args: {"foo": "bar"},
                technicalParameters: TechnicalParameters
            },
            oTechParams = [
                {
                    "name": "sap-navigation-scope",
                    "injectFrom": "inboundParameter",
                    "sticky": true,
                    "stickyName": "sap-navigation-scope-filter"
                }
            ],
            oParamValue = "green",
            oGetServiceStub = sinon.stub(sap.ushell.Container, "getService").returns(oAppLifeCycle);

        this.oGetParameterValueSyncStub.returns(oParamValue);
        this.oInjectParametersStub.returns({ "foo": "bar"});
        this.oGetParametersStub.returns(oTechParams);

        // Act
        var oResult = oUtils._injectStickyParameters(oParams);

        // Assert
        assert.equal(this.oInjectParametersStub.callCount, 1, "_injectParameter is called once");
        assert.deepEqual(oResult, { "foo": "bar"}, "Correct result is returned");
        oGetServiceStub.restore();
    });

    QUnit.module("_injectParameters");

    QUnit.test("Returns oParams.args when it is undefined", function (assert) {
        // Arrange
        var oParams = {
            inject: {},
            type: {
                isPlainObject: function () {
                    return false;
                }
            },
            args: undefined
        };

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oResult, undefined, "Correct result is returned");
    });

    QUnit.test("Returns the shell hash with parameters injected", function (assert) {
        // Arrange
        var oParams = {
                inject: { "sap-system": "UR5" },
                type: {
                    isPlainObject: function () {
                        return false;
                    }
                },
                args: "#Hash-fragment?with=parameters"
            },
            oExpectedResult = "#Hash-fragment?with=parameters&sap-system=UR5";

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oResult, oExpectedResult, "Correct result is returned");
    });

    QUnit.test("Self-invoke when oParam.args is like { target: { shellHash : string}}", function (assert) {
        // Arrange
        var oIsPlainObjectStub = sinon.stub();
        oIsPlainObjectStub.onFirstCall().returns(true);
        oIsPlainObjectStub.onSecondCall().returns(false);

        var oInjectParametersStub = sinon.stub(oUtils, "_injectParameters");
        var oParamsToInject = {
            "sap-system": "UR5"
        };
        var oType = {
            isPlainObject: oIsPlainObjectStub
        };
        var oParams = {
            inject: oParamsToInject,
            type: oType,
            args: {
                target: {
                    shellHash: "#Hash-fragmnent?with=parameters"
                }
            }
        };

        oInjectParametersStub.withArgs({
            inject: oParamsToInject,
            type: oType,
            args: "#Hash-fragmnent?with=parameters"
        }).returns("MyHash");
        oInjectParametersStub.callThrough();

        // Action
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.strictEqual(oInjectParametersStub.callCount, 2, "_injectParameters are called twice");
        assert.strictEqual(oResult.target.shellHash, "MyHash", "The function _injectParameters has returned the correct value.");
        oInjectParametersStub.restore();
    });

    QUnit.test("Returns the arguments when oParams.args.target.shellHash is not a string", function (assert) {
        // Arrange
        var oParams = {
            inject: { "sap-system": "UR5" },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: {
                target: {
                    shellHash: 1
                }
            }
        };

        var oExpectedResult = {
            target: {
                shellHash: 1
            }
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Correct Parameters are returned");
    });

    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: { ... }} ", function (assert) {
        // Arrange
        var oParams = {
            inject: { "sap-system": "UR5" },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: {
                params: {
                    "param1": 1
                }
            }
        };

        var oExpectedResult = {
            params: {
                param1: 1,
                "sap-system": "UR5"
            }
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });

    QUnit.test("Returns arguments with injected parameters when oParam.args is like {semanticObject: ..., action: ..., params: 'A=B&C=D'} ", function (assert) {
        // Arrange
        var oParams = {
            inject: {
                "sap-navigation-scope": "green"
            },
            type: {
                isPlainObject: function () {
                    return true;
                }
            },
            args: {
                params: "A=B&C=D"
            }
        };
        var oExpectedResult = {
            params: "A=B&C=D&sap-navigation-scope=green"
        };

        // Act
        var oResult = oUtils._injectParameters(oParams);

        // Assert
        assert.deepEqual(oResult, oExpectedResult, "Parameters are correctly injected");
    });
});
