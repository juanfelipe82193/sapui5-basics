// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/m/GenericTile",
    "sap/ui/events/KeyCodes",
	"sap/ui/qunit/QUnitUtils",
    "sap/ushell/resources",
    "sap/ushell/services/_VisualizationLoading/VizInstance",
    "sap/ushell/ui/launchpad/Page",
    "sap/ushell/ui/launchpad/Section"
], function (
    GenericTile,
    KeyCodes,
    QUnitUtils,
    resources,
    VizInstance,
    Page,
    Section
) {
    "use strict";

    /* global QUnit sinon */

    QUnit.module("Page defaults", {
        beforeEach: function () {
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oPage.getProperty("edit"), false, "Default Value of property edit is: false");
        assert.strictEqual(this.oPage.getProperty("enableSectionReordering"), false,
            "Default Value of property enableSectionReordering is: false");
        assert.strictEqual(this.oPage.getProperty("noSectionsText"), "", "Default Value of property noSectionsText is: \"\"");
        assert.strictEqual(this.oPage.getProperty("showNoSectionsText"), true, "Default Value of property showNoSectionsText is: true");
        assert.strictEqual(this.oPage.getProperty("showTitle"), false, "Default Value of property showTitle is: false");
        assert.strictEqual(this.oPage.getProperty("title"), "", "Default Value of property title is: \"\"");
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oPage.getAggregation("sections"), null, "Section Aggregation is initaly: null");
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons"), null,
            "Internal Aggregation _addSectionButtons is initaly: null");
        assert.notEqual(this.oPage.getAggregation("_noSectionText"), null, "Internal Aggregation _noSectionText has a default text");
        this.oPage.onBeforeRendering();
        assert.strictEqual(this.oPage.getAggregation("_addSectionButtons").length, 1,
            "Internal Aggregation _addSectionButtons has: one add section button after onBeforeRendering");
    });

    QUnit.test("default events", function (assert) {
        // Arrange
        var bEventWasTriggerd;
        this.oPage.onBeforeRendering();
        this.oPage.attachAddSectionButtonPressed(function () {
            bEventWasTriggerd = true;
        });

        // Act
        this.oPage.getAggregation("_addSectionButtons")[0].firePress();

        // Assert
        assert.strictEqual(bEventWasTriggerd, true, "The addSectionButtonPressed event was fired");
    });

    QUnit.test("internal _addSectionButtons aggregation has elements with the correct properties", function (assert) {
        // Arrange
        this.oPage.onBeforeRendering();
        var oAddSectionButton = this.oPage.getAggregation("_addSectionButtons")[0];

        // Assert
        assert.strictEqual(oAddSectionButton.isA("sap.m.Button"), true, "The Control is a Button");
        assert.strictEqual(oAddSectionButton.getType(), "Transparent", "The Control has the type: Transparent");
        assert.strictEqual(oAddSectionButton.getIcon(), "sap-icon://add", "The Control has the icon: \"sap-icon://add\"");
        assert.strictEqual(oAddSectionButton.getText(), resources.i18n.getText("Page.Button.AddSection"),
        "The Control has the text: " + resources.i18n.getText("Page.Button.AddSection"));
    });

    QUnit.test("internal _noSectionText aggregation has the correct defualt properties", function (assert) {
        // Arrange
        var oNoSectionText = this.oPage.getAggregation("_noSectionText");

        // Assert
        assert.strictEqual(oNoSectionText.isA("sap.m.Text"), true, "The Control is a Button");
        assert.strictEqual(oNoSectionText.getWidth(), "100%", "The Control has the width: 100%");
        assert.strictEqual(oNoSectionText.getTextAlign(), "Center", "The Control has the textAlign: \"Center\"");
        assert.strictEqual(oNoSectionText.getText(), resources.i18n.getText("Page.NoSectionText"),
            "The Control has the text: " + resources.i18n.getText("Page.NoSectionText"));
    });

    QUnit.module("Page properties", {
        beforeEach: function () {
            this.oPage = new Page();
        },
        afterEach: function () {
            this.oPage.destroy();
        }
    });

    QUnit.test("edit property", function (assert) {
        assert.strictEqual(this.oPage.getEdit(), false, "Value is initally false");
        this.oPage.setEdit(true);
        assert.strictEqual(this.oPage.getEdit(), true, "Value was set to true");
        this.oPage.setEdit(false);
        assert.strictEqual(this.oPage.getEdit(), false, "Value was set to false");
    });

    QUnit.test("enableSectionReordering property", function (assert) {
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value is initally false");
        this.oPage.setEnableSectionReordering(true);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), true, "Value was set to true");
        this.oPage.setEnableSectionReordering(false);
        assert.strictEqual(this.oPage.getEnableSectionReordering(), false, "Value was set to false");
    });

    QUnit.test("noSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getNoSectionsText(), "", "Value is initally \"\"");
        this.oPage.setNoSectionsText("some text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some text", "Value was set to \"some text\"");
        this.oPage.setNoSectionsText("some other text");
        assert.strictEqual(this.oPage.getNoSectionsText(), "some other text", "Value was set to \"some other text\"");
    });

    QUnit.test("showNoSectionsText property", function (assert) {
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value is initally true");
        this.oPage.setShowNoSectionsText(false);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), false, "Value was set to false");
        this.oPage.setShowNoSectionsText(true);
        assert.strictEqual(this.oPage.getShowNoSectionsText(), true, "Value was set to true");
    });

    QUnit.test("showTitle property", function (assert) {
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value is initally false");
        this.oPage.setShowTitle(true);
        assert.strictEqual(this.oPage.getShowTitle(), true, "Value was set to true");
        this.oPage.setShowTitle(false);
        assert.strictEqual(this.oPage.getShowTitle(), false, "Value was set to false");
    });

    QUnit.test("title property", function (assert) {
        assert.strictEqual(this.oPage.getTitle(), "", "Value is initally \"\"");
        this.oPage.setTitle("some title");
        assert.strictEqual(this.oPage.getTitle(), "some title", "Value was set to \"some title\"");
        this.oPage.setTitle("some other title");
        assert.strictEqual(this.oPage.getTitle(), "some other title", "Value was set to \"some other title\"");
    });

    QUnit.module("Page accessability", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oPage = new Page({
                edit: true,
                sections: [
                    new Section({
                        visualizations: [
                            new VizInstance({
                                innerControl: new GenericTile("tile-0-0")
                            }),
                            new VizInstance({
                                innerControl: new GenericTile("tile-0-1")
                            })
                        ]
                    }),
                    new Section()
                ]
            });

            this.oPage.insertSection(new Section({
                visualizations: [
                    new VizInstance({
                        innerControl: new GenericTile("tile-2-0")
                    }),
                    new VizInstance({
                        innerControl: new GenericTile("tile-2-1")
                    })
                ]
            }), 2);
            this.oPage.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oPage.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    QUnit.test("PAGE_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-0-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_UP while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        sap.ui.getCore().byId("tile-2-1").getDomRef().focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-0-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-2-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("PAGE_DOWN while focus is inside of a Section", function (assert) {
        // Arrange
        var done = assert.async();
        sap.ui.getCore().byId("tile-0-1").getDomRef().focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.PAGE_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-2-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var aSectionWrapper = this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection");
        aSectionWrapper[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_UP);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, aSectionWrapper[1], "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_UP + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[2].focus();

        var fnFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_UP, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(fnFireSectionDropStub.called, true, "Section drop event called");

            fnFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN while focus is on a Section", function (assert) {
        // Arrange
        var done = assert.async();
        var aSectionWrapper = this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection");
        aSectionWrapper[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(window.document.activeElement, aSectionWrapper[1], "focus is on the correct visualization.");
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.setEnableSectionReordering(true);
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        var fnFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(fnFireSectionDropStub.called, true, "Section drop event called.");

            fnFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("ARROW_DOWN + CTRL - SectionReordering disabled", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        var fnFireSectionDropStub = sinon.stub(this.oPage, "fireSectionDrop");

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.ARROW_DOWN, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(fnFireSectionDropStub.called, false, "Section drop event called.");

            fnFireSectionDropStub.restore();
            done();
        }, 0);
    });

    QUnit.test("HOME", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.HOME);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-0-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("END", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.END);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-0-1").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("HOME + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[2].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.HOME, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-0-0").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });

    QUnit.test("END + CTRL", function (assert) {
        // Arrange
        var done = assert.async();
        this.oPage.getDomRef().getElementsByClassName("sapUshellPageSection")[0].focus();

        // Act
        QUnitUtils.triggerKeydown(this.oPage.getDomRef(), KeyCodes.END, false, false, true);

        // Assert
        window.setTimeout(function () {
            assert.strictEqual(
                window.document.activeElement,
                sap.ui.getCore().byId("tile-2-1").getDomRef(),
                "focus is on the correct visualization."
            );
            done();
        }, 0);
    });
});