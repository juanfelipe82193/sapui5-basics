// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationLoading
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/VisualizationLoading",
    "sap/ushell/services/_VisualizationLoading/VizInstanceEmpty",
    "sap/ushell/services/_VisualizationLoading/VizInstanceLocal",
    "sap/ushell/services/_VisualizationLoading/VizInstanceDefault"
], function (
    VisualizationLoading,
    VizEmpty,
    VizLocal,
    VizDefault
) {
    "use strict";

    /* global QUnit, sinon */

    QUnit.start();

    QUnit.module("Constructor");

    QUnit.test("Calls the expected functions in the constructor flow", function (assert) {
        // Arrange
        var oInitStub = sinon.spy(VisualizationLoading.prototype, "_init"),
            oLoadVisualizationDataStub = sinon.stub(VisualizationLoading.prototype, "loadVisualizationData");
        // Act
        // eslint-disable-next-line no-new
        new VisualizationLoading();
        // Assert
        assert.ok(oInitStub.calledOnce, "_init was called");
        assert.ok(oLoadVisualizationDataStub, "loadVisualizationData was called");
        // Cleanup
        oInitStub.restore();
        oLoadVisualizationDataStub.restore();
    });

    QUnit.module("loadVisualizationData", {
        beforeEach: function () {
            this.getCatalogTilesData = {
                sampleViz: { id: "sampleId" }
            };

            this.oVisualizationDataProviderService = {
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData))
            };

            sap.ushell.Container = {
                getService: sinon.stub().withArgs("VisualizationDataProvider").returns(this.oVisualizationDataProviderService)
            };
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Loads the catalog tiles and resolves as soon as they are loaded", function (assert) {
        // Arrange
        // Stub init to prevent constructor from loading the tiles already
        var oInitStub = sinon.stub(VisualizationLoading.prototype, "_init"),
            oVizLoadingService = new VisualizationLoading(),
            oLoadVisualizationDataPromise,
            fnDone = assert.async();
        // Act
        oLoadVisualizationDataPromise = oVizLoadingService.loadVisualizationData();
        // Assert
        oLoadVisualizationDataPromise.then(function () {
            assert.ok("Promise was resolved");
            assert.deepEqual(oVizLoadingService._oCatalogTiles, this.getCatalogTilesData, "Catalogs are properly stored internally");
        }.bind(this)).catch(function () {
            assert.notOk("Promise was resolved");
        }).finally(function () {
            oInitStub.restore();
            fnDone();
        });
    });

    QUnit.test("Does not call the VisualizationDataProvider again after the data has already beenloaded", function (assert) {
        // Arrange
        // Stub init to prevent constructor from loading the tiles already
        var oInitStub = sinon.stub(VisualizationLoading.prototype, "_init"),
            oVizLoadingService = new VisualizationLoading(),
            oFirstLoadVisualizationDataPromise,
            oSecondLoadVisualizationDataPromise,
            fnDone = assert.async();
        // Act
        oFirstLoadVisualizationDataPromise = oVizLoadingService.loadVisualizationData();
        oSecondLoadVisualizationDataPromise = oVizLoadingService.loadVisualizationData();
        // Assert
        oFirstLoadVisualizationDataPromise.then(function () {
            assert.ok("Promise was resolved");
            assert.strictEqual(oFirstLoadVisualizationDataPromise, oSecondLoadVisualizationDataPromise, "Same promise is returned on second call");
        }).catch(function () {
            assert.notOk("Promise was resolved");
        }).finally(function () {
            oInitStub.restore();
            fnDone();
        });
    });

    QUnit.test("Rejects the promise when an error occurs in the VisualizationDataProvider", function (assert) {
        // Arrange
        var oError = { error: "SomeError" },
            fnDone = assert.async(),
            oVizLoadingService,
            oLoadVisualizationDataPromise;
        this.oVisualizationDataProviderService._getCatalogTiles.returns(Promise.reject(oError));
        // Act
        oVizLoadingService = new VisualizationLoading();
        oLoadVisualizationDataPromise = oVizLoadingService.loadVisualizationData();
        // Assert
        oLoadVisualizationDataPromise.then(function () {
            assert.notOkay("Promise was rejected");
        }).catch(function (error) {
            assert.ok("Promise was rejected");
            assert.deepEqual(error, oError);
        }).finally(function () {
            fnDone();
        });
    });

    QUnit.module("instantiateVisualization", {
        beforeEach: function (assert) {
            var fnDone = assert.async();
            this.getCatalogTilesData = {
                sampleViz: { id: "sampleId" }
            };
            this.oVisualizationDataProviderService = {
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData)),
                _getAdapter: sinon.stub()
            };
            sap.ushell.Container = {
                getService: sinon.stub().withArgs("VisualizationDataProvider").returns(this.oVisualizationDataProviderService)
            };
            this.oVizLoadingService = new VisualizationLoading();
            // Wait until the catalog tiles are loaded before proceeding to the tests
            this.oVizLoadingService.loadVisualizationData();
            this.oVizLoadingService.oCatalogTileRequest.finally(fnDone);
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("returns a new VizEmpty instance if catalogTiles are not yet loaded", function (assert) {
        // Arrange
        var oVizData = { vizId: "someId" },
            oVizEmptyLoadedStub = sinon.stub(VizEmpty.prototype, "load");
        delete this.oVizLoadingService._oCatalogTiles;
        var oLoadSpy = sinon.spy(this.oVizLoadingService, "loadVisualizationData");
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizEmpty);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        assert.ok(oVizEmptyLoadedStub.called, "Loading of the viz instance was triggered");
        assert.ok(oLoadSpy.called, "Loading of the data was triggered");
        // Cleanup
        oVizEmptyLoadedStub.restore();
        oLoadSpy.restore();
    });

    QUnit.test("returns an empty object when no vizData was provided", function (assert) {
        // Arrange
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization({});
        // Assert
        assert.deepEqual(oResult, {}, "Empty object was returned");
    });

    QUnit.test("returns a new VizEmpty instance if no catalog tile can be found for the provided vizId", function (assert) {
        // Arrange
        var oVizData = { vizId: "someNonExisitingId" },
            oVizEmptyLoadedStub = sinon.stub(VizEmpty.prototype, "load");
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizEmpty);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        assert.ok(oVizEmptyLoadedStub.called, "Loading of the viz instance was triggered");
        // Cleanup
        oVizEmptyLoadedStub.restore();
    });

    QUnit.test("returns a new VizLocal instance if the proper type is configured and prerequisites are met and loads it based on configuration", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "sampleViz",
            deferLoading: false
        };
        var oVizConfig = {
            oAdditionalData: { someData: "as a string" },
            oInitData: {
                visualizationId: oVizData.vizId,
                vizType: "local"
            }
        };
        var oVizLocalLoadedStub = sinon.stub(VizLocal.prototype, "load"),
            oGetPlatformStub = sinon.stub(VisualizationLoading.prototype, "_getPlatform").returns("local"),
            oPrepareLocalConfig = sinon.stub(VisualizationLoading.prototype, "_prepareLocalConfig").returns(oVizConfig);
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizLocal);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        assert.ok(oVizLocalLoadedStub.called, "Loading of the viz instance was triggered");
        assert.deepEqual(oVizLocalLoadedStub.firstCall.args[0], oVizConfig.oAdditionalData, "Load was called with additional data");
        assert.ok(oGetPlatformStub.called, "getPlatform was called");
        assert.ok(oPrepareLocalConfig.called, "prepadeLocalConfig was called");
        // Cleanup
        oVizLocalLoadedStub.restore();
        oGetPlatformStub.restore();
        oPrepareLocalConfig.restore();
    });

    QUnit.test("returns a new VizLocal instance if the proper type is configured and prerequisites are met and defers loading it based on configuration", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "sampleViz",
            deferLoading: true
        };
        var oVizConfig = {
            oAdditionalData: { someData: "as a string" },
            oInitData: {
                visualizationId: oVizData.vizId,
                vizType: "local"
            }
        };
        var oVizEmptyLoadedStub = sinon.stub(VizEmpty.prototype, "load"),
            oGetPlatformStub = sinon.stub(VisualizationLoading.prototype, "_getPlatform").returns("local"),
            oPrepareLocalConfig = sinon.stub(VisualizationLoading.prototype, "_prepareLocalConfig").returns(oVizConfig);
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizLocal);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        assert.ok(oVizEmptyLoadedStub.notCalled, "Loading of the viz instance was not triggered");
        // Cleanup
        oVizEmptyLoadedStub.restore();
        oGetPlatformStub.restore();
        oPrepareLocalConfig.restore();
    });

    QUnit.test("returns a new VizLocal instance if the \"localLoad\" flag is set and prerequisites are met and defers loading it based on configuration", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "sampleViz",
            deferLoading: true,
            localLoad: true
        };
        var oVizConfig = {
            oAdditionalData: { someData: "as a string" },
            oInitData: {
                visualizationId: oVizData.vizId,
                vizType: "local"
            }
        };
        var oVizEmptyLoadedStub = sinon.stub(VizEmpty.prototype, "load"),
            oGetPlatformStub = sinon.stub(VisualizationLoading.prototype, "_getPlatform").returns("local"),
            oPrepareLocalConfig = sinon.stub(VisualizationLoading.prototype, "_prepareLocalConfig").returns(oVizConfig),
            oLoadSpy = sinon.spy(this.oVizLoadingService, "loadVisualizationData");

        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizLocal);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        assert.ok(oVizEmptyLoadedStub.notCalled, "Loading of the viz instance was not triggered");
        assert.ok(oLoadSpy.notCalled, "Loading of the data was not triggered");
        // Cleanup
        oVizEmptyLoadedStub.restore();
        oGetPlatformStub.restore();
        oPrepareLocalConfig.restore();
        oLoadSpy.restore();
    });

    QUnit.test("returns a new VizDefault instance if the proper type is configured and prerequisites are met", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "sampleViz",
            deferLoading: true
        };
        var oVizConfig = {
            oAdditionalData: { someData: "as a string" },
            oInitData: {
                visualizationId: oVizData.vizId,
                vizType: "default"
            }
        };
        var oGetPlatformStub = sinon.stub(VisualizationLoading.prototype, "_getPlatform").returns("default"),
            oPrepareDefaultConfig = sinon.stub(VisualizationLoading.prototype, "_prepareDefaultConfig").returns(oVizConfig);
        // Act
        var oResult = this.oVizLoadingService.instantiateVisualization(oVizData);
        // Assert
        assert.ok(oResult instanceof VizDefault);
        assert.strictEqual(oResult.getVisualizationId(), oVizData.vizId, "Id matches with the one that was provided");
        // Cleanup
        oGetPlatformStub.restore();
        oPrepareDefaultConfig.restore();
    });

    QUnit.module("_getPlatform", {
        beforeEach: function () {
            this.getCatalogTilesData = { sampleViz: { id: "sampleId" } };
            this.oVisualizationDataProviderService = {
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData)),
                _getAdapter: sinon.stub()
            };

            sap.ushell.Container = {
                getService: sinon.stub().withArgs("VisualizationDataProvider").returns(this.oVisualizationDataProviderService)
            };
            this.oVizLoadingService = new VisualizationLoading();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("detects ABAP platform based on CHIP API", function (assert) {
        // Arrange
        var oCatalogTile = {
            getChip: function () { }
        },
            oVizData = {};
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "ABAP", "ABAP platform was detected");
    });

    QUnit.test("detects local platform based on namespace property", function (assert) {
        // Arrange
        var oCatalogTile = { namespace: "foo" },
            oVizData = {};
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "local", "local platform was detected");
    });

    QUnit.test("detects local platform based on tileType property", function (assert) {
        // Arrange
        var oCatalogTile = { tileType: "foo" },
            oVizData = {};
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "local", "local platform was detected");
    });

    QUnit.test("detects local platform based on properties property", function (assert) {
        // Arrange
        var oCatalogTile = { properties: "foo" },
            oVizData = {};
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "local", "local platform was detected");
    });

    QUnit.test("detects local platform based on vizData properties property", function (assert) {
        // Arrange
        var oCatalogTile = {},
            oVizData = { properties: "123" };
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "local", "local platform was detected");
    });

    QUnit.test("returns default platform in case no other platform was detected", function (assert) {
        // Arrange
        var oCatalogTile = {},
            oVizData = {};
        // Act
        var sResult = this.oVizLoadingService._getPlatform(oCatalogTile, oVizData);
        // Assert
        assert.strictEqual(sResult, "default", "default platform was detected");
    });

    QUnit.module("_prepareDefaultConfig", {
        beforeEach: function () {
            this.getCatalogTilesData = { sampleViz: { id: "sampleId" } };
            this.oVisualizationDataProviderService = {
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData)),
                _getAdapter: sinon.stub()
            };

            sap.ushell.Container = {
                getService: sinon.stub().withArgs("VisualizationDataProvider").returns(this.oVisualizationDataProviderService)
            };
            this.oVizLoadingService = new VisualizationLoading();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Extracts the relevant data from the input parameters", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "someVizId",
            extraProperty: "should be ignored"
        };
        var oCatalogTile = {},
            oExpectedVizConfig = {
                oInitData: {
                    catalogTile: oCatalogTile,
                    visualizationId: oVizData.vizId,
                    vizType: "default"
                }
            };
        // Act
        var oResult = this.oVizLoadingService._prepareDefaultConfig(oVizData, oCatalogTile);
        // Assert
        assert.deepEqual(oResult, oExpectedVizConfig, "Expected config was returned");
    });

    QUnit.module("_prepareLocalConfig", {
        beforeEach: function () {
            this.getCatalogTilesData = { sampleViz: { id: "sampleId" } };
            this.oVisualizationDataProviderService = {
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData)),
                _getAdapter: sinon.stub()
            };

            sap.ushell.Container = {
                getService: sinon.stub().withArgs("VisualizationDataProvider").returns(this.oVisualizationDataProviderService)
            };
            this.oVizLoadingService = new VisualizationLoading();
        },
        afterEach: function () {
            delete sap.ushell.Container;
        }
    });

    QUnit.test("Extracts the relevant data from the input parameters", function (assert) {
        // Arrange
        var oVizData = {
            vizId: "someVizId",
            extraProperty: "should be ignored",
            properties: { foo: "bar" },
            mode: "someMode",
            namespace: "someNamespace",
            path: "somePath",
            moduleType: "someModuleType",
            moduleName: "someModuleName",
            tileType: "someTileType"
        };
        var oCatalogTile = {},
            oExpectedVizConfig = {
                oInitData: {
                    catalogTile: oCatalogTile,
                    visualizationId: oVizData.vizId,
                    vizType: "local"
                },
                oAdditionalData: {
                    properties: { foo: "bar" },
                    mode: "someMode",
                    namespace: "someNamespace",
                    path: "somePath",
                    moduleType: "someModuleType",
                    moduleName: "someModuleName",
                    tileType: "someTileType",
                    keywords: []
                }
            };
        // Act
        var oResult = this.oVizLoadingService._prepareLocalConfig(oVizData, oCatalogTile);
        // Assert
        assert.deepEqual(oResult, oExpectedVizConfig, "Expected config was returned");
    });

    QUnit.module("Integration", {
        beforeEach: function () {
            this.getCatalogTilesData = {
                "viz1234": {
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
                }
            };
            this.oLaunchPageAdapter = {
                getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData))
            };

            this.oVisualizationDataProviderService = {
                _getAdapter: sinon.stub().returns(this.oLaunchPageAdapter),
                _getCatalogTiles: sinon.stub().returns(Promise.resolve(this.getCatalogTilesData))
            };

            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };

            this.oVizData = {
                vizId: "viz1234",
                vizType: "tile",
                catalogTile: { The: "catalog tile" },
                previewMode: true,
                deferLoading: true
            };
        },

        afterEach: function () {
            VisualizationLoading.oCatalogTileRequest = undefined;
        }
    });

    QUnit.test("Tile instantiation (full test in local)", function (assert) {
        // Arrange
        var fnDone = assert.async();
        var oVizLoadingService = new VisualizationLoading();
        var oTilesDone = oVizLoadingService.loadVisualizationData();
        this.oVizData.deferLoading = false;
        assert.expect(2);

        // Act
        oTilesDone.then(function () {
            var oControl = oVizLoadingService.instantiateVisualization(this.oVizData);
            var sControlType = oControl.getMetadata().getName();
            assert.strictEqual(sControlType, "sap.ushell.ui.launchpad.VizInstanceLocal", "The correct control is returned.");

            oControl._getInnerControlPromise().then(function (oInnerControl) {
                assert.strictEqual(oInnerControl.sId, "__tile0");
            });
        }.bind(this)).finally(fnDone);
    });
});
