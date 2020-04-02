// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.VisualizationLoader
 */

/* global QUnit, sinon */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/m/GenericTile",
    "sap/ushell/services/_VisualizationLoading/VizInstanceDefault"
], function (
    GenericTile,
    VizInstanceDefault
) {
    "use strict";

    QUnit.start();
    QUnit.module("The constructor", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {};
            this.oServiceStub = sinon.stub().returns();
            sap.ushell.Container = {
                getService: this.oServiceStub
            };

            this.oVizData = {
                visualizationId: "viz1234",
                vizType: "card",
                catalogTile: {
                    "The": "catalog tile"
                },
                previewMode: true
            };
        }
    });

    QUnit.test("returns the correct control", function (assert) {
        // Act
        var oInstance = new VizInstanceDefault(this.oVizData);
        var sInstanceControlType = oInstance.getMetadata().getName();
        // Assert
        assert.strictEqual(sInstanceControlType, "sap.ushell.ui.launchpad.VizInstanceDefault", "The correct control is returned.");
        assert.ok(this.oServiceStub.notCalled, "The Adapter wasn't loaded");
    });

    QUnit.test("stores the initialization data correctly", function (assert) {
        // Act
        var oInstance = new VizInstanceDefault(this.oVizData);

        // Assert
        assert.ok(this.oServiceStub.notCalled, "The Adapter wasn't loaded");
        assert.strictEqual(oInstance.getVisualizationId(), this.oVizData.visualizationId);
        assert.strictEqual(oInstance.getVizType(), this.oVizData.vizType);
        assert.strictEqual(oInstance.getCatalogTile(), this.oVizData.catalogTile);
    });

    QUnit.module("Visualization methods", {
        beforeEach: function () {
            this.oLaunchPageAdapterData = {
                title: "VizTitle",
                subtitle: "Viz Subtitle",
                icon: "🤷",
                keywords: [],
                info: "very informative",
                type: "superTile",
                height: 56,
                width: 12,
                id: "test",
                url: "my-url",
                isCustomTile: true
            };
            this.oLaunchPageAdapter = {
                getCatalogTilePreviewTitle: sinon.stub().returns(this.oLaunchPageAdapterData.title),
                getCatalogTilePreviewSubtitle: sinon.stub().returns(this.oLaunchPageAdapterData.subtitle),
                getCatalogTilePreviewIcon: sinon.stub().returns(this.oLaunchPageAdapterData.icon),
                getCatalogTileKeywords: sinon.stub().returns(this.oLaunchPageAdapterData.keywords),
                getCatalogTilePreviewInfo: sinon.stub().returns(this.oLaunchPageAdapterData.info),
                getTileType: sinon.stub().returns(this.oLaunchPageAdapterData.type),
                setTileVisible: sinon.stub().returns(undefined),
                refresh: sinon.stub().returns(undefined),
                getTileSize: sinon.stub().returns(this.oLaunchPageAdapterData.height + "x" + this.oLaunchPageAdapterData.width),
                getTileId: sinon.stub().returns(this.oLaunchPageAdapterData.id),
                getCatalogTileTargetURL: sinon.stub().returns(this.oLaunchPageAdapterData.url),
                isCustomTile: sinon.stub().returns(this.oLaunchPageAdapterData.isCustomTile)
            };
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
                    "The": "catalog tile"
                },
                previewMode: true
            };
            // Arrange (same for all tests)
            this.oInstance = new VizInstanceDefault(this.oVizData);
            this.oInstance.setAdapter(this.oLaunchPageAdapter);
        },
        afterEach: function () {
            this.oInstance.destroy();
        }
    });

    QUnit.test("getVisualizationId", function (assert) {
        // Act
        var sVisualizationId = this.oInstance.getVisualizationId();

        // Assert
        assert.strictEqual(sVisualizationId, this.oVizData.visualizationId);
    });

    QUnit.test("getTitle delegates to the adapter", function (assert) {
        // Act
        var sTitle = this.oInstance.getTitle();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTilePreviewTitle.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sTitle, this.oLaunchPageAdapterData.title, "Correct title was returned");
    });

    QUnit.test("getSubtitle delegates to the adapter", function (assert) {
        // Act
        var sSubtitle = this.oInstance.getSubtitle();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTilePreviewSubtitle.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sSubtitle, this.oLaunchPageAdapterData.subtitle, "Correct subtitle was returned");
    });

    QUnit.test("getIcon delegates to the adapter", function (assert) {
        // Act
        var sIcon = this.oInstance.getIcon();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTilePreviewIcon.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sIcon, this.oLaunchPageAdapterData.icon, "Correct icon was returned");
    });

    QUnit.test("getKeywords delegates to the adapter", function (assert) {
        // Act
        var aKeywords = this.oInstance.getKeywords();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTileKeywords.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.deepEqual(aKeywords, this.oLaunchPageAdapterData.keywords, "Correct keywords were returned");
    });

    QUnit.test("getInfo delegates to the adapter", function (assert) {
        // Act
        var sFooter = this.oInstance.getFooter();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTilePreviewInfo.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sFooter, this.oLaunchPageAdapterData.info, "Correct footer was returned");
    });

    QUnit.test("getType delegates to the adapter", function (assert) {
        // Act
        var sType = this.oInstance.getType();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getTileType.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sType, this.oLaunchPageAdapterData.type, "Correct type was returned");
    });

    QUnit.test("getType defaults to getVizType if the adapter does not provide a getTileType function", function (assert) {
        // Arrange
        var sVizType = "default",
            oGetVizTypeStub = sinon.stub(this.oInstance, "getVizType").returns(sVizType);
        this.oLaunchPageAdapter.getTileType = false;

        // Act
        var sType = this.oInstance.getType();

        // Assert
        assert.ok(oGetVizTypeStub.called, "getVizType was called");
        assert.strictEqual(sType, sVizType, "Correct type was returned");

        // Cleanup
        oGetVizTypeStub.restore();
    });

    QUnit.test("refresh delegates to the adapter", function (assert) {
        // Act
        this.oInstance.refresh();

        // Assert
        assert.ok(this.oLaunchPageAdapter.refresh.calledWith(this.oVizData.catalogTile), "The adapter was called");
    });

    QUnit.test("getHeight returns the height", function (assert) {
        // Act
        var iHeight = this.oInstance.getHeight();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getTileSize.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(iHeight, this.oLaunchPageAdapterData.height, "Correct height was returned");
    });

    QUnit.test("getWidth returns the width", function (assert) {
        // Act
        var iWidth = this.oInstance.getWidth();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getTileSize.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(iWidth, this.oLaunchPageAdapterData.width, "Correct width was returned");
    });

    QUnit.test("getLayout returns the correct Layout data for a tile", function (assert) {
        // Arrange
        var oExpectedLayout = {
            rows: this.oLaunchPageAdapterData.height * 2,
            columns: this.oLaunchPageAdapterData.width * 2
        };

        // Act
        var oLayout = this.oInstance.getLayout();

        // Assert
        assert.deepEqual(oLayout, oExpectedLayout, "Correct layout was returned");
    });

    QUnit.test("isCustomTile returns true if custom tile", function (assert) {
        // Act
        var bIsCustomTile = this.oInstance.isCustomTile();

        // Assert
        assert.ok(this.oLaunchPageAdapter.isCustomTile.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(bIsCustomTile, this.oLaunchPageAdapterData.isCustomTile, "Correct value for isCustomTile was returned");
    });

    QUnit.test("getTarget delegates to the adapter", function (assert) {
        // Act
        var sTarget = this.oInstance.getTarget();

        // Assert
        assert.ok(this.oLaunchPageAdapter.getCatalogTileTargetURL.calledWith(this.oVizData.catalogTile), "The adapter was called");
        assert.strictEqual(sTarget, this.oLaunchPageAdapterData.url, "Correct targetURL was returned");
    });

    QUnit.module("setActive", {
        beforeEach: function () {
            this.oInstance = new VizInstanceDefault();
            this.oInstance.setAdapter(sinon.stub().returns());

            this.oVisibleHandlerStub = sinon.stub();
            this.oRefreshHandlerStub = sinon.stub();
            this.oGetInnerControlStub = sinon.stub(this.oInstance, "getInnerControl").returns({
                getController: sinon.stub().returns({
                    visibleHandler: this.oVisibleHandlerStub,
                    refreshHandler: this.oRefreshHandlerStub
                })
            });
            this.oSetVisibleStub = sinon.stub();
            this.oGetCatalogTileStub = sinon.stub(this.oInstance, "getCatalogTile").returns({
                getContract: sinon.stub().withArgs("visible").returns({
                    setVisible: this.oSetVisibleStub
                })
            });
        },
        afterEach: function () {
            this.oGetInnerControlStub.restore();
            this.oGetCatalogTileStub.restore();
            delete sap.ushell.Container;
            this.oInstance.destroy();
        }
    });

    QUnit.test("sets the tile to inactive in the tile controller and chip contract", function (assert) {
        // Arrange
        // Act
        this.oInstance.setActive(false);

        // Assert
        assert.strictEqual(this.oVisibleHandlerStub.firstCall.args[0], false, "Active state was set on the controller");
        assert.strictEqual(this.oSetVisibleStub.firstCall.args[0], false, "Active state was set on the contract");
        assert.strictEqual(this.oRefreshHandlerStub.called, false, "Tile was not refreshed");
    });

    QUnit.test("sets the tile to active in the tile controller and chip contract and refreshes the tile immediately if requested", function (assert) {
        // Arrange
        // Act
        this.oInstance.setActive(true, true);

        // Assert
        assert.strictEqual(this.oVisibleHandlerStub.firstCall.args[0], true, "Active state was set on the controller");
        assert.strictEqual(this.oSetVisibleStub.firstCall.args[0], true, "Active state was set on the contract");
        assert.strictEqual(this.oRefreshHandlerStub.called, true, "Tile was refreshed");
    });


    QUnit.test("does not throw when no catalog tile is attached", function (assert) {
        // Arrange
        this.oGetCatalogTileStub.returns();
        // Act
        this.oInstance.setActive(false, true);

        // Assert
        assert.ok("No exception was raised");
        assert.strictEqual(this.oSetVisibleStub.notCalled, true, "Active state was not set on the contract");
        assert.strictEqual(this.oRefreshHandlerStub.called, false, "Tile was not refreshed");
    });

    QUnit.test("does not throw when the controller does not provide a visibleHandler", function (assert) {
        // Arrange
        this.oVisibleHandlerStub = null;
        // Act
        this.oInstance.setActive(false);

        // Assert
        assert.ok(true, "No exception was raised");
    });

    QUnit.module("Visualization view", {
        beforeEach: function () {
            this.oLaunchPageAdapter = {
            };
            this.oGetAdapter = sinon.stub().returns(this.oLaunchPageAdapter);
            this.oVisualizationDataProviderService = {
                getVisualizationView: sinon.stub().returns(Promise.resolve(
                    new GenericTile({
                        header: "The View!"
                    })
                )),
                _getAdapter: this.oGetAdapter
            };
            sap.ushell.Container = {
                getService: sinon.stub().returns(this.oVisualizationDataProviderService)
            };
            }
    });

    QUnit.test("load", function (assert) {
        // Arrange
        var oInstance = new VizInstanceDefault(this.oVizData);

        // Act
        var oViewPromise = oInstance.load();

        // Assert
        return oViewPromise.then(function (oView) {
            assert.strictEqual(oView.sId, "__tile0");
            assert.strictEqual(oView.getHeader(), "The View!", "The correct view was returned!");
            assert.ok(this.oGetAdapter.called, "Load stores the adapter");
        }.bind(this));
    });
});