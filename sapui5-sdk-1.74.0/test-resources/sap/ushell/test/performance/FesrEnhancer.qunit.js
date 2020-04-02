// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.performance.FesrEnhancer
 */
sap.ui.require([
    "sap/ushell/performance/FesrEnhancer",
    "sap/ui/performance/trace/FESR",
    "sap/ushell/performance/ShellAnalytics",
    "sap/ushell/performance/StatisticalRecord"
], function (FesrEnhancer, FESR, ShellAnalytics, StatisticalRecord) {
    "use strict";
    /*global QUnit sinon*/

    function clone (oObject) {
        return JSON.parse(JSON.stringify(oObject));
    }

    QUnit.module("Integration (mocked) with FESR and ShellAnalytics", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sinon.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");

            // arrange UI5 FESR
            this.oFesrGetActiveStub = sinon.stub(FESR, "getActive");
            this.originalFesrOnBeforeCreated = FESR.onBeforeCreated;
        },
        afterEach: function () {
            this.oFesrGetActiveStub.restore();
            FESR.onBeforeCreated = this.originalFesrOnBeforeCreated;
            FesrEnhancer.reset();

            this.ShellAnalyticsEnableStub.restore();
            this.ShellAnalyticsDisableStub.restore();
        }
    });

    QUnit.test("reset does not throw when init was never called", function (assert) {
        // arrange

        // act
        FesrEnhancer.reset();

        // assert
        assert.ok(true, "no error was thrown by reset");
    });

    QUnit.test("consecutive reset calls", function (assert) {

        var fnDoAsserts = function (iExecution) {
            var sPrefix = "(reset call #" + (iExecution || 1) + ") ";

            assert.strictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, sPrefix + "FESR.onBeforeCreated was reset");
            assert.strictEqual(
                this.ShellAnalyticsDisableStub.callCount,
                iExecution || 1,
                sPrefix + "Number of disable calls for ShellAnalytics is " + iExecution
            );

            assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), null, sPrefix + "latest navigation record cleared");
        }.bind(this);

        // arrange
        this.oFesrGetActiveStub.returns(true);
        FesrEnhancer.init();
        FesrEnhancer._setLastTrackedRecord({});
        assert.ok(this.ShellAnalyticsEnableStub.callCount > 0, "prerequisite: attachment(s) to EventHub were done");

        // act #1
        FesrEnhancer.reset();

        // assert #1
        fnDoAsserts();

        // act #2
        // a second reset call should not harm!
        FesrEnhancer.reset();

        // assert #2
        fnDoAsserts(2);
    });

    QUnit.test("init when UI5 FESR is inactive", function (assert) {
        // arrange
        this.oFesrGetActiveStub.returns(false);

        // act
        FesrEnhancer.init();

        // assert
        assert.strictEqual(this.ShellAnalyticsEnableStub.callCount, 0, "ShellAnalytics was not enabled");
        assert.strictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, "onBeforeCreated not overwritten");
    });

    QUnit.test("init when UI5 FESR is active", function (assert) {
        // arrange
        this.oFesrGetActiveStub.returns(true);

        // act
        FesrEnhancer.init();

        // assert
        assert.strictEqual(this.ShellAnalyticsEnableStub.callCount, 1, "ShellAnalytics was not enabled");
        assert.notStrictEqual(FESR.onBeforeCreated, this.originalFesrOnBeforeCreated, "onBeforeCreated has been overwritten");
    });

    QUnit.module("set and get last tracked record", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sinon.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            FesrEnhancer.init();
        },
        afterEach: function () {
            FesrEnhancer.reset();
            this.ShellAnalyticsEnableStub.restore();
            this.ShellAnalyticsDisableStub.restore();
        }
    });

    QUnit.test("setter and getter", function (assert) {
        // act & assert #1
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), null, "initially no records are set");

        // act #2
        var oTestRecord = new StatisticalRecord();
        FesrEnhancer._setLastTrackedRecord(oTestRecord);
        assert.strictEqual(FesrEnhancer._getLastTrackedRecord(), oTestRecord, "latest record is returned");
    });

    QUnit.module("_onBeforeCreatedHandler: ignore scenario", {
        beforeEach: function () {
            this.ShellAnalyticsEnableStub = sinon.stub(ShellAnalytics, "enable");
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sinon.stub(ShellAnalytics, "getCurrentApplication");
            // shared input
            this.oInput = {
                    oFesrHandle: {
                        // stepName must be defined in the test
                        appNameLong: "bar bar",
                        appNameShort: "bar",
                        timeToInteractive: 99999
                    },
                    oInteraction: {
                        "event": "foo",
                        "trigger": "bar",
                        "component": "baz"
                        // ...
                    }
                };
        },
        afterEach: function () {
            FesrEnhancer.reset();
            delete this.oInput;
            this.ShellAnalyticsEnableStub.restore();
            this.ShellAnalyticsDisableStub.restore();
            this.ShellAnalyticGetCurrentAppStub.restore();
        }
    });

    QUnit.test("FESR step is unknown & no Fiori ID remembered", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle;

        // arrange
        this.oInput.oFesrHandle.stepName = "foo";
        oExpectedFesrHandle = clone(this.oInput.oFesrHandle);
        this.ShellAnalyticGetCurrentAppStub.returns(null);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.strictEqual(oReturnedFesrHandle, this.oInput.oFesrHandle, "same FESR handle object was returned");
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "FESR handle information was not modified");
    });

    QUnit.test("FESR step is unknown & Fiori ID remembered", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle;

        // arrange
        this.oInput.oFesrHandle.stepName = "foo";
        this.ShellAnalyticGetCurrentAppStub.returns({id: "F01234"});
        oExpectedFesrHandle = clone(this.oInput.oFesrHandle);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.strictEqual(oReturnedFesrHandle, this.oInput.oFesrHandle, "same FESR handle object was returned");
        assert.deepEqual(oReturnedFesrHandle.appNameShort, "F01234", "appNameShort was overwritten with remembered fiori ID");
        assert.deepEqual(oReturnedFesrHandle.stepName, oExpectedFesrHandle.stepName, "stepName was not modified");
        assert.deepEqual(oReturnedFesrHandle.appNameLong, oExpectedFesrHandle.appNameLong, "appNameLong was not modified");
        assert.deepEqual(oReturnedFesrHandle.timeToInteractive, oExpectedFesrHandle.timeToInteractive,
            "timeToInteractive was not modified");
    });

    QUnit.test("remembered Fiori ID is added to all consecutive records", function (assert) {
        var oOriginalFesrHandle = this.oInput.oFesrHandle,
            oReturnedFesrHandle;

        this.ShellAnalyticGetCurrentAppStub
            .onFirstCall().returns(null)
            .onSecondCall().returns({id: "F01234"})
            .onThirdCall().returns(null);

        // arrange #1
        oOriginalFesrHandle.stepName = "foo";

        // act #1
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(clone(oOriginalFesrHandle), this.oInput.oInteraction);

        // assert #1
        assert.deepEqual(oReturnedFesrHandle, oOriginalFesrHandle, "FESR handle information was not modified");

        // arrange #2
        //.onSecondCall().returns({id: "F01234"}) defined above

        // act #2
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(clone(oOriginalFesrHandle), this.oInput.oInteraction);

        // assert #2
        assert.deepEqual(oReturnedFesrHandle.appNameShort, "F01234", "appNameShort was overwritten with remembered fiori ID");
        assert.deepEqual(oReturnedFesrHandle.stepName, oOriginalFesrHandle.stepName, "stepName was not modified");
        assert.deepEqual(oReturnedFesrHandle.appNameLong, oOriginalFesrHandle.appNameLong, "appNameLong was not modified");
        assert.deepEqual(oReturnedFesrHandle.timeToInteractive, oOriginalFesrHandle.timeToInteractive,
            "timeToInteractive was not modified");

        // arrange #3
        //.onThirdCall().returns(null) defined above

        // act #3
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(clone(oOriginalFesrHandle), this.oInput.oInteraction);

        // assert #3
        assert.deepEqual(oReturnedFesrHandle, oOriginalFesrHandle, "FESR handle information was not modified");
    });

    QUnit.module("_onBeforeCreatedHandler: Initial Homepage scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            // shared input
            this.oInput = {
                    oFesrHandle: {
                        stepName: "undetermined_startup",
                        appNameLong: "sap.ushell.components.homepage",
                        appNameShort: "sap.ushell.components.homepage",
                        timeToInteractive: 99999
                    },
                    oInteraction: {
                        event: "startup",
                        component: "undetermined",
                        stepComponent: "sap.ushell.components.homepage",
                        trigger: "undetermined"
                        // more properties available ...
                    }
                };

            // shared expectations
            this.oExpected = {
                oFesrHandle: {
                    stepName: "FLP@LOAD",
                    appNameLong: "sap.ushell.components.homepage",
                    appNameShort: ""
                    // timeToInteractive must be defined in the test
                }
            };
        },
        afterEach: function () {
            FesrEnhancer.reset();
            FesrEnhancer._getPerformanceEntries.restore();
            delete this.oInput;
            delete this.oExpected;
            this.ShellAnalyticsDisableStub.restore();
        }
    });

    QUnit.test("FLP-TTI-Homepage performance mark does NOT exist", function (assert) {
        var oReturnedFesrHandle,
            oGetPerformanceEntriesStub;

        // arrange
        // Note: As no performance mark exist the time should be kept
        this.oExpected.oFesrHandle.timeToInteractive = this.oInput.oFesrHandle.timeToInteractive;
        oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-Homepage", "correct performance mark read");
    });

    QUnit.test("FLP-TTI-Homepage performance mark exists", function (assert) {
        var oReturnedFesrHandle,
            oGetPerformanceEntriesStub,
            iPerformanceMarkStartTime = 500; // super fast FLP ;)

        // arrange
        this.oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries").returns([
            {
                startTime: iPerformanceMarkStartTime
            }
        ]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-Homepage", "correct performance mark read");
    });


    QUnit.module("_onBeforeCreatedHandler: Initial AppFinder scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            // shared input
            this.oInput = {
                    oFesrHandle: {
                        "stepName": "undetermined_startup",
                        "appNameLong": "sap.ushell.components.appfinder",
                        "appNameShort": "sap.ushell.components.appfinder",
                        "timeToInteractive": 99999
                    },
                    oInteraction: {
                        event: "startup",
                        component: "undetermined",
                        stepComponent: "sap.ushell.components.appfinder",
                        trigger: "undetermined"
                        // more properties available ...
                    }
                };

            // shared expectations
            this.oExpected = {
                oFesrHandle: {
                    stepName: "FLP@LOAD_FINDER",
                    appNameLong: "sap.ushell.components.appfinder",
                    appNameShort: ""
                    // timeToInteractive must be defined in the test
                }
            };
        },
        afterEach: function () {
            FesrEnhancer.reset();
            FesrEnhancer._getPerformanceEntries.restore();
            delete this.oInput;
            delete this.oExpected;
            this.ShellAnalyticsDisableStub.restore();
        }
    });

    QUnit.test("FLP-TTI-AppFinder performance mark does NOT exist", function (assert) {
        var oReturnedFesrHandle,
            oGetPerformanceEntriesStub;

        // arrange
        // Note: As no performance mark exist the time should be kept
        this.oExpected.oFesrHandle.timeToInteractive = this.oInput.oFesrHandle.timeToInteractive;
        oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-AppFinder", "correct performance mark read");
    });

    QUnit.test("FLP-TTI-AppFinder performance mark exists", function (assert) {
        var oReturnedFesrHandle,
            oGetPerformanceEntriesStub,
            iPerformanceMarkStartTime = 500; // super fast AppFinder ;)

        // arrange
        this.oExpected.oFesrHandle.timeToInteractive = iPerformanceMarkStartTime;
        oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries").returns([
            {
                startTime: iPerformanceMarkStartTime
            }
        ]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, this.oExpected.oFesrHandle, "expected FESR handle information");
        assert.strictEqual(oGetPerformanceEntriesStub.firstCall.args[0], "FLP-TTI-AppFinder", "correct performance mark read");
    });


    QUnit.module("_onBeforeCreatedHandler: Direct (initial) app start scenario w/o ", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sinon.stub(ShellAnalytics, "getCurrentApplication");
            // shared input
            this.oInput = {
                    oFesrHandle: {
                        stepName: "undetermined_startup",
                        appNameLong: "sap.some.useful.App",
                        appNameShort: "sap.some.useful.App",
                        timeToInteractive: 99999
                    },
                    oInteraction: {
                        event: "startup",
                        component: "undetermined",
                        stepComponent: "sap.some.useful.App",
                        trigger: "undetermined"
                        // more properties available ...
                    }
                };

            // arrange _getPerformanceEntries
            this.oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries").returns([]);
        },
        afterEach: function () {
            FesrEnhancer.reset();
            FesrEnhancer._getPerformanceEntries.restore();
            delete this.oInput;
            delete this.oExpected;
            this.ShellAnalyticsDisableStub.restore();
            this.ShellAnalyticGetCurrentAppStub.restore();
        }
    });

    QUnit.test("AppRendered event w/o fiori IDs was tracked", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "FLP@DEEP_LINK",
                appNameLong: "sap.some.useful.App",
                appNameShort: "sap.some.useful.App", // No Fiori Id present in tracked events, no changes for appNameShort
                timeToInteractive: this.oInput.oFesrHandle.timeToInteractive // As no performance mark exist the time should be kept
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: ""});

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
    });

    QUnit.test("AppRendered event w/ fiori IDs was tracked", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "FLP@DEEP_LINK",
                appNameLong: "sap.some.useful.App",
                appNameShort: "F00000",
                timeToInteractive: this.oInput.oFesrHandle.timeToInteractive // As no performance mark exist the time should be kept
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: "F00000"});

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
    });

    QUnit.module("_onBeforeCreatedHandler: Navigation scenario", {
        beforeEach: function () {
            //ShellAnalytics
            this.ShellAnalyticsDisableStub = sinon.stub(ShellAnalytics, "disable");
            this.ShellAnalyticGetCurrentAppStub = sinon.stub(ShellAnalytics, "getCurrentApplication");
            this.ShellAnalyticGetNavRecordsStub = sinon.stub(ShellAnalytics, "getNextNavigationRecords");
            // shared input
            this.oInput = {
                    oFesrHandle: {
                        stepName: "some_id__click",
                        appNameLong: "sap.some.useful.App",
                        appNameShort: "sap.some.useful.App",
                        timeToInteractive: 99999
                    },
                    oInteraction: {
                        event: "startup",
                        component: "undetermined",
                        stepComponent: "sap.some.useful.App",
                        trigger: "click"
                        // more properties available ...
                    }
                };

            // arrange _getPerformanceEntries
            this.oGetPerformanceEntriesStub = sinon.stub(FesrEnhancer, "_getPerformanceEntries");
        },
        afterEach: function () {
            FesrEnhancer.reset();
            FesrEnhancer._getPerformanceEntries.restore();
            delete this.oInput;
            delete this.oExpected;
            this.ShellAnalyticsDisableStub.restore();
            this.ShellAnalyticGetCurrentAppStub.restore();
            this.ShellAnalyticGetNavRecordsStub.restore();
        }
    });

    QUnit.test("App to app navigation scenario", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "A2A@F9999",
                appNameLong: "sap.some.useful.App",
                appNameShort: "F00000",
                timeToInteractive: this.oInput.oFesrHandle.timeToInteractive // As no performance mark exist the time should be kept
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: "F00000"});
        var oRecord = new StatisticalRecord();
        oRecord.status = "CLOSED";
        oRecord.step = "A2A@F9999";
        oRecord.targetApplication = "F00000";
        this.ShellAnalyticGetNavRecordsStub.returns([oRecord]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.ok(FesrEnhancer._getLastTrackedRecord().isEqual(oRecord), "New statistical record was set");
    });

    QUnit.test("App to app navigation scenario when FESR does not record interaction", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "A2A@F9999",
                appNameLong: "sap.some.useful.App",
                appNameShort: "F0000",
                timeToInteractive: this.oInput.oFesrHandle.timeToInteractive // As no performance mark exist the time should be kept
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: "F7777"});
        var oRecord1 = new StatisticalRecord();
        oRecord1.status = "CLOSED";
        oRecord1.step = "A2A@F9999";
        oRecord1.targetApplication = "F0000";

        var oRecord2 = new StatisticalRecord();
        oRecord2.status = "CLOSED";
        oRecord2.step = "A2A@F0000";
        oRecord2.targetApplication = "F7777";

        this.ShellAnalyticGetNavRecordsStub.returns([oRecord1, oRecord2]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 0, "no performance marks read");
        assert.ok(FesrEnhancer._getLastTrackedRecord().isEqual(oRecord2), "New statistical record was set");
    });


    QUnit.test("Navigation to the home page from DEEP_LINK application", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "FLP@LOAD",
                appNameLong: "sap.some.useful.App",
                appNameShort: "FLP_HOME",
                timeToInteractive: 50.0
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: "FLP_HOME"});
        var oRecord = new StatisticalRecord();
        oRecord.status = "CLOSED";
        oRecord.step = "FLP@LOAD";
        oRecord.targetApplication = "FLP_HOME";
        sinon.stub(oRecord, "getTimeStart").returns(100.0);
        this.ShellAnalyticGetNavRecordsStub.returns([oRecord]);

        this.oGetPerformanceEntriesStub.returns([{
            startTime: 150.0
        }]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 1, "Performance marks was read");
        assert.ok(FesrEnhancer._getLastTrackedRecord().isEqual(oRecord), "New statistical record was set");
    });

    QUnit.test("Navigation to the home page when home page was already loaded", function (assert) {
        var oReturnedFesrHandle,
            oExpectedFesrHandle = {
                stepName: "FLP@LOAD",
                appNameLong: "sap.some.useful.App",
                appNameShort: "FLP_HOME",
                timeToInteractive: this.oInput.oFesrHandle.timeToInteractive
            };

        // arrange
        this.ShellAnalyticGetCurrentAppStub.returns({id: "FLP_HOME"});
        var oRecord = new StatisticalRecord();
        oRecord.status = "CLOSED";
        oRecord.step = "FLP@LOAD";
        oRecord.targetApplication = "FLP_HOME";
        sinon.stub(oRecord, "getTimeStart").returns(200.0);
        this.ShellAnalyticGetNavRecordsStub.returns([oRecord]);

        this.oGetPerformanceEntriesStub.returns([{
            startTime: 150.0
        }]);

        // act
        oReturnedFesrHandle = FesrEnhancer._onBeforeCreatedHandler(this.oInput.oFesrHandle, this.oInput.oInteraction);

        // assert
        assert.deepEqual(oReturnedFesrHandle, oExpectedFesrHandle, "expected FESR handle information");
        assert.strictEqual(this.oGetPerformanceEntriesStub.callCount, 1, "Performance marks was read");
        assert.ok(FesrEnhancer._getLastTrackedRecord().isEqual(oRecord), "New statistical record was set");
    });

});
