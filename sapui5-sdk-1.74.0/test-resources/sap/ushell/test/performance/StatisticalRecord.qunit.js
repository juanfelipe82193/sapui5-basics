// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.performance.StatisticalRecord
 */
sap.ui.require([
    "sap/ushell/performance/StatisticalRecord"
], function (StatisticalRecord) {
    "use strict";
    /*global QUnit sinon*/

    QUnit.module("Create/close a StatisticalRecord", {
        beforeEach: function () {
            this.oPerformanceStub = sinon.stub(performance, "now");
        },
        afterEach: function () {
            this.oPerformanceStub.restore();
        }
    });

    QUnit.test("Create StatisticalRecord with open status", function (assert) {
        var oStatisticalRecord = new StatisticalRecord();
        assert.strictEqual(oStatisticalRecord.status, "OPEN", "Status of StatisticalRecord should be opened when create the new instance");
        assert.notOk(oStatisticalRecord.isClosed(), "Status of StatisticalRecord should be opened when create the new instance");
    });

    QUnit.test("Close StatisticalRecord should calculate the step and duration", function (assert) {

        var oStatisticalRecord = new StatisticalRecord();
        assert.notOk(oStatisticalRecord.isClosed(), "Status of StatisticalRecord should be opened when create the new instance");

        oStatisticalRecord.setTimeStart(100.0);
        this.oPerformanceStub.returns(200.0);
        oStatisticalRecord._calculateStep = sinon.spy();

        oStatisticalRecord.closeRecord();
        assert.ok(oStatisticalRecord.isClosed(), "StatisticalRecord should be closed");
        assert.ok(oStatisticalRecord._calculateStep.calledOnce, "_calculateStep should be called once");
        assert.equal(oStatisticalRecord.getTimeEnd(), 200.0, "TimeEnd was taken from performance.now()");
        assert.equal(oStatisticalRecord.duration, 100.0, "Duration of StatisticalRecord calculated correctly");

    });

    QUnit.test("Close StatisticalRecord should not calculate the duration if start time is not defined", function (assert) {

        var oStatisticalRecord = new StatisticalRecord();
        this.oPerformanceStub.returns(200.0);
        oStatisticalRecord.closeRecord();

        assert.ok(oStatisticalRecord.isClosed(), "StatisticalRecord should be closed");
        assert.equal(oStatisticalRecord.getTimeEnd(), 200.0, "TimeEnd was taken from performance.now()");
        assert.equal(oStatisticalRecord.duration, null, "Duration of StatisticalRecord should not be calculated");

    });

    QUnit.test("Close StatisticalRecord with error", function (assert) {

        var oStatisticalRecord = new StatisticalRecord();
        assert.notOk(oStatisticalRecord.isClosed(), "Status of StatisticalRecord should be opened when create the new instance");

        oStatisticalRecord.setTimeStart(100.0);
        this.oPerformanceStub.returns(200.0);
        oStatisticalRecord._calculateStep = sinon.spy();

        oStatisticalRecord.closeRecordWithError();
        assert.strictEqual(oStatisticalRecord.status, "ERROR", "Status of StatisticalRecord should be ERROR");
        assert.ok(oStatisticalRecord._calculateStep.notCalled, "_calculateStep should not be called once");
        assert.equal(oStatisticalRecord.getTimeEnd(), 200.0, "TimeEnd was taken from performance.now()");
        assert.equal(oStatisticalRecord.duration, 100.0, "Duration of StatisticalRecord calculated correctly");

    });

    QUnit.test("isEqual calculates based on the start time", function (assert) {

        var oStatisticalRecord = new StatisticalRecord();
        oStatisticalRecord.setTimeStart(100.0);

        var oAnotherRecord = new StatisticalRecord();
        oAnotherRecord.setTimeStart(200.0);

        assert.ok(oStatisticalRecord.isEqual(oStatisticalRecord), "StatisticalRecord should be equal to the same record");
        assert.notOk(oStatisticalRecord.isEqual(oAnotherRecord), "StatisticalRecords should be equal if start time is different");
    });



    QUnit.module("Calculate steps for a StatisticalRecord", {
        beforeEach: function () {
        },
        afterEach: function () {
        }
    });

    [{
        description: "App to App navigation when source and target application is not FLP_HOME",
        sourceApplication: "F123",
        targetApplication: "F321",
        expectedStep: "A2A@F123"
    }, {
        description: "Navigation to home should return FLP@LOAD step",
        sourceApplication: "F123",
        targetApplication: "FLP_HOME",
        expectedStep: "FLP@LOAD"
    }, {
        description: "Navigation to application from FLP_HOME should return FLP@HOMEPAGE_TILE",
        sourceApplication: "FLP_HOME",
        targetApplication: "F123",
        expectedStep: "FLP@HOMEPAGE_TILE"
    }, {
        description: "Open application directly should returns FLP@DEEP_LINK",
        sourceApplication: undefined,
        targetApplication: "F123",
        expectedStep: "FLP@DEEP_LINK"
    }, {
        description: "There is no status if target and source application is not defined",
        sourceApplication: undefined,
        targetApplication: undefined,
        expectedStep: ""
    }].forEach(function (oTestCase) {

        QUnit.test(oTestCase.description, function (assert) {
            var oStatisticalRecord = new StatisticalRecord();

            oStatisticalRecord.setSourceApplication(oTestCase.sourceApplication);
            oStatisticalRecord.setTargetApplication(oTestCase.targetApplication);

            oStatisticalRecord.closeRecord();
            assert.strictEqual(oStatisticalRecord.getStep(), oTestCase.expectedStep, "App to app navigation at F123");

        });
    });

});
