// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview QUnit tests for sap.ushell.ui.launchpad.TileContainer
 */
sap.ui.require([
    "sap/ushell/ui/launchpad/TileContainer",
    "sap/ushell/services/Container",
    "sap/m/Button",
    "sap/ushell/ui/launchpad/GroupHeaderActions",
    "sap/ushell/components/homepage/ActionMode",
    "sap/ushell/components/applicationIntegration/AppLifeCycle",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/ui/launchpad/Tile",
    "sap/ui/integration/widgets/Card",
    "sap/m/library"
], function (
    TileContainer,
    Container,
    Button,
    GroupHeaderActions,
    ActionMode,
    AppLifeCycle,
    Device,
    Config,
    Tile,
    Card,
    library
) {
    "use strict";

    var HeaderLevel = library.HeaderLevel;

    /* global asyncTest, module, ok, start, stop, test, sinon */

    var stub,
        bIsPhone = Device.system.phone,
        oTileContainer,
        oGroupHeaderActionPanel,
        groupHeaderActionData = {
            content: [],
            tileActionModeActive: true,
            isOverflow: false
        },
        testContainer,
        demiItemData = {
            showHeader: false,
            showPlaceholder: false,
            showGroupHeader: true,
            groupHeaderLevel: HeaderLevel.H3,
            showNoData: true,
            tiles: {}
        },
        _prepareTileContainerHeaderActions = function (bShowHeader, bShowMobileHeaderActionsBtn, bAddHeaderActions, bMockPhone) {
            sap.ui.Device.system.phone = bMockPhone;
            if (bAddHeaderActions) {
                var aHeaderActions = [
                    new Button("headerActionBtn1", { text: "headerActionBtn1" }),
                    new Button("headerActionBtn2", { text: "headerActionBtn2" })
                ];
                oGroupHeaderActionPanel.addContent(aHeaderActions[0]);
                oGroupHeaderActionPanel.addContent(aHeaderActions[1]);
                oTileContainer.addHeaderAction(oGroupHeaderActionPanel);
            }
            oGroupHeaderActionPanel.setIsOverflow(bMockPhone);
            oGroupHeaderActionPanel.setTileActionModeActive(bShowMobileHeaderActionsBtn);
            oTileContainer.setTileActionModeActive(bShowMobileHeaderActionsBtn);
            oTileContainer.setShowHeader(bShowHeader);
            oTileContainer.setShowMobileActions(bShowMobileHeaderActionsBtn);
            oTileContainer.placeAt("testContainer");
        },
        _prepareTileContainerEditFlags = function (bEditMode, bIsGroupLocked, bIsDefaultGroup, bIsTileActionModeActive) {
            oTileContainer.setShowHeader(true);
            oTileContainer.setEditMode(bEditMode);
            oTileContainer.setIsGroupLocked(bIsGroupLocked);
            oTileContainer.setDefaultGroup(bIsDefaultGroup);
            oTileContainer.setTileActionModeActive(bIsTileActionModeActive);
            oTileContainer.placeAt("testContainer");
        },
        _prepareTileContainerBeforeContent = function (bAddBeforeContent) {
            if (bAddBeforeContent) {
                var oBeforeContentBtn = new Button("beforeContentBtn", { text: "beforeContentBtn" });
                oTileContainer.addBeforeContent(oBeforeContentBtn);
            }
            oTileContainer.setShowHeader(true);
            oTileContainer.placeAt("testContainer");
        };

    module("sap.ushell.ui.launchpad.TileContainer", {
        setup: function () {
            stop(); // wait until the bootstrap finishes loading
            sap.ushell.bootstrap("local").then(function () {
                oTileContainer = new TileContainer(demiItemData);
                oGroupHeaderActionPanel = new GroupHeaderActions(groupHeaderActionData);
                testContainer = jQuery("<div id=\"testContainer\" style=\"display: none;\">").appendTo("body");

                jQuery.sap.getObject("sap.ushell.components.homepage.ActionMode", 0);//'0' - Create object if such doesn't exist.
                if (ActionMode.activateGroupEditMode) {
                    stub = sinon.stub(ActionMode, "activateGroupEditMode");
                } else {
                    ActionMode.activateGroupEditMode = function () { };
                }

                Config.emit("/core/home/sizeBehavior", "Responsive");
                Config.once("/core/home/sizeBehavior").do(function () {
                    start();
                });
            });
        },

        // This method is called after each test. Add every restoration code here.
        teardown: function () {
            if (stub) {
                stub.restore();
            }
            sap.ui.Device.system.phone = bIsPhone;
            oTileContainer.destroy();
            oGroupHeaderActionPanel.destroy();
            jQuery(testContainer).remove();
            delete sap.ushell.Container;
        }
    });

    var _addHeaderActionsAggregationTestHelper = function (bExpectHeaderClassAdded, bExpectHeaderActionsButtonAdded, bExpectHeaderActionsAdded) {
        setTimeout(function () {
            start();
            var bSapHeaderActionsClassAdded = testContainer.find(".sapUshellContainerHeaderActions").length > 0,
                bHeaderActionsButtonAdded = testContainer.find(".sapUshellHeaderActionButton").length > 0,
                bHeaderActionsAdded = (testContainer.find("#headerActionBtn1").length && testContainer.find("#headerActionBtn2").length) > 0;

            if (typeof bExpectHeaderClassAdded !== "undefined") {
                ok(bSapHeaderActionsClassAdded === bExpectHeaderClassAdded, "Header Actions class:sapUshellContainerHeaderActions is added ");
            }
            if (typeof bExpectHeaderActionsButtonAdded !== "undefined") {
                ok(bHeaderActionsButtonAdded === bExpectHeaderActionsButtonAdded, "Header actions mobile button added");
            }
            if (typeof bExpectHeaderActionsAdded !== "undefined") {
                ok(bHeaderActionsAdded === bExpectHeaderActionsAdded, "Both header actions added");
            }
        }, 0);
    };

    asyncTest("Add header Actions aggregation - non mobile scenario test", function () {
        _prepareTileContainerHeaderActions(true, true, true, false);
        _addHeaderActionsAggregationTestHelper(true, undefined, true);
    });

    asyncTest("Add header Actions aggregation test - mobile  scenario test", function () {
        _prepareTileContainerHeaderActions(true, true, true, true);
        _addHeaderActionsAggregationTestHelper(true, true, false);
    });

    asyncTest("Add header Actions aggregation when showMobileActions is false - mobile  scenario test", function () {
        _prepareTileContainerHeaderActions(true, false, true, true);
        _addHeaderActionsAggregationTestHelper(undefined, false, false);
    });

    asyncTest("Add header Actions aggregation when showHeader is false test", function () {
        _prepareTileContainerHeaderActions(false, true, true, true);
        _addHeaderActionsAggregationTestHelper(false, false, false);
    });

    asyncTest("Add header Actions aggregation when showMobileActions is false - non mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, false, true, false);
        _addHeaderActionsAggregationTestHelper(false, false, false);
    });

    asyncTest("No header Actions aggregation test - mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, true, false, true);
        _addHeaderActionsAggregationTestHelper(true, false, false);
    });

    asyncTest("No header Actions aggregation when showMobileActions is true - mobile scenario", function () {
        _prepareTileContainerHeaderActions(true, true, false, false);
        _addHeaderActionsAggregationTestHelper(true, false, false);
    });

    var _tileContainerTitleSimulateClickTestHelper = function (bExpectInputFieldBeforeClick, bExpectInputFieldAfterClick) {
        setTimeout(function () {
            var bInputFieldBeforeClick = testContainer.find(".sapUshellTileContainerTitleInput").length > 0,
                jqTileContainerTitle = testContainer.find(".sapUshellContainerTitle");

            jqTileContainerTitle.trigger("click");
            setTimeout(function () {
                start();
                var bInputFieldAfterClick = testContainer.find(".sapUshellTileContainerTitleInput").length > 0;

                ok(bInputFieldBeforeClick === bExpectInputFieldBeforeClick, "Input Field  did not exist  before simulating click on tile Container Title");
                ok(bInputFieldAfterClick === bExpectInputFieldAfterClick, "Input Field added after simulating click on tile Container Title");
            }, 100);
        }, 0);
    };

    asyncTest("Tile Container Header Edit mode - simulate click test", function () {
        _prepareTileContainerEditFlags(false, false, false, true);
        _tileContainerTitleSimulateClickTestHelper(false, true);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when group is locked", function () {
        _prepareTileContainerEditFlags(false, true, false, true);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when group is Default", function () {
        _prepareTileContainerEditFlags(false, false, true, true);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode - simulate click when Action Mode is not Active", function () {
        _prepareTileContainerEditFlags(false, false, false, false);
        _tileContainerTitleSimulateClickTestHelper(false, false);
    });

    asyncTest("Tile Container Header Edit mode test - when editMode is true", function () {
        _prepareTileContainerEditFlags(true, false, false, false);
        setTimeout(function () {
            start();
            var bInputFieldExist = testContainer.find(".sapUshellTileContainerTitleInput").length > 0;

            ok(bInputFieldExist, "Input Field exists");
        }, 200);
    });

    var _tileContainerBeforeContentTestHelper = function (bExpectBeforeContentDivAdded, bExpectBeforeContentBtnAdded) {
        setTimeout(function () {
            start();
            var jqBeforeContentDiv = testContainer.find(".sapUshellTileContainerBeforeContent"),
                bBeforeContentDivAdded = jqBeforeContentDiv.length > 0,
                bBeforeContentBtnAdded = bBeforeContentDivAdded ? (jqBeforeContentDiv.find("#beforeContentBtn").length > 0) : false;

            ok(bBeforeContentDivAdded === bExpectBeforeContentDivAdded, "BeforeContent div exists");
            ok(bBeforeContentBtnAdded === bExpectBeforeContentBtnAdded, "BeforeContent button exists");
        }, 0);
    };

    asyncTest("Tile Container test with BeforeContent aggregation in edit mode", function () {
        _prepareTileContainerBeforeContent(true);
        oTileContainer.setTileActionModeActive(true);
        _tileContainerBeforeContentTestHelper(true, true);
    });

    asyncTest("Tile Container test with BeforeContent aggregation", function () {
        _prepareTileContainerBeforeContent(true);
        oTileContainer.setTileActionModeActive(false);
        _tileContainerBeforeContentTestHelper(false, false);
    });

    asyncTest("Tile Container test - No BeforeContent aggregation", function () {
        _prepareTileContainerBeforeContent(false);
        _tileContainerBeforeContentTestHelper(false, false);

        setTimeout(function () {
            ok(!jQuery(".sapUshellSmall").length, "sapUshellSmall class should not be added because the sizeBehavior parameter is Responsive");
        }, 0);

    });

    asyncTest("Tile Container test - small tiles test", function () {
        Config.emit("/core/home/sizeBehavior", "Small");
        oTileContainer.addTile(new Tile());
        oTileContainer.placeAt("testContainer");

        setTimeout(function () {
            ok(jQuery(".sapUshellSmall").length, "sapUshellSmall class sould be added because the sizeBehavior parameter is Small");
            start();
        }, 0);
    });

    module("The function onAfterRendering", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();
            this.oResizeCardsStub = sinon.stub(this.oTileContainer, "_resizeCards");
            this.oGetTilesStub = sinon.stub(this.oTileContainer, "getTiles").returns([
                { isA: function () { return false; } },
                { isA: function () { return true; } },
                { isA: function () { return false; } },
                { isA: function () { return true; } }
            ]);
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.oResizeCardsStub.restore();
            this.oGetTilesStub.restore();
        }
    });

    test("Calls the _resizeCards function", function (assert) {
        // Act
        this.oTileContainer.onAfterRendering();

        // Assert
        assert.ok(this.oResizeCardsStub.calledOnce, "The function _resizeCards was called once.");
        assert.strictEqual(this.oResizeCardsStub.args[0][0].length, 2, "The function _resizeCards was called with an array of two card objects.");
    });

    module("The function _resizeCards", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();
            this.oWindowMatchMediaStub = sinon.stub(window, "matchMedia").returns({
                matches: false
            });
        },
        afterEach: function () {
            this.oTileContainer.destroy();
            this.oWindowMatchMediaStub.restore();
        }
    });

    test("Sets the right card dimensions according to the manifest", function (assert) {
        // Arrange
        var oFirstCard = new Card({ manifest: { "sap.flp": { columns: 4, rows: 2 } } }),
            oSecondCard = new Card({ manifest: { "sap.flp": { columns: 5, rows: 1 } } }),
            aCards = [oFirstCard, oSecondCard];

        // Act
        this.oTileContainer._resizeCards(aCards);

        // Assert
        assert.strictEqual(oFirstCard.getWidth(), "22.9rem", "The first card has the right width when the manifest parameter sap.flp.columns is equal to 4.");
        assert.strictEqual(oFirstCard.getHeight(), "11.2rem", "The first card has the right height when the manifest parameter sap.flp.rows is equal to 2.");
        assert.strictEqual(oSecondCard.getWidth(), "28.75rem", "The second card has the right width when the manifest parameter sap.flp.columns is equal to 5.");
        assert.strictEqual(oSecondCard.getHeight(), "5.35rem", "The second card has the right height when the manifest parameter sap.flp.rows is equal to 1.");
    });

    module("The function exit", {
        beforeEach: function () {
            this.oTileContainer = new TileContainer();

            this.oDestroyStub = sinon.stub();
            this.oTileContainer.oPlusTile = { destroy: this.oDestroyStub };
            this.oTileContainer.oHeaderButton = { destroy: this.oDestroyStub };
            this.oTileContainer.oActionSheet = { destroy: this.oDestroyStub };
        },
        afterEach: function () {
            this.oTileContainer.destroy();
        }
    });

    test("Destroys all controls", function (assert) {
        // Act
        this.oTileContainer.exit();

        // Assert
        assert.strictEqual(this.oDestroyStub.callCount, 3, "Destroys the PlusTile, HeaderButton and ActionSheet controls.");
    });
});
