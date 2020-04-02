// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*
@fileOverview QUnit tests for sap.ushell.services.VisualizationLoader
*/

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationLoading/VizInstance",
    "sap/m/GenericTile"
], function (VizInstance, GenericTile) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                _getAdapter: sinon.stub().returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };

            this.oVizData = {
                visualizationId: "viz1234",
                vizType: "card",
                catalogTile: {
                    "id": "toappperssample3",
                    "title": "AppPersSample3",
                    "size": "1x1",
                    "tileType": "sap.ushell.ui.tile.StaticTile",
                    "properties": {
                        "chipId": "catalogTile_06",
                        "title": "AppPersSample3",
                        "subtitle": "Personalization Sample 3",
                        "info": "demo for personalization with variants",
                        "icon": "sap-icon://camera",
                        "targetURL": "#Action-toappperssample3"
                    }
                },
                previewMode: true
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Constructor returns the correct control", function (assert) {
        // Act
        var oInstance = new VizInstance(this.oVizData);
        var sInstanceControlType = oInstance.getMetadata().getName();
        // Assert
        assert.strictEqual(sInstanceControlType, "sap.ushell.ui.launchpad.VizInstance", "The correct control is returned.");
    });

    QUnit.test("Constructor stores the initialization data correctly", function (assert) {
        // Act
        var oInstance = new VizInstance(this.oVizData);

        // Assert
        assert.strictEqual(oInstance.getVisualizationId(), this.oVizData.visualizationId, "Visualization ID is set as expected");
        assert.strictEqual(oInstance.getVizType(), this.oVizData.vizType, "Visualization type is set as expected");
        assert.strictEqual(oInstance.getCatalogTile(), this.oVizData.catalogTile, "Catalog tile is set as expected");
        assert.strictEqual(oInstance.getPreviewMode(), this.oVizData.previewMode, "Preview mode is configured as expected");
    });

    QUnit.module("getLayout", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                _getAdapter: sinon.stub().returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("returns the correct layout for non-card instances", function (assert) {
        // Arrange
        var oGetWidthStub = sinon.stub(this.oVizInstance, "getWidth").returns(1),
            oGetHeightStub = sinon.stub(this.oVizInstance, "getHeight").returns(1),
            oGetMetadataGetNameStub = sinon.stub(Object.getPrototypeOf(this.oVizInstance).getMetadata(), "getName").returns("sap.ushell.ui.launchpad.VizInstanceDefault"),
            oExpectedLayout = {
                columns: 2,
                rows: 2
            };

        // Act
        var oResult = this.oVizInstance.getLayout();
        // Assert
        assert.deepEqual(oResult, oExpectedLayout, "Expected layout was returned");
        // Cleanup
        oGetWidthStub.restore();
        oGetHeightStub.restore();
        oGetMetadataGetNameStub.restore();
    });

    QUnit.test("returns the correct layout for card instances", function (assert) {
        // Arrange
        var oGetWidthStub = sinon.stub(this.oVizInstance, "getWidth").returns(1),
            oGetHeightStub = sinon.stub(this.oVizInstance, "getHeight").returns(1),
            oGetMetadataGetNameStub = sinon.stub(Object.getPrototypeOf(this.oVizInstance).getMetadata(), "getName").returns("sap.ushell.ui.launchpad.VizInstanceCard"),
            oExpectedLayout = {
                columns: 1,
                rows: 1
            };

        // Act
        var oResult = this.oVizInstance.getLayout();
        // Assert
        assert.deepEqual(oResult, oExpectedLayout, "Expected layout was returned");
        // Cleanup
        oGetWidthStub.restore();
        oGetHeightStub.restore();
        oGetMetadataGetNameStub.restore();
    });

    QUnit.module("load", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                _getAdapter: sinon.stub().returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
            this.oVizInstance = new VizInstance();
            this.oSetVizViewControlPromiseStub = sinon.stub(this.oVizInstance, "_setVizViewControlPromise");
            this.oSetAggregationStub = sinon.stub(this.oVizInstance, "setAggregation");
        },
        afterEach: function () {
            delete sap.ushell.Container;
            this.oSetVizViewControlPromiseStub.restore();
            this.oSetAggregationStub.restore();
        }
    });

    QUnit.test("Resolves directly if inner control is already available", function (assert) {
        // Arrange
        var oMockInnerControl = {
                some: "control"
            },
            oPromise;

        this.oVizInstance.oInnerControl = oMockInnerControl;
        // Act
        oPromise = this.oVizInstance.load();
        // Assert
        return oPromise.then(function (oInnerControl) {
            assert.deepEqual(oInnerControl, oMockInnerControl, "Inner control was returned");
            assert.ok(this.oSetVizViewControlPromiseStub.notCalled, "Promise was resolved directly and further logic was not executed again");
            assert.ok(this.oSetAggregationStub.notCalled, "Promise was resolved directly and furthr logic was not executed again");
        }.bind(this));
    });

    QUnit.test("Resolves directly if inner control instantiation was already triggered", function (assert) {
        // Arrange
        var oMockInnerControl = {
                some: "control"
            },
            oPromise;

        this.oVizInstance.oControlPromise = Promise.resolve(oMockInnerControl);
        // Act
        oPromise = this.oVizInstance.load();
        // Assert
        return oPromise.then(function (oInnerControl) {
            assert.deepEqual(oInnerControl, oMockInnerControl, "Inner control was returned");
            assert.ok(this.oSetVizViewControlPromiseStub.notCalled, "Promise was resolved directly and further logic was not executed again");
            assert.ok(this.oSetAggregationStub.notCalled, "Promise was resolved directly and furthr logic was not executed again");
        }.bind(this));
    });

    QUnit.test("Triggers the instantiation and sets the aggregation", function (assert) {
        // Arrange
        var oVizData = {
                some: "data"
            },
            oView = {
                some: "view"
            },
            oPromise,
            aExpectedSetAggregationArgs = [
                "innerControl",
                oView,
                false
            ];

        this.oSetVizViewControlPromiseStub.callsFake(function () {
            this.oControlPromise = Promise.resolve(oView);
        }.bind(this.oVizInstance));
        // Act
        oPromise = this.oVizInstance.load(oVizData);
        // Assert
        return oPromise.then(function () {
            assert.ok(this.oSetVizViewControlPromiseStub.called, "The control promise was set");
            assert.deepEqual(this.oSetAggregationStub.firstCall.args, aExpectedSetAggregationArgs, "The correct view was returned");
        }.bind(this));
    });

    QUnit.module("misc methods", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                _getAdapter: sinon.stub().returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
            this.oVizInstance = new VizInstance();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("_setVizViewControlPromise sets a promise which resolves with an empty object", function (assert) {
        // Arrange
        var oExpectedResult = {},
            oPromise;
        // Act
        this.oVizInstance._setVizViewControlPromise();
        oPromise = this.oVizInstance.oControlPromise;
        // Assert
        return oPromise.then(function (result) {
            assert.deepEqual(result, oExpectedResult, "Promise was set and resolved as expected");
        });
    });

    QUnit.test("_getInnerControlPromise returns the correct promise", function (assert) {
        // Arrange
        var oPromise = Promise.resolve(),
            oResult;
        this.oVizInstance.oControlPromise = oPromise;
        // Act
        oResult = this.oVizInstance._getInnerControlPromise();
        // Assert
        assert.strictEqual(oResult, oPromise, "The correct promise was returned");
    });
});