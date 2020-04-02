// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.GridContainer
 */
sap.ui.require([
    "sap/m/GenericTile",
    "sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
    "sap/ushell/ui/launchpad/Tile"
], function (
    GenericTile,
    KeyCodes,
    QUnitUtils,
    Tile
) {
    "use strict";

    /*global QUnit sinon*/

    QUnit.module("Tile defaults", {
        beforeEach: function () {
            this.oTile = new Tile();
        },
        afterEach: function () {
            this.oTile.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oTile.getProperty("long"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("uuid"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("tileCatalogId"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("isCustomTile"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("target"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("debugInfo"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("rgba"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("animationRendered"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("isLocked"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("showActionsIcon"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("tileActionModeActive"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("ieHtml5DnD"), false, "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("navigationMode"), "", "The correct value has been found.");
        assert.strictEqual(this.oTile.getProperty("isDraggedInTabBarToSourceGroup"), false, "The correct value has been found.");
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oTile.getAggregation("tileViews"), null, "The correct value has been found.");
        assert.strictEqual(this.oTile.getAggregation("pinButton"), null, "The correct value has been found.");
    });

    QUnit.test("default events", function (assert) {
        ["press", "coverDivPress", "afterRendering", "showActions", "deletePress"].forEach(function (sEventName) {
            // Arrange
            sEventName = sEventName.charAt(0).toUpperCase() + sEventName.slice(1);
            var bEventWasTriggerd;
            this.oTile["attach" + sEventName](function () {
                bEventWasTriggerd = true;
            });

            // Act
            this.oTile["fire" + sEventName]();

            // Assert
            assert.strictEqual(bEventWasTriggerd, true, "The " + sEventName + " event was fired and recieved.");
        }.bind(this));
    });

    QUnit.module("The function onBeforeRendering", {
        beforeEach: function () {
            this.oTile = new Tile();

            this.oGetDomrefStub = sinon.stub(this.oTile, "getDomRef");
        },
        afterEach: function () {
            this.oTile.destroy();
        }
    });

    QUnit.test("Does not throw if no DOM reference exists", function (assert) {
        assert.expect(0);

        this.oTile.onBeforeRendering();
    });

    QUnit.test("Does not throw if no inner link is found", function (assert) {
        // Arrange
        assert.expect(0);

        var oDomRef = {
            querySelector: sinon.stub()
        };
        this.oGetDomrefStub.returns(oDomRef);

        // Act
        this.oTile.onBeforeRendering();
    });

    QUnit.test("Sets the inner link's onclick property to null", function (assert) {
        // Arrange
        var oInnerLink = {};
        var oDomRef = {
            querySelector: function () {
                return oInnerLink;
            }
        };
        this.oGetDomrefStub.returns(oDomRef);

        // Act
        this.oTile.onBeforeRendering();

        // Assert
        assert.strictEqual(oInnerLink.onclick, null, "The onclick property has been correctly set.");
    });

    QUnit.module("The function onAfterRendering", {
        beforeEach: function () {
            this.oTile = new Tile();

            this.oIsDraggedStub = sinon.stub(this.oTile, "getIsDraggedInTabBarToSourceGroup");
            this.oRedrawStub = sinon.stub(this.oTile, "_redrawRGBA");
            this.oDisableLinkStub = sinon.stub(this.oTile, "_disableInnerLink");
        },
        afterEach: function () {
            this.oTile.destroy();
        }
    });

    QUnit.test("Removes the tile from the parent aggregation if it is dragged", function (assert) {
        // Arrange
        this.oIsDraggedStub.returns(true);
        var oRemoveAggregationStub = sinon.stub();
        var oTileContainer = {
            removeAggregation: oRemoveAggregationStub
        };

        sinon.stub(this.oTile, "getParent").returns(oTileContainer);

        // Act
        this.oTile.onAfterRendering();

        // Assert
        assert.strictEqual(oRemoveAggregationStub.callCount, 1, "The function removeAggregation has been called once.");
    });

    QUnit.test("Calls the function _redrawRGBA", function (assert) {
        // Arrange
        // Act
        this.oTile.onAfterRendering();

        // Assert
        assert.strictEqual(this.oRedrawStub.callCount, 1, "The function _redrawrRGBA has been called once.");
    });

    QUnit.test("Calls the function _disableInnerLink", function (assert) {
        // Arrange
        // Act
        this.oTile.onAfterRendering();

        // Assert
        assert.strictEqual(this.oDisableLinkStub.callCount, 1, "The function _disableInnerLink has been called once.");
    });

    QUnit.module("The function _disableInnerLink", {
        beforeEach: function () {
            this.oTile = new Tile();

            this.oQuerySelectorStub = sinon.stub();

            var oDomRef = {
                querySelector: this.oQuerySelectorStub
            };

            sinon.stub(this.oTile, "getDomRef").returns(oDomRef);
        },
        afterEach: function () {
            this.oTile.destroy();
        }
    });

    QUnit.test("Does not throw if no inner link is found", function (assert) {
        assert.expect(0);

        this.oTile._disableInnerLink();
    });

    QUnit.test("Sets the inner link's onclick property", function (assert) {
        // Arrange
        var oInnerLink = {};
        this.oQuerySelectorStub.returns(oInnerLink);

        // Act
        this.oTile._disableInnerLink();

        // Assert
        assert.strictEqual(typeof oInnerLink.onclick, "function", "The onclick property has been correctly added.");
    });

    QUnit.test("Prevents the default action if the inner link is clicked", function (assert) {
        // Arrange
        var oInnerLink = {};
        this.oQuerySelectorStub.returns(oInnerLink);
        this.oTile._disableInnerLink();

        var oPreventDefaultStub = sinon.stub();
        var oEvent = {
            preventDefault: oPreventDefaultStub
        };

        // Act
        oInnerLink.onclick(oEvent);

        // Assert
        assert.strictEqual(oPreventDefaultStub.callCount, 1, "The function preventDefault has been called once.");
    });

    QUnit.module("The function exit", {
        beforeEach: function () {
            this.oTile = new Tile({
                tileActionModeActive: true
            });
        },
        afterEach: function () {
            this.oTile.destroy();
        }
    });

    QUnit.test("ActionSheetIcon", function (assert) {
        // Assert
        assert.strictEqual(this.oTile.actionSheetIcon, undefined, "ActionSheetIcon is undefined");

        // Act
        var oActionSheetIcon = this.oTile.getActionSheetIcon();

        // Assert
        assert.strictEqual(this.oTile.actionSheetIcon, oActionSheetIcon, "ActionSheetIcon was created");

        // Act
        this.oTile.exit();

        // Assert
        assert.strictEqual(this.oTile.actionSheetIcon.bIsDestroyed, true, "ActionSheetIcon was destroyed");
    });

    QUnit.test("ActionIcon", function (assert) {
        // Assert
        assert.strictEqual(this.oTile.actionIcon, undefined, "ActionIcon is undefined");

        // Act
        this.oTile.setShowActionsIcon(true);

        // Assert
        assert.notEqual(this.oTile.actionIcon, undefined, "ActionIcon was created");

        // Act
        this.oTile.exit();

        // Assert
        assert.strictEqual(this.oTile.actionIcon.bIsDestroyed, true, "ActionIcon was destroyed");
    });

    QUnit.test("FailedToLoadViewText", function (assert) {
        // Assert
        assert.strictEqual(this.oTile.failedToLoadViewText, undefined, "FailedToLoadViewText is undefined");

        // Act
        var oFailedToLoadViewText = this.oTile.getFailedtoLoadViewText();

        // Assert
        assert.strictEqual(this.oTile.failedToLoadViewText, oFailedToLoadViewText, "FailedToLoadViewText was created");

        // Act
        this.oTile.exit();

        // Assert
        assert.strictEqual(this.oTile.failedToLoadViewText.bIsDestroyed, true, "FailedToLoadViewText was destroyed");
    });

    QUnit.module("Tile accessability", {
        beforeEach: function () {
            this.bEventWasTriggerd = false;
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oAccHelper = window.document.createElement("div");
            this.oAccHelper.setAttribute("id", "sapUshellLoadingAccessibilityHelper-appInfo");
            window.document.body.appendChild(this.oAccHelper);
            this.oTileView = new GenericTile({
                id: "tileViewId",
                press: function () {
                    this.bEventWasTriggerd = true;
                }.bind(this)
            });
            this.oTile = new Tile("tileId");
            this.oTile.addTileView(this.oTileView);
            this.oTile.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oTile.destroy();
            this.oTileView.destroy();
            window.document.body.removeChild(this.oContent);
            window.document.body.removeChild(this.oAccHelper);
        }
    });

    QUnit.test("SPACE", function (assert) {
        // Act
        QUnitUtils.triggerKeydown(this.oTile.getDomRef(), KeyCodes.SPACE);

        // Assert
        assert.strictEqual(this.bEventWasTriggerd, true, "Press event of TileView was fired.");
    });

    QUnit.test("ENTER", function (assert) {
        // Act
        QUnitUtils.triggerKeydown(this.oTile.getDomRef(), KeyCodes.ENTER);

        // Assert
        assert.strictEqual(this.bEventWasTriggerd, true, "Press event of TileView was fired.");
    });

    QUnit.test("focus", function (assert) {
        // Act
        this.oTile.focus();

        // Assert
        assert.strictEqual(
            this.oTile.getDomRef().getAttribute("aria-labelledby"),
            "sapUshellDashboardAccessibilityTileText tileViewId",
            "Accessabilitytext is correct."
        );
    });

    QUnit.module("Tile accessability with tileActionModeActive", {
        beforeEach: function () {
            this.bEventWasTriggerd = false;
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oAccHelper = window.document.createElement("div");
            this.oAccHelper.setAttribute("id", "sapUshellLoadingAccessibilityHelper-appInfo");
            window.document.body.appendChild(this.oAccHelper);
            this.oTileView = new GenericTile({
                id: "tileViewId",
                press: function () {
                    this.bEventWasTriggerd = true;
                }.bind(this)
            });
            this.oTile = new Tile({
                tileActionModeActive: true
            });
            this.oTile.addTileView(this.oTileView);
            this.oTile.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oTile.destroy();
            this.oTileView.destroy();
            window.document.body.removeChild(this.oContent);
            window.document.body.removeChild(this.oAccHelper);
        }
    });

    QUnit.test("SPACE", function (assert) {
        // Arrange
        var bEventWasTriggerd = false;
        this.oTile.attachCoverDivPress(function () {
            bEventWasTriggerd = true;
        });

        // Act
        QUnitUtils.triggerKeydown(this.oTile.getDomRef(), KeyCodes.SPACE);

        // Assert
        assert.strictEqual(bEventWasTriggerd, true, "CoverDivPress event was fired.");
    });

    QUnit.test("Enter", function (assert) {
        // Arrange
        var bEventWasTriggerd = false;
        this.oTile.attachCoverDivPress(function () {
            bEventWasTriggerd = true;
        });

        // Act
        QUnitUtils.triggerKeydown(this.oTile.getDomRef(), KeyCodes.ENTER);

        // Assert
        assert.strictEqual(bEventWasTriggerd, true, "CoverDivPress event was fired.");
    });
});