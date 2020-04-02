// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationDataProvider
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/services/VisualizationDataProvider",
    "sap/ushell/resources"
],
function (VisualizationDataProvider, resources) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor");

    QUnit.test("Sets the right class properties", function (assert) {
        // Arrange
        var oLaunchPageAdapter = {
            getCatalogTileId: function () { }
        };

        // Act
        var oService = new VisualizationDataProvider(oLaunchPageAdapter);

        // Assert
        assert.strictEqual(oService.oLaunchPageAdapter, oLaunchPageAdapter, "The constructor sets the oLaunchPageAdapter property correctly.");
        assert.equal(oService.S_COMPONENT_NAME, "sap.ushell.services.VisualizationDataProvider", "The component name is set correctly.");
    });

    QUnit.module("The function getVisualizationData", {
        beforeEach: function () {
            var aCatalogs = [
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:/UI2/CONFIG_NAVIGATION_MODE",
                    title: "Configuration for in-place navigation of classic UIs",
                    tiles: [],
                    ui2catalog: {}
                },
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                    title: "/UI2/FLP_DEMO_CLIENT_TRESOLUTION",
                    tiles: [
                        {
                            id: 1,
                            title: "Tile 1",
                            subtitle: "Subtitle tile 1",
                            icon: "sap-icon://add",
                            info: "",
                            size: "1x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service1/$count",
                                refresh: 200
                            },
                            isCustomTile: false
                        },
                        {

                            id: 2,
                            title: "Tile 2",
                            subtitle: "Subtitle tile 2",
                            icon: "sap-icon://mail",
                            info: "info 2",
                            size: "2x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service2/$count",
                                refresh: 800
                            },
                            isCustomTile: false
                        },
                        {
                            id: 3,
                            title: "Tile 3",
                            subtitle: "Subtitle tile 3",
                            icon: "sap-icon://documents",
                            info: "info 3",
                            size: "1x2",
                            indicatorDataSource: {
                                path: "url/to/odata/service3/$count"
                            },
                            isCustomTile: true
                        },
                        {
                            id: 5,
                            title: "Tile 5",
                            subtitle: "Subtitle tile 5",
                            icon: "sap-icon://workflow",
                            info: "",
                            size: "2x2",
                            indicatorDataSource: undefined,
                            isCustomTile: false,
                            url: "www.sap.url.com"
                        }
                    ],
                    ui2catalog: {}
                },
                {
                    data: {},
                    id: "X-SAP-UI2-CATALOGPAGE:SAP_PRC_BC_PURCHASER_PIR",
                    title: "Purchasing - Source Assignment",
                    tiles: [
                        {
                            id: 4,
                            title: "Tile 4",
                            subtitle: "Subtitle tile 4",
                            icon: "sap-icon://workflow",
                            info: "",
                            size: "2x2",
                            indicatorDataSource: undefined,
                            isCustomTile: true
                        }
                    ],
                    ui2catalog: {}
                }
            ];

            this.oLaunchPageGetCatalogsStub = sinon.stub().returns(
                new jQuery.Deferred().resolve(aCatalogs).promise()
            );

            var oAdapterStub = {
                getCatalogs: this.oLaunchPageGetCatalogsStub,
                getCatalogTiles: function (catalog) { return new jQuery.Deferred().resolve(catalog.tiles).promise(); },
                getCatalogTileId: function (tile) { return tile.id; },
                getCatalogTilePreviewTitle: function (tile) { return tile.title; },
                getCatalogTilePreviewSubtitle: function (tile) { return tile.subtitle; },
                getCatalogTilePreviewIcon: function (tile) { return tile.icon; },
                getCatalogTilePreviewInfo: function (tile) { return tile.info; },
                getCatalogTileSize: function (tile) { return tile.size; },
                getCatalogTilePreviewIndicatorDataSource: function (tile) { return tile.indicatorDataSource; },
                getCatalogTileTargetURL: function (tile) { return tile.url || undefined; },
                isCustomTile: function (tile) { return tile.isCustomTile; }
            };

            this.oService = new VisualizationDataProvider(oAdapterStub);
            this.oResourceI18nGetTextStub = sinon.stub(resources.i18n, "getText").returns("This is the translated error message.");
        },
        afterEach: function () {
            this.oResourceI18nGetTextStub.restore();
        }
    });

    QUnit.test("Returns a promise containing an object of formatted catalog tiles", function (assert) {
        // Arrange
        var oExpectedCatalogTiles = {
            1: {
                icon: "sap-icon://add",
                info: "",
                size: "1x2",
                subTitle: "Subtitle tile 1",
                title: "Tile 1",
                isCustomTile: false,
                indicatorDataSource: {
                    path: "url/to/odata/service1/$count",
                    refresh: 200
                },
                url: undefined
            },
            2: {
                icon: "sap-icon://mail",
                info: "info 2",
                size: "2x2",
                subTitle: "Subtitle tile 2",
                title: "Tile 2",
                isCustomTile: false,
                indicatorDataSource: {
                    path: "url/to/odata/service2/$count",
                    refresh: 800
                },
                url: undefined
            },
            3: {
                icon: "sap-icon://documents",
                info: "info 3",
                size: "1x2",
                subTitle: "Subtitle tile 3",
                title: "Tile 3",
                isCustomTile: true,
                indicatorDataSource: {
                    path: "url/to/odata/service3/$count"
                },
                url: undefined
            },
            4: {
                icon: "sap-icon://workflow",
                info: "",
                size: "2x2",
                subTitle: "Subtitle tile 4",
                title: "Tile 4",
                isCustomTile: true,
                indicatorDataSource: undefined,
                url: undefined
            },
            5: {
                title: "Tile 5",
                subTitle: "Subtitle tile 5",
                icon: "sap-icon://workflow",
                info: "",
                size: "2x2",
                indicatorDataSource: undefined,
                isCustomTile: false,
                url: "www.sap.url.com"
            }
        };

        // Act
        return this.oService.getVisualizationData().then(function (catalogTiles) {
            assert.deepEqual(catalogTiles, oExpectedCatalogTiles, "The function returns correctly formatted catalog tiles.");
        });
    });

    QUnit.test("Rejects the promise when the LaunchPageAdapter throws an error.", function (assert) {
        // Arrange
        this.oLaunchPageGetCatalogsStub.returns(new jQuery.Deferred().reject("LaunchPageAdapter error").promise());
        var oExpectedError = {
            "component": "sap.ushell.services.VisualizationDataProvider",
            "description": "This is the translated error message.",
            "detail": "LaunchPageAdapter error"
        };

        // Act
        return this.oService.getVisualizationData().catch(function (error) {
            assert.ok(this.oResourceI18nGetTextStub.calledOnce, "The getText of resource.i18n is called once");
            assert.deepEqual(this.oResourceI18nGetTextStub.getCall(0).args, ["VisualizationDataProvider.CannotLoadData"], "The getText of resource.i18n is called with correct parameters");
            assert.deepEqual(error, oExpectedError, "The function returns a rejected promise containing an error message.");
        }.bind(this));
    });

    QUnit.module("The function getVisualizationView", {
        beforeEach: function () {
            this.oService = new VisualizationDataProvider({});
        }
    });

    QUnit.test("Returns the visualization view for a visualization ID", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);

        var oCatalogTiles = {
            "12345": {
                "The": "catalog tile"
            }
        };
        this.oService.oCatalogTilePromise = Promise.resolve(oCatalogTiles);
        var oCatalogTileView = {
            "The": "catalog tile view"
        };
        this.oService.oLaunchPageAdapter.getCatalogTileView = sinon.stub().withArgs(oCatalogTiles["12345"]).returns(oCatalogTileView);

        // Act
        this.oService.getVisualizationView("12345")
        .then(function (oVisualizationView) {
            // Assert
            assert.deepEqual(oVisualizationView, oCatalogTileView, "The catalog tile view is returned");
        })
        .finally(done);
    });

    QUnit.test("Rejects with an error message if the visualization is not found", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);

        var oCatalogTiles = {};
        this.oService.oCatalogTilePromise = Promise.resolve(oCatalogTiles);

        // Act
        this.oService.getVisualizationView("12345")
        .catch(function (sError) {
            // Assert
            assert.ok(sError, "An error message is returned");
        })
        .finally(done);
    });

    QUnit.test("Rejects with an error message if catalog tiles cannot be read", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);

        this.oService.oCatalogTilePromise = Promise.reject();

        // Act
        this.oService.getVisualizationView("12345")
        .catch(function (sError) {
            // Assert
            assert.ok(true, "The promise is rejected");
        })
        .finally(done);
    });

    QUnit.test("Asks for a visualization in non preview mode as default", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);

        var oCatalogTiles = {
            "12345": {
                "The": "catalog tile"
            }
        };
        this.oService.oCatalogTilePromise = Promise.resolve(oCatalogTiles);

        this.oService.oLaunchPageAdapter.getCatalogTileView = sinon.stub().returns({});

        // Act
        this.oService.getVisualizationView("12345")
        .then(function (oView) {
            // Assert
            assert.ok(this.oService.oLaunchPageAdapter.getCatalogTileView.calledWithExactly(oCatalogTiles["12345"], false), "The non-preview visualization is requested.");
        }.bind(this))
        .finally(done);
    });

    QUnit.test("Returns a visualization in preview mode if requested", function (assert) {
        // Arrange
        var done = assert.async();
        assert.expect(1);

        var oCatalogTiles = {
            "12345": {
                "The": "catalog tile"
            }
        };
        this.oService.oCatalogTilePromise = Promise.resolve(oCatalogTiles);

        this.oService.oLaunchPageAdapter.getCatalogTileView = sinon.stub().returns({});

        // Act
        this.oService.getVisualizationView("12345", true)
        .then(function (oView) {
            // Assert
            assert.ok(this.oService.oLaunchPageAdapter.getCatalogTileView.calledWithExactly(oCatalogTiles["12345"], true), "The non-preview visualization is requested.");
        }.bind(this))
        .finally(done);
    });

    QUnit.test("_getAdapter returns the current adapter", function (assert) {
        // Arrange
        assert.expect(1);

        var oAdapter = this.oService._getAdapter();

        assert.strictEqual(oAdapter, this.oService.oLaunchPageAdapter, "The correct adapter was returned");
    });
});
