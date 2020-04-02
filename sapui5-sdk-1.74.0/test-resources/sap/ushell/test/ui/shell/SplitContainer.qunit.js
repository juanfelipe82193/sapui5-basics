// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.ui.shell.SplitContainer
 */
sap.ui.require([
    "sap/ui/core/Control",
    "sap/ushell/ui/shell/SplitContainer",
    "sap/ushell/ui/shell/ShellLayout"
], function (Control, SplitContainer, ShellLayout) {
    "use strict";
    /*global asyncTest, equal, module, ok, start, test, jQuery, my*/

    var TestControl = Control.extend("my.Test", {
        renderer: function (rm, ctrl) {
            rm.write("<div style='width:10px;height:10px;background-color:gray;'");
            rm.writeControlData(ctrl);
            rm.write("></div>");
        }
    });

    QUnit.module("sap.ushell.ui.shell.SplitContainer", {
        beforeEach: function () {
            this.oSplitContainer = new SplitContainer();
            this.oSplitContainer.placeAt("qunit-fixture");

            sinon.stub(this.oSplitContainer, "onAfterRendering");

            sap.ui.getCore().applyChanges();
        },

        afterEach: function () {
            this.oSplitContainer.destroy();
        }
    });

    QUnit.test("Properties - Default Values", function (assert) {
        assert.strictEqual(this.oSplitContainer.getShowSecondaryContent(), false, "Default 'showSecondaryContent'");
        assert.strictEqual(this.oSplitContainer.getSecondaryContentSize(), "250px", "Default 'secondaryContentSize'");
        assert.strictEqual(this.oSplitContainer.getShowSecondaryContent(), false, "Default 'showSecondaryContent'");
        assert.strictEqual(this.oSplitContainer.getSecondaryContentWidth(), "250px", "Default 'secondaryContentWidth'");
        assert.strictEqual(this.oSplitContainer.getOrientation(), "Horizontal", "Default 'orientation'");
    });

    QUnit.test("Properties - Custom Values", function (assert) {
        // Arrange
        var oSplitContainer = new SplitContainer({
            showSecondaryContent: true,
            secondaryContentSize: "200px"
        });

        assert.strictEqual(oSplitContainer.getShowSecondaryContent(), true, "Custom 'showSecondaryContent'");
        assert.strictEqual(oSplitContainer.getSecondaryContentSize(), "200px", "Custom 'secondaryContentWidth'");

        // Cleanup
        oSplitContainer.destroy();
    });

    QUnit.test("Initial size of 'content' aggregation", function (assert) {
        // Act
        var aContent = this.oSplitContainer.getContent();

        // Assert
        assert.strictEqual(aContent.length, 0, "The correct number of items has been found.");
    });

    QUnit.test("Content", function (assert) {
        // Arrange
        var oContent = new TestControl();
        var oSecondaryContent = new TestControl();
        this.oSplitContainer.addContent(oContent);
        this.oSplitContainer.addSecondaryContent(oSecondaryContent);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        var oDomRef = this.oSplitContainer.getDomRef();
        assert.strictEqual(oDomRef.querySelector("sc-canvas"), oContent.getDomRef(), "The correct DOM element has been found.");
        assert.strictEqual(oDomRef.querySelector("sc-pane"), oSecondaryContent.getDomRef(), "The correct DOM element has been found.");
    });

    QUnit.test("Secondary Content Width", function (assert) {
        // Arrange
        this.oSplitContainer.getParent().getToolAreaSize = function () { return 0; };
        this.oSplitContainer.onAfterRendering.restore();
        this.oSplitContainer.setSecondaryContentSize("200px");

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        var iOuterWidth = this.oSplitContainer.$("pane").outerWidth();
        assert.ok(iOuterWidth >= 199, "Secondary Content Width after change");
    });

    QUnit.test("Secondary content is initially hidden", function (assert) {
        assert.strictEqual(this.oSplitContainer.$("panecntnt").is(":visible"), false, "Secondary Content initially hidden");
    });

    QUnit.test("Secondary content is visible after rendering", function (assert) {
        // Arrange
        this.oSplitContainer.setShowSecondaryContent(true);

        // Act
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(this.oSplitContainer.$("panecntnt").is(":visible"), true, "Secondary Content visible");
    });
});