// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GridContainer
 */
QUnit.config.autostart = false;
sap.ui.require([
    "sap/ushell/ui/launchpad/GridContainer",
    "sap/ui/core/Control",
    "sap/f/GridContainer",
    "sap/f/GridContainerItemLayoutData",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ushell/utils",
    "sap/ui/integration/widgets/Card",
    "sap/m/library",
    "sap/f/GridContainerSettings",
], function (
    GridContainer,
    Control,
    Ui5GridContainer,
    Ui5GridContainerItemLayoutData,
    Tile,
    UshellUtils,
    Card,
    library,
    GridContainerSettings
) {
    "use strict";

    var HeaderLevel = library.HeaderLevel;

    /*global QUnit sinon*/
    QUnit.start();
    QUnit.module("The GridContainer", {
        beforeEach: function () {
            this.oGridContainer = new GridContainer();
            this.oGrid = this.oGridContainer.getAggregation("_grid");
        },
        afterEach: function () {
            this.oGridContainer.destroy();
            this.oGridContainer = null;
        }
    });

    QUnit.test("Default Values", function (assert) {
        assert.strictEqual(this.oGridContainer.getGroupId(), "", "Default 'groupId' value is ''");
        assert.strictEqual(this.oGridContainer.getShowHeader(), true, "Default 'showHeader' value is true");
        assert.strictEqual(this.oGridContainer.getDefaultGroup(), false, "Default 'defaultGroup' value is false");
        assert.strictEqual(this.oGridContainer.getIsLastGroup(), false, "Default 'isLastGroup' value is false");
        assert.strictEqual(this.oGridContainer.getHeaderText(), "", "Default 'headerText' value is ''");
        assert.strictEqual(this.oGridContainer.getHeaderLevel(), HeaderLevel.H2, "Default 'headerLevel' value is sap.m.HeaderLevel.H2");
        assert.strictEqual(this.oGridContainer.getGroupHeaderLevel(), HeaderLevel.H4, "Default 'groupHeaderLevel' value is sap.m.HeaderLevel.H4");
        assert.strictEqual(this.oGridContainer.getShowGroupHeader(), true, "Default 'showGroupHeader' value is sap.m.HeaderLevel.H4");
        assert.strictEqual(this.oGridContainer.getHomePageGroupDisplay(), "", "Default 'homePageGroupDisplay' value is ''");
        assert.strictEqual(this.oGridContainer.getIsGroupLocked(), false, "Default 'isGroupLocked' value is false");
        assert.strictEqual(this.oGridContainer.getIsGroupSelected(), false, "Default 'isGroupSelected' value is false");
        assert.strictEqual(this.oGridContainer.getEditMode(), false, "Default 'editMode' value is false");
        assert.strictEqual(this.oGridContainer.getShowBackground(), false, "Default 'showBackground' value is false");
        assert.strictEqual(this.oGridContainer.getIcon(), "sap-icon://locked", "Default 'icon' value is 'sap-icon://locked'");
        assert.strictEqual(this.oGridContainer.getShowIcon(), false, "Default 'showIcon' value is false");
        assert.strictEqual(this.oGridContainer.getEnableHelp(), false, "Default 'enableHelp' value is false");
        assert.strictEqual(this.oGridContainer.getTileActionModeActive(), false, "Default 'tileActionModeActive' value is false");
        assert.strictEqual(this.oGridContainer.getIeHtml5DnD(), false, "Default 'ieHtml5DnD' value is false");
        assert.strictEqual(this.oGridContainer.getShowEmptyLinksArea(), false, "Default 'showEmptyLinksArea' value is false");
        assert.strictEqual(this.oGridContainer.getShowEmptyLinksAreaPlaceHolder(), false, "Default 'showEmptyLinksAreaPlaceHolder' value is false");
        assert.strictEqual(this.oGridContainer.getSupportLinkPersonalization(), false, "Default 'supportLinkPersonalization' value is false");
        assert.strictEqual(this.oGridContainer.getTileSizeBehavior(), "Responsive", "Default 'tileSizeBehavior' value is 'Responsive'");
        assert.strictEqual(this.oGrid.getSnapToRow(), true, "Default 'snapToRow' value is true");
    });

    QUnit.test("Creates a sap.f.GridContainer instance in the hidden _grid aggregation", function (assert) {
        assert.ok(this.oGridContainer.getAggregation("_grid") instanceof Ui5GridContainer, "A sap.f.GridContainer is created");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the default layout aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayout();

        // Act
        // Assert
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the layoutXS aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayoutXS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the layoutS aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayoutS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the layoutM aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayoutM();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 6, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the layoutL aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayoutL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 10, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Creates a sap.f.GridContainer instance with correct properties for the layoutXL aggregation", function (assert) {
        // Arrange
        var oSettings = this.oGrid.getLayoutXL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 14, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the default layout aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayout();

        // Act
        // Assert
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the layoutXS aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayoutXS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the layoutS aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayoutS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the layoutM aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayoutM();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 6, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the layoutL aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayoutL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 10, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets responsive TileSizeBehavior, breakpoints enabled and correct properties for the layoutXL aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Responsive");
        var oSettings = this.oGrid.getLayoutXL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 14, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "5.25rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the default layout aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayout();

        // Act
        // Assert
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the layoutXS aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayoutXS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the layoutS aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayoutS();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 4, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the layoutM aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayoutM();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 6, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the layoutL aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayoutL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 12, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.test("Sets small TileSizeBehavior, breakpoints enabled and correct properties for the layoutXL aggregation", function (assert) {
        // Arrange
        this.oGridContainer.setTileSizeBehavior("Small");
        var oSettings = this.oGrid.getLayoutXL();

        // Act
        // Assert
        assert.strictEqual(oSettings.getColumns(), 16, "The correct value has been found.");
        assert.strictEqual(oSettings.getRowSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getColumnSize(), "4.375rem", "The correct value has been found.");
        assert.strictEqual(oSettings.getGap(), "0.5rem", "The correct value has been found.");
    });

    QUnit.module("The function _getInternalGrid", {
        beforeEach: function () {
            this.oGridContainer = new GridContainer();
            this.oGetAggregationStub = sinon.stub(this.oGridContainer, "getAggregation");
        },
        afterEach: function () {
            this.oGridContainer.destroy();
            this.oGridContainer = null;
            this.oGetAggregationStub.restore();
            this.oGetAggregationStub = null;
        }
    });

    QUnit.test("Calls the getAggregation with parameter '_grid'", function (assert) {
        // Act
        this.oGridContainer._getInternalGrid();

        // Assert
        assert.strictEqual(this.oGetAggregationStub.callCount, 1, "The function getAggregation is called");
        assert.strictEqual(this.oGetAggregationStub.getCall(0).args[0], "_grid", "The function getAggregation is called with the parameter '_grid'");
    });

    QUnit.test("Returns the aggregation '_grid'", function (assert) {
        // Arrange
        var oGrid = {};
        this.oGetAggregationStub.returns(oGrid);

        // Act
        var oResult = this.oGridContainer._getInternalGrid();

        // Assert
        assert.strictEqual(oResult, oGrid, "The aggregation '_grid' is returned");
    });

    QUnit.module("The function addAggregation", {
        beforeEach: function () {
            this.oGridContainer = new GridContainer({
                tiles: [
                    new Tile({id: "item1"}),
                    new Tile({id: "item2"})
                ]
            });
            this.oAddItemLayoutDataStub = sinon.stub(this.oGridContainer, "_addItemLayoutData");
        },
        afterEach: function () {
            this.oGridContainer.destroy();
            this.oGridContainer = null;
            this.oAddItemLayoutDataStub.restore();
            this.oAddItemLayoutDataStub = null;
        }
    });

    QUnit.test("Calls the addAggregation function of the superclass", function (assert) {
        // Arrange
        var oControlStub = sinon.stub(Control.prototype, "addAggregation");

        // Act
        this.oGridContainer.addAggregation();

        // Assert
        assert.strictEqual(oControlStub.callCount, 1, "The function addAggregation of the superclass is called");

        oControlStub.restore();
    });


    QUnit.test("Adds an tiles to grid container", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);

        // Act
        this.oGridContainer.addAggregation("tiles", oItem);

        // Assert
        var aItems = this.oGridContainer.getTiles();
        assert.strictEqual(aItems.length, 3, "One item is added");
        assert.strictEqual(aItems[2].getId(), sTestItemId, "The item is added");
    });

    QUnit.test("Calls the function _addItemlayoutData when sAggregationName === 'tiles'", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);

        // Act
        this.oGridContainer.addAggregation("tiles", oItem);

        // Assert
        assert.strictEqual(this.oAddItemLayoutDataStub.callCount, 1, "The function _addItemLayoutData is called");
    });

    QUnit.test("Does not call the function _addItemlayoutData when sAggregationName !== 'tiles'", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);
        // Act
        this.oGridContainer.addAggregation("links", oItem);

        // Assert
        assert.strictEqual(this.oAddItemLayoutDataStub.callCount, 0, "The function _addItemLayoutData is not called");
    });

    QUnit.test("Returns this for method chaining", function (assert) {
        // Act
        var oResult = this.oGridContainer.addAggregation();

        // Assert
        assert.strictEqual(oResult, this.oGridContainer, "'this' is returned");
    });

    QUnit.module("The function insertAggregation", {
        beforeEach: function () {
            this.oGridContainer = new GridContainer({
                tiles: [
                    new Tile({id: "item1"}),
                    new Tile({id: "item2"})
                ]
            });
            this.oAddItemLayoutDataStub = sinon.stub(this.oGridContainer, "_addItemLayoutData");
        },
        afterEach: function () {
            this.oGridContainer.destroy();
            this.oGridContainer = null;
            this.oAddItemLayoutDataStub.restore();
            this.oAddItemLayoutDataStub = null;
        }
    });

    QUnit.test("Calls the insertAggregation function of the superclass", function (assert) {
        // Arrange
        var oControlStub = sinon.stub(Control.prototype, "insertAggregation");

        // Act
        this.oGridContainer.insertAggregation();

        // Assert
        assert.strictEqual(oControlStub.callCount, 1, "The function insertAggregation of the superclass is called");

        oControlStub.restore();
    });

    QUnit.test("Calls the function _addItemlayoutData when sAggregationName === 'tiles'", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);

        // Act
        this.oGridContainer.insertAggregation("tiles", oItem);

        // Assert
        assert.strictEqual(this.oAddItemLayoutDataStub.callCount, 1, "The function _addItemLayoutData is called");
    });

    QUnit.test("Does not call the function _addItemlayoutData when sAggregationName !== 'tiles'", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);

        // Act
        this.oGridContainer.insertAggregation("links", oItem);

        // Assert
        assert.strictEqual(this.oAddItemLayoutDataStub.callCount, 0, "The function _addItemLayoutData is not called");
    });

    QUnit.test("Inserts an item to grid container", function (assert) {
        // Arrange
        var sTestItemId = "item-test",
            oItem = new Tile(sTestItemId);

        // Act
        this.oGridContainer.insertAggregation("tiles", oItem, 1);

        var aItems = this.oGridContainer.getTiles();

        // Assert
        assert.strictEqual(aItems.length, 3, "One item is inserted");
        assert.strictEqual(aItems[1].getId(), sTestItemId, "The item is inserted with index 1");
    });

    QUnit.test("Returns this for method chaining", function (assert) {
        // Act
        var oResult = this.oGridContainer.insertAggregation();

        // Assert
        assert.strictEqual(oResult, this.oGridContainer, "'this' is returned");
    });

    QUnit.module("The function _addItemLayoutData", {
        beforeEach: function () {
            this.oGridContainer = new GridContainer({});
        },
        afterEach: function () {
            this.oGridContainer.destroy();
            this.oGridContainer = null;
        }
    });

    QUnit.test("Adds layout data to an item", function (assert) {
        // Arrange
        var oItem = new Tile();

        // Act
        this.oGridContainer._addItemLayoutData(oItem);

        // Assert
        var oItemLayoutData = oItem.getLayoutData();
        var oBindingInfo = oItemLayoutData.getBindingInfo("columns");

        assert.ok(oItemLayoutData instanceof Ui5GridContainerItemLayoutData, "The grid item layout data is added");
        assert.strictEqual(oItemLayoutData.getRows(), 2, "The grid row is set");
        assert.strictEqual(oBindingInfo.formatter, GridContainer._getItemLayoutColumn, "The formatter function is correct");
        assert.strictEqual(oBindingInfo.parts[0].path, "long", "The binding path is 'long'");
    });

    QUnit.test("Adds layout data to a card", function (assert) {
        // Arrange
        var oCard = new Card(),
            oGetMemberStub = sinon.stub(UshellUtils, "getMember").returns("4"),
            oGetManifestStub = sinon.stub(oCard, "getManifest");

        // Act
        this.oGridContainer._addItemLayoutData(oCard);

        // Assert
        var oItemLayoutData = oCard.getLayoutData();

        assert.ok(oGetManifestStub.callCount, 1, "The getManifest method of Card is called");
        assert.strictEqual(oGetMemberStub.callCount, 2, "The getMember method of UshellUtils is called");
        assert.strictEqual(oItemLayoutData.getRows(), 4, "The grid row is set");
        assert.strictEqual(oItemLayoutData.getColumns(), 4, "The grid column is set");
        oGetMemberStub.restore();
    });

    QUnit.test("Adds layout data to a card which has no size info", function (assert) {
        // Arrange
        var oCard = new Card(),
            oGetMemberStub = sinon.stub(UshellUtils, "getMember"),
            oGetManifestStub = sinon.stub(oCard, "getManifest");

        // Act
        this.oGridContainer._addItemLayoutData(oCard);

        // Assert
        var oItemLayoutData = oCard.getLayoutData();

        assert.ok(oGetManifestStub.callCount, 1, "The getManifest method of Card is called");
        assert.strictEqual(oGetMemberStub.callCount, 2, "The getMember method of UshellUtils is called");
        assert.strictEqual(oItemLayoutData.getRows(), 3, "The grid row is set to default value");
        assert.strictEqual(oItemLayoutData.getColumns(), 3, "The grid column is set to default value");
        oGetMemberStub.restore();
    });

    QUnit.module("The function _getItemLayoutColumn");

    QUnit.test("Return 'span 4' when bLong = true", function (assert) {
        // Act
        var sColumn = GridContainer._getItemLayoutColumn(true);

        // Assert
        assert.strictEqual(sColumn, 4, "The correct layout column is returned");
    });

    QUnit.test("Return 'span 2' when bLong = false", function (assert) {
        // Act
        var sColumn = GridContainer._getItemLayoutColumn(false);

        // Assert
        assert.strictEqual(sColumn, 2, "The correct layout column is returned");
    });

    QUnit.module("The _generateSetting");

    QUnit.test("Returns an instance of GridContainerSettings with given configuration", function (assert) {
        // Act
        var oResult = GridContainer._generateSetting("4.375rem", 4);

        // Assert
        assert.ok(oResult instanceof GridContainerSettings, "An instance of GridContainerSettings has been returned");
        assert.equal(oResult.getProperty("columns"), 4, "The property 'columns' of the GridContainerSettings instance has been set correctly");
        assert.equal(oResult.getProperty("rowSize"), "4.375rem", "The property 'rowSize' of the GridContainerSettings instance has been set correctly");
        assert.equal(oResult.getProperty("columnSize"), "4.375rem", "The property 'columnSize' of the GridContainerSettings instance has been set correctly");
        assert.equal(oResult.getProperty("gap"), "0.5rem", "The property 'gap' of the GridContainerSettings instance has been set correctly");
    });
});