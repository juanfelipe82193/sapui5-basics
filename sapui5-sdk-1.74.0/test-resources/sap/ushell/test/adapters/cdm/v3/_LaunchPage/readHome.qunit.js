// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.adapters.cdm.v3._LaunchPage.readHome
 */
/* global QUnit sinon*/
sap.ui.require([
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readHome",
    "sap/base/util/ObjectPath"
], function (readHome, ObjectPath) {
    "use strict";

    QUnit.module("getTileVizId method");

    QUnit.test("returns correct value", function (assert) {
        //Arrange
        this.oTile = {
            vizId: "vizId1"
        };
        this.sExpectedResult = "vizId1";
        //Act
        var sResult = readHome.getTileVizId(this.oTile);
        //Assert
        assert.strictEqual(sResult, this.sExpectedResult, "returns correct result");
    });

    QUnit.module("getInbound method", {
        beforeEach: function () {
            this.oGetStub = sinon.stub(ObjectPath, "get");

            this.sMockAppDescriptor = "sMockAppDescriptor";
            this.sMockInboundId = "sMockInboundId";
            this.sMockInbound = "sMockInbound";
            this.aInboundPath = ["sap.app", "crossNavigation", "inbounds", this.sMockInboundId];

            this.oGetStub.withArgs(this.aInboundPath, this.sMockAppDescriptor).returns(this.sMockInbound);
        },
        afterEach: function () {
            this.oGetStub.restore();
        }
    });

    QUnit.test("applicationInbound exists", function (assert) {
        //Arrange
        var oExpectedResult = {
            key: this.sMockInboundId,
            inbound: this.sMockInbound
        };
        //Act
        var oResult = readHome.getInbound(this.sMockAppDescriptor, this.sMockInboundId);
        //Assert
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.deepEqual(oResult, oExpectedResult, "returns the correct object");
    });

    QUnit.test("applicationInbound does not exist", function (assert) {
        //Arrange
        this.oGetStub.withArgs(this.aInboundPath, this.sMockAppDescriptor).returns();
        //Act
        var oResult = readHome.getInbound(this.sMockAppDescriptor, this.sMockInboundId);
        //Assert
        assert.strictEqual(this.oGetStub.callCount, 1, "get was called once");
        assert.strictEqual(oResult, undefined, "returns undefined");
    });

    QUnit.module("component and integration tests", {
        beforeEach: function () {
            this.oMockInbound = {
                info: "inboundInfo"
            };
            this.oMockAppDescriptor = {
                "sap.app": {
                    crossNavigation: {
                        inbounds: {
                            inboundId1: this.oMockInbound
                        }
                    }
                }
            };
            this.oExpectedResult = {
                inbound: this.oMockInbound,
                key: "inboundId1"
            };
        }
    });

    QUnit.test("get existing Inbound", function (assert) {
        //Arrange
        //Act
        var oResult = readHome.getInbound(this.oMockAppDescriptor, "inboundId1");
        //Assert
        assert.deepEqual(oResult, this.oExpectedResult, "getInbound returns the correct result");
    });

    QUnit.test("get non existing Inbound", function (assert) {
        //Arrange
        //Act
        var oResult = readHome.getInbound(this.oMockAppDescriptor, "nonExistingInbound");
        //Assert
        assert.strictEqual(oResult, undefined, "getInbound returns the correct result");
    });
});