// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/m/Button",
    "sap/m/library",
    "sap/ushell/ui/launchpad/GroupHeaderActions"
], function (
    Button,
    mobileLibrary,
    GroupHeaderActions
) {
    "use strict";

    /* global QUnit */

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    QUnit.module("GroupHeaderActions defaults", {
        beforeEach: function () {
            this.oGroupHeaderActions = new GroupHeaderActions();
        },
        afterEach: function () {
            this.oGroupHeaderActions.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oGroupHeaderActions.getProperty("isOverflow"), false, "Default Value of property isOverflow is: false");
        assert.strictEqual(this.oGroupHeaderActions.getProperty("tileActionModeActive"), false, "Default Value of property tileActionModeActive is: false");
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oGroupHeaderActions.getAggregation("content"), null, "Content Aggregation is initaly: empty");
    });

    QUnit.module("GroupHeaderActions Rendering", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oGroupHeaderActions = new GroupHeaderActions();
            this.oGroupHeaderActions.placeAt("content");
        },
        afterEach: function () {
            this.oGroupHeaderActions.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });


    QUnit.test("isOverflow is false and tileActionModeActive is false with visible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton");
        this.oGroupHeaderActions.setIsOverflow(false);
        this.oGroupHeaderActions.setTileActionModeActive(false);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!oTestButton.getDomRef(), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is true and tileActionModeActive is false with visible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton");
        this.oGroupHeaderActions.setIsOverflow(true);
        this.oGroupHeaderActions.setTileActionModeActive(false);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!oTestButton.getDomRef(), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is false and tileActionModeActive is true with visible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton");
        this.oGroupHeaderActions.setIsOverflow(false);
        this.oGroupHeaderActions.setTileActionModeActive(true);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!oTestButton.getDomRef(), true, "oTestButton was rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is true and tileActionModeActive is true with visible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton");
        this.oGroupHeaderActions.setIsOverflow(true);
        this.oGroupHeaderActions.setTileActionModeActive(true);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!oTestButton.getDomRef(), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, true, "OverflowButton is created");
        assert.strictEqual(
            this.oGroupHeaderActions._oOverflowButton.getIcon(),
            "sap-icon://overflow",
            "OverflowButton has the correct icon: sap-icon://overflow"
        );
        assert.strictEqual(
            this.oGroupHeaderActions._oOverflowButton.getType(),
            ButtonType.Transparent,
            "OverflowButton has the correct type: Transparent"
        );
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton.getDomRef(), true, "OverflowButton is rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is false and tileActionModeActive is false with invisible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton", { visible: false });
        this.oGroupHeaderActions.setIsOverflow(false);
        this.oGroupHeaderActions.setTileActionModeActive(false);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!window.document.getElementById("sap-ui-invisible-testButton"), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is true and tileActionModeActive is false with invisible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton", { visible: false });
        this.oGroupHeaderActions.setIsOverflow(true);
        this.oGroupHeaderActions.setTileActionModeActive(false);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!window.document.getElementById("sap-ui-invisible-testButton"), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is false and tileActionModeActive is true with invisible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton", { visible: false });
        this.oGroupHeaderActions.setIsOverflow(false);
        this.oGroupHeaderActions.setTileActionModeActive(true);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!window.document.getElementById("sap-ui-invisible-testButton"), true, "oTestButton was rendered invisible");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.test("isOverflow is true and tileActionModeActive is true with invisible Content", function (assert) {
        // Arrange
        var oTestButton = new Button("testButton", { visible: false });
        this.oGroupHeaderActions.setIsOverflow(true);
        this.oGroupHeaderActions.setTileActionModeActive(true);
        this.oGroupHeaderActions.addContent(oTestButton);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!window.document.getElementById("sap-ui-invisible-testButton"), false, "oTestButton was not rendered");
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, false, "OverflowButton is not created");
        assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, false, "ActionSheet is not created");

        oTestButton.destroy();
    });

    QUnit.module("GroupHeaderActions OverflowButton and ActionSheet", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oGroupHeaderActions = new GroupHeaderActions({
                isOverflow: true,
                tileActionModeActive: true,
                content: [ new Button() ]
            });
            this.oGroupHeaderActions.placeAt("content");
        },
        afterEach: function () {
            this.oGroupHeaderActions.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    QUnit.test("OverflowButton default parameters", function (assert) {
        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton, true, "OverflowButton is created");
        assert.strictEqual(
            this.oGroupHeaderActions._oOverflowButton.getIcon(),
            "sap-icon://overflow",
            "OverflowButton has the correct icon: sap-icon://overflow"
        );
        assert.strictEqual(
            this.oGroupHeaderActions._oOverflowButton.getType(),
            ButtonType.Transparent,
            "OverflowButton has the correct type: Transparent"
        );
        assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton.getDomRef(), true, "OverflowButton is rendered");
    });

    QUnit.test("ActionSheet default parameters", function (assert) {
        // Act
        var done = assert.async();
        sap.ui.getCore().applyChanges();
        this.oGroupHeaderActions._oOverflowButton.firePress();

        window.setTimeout(function () {
            // Act
            sap.ui.getCore().applyChanges();

            // Assert
            assert.strictEqual(!!this.oGroupHeaderActions._oActionSheet, true, "ActionSheet is created");
            assert.strictEqual(
                this.oGroupHeaderActions._oActionSheet.getPlacement(),
                PlacementType.Auto,
                "OverflowButton has the correct placement: Auto"
            );
            assert.strictEqual(!!this.oGroupHeaderActions._oOverflowButton.getDomRef(), true, "ActionSheet is rendered");
            done();
        }.bind(this), 0);
    });
});