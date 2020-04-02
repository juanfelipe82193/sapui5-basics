// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.utils.objectOperations
 */

sap.ui.require([
    "sap/ushell/utils/objectOperations"
], function (objectOperations) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.module("getMember");

    QUnit.test("Returns the correct result when passing an empty object.", function (assert) {
        var oObj = {};
        var sPath = "sap|flp.type";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, undefined, "correct result");
    });

    QUnit.test("Returns the correct result when passing an empty path.", function (assert) {
        var oObj = { "abc": "def" };
        var sPath = "";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, undefined, "correct result");
    });

    QUnit.test("Returns the correct result when passing a single path.", function (assert) {
        var oObj = { "abc": "def" };
        var sPath = "abc";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, "def", "correct result");
    });

    QUnit.test("Returns the correct result when passing a 2 segment path.", function (assert) {
        var oObj = {
            "sap.flp": {
                type: "tile"
            }
        };
        var sPath = "sap|flp.type";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, "tile", "correct result");
    });

    QUnit.test("Returns the correct result when passing a long path.", function (assert) {
        var oObj = {
            "sap.demo.has": {
                "sap.flp": {
                    type: "application"
                }
            }
        };
        var sPath = "sap|demo|has.sap|flp.type";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, "application", "correct result");
    });

    QUnit.test("Returns the correct result when passing a deep path.", function (assert) {
        var oInnerObj = {
            type: "application"
        };
        var oObj = {
            "sap.demo.has": {
                "sap.flp": oInnerObj
            }
        };
        var sPath = "sap|demo|has.sap|flp";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, oInnerObj, "correct result");
    });

    QUnit.test("Returns the correct result when expecting an array", function (assert) {
        var aArr = [1, 2, 3];
        var oObj = {
            "sap.demo.has": {
                "sap.flp": aArr
            }
        };
        var sPath = "sap|demo|has.sap|flp";
        var oResult = objectOperations.getMember(oObj, sPath);
        assert.strictEqual(oResult, aArr, "correct result");
    });

    QUnit.module("getNestedObjectProperty", {
        beforeEach: function () {
            this.oGetMemberStub = sinon.stub(objectOperations, "getMember");

            this.aObjects = [undefined, "nonEmpty", undefined];
            this.aPaths = ["test", "test", "test"];

            this.oGetMemberStub.withArgs(undefined, "test").returns();
            this.oGetMemberStub.withArgs("nonEmpty", "test").returns("");
        },
        afterEach: function () {
            this.oGetMemberStub.restore();
        }
    });

    QUnit.test("Returns an empty string if it is the first value", function (assert) {
        //Arrange
        //Act
        var sResult = objectOperations.getNestedObjectProperty(this.aObjects, this.aPaths);
        //Assert
        assert.strictEqual(sResult, "", "correct value was returned");
    });
});
