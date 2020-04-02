// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*
@fileOverview QUnit tests for sap.ushell.services.VisualizationLoader
*/

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationLoading/VizInstanceEmpty",
    "sap/m/GenericTile"
], function (VizInstanceEmpty, GenericTile) {
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
        }
    });

    QUnit.test("Constructor returns the correct control", function (assert) {
        // Act
        var oInstance = new VizInstanceEmpty(this.oVizData);
        var sInstanceControlType = oInstance.getMetadata().getName();
        // Assert
        assert.strictEqual(sInstanceControlType, "sap.ushell.ui.launchpad.VizInstanceEmpty", "The correct control is returned.");
    });

    QUnit.test("Constructor stores the initialization data correctly", function (assert) {
        // Act
        var oInstance = new VizInstanceEmpty(this.oVizData);

        // Assert
        assert.strictEqual(oInstance.getVisualizationId(), this.oVizData.visualizationId, "Visualization ID is set as expected");
        assert.strictEqual(oInstance.getVizType(), this.oVizData.vizType, "Visualization type is set as expected");
        assert.strictEqual(oInstance.getCatalogTile(), this.oVizData.catalogTile, "Catalog tile is set as expected");
        assert.strictEqual(oInstance.getPreviewMode(), this.oVizData.previewMode, "Preview mode is configured as expected");
    });

    QUnit.module("Visualization view", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                getVisualizationView: sinon.stub().callsFake(function () {
                    return Promise.resolve(
                        new GenericTile({
                            header: "The View!"
                        })
                    );
                }),
                _getAdapter: sinon.stub.returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("load", function (assert) {
        // Arrange
        var oInstance = new VizInstanceEmpty(this.oVizData);
        var fnDone = assert.async();
        assert.expect(2);

        // Act
        var oViewPromise = oInstance.load();

        // Assert
        oViewPromise.then(function (oView) {
            assert.strictEqual(oView.sId, "__tile0");
            assert.strictEqual(oView.getHeader(), "", "");
        }).finally(fnDone);
    });

    QUnit.module("misc", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oVisualizationDataProviderService = {
                getVisualizationView: sinon.stub().callsFake(function () {
                    return Promise.resolve(
                        new GenericTile({
                            header: "The View!"
                        })
                    );
                }),
                _getAdapter: sinon.stub.returns(this.oLaunchPageAdapter)
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
            this.oVizInstance = new VizInstanceEmpty();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("_getInnerControlPromise resolves with an empty object", function (assert) {
        // Arrange
        var oExpectedResult = {},
            fnDone = assert.async();
        // Act
        this.oVizInstance._getInnerControlPromise()
            .then(function (innerControl) {
                // Assert
                assert.deepEqual(innerControl, oExpectedResult, "Empty object was returned");
            }).finally(fnDone);
    });
});