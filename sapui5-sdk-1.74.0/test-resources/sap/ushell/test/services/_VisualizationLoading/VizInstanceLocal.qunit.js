// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationLoader
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/_VisualizationLoading/VizInstanceLocal"
], function (VizLocalInstance) {
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
        var oInstance = new VizLocalInstance(this.oVizData);
        var sInstanceControlType = oInstance.getMetadata().getName();
        // Assert
        assert.strictEqual(sInstanceControlType, "sap.ushell.ui.launchpad.VizInstanceLocal", "The correct control is returned.");
    });

    QUnit.test("Constructor stores the initialization data correctly", function (assert) {
        // Act
        var oInstance = new VizLocalInstance(this.oVizData);

        // Assert
        assert.strictEqual(oInstance.getVisualizationId(), this.oVizData.visualizationId);
        assert.strictEqual(oInstance.getVizType(), this.oVizData.vizType);
        assert.strictEqual(oInstance.getCatalogTile(), this.oVizData.catalogTile);
        assert.strictEqual(oInstance.getPreviewMode(), this.oVizData.previewMode);
    });

    QUnit.module("Visualization methods", {
        beforeEach: function () {
            this.oVizData = {
                visualizationId: "viz1234",
                vizType: "card",
                catalogTile: {
                    "The": "catalog tile"
                },
                previewMode: true
            };
            this.oVizData2 = {
                visualizationId: "viz1234",
                vizType: "tile",
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

    QUnit.test("View instantiation", function (assert) {
        // Arrange
        var oInstance = new VizLocalInstance(this.oVizData2);
        var fnDone = assert.async();
        assert.expect(1);
        // Act
        var oViewPromise = oInstance.load();

        // Assert
        oViewPromise.then(function (oView) {
            var bIsAMatch = !!oView.sId.match(/__tile/);
            assert.ok(bIsAMatch, "Tile instantiated");
        }).finally(fnDone);
    });

    QUnit.module("_setInitData", {
        beforeEach: function () {
            // for the initial instantiation
            this.oVizData = {
                visualizationId: "viz1234",
                vizType: "testTile",
                catalogTile: undefined
            };
        }
    });

    QUnit.test("_setInitData - minimal case", function (assert) {
        // Arrange
        var oInstance = new VizLocalInstance(this.oVizData);
        var oAdditionalData = {
            tileType: "sap.ushell.ui.tile.StaticTile",
            properties: {
                title: "My Tile",
                subtitle: "A testing tile",
                icon: "sap-icon://camera",
                info: "bla",
                keywords: []
            }
        };
        var aExpectedKeywords = [
            "A testing tile",
            "bla"
        ];
        var oExpectedDataSource = {
            refreshInterval: 10000
        };
        assert.expect(11);

        // Act
        oInstance._setInitData(oAdditionalData);

        var sTitle = oInstance.getTitle();
        var sSubTitle = oInstance.getSubtitle();
        var sIcon = oInstance.getIcon();
        var sVizId = oInstance.getVisualizationId();
        var iHeight = oInstance.getHeight();
        var iWidth = oInstance.getWidth();
        var sTileType = oInstance.getType();
        var sTargetURL = oInstance.getTargetURL();
        var aKeywords = oInstance.getKeywords();
        var oDataSource = oInstance.getDataSource();

        // Assert
        assert.strictEqual(sVizId, this.oVizData.visualizationId, "VizId was correctly set");
        assert.strictEqual(sTitle, oAdditionalData.properties.title, "Title was correctly set");
        assert.strictEqual(sSubTitle, oAdditionalData.properties.subtitle, "Subtitle was correctly set");
        assert.strictEqual(sIcon, oAdditionalData.properties.icon, "Icon was correctly set");
        assert.strictEqual(sTileType, oAdditionalData.tileType, "VizId was correctly set");
        assert.strictEqual(sTileType, oAdditionalData.tileType, "VizId was correctly set");
        assert.strictEqual(iHeight, 1, "Height was correctly set");
        assert.strictEqual(iWidth, 1, "Width was correctly set");
        assert.strictEqual(sTargetURL, undefined, "Target was correctly set");
        assert.deepEqual(aKeywords, aExpectedKeywords, "Keywords were correctly set");
        assert.deepEqual(oDataSource, oExpectedDataSource, "Data source were correctly set");
    });

    QUnit.module("Visualization direct instantiation", {
        beforeEach: function () {
            // for the initial instantiation
            this.oVizData = {
                visualizationId: "viz1234",
                vizType: "testTile",
                catalogTile: undefined
            };
            /// for the #load call
            this.oAdditionalData = {
                tileType: "sap.ushell.ui.tile.StaticTile",
                properties: {
                    title: "My Tile",
                    subtitle: "A testing tile",
                    icon: "sap-icon://camera",
                    keywords: []
                }
            };
        }
    });

    QUnit.test("Basic instantiation - PageComposer data", function (assert) {
        // Arrange
        var oInstance = new VizLocalInstance(this.oVizData);
        var fnDone = assert.async();
        assert.expect(8);

        // Act
        var oViewPromise = oInstance.load(this.oAdditionalData);
        oViewPromise.then(function (oView) {
            var sTitle = oInstance.getTitle();
            var sSubTitle = oInstance.getSubtitle();
            var sIcon = oInstance.getIcon();
            var sVizId = oInstance.getVisualizationId();
            var iHeight = oInstance.getHeight();
            var iWidth = oInstance.getWidth();
            var sTileType = oInstance.getType();
            var bIsAMatch = !!oView.sId.match(/__tile/);

            // Assert
            assert.ok(bIsAMatch, "Tile instantiated");
            assert.strictEqual(sTitle, this.oAdditionalData.properties.title, "Title was correctly set");
            assert.strictEqual(sSubTitle, this.oAdditionalData.properties.subtitle, "Subtitle was correctly set");
            assert.strictEqual(sIcon, this.oAdditionalData.properties.icon, "Icon was correctly set");
            assert.strictEqual(sVizId, this.oVizData.visualizationId, "VizId was correctly set");
            assert.strictEqual(sTileType, this.oAdditionalData.tileType, "VizId was correctly set");
            assert.strictEqual(iHeight, 1, "Height was correctly set");
            assert.strictEqual(iWidth, 1, "Width was correctly set");
        }.bind(this)).finally(fnDone);
    });
});
