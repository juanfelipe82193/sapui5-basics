// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/m/library",
    "sap/m/GenericTile",
    "sap/ui/events/KeyCodes",
    "sap/ui/qunit/QUnitUtils",
    "sap/ushell/resources",
    "sap/ushell/services/_VisualizationLoading/VizInstance",
    "sap/ushell/ui/launchpad/Section",
    "sap/ui/core/ResizeHandler",
    "sap/ushell/services/Container"
], function (
    library,
    GenericTile,
    KeyCodes,
    QUnitUtils,
    resources,
    VizInstance,
    Section,
    ResizeHandler
) {
    "use strict";

    /* global QUnit, sinon */

    var TileSizeBehavior = library.TileSizeBehavior;
    var sandbox = sinon.createSandbox({});

    QUnit.module("Section defaults", {
        beforeEach: function () {
            this.oSection = new Section();
            this.oSection.placeAt("qunit-fixture");
        },
        afterEach: function () {
            this.oSection.destroy();
        }
    });

    QUnit.test("default properties", function (assert) {
        assert.strictEqual(this.oSection.getEditable(), false,
            "Default Value of property editable is: false");
        assert.strictEqual(this.oSection.getEnableAddButton(), true,
            "Default Value of property enableAddButton is: true");
        assert.strictEqual(this.oSection.getEnableDeleteButton(), true,
            "Default Value of property enableDeleteButton is: true");
        assert.strictEqual(this.oSection.getEnableGridBreakpoints(), false,
            "Default Value of property enableGridBreakpoints is: false");
        assert.strictEqual(this.oSection.getEnableResetButton(), true,
            "Default Value of property enableResetButton is: true");
        assert.strictEqual(this.oSection.getEnableShowHideButton(), true,
            "Default Value of property enableShowHideButton is: true");
        assert.strictEqual(this.oSection.getEnableVisualizationReordering(), false,
            "Default Value of property enableVisualizationReordering is: false");
        assert.strictEqual(this.oSection.getNoVisualizationsText(), resources.i18n.getText("Section.NoVisualizationsText"),
            "Default Value of property noVisualizationsText is: " + resources.i18n.getText("Section.NoVisualizationsText"));
        assert.strictEqual(this.oSection.getTitle(), "", "Default Value of property title is empty.");
        assert.strictEqual(this.oSection.getShowNoVisualizationsText(), false,
            "Default Value of property showNoVisualizationsText is: false");
        assert.strictEqual(this.oSection.getShowSection(), true,
            "Default Value of property showSection is: true");
        assert.strictEqual(this.oSection.getSizeBehavior(), TileSizeBehavior.Responsive,
            "Default Value of property sizeBehavior is: " + TileSizeBehavior.Responsive);
    });

    QUnit.test("default aggregations", function (assert) {
        assert.strictEqual(this.oSection.getVisualizations().length > 0, false, "Visualization Aggregation is initially: empty");
    });

    QUnit.test("add event", function (assert) {
        // Arrange
        var fnAddSpy = sinon.spy();

        this.oSection.attachAdd(fnAddSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("addVisualization").firePress();

        // Assert
        assert.strictEqual(fnAddSpy.called, true, "The add event was fired");
    });

    QUnit.test("delete event", function (assert) {
        // Arrange
        var fnDeleteSpy = sinon.spy();

        this.oSection.attachDelete(fnDeleteSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("delete").firePress();

        // Assert
        assert.strictEqual(fnDeleteSpy.called, true, "The delete event was fired");
    });

    QUnit.test("reset event", function (assert) {
        // Arrange
        var fnResetSpy = sinon.spy();

        this.oSection.attachReset(fnResetSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("reset").firePress();

        // Assert
        assert.strictEqual(fnResetSpy.called, true, "The reset event was fired");
    });

    QUnit.test("titleChange event", function (assert) {
        // Arrange
        var fnTitleChangeSpy = sinon.spy();

        this.oSection.attachTitleChange(fnTitleChangeSpy);

        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        // Act
        this.oSection.byId("title-edit").fireChange();

        // Assert
        assert.strictEqual(fnTitleChangeSpy.called, true, "The titleChange event was fired");
    });

    QUnit.test("visualizations aggregation with a GenericTile", function (assert) {
        // Arrange
        var done = assert.async();
        sap.ushell.bootstrap("local").then(function () {
            var oldFunction = sap.ushell.Container.getService;
            sap.ushell.Container.getService = function (sId) {
                if (sId === "VisualizationDataProvider") {
                    return {
                        _getCatalogTiles: function () { return Promise.resolve([]); }
                    };
                }
                return oldFunction(sId);
            };
            var oVisualizationLoadingService = sap.ushell.Container.getService("VisualizationLoading");
            oVisualizationLoadingService.loadVisualizationData().then(function () {
                var oVizInstance = oVisualizationLoadingService.instantiateVisualization({ vizId: "someId" }),
                    oVizInstance2 = oVisualizationLoadingService.instantiateVisualization({ vizId: "someOtherId" });

                // Act
                this.oSection.addVisualization(oVizInstance);
                this.oSection.insertVisualization(oVizInstance2);
                sap.ui.getCore().applyChanges();

                // Assert
                var oLayoutData = this.oSection.getVisualizations()[0].getLayoutData();
                assert.strictEqual(this.oSection.getVisualizations().length, 2,
                    "The 2 visualization were added correctly");
                assert.strictEqual(oLayoutData.getRows(), 2,
                    "The first visualization received layout data with the correct amount of rows.");
                assert.strictEqual(oLayoutData.getColumns(), 2,
                    "The first visualization received layout data with the correct amount of columns.");

                sap.ushell.Container.getService = oldFunction;
                done();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("check that the correct default classes are assigned", function (assert) {
        // Arrange
        sap.ui.getCore().applyChanges();

        // Act
        var oVbox = this.oSection._getCompositeAggregation();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), false,
            "The section does not have the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), false,
            "The section does not have the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned when not editble, but hidden", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Act
        this.oSection.byId("showHide").firePress();

        this.oSection.setEditable(false);
        sap.ui.getCore().applyChanges();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), false,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.test("check that the correct classes are assigned during edit and hidden", function (assert) {
        // Arrange
        this.oSection.setEditable(true);
        sap.ui.getCore().applyChanges();

        var oVbox = this.oSection._getCompositeAggregation();

        // Act
        this.oSection.byId("showHide").firePress();

        // Assert
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSection"), true,
            "The section does not have the class: \"sapUshellSection\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionEdit"), true,
            "The section has the class: \"sapUshellSectionEdit\"");
        assert.strictEqual(oVbox.hasStyleClass("sapUshellSectionHidden"), true,
            "The section has the class: \"sapUshellSectionHidden\"");
    });

    QUnit.module("Section accessability", {
        beforeEach: function () {
            this.oContent = window.document.createElement("div");
            this.oContent.setAttribute("id", "content");
            window.document.body.appendChild(this.oContent);
            this.oSection = new Section({
                enableVisualizationReordering: true,
                visualizations: [
                    new VizInstance({
                        innerControl: new GenericTile("tile-0-0")
                    }),
                    new VizInstance({
                        innerControl: new GenericTile("tile-0-1")
                    })
                ]
            });

            this.oSection.placeAt("content");
            sap.ui.getCore().applyChanges();
        },
        afterEach: function () {
            this.oSection.destroy();
            window.document.body.removeChild(this.oContent);
        }
    });

    [
        {
            sKeyCode: "ARROW_UP",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: true
        },
        {
            sKeyCode: "ARROW_UP",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "ARROW_RIGHT",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "ARROW_RIGHT",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: true
        },
        {
            sKeyCode: "ARROW_DOWN",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "ARROW_DOWN",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: true
        },
        {
            sKeyCode: "ARROW_LEFT",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: true
        },
        {
            sKeyCode: "ARROW_LEFT",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "HOME",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "HOME",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-0",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "END",
            sFocusElement: "tile-0-0",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: false
        },
        {
            sKeyCode: "END",
            sFocusElement: "tile-0-1",
            sExpectedFocus: "tile-0-1",
            bExpectedBorderReachedEvent: false
        }
    ].forEach(function (oFixture) {
        QUnit.test("KeyBoard: " + oFixture.sKeyCode, function (assert) {
            // Arrange
            var done = assert.async();
            sap.ui.getCore().byId(oFixture.sFocusElement).getDomRef().focus();
            var fnBorderReachedStub = sinon.stub(this.oSection, "fireBorderReached");

            // Act
            QUnitUtils.triggerKeydown(this.oSection.getDomRef(), KeyCodes[oFixture.sKeyCode]);

            // Assert
            window.setTimeout(function () {
                assert.strictEqual(
                    window.document.activeElement,
                    sap.ui.getCore().byId(oFixture.sExpectedFocus).getDomRef(),
                    "focus is on the correct visualization."
                );
                assert.strictEqual(
                    fnBorderReachedStub.called,
                    oFixture.bExpectedBorderReachedEvent,
                    "Border reached event was (not) fired."
                );
                fnBorderReachedStub.restore();
                done();
            }, 0);
        });
    });

    [
        {
            sKeyCode: "ARROW_UP",
            sFocusElement: "tile-0-0",
            bExpectedBorderReachedEvent: true,
            bExpectedVisualizationDropEvent: false
        },
        {
            sKeyCode: "ARROW_UP",
            sFocusElement: "tile-0-1",
            bExpectedBorderReachedEvent: false,
            bExpectedVisualizationDropEvent: true
        },
        {
            sKeyCode: "ARROW_RIGHT",
            sFocusElement: "tile-0-0",
            bExpectedBorderReachedEvent: false,
            bExpectedVisualizationDropEvent: true
        },
        {
            sKeyCode: "ARROW_RIGHT",
            sFocusElement: "tile-0-1",
            bExpectedBorderReachedEvent: true,
            bExpectedVisualizationDropEvent: false
        },
        {
            sKeyCode: "ARROW_DOWN",
            sFocusElement: "tile-0-0",
            bExpectedBorderReachedEvent: false,
            bExpectedVisualizationDropEvent: true
        },
        {
            sKeyCode: "ARROW_DOWN",
            sFocusElement: "tile-0-1",
            bExpectedBorderReachedEvent: true,
            bExpectedVisualizationDropEvent: false
        },
        {
            sKeyCode: "ARROW_LEFT",
            sFocusElement: "tile-0-0",
            bExpectedBorderReachedEvent: true,
            bExpectedVisualizationDropEvent: false
        },
        {
            sKeyCode: "ARROW_LEFT",
            sFocusElement: "tile-0-1",
            bExpectedBorderReachedEvent: false,
            bExpectedVisualizationDropEvent: true
        }
    ].forEach(function (oFixture) {
        QUnit.test("KeyBoard: " + oFixture.sKeyCode + " + CTRL", function (assert) {
            // Arrange
            var done = assert.async(),
                fnBorderReachedStub = sinon.stub(this.oSection, "fireBorderReached"),
                fnVisualizationDropStub = sinon.stub(this.oSection, "fireVisualizationDrop");

            sap.ui.getCore().byId(oFixture.sFocusElement).getDomRef().focus();

            // Act
            QUnitUtils.triggerKeydown(this.oSection.getDomRef(), KeyCodes[oFixture.sKeyCode], false, false, true);

            // Assert
            window.setTimeout(function () {
                assert.strictEqual(
                    fnBorderReachedStub.called,
                    oFixture.bExpectedBorderReachedEvent,
                    "Border reached event was (not) fired."
                );
                assert.strictEqual(
                    fnVisualizationDropStub.called,
                    oFixture.bExpectedVisualizationDropEvent,
                    "Visualization drop event was (not) fired."
                );
                fnBorderReachedStub.restore();
                fnVisualizationDropStub.restore();
                done();
            }, 0);
        });
    });

    QUnit.module("The function init", {
        beforeEach: function () {
            this.oGridStub = { addEventDelegate: sinon.stub() };
            this.oByIdStub = sinon.stub(Section.prototype, "byId");
            this.oByIdStub.withArgs("innerGrid").returns(this.oGridStub);
            this.oVBox = {
                toggleStyleClass: sinon.stub()
            };
            this.oByIdStub.withArgs("content").returns(this.oVBox);

            this.oSection = new Section();

            this.oEventDelegate = this.oGridStub.addEventDelegate.firstCall.args[0];
        },
        afterEach: function () {
            this.oSection.destroy();
            this.oByIdStub.restore();
        }
    });

    QUnit.test("checks that the eventDelegate is called after initiating the section.", function (assert) {
        // Assert
        assert.strictEqual(this.oGridStub.addEventDelegate.callCount, 1, "calls the addEventDelegate.");
    });

    QUnit.test("checks that the eventDelegate has the properties onBeforeRendering and onAfterRendering.", function (assert) {
        // Arrange
        var oEventDelegate = this.oGridStub.addEventDelegate.firstCall.args[0];

        // Assert
        assert.strictEqual(oEventDelegate.hasOwnProperty("onBeforeRendering"), true, "onBeforeRendering was received");
        assert.strictEqual(oEventDelegate.hasOwnProperty("onAfterRendering"), true, "onAfterRendering was received");
    });

    QUnit.test("checks that deregister is called inside the onBeforeRendering with the correct parameter", function (assert) {
        // Arrange
        var oDeregisterStub = sinon.stub(ResizeHandler, "deregister");
        this.oSection._sHandleResizeId = "1";

        // Act
        this.oEventDelegate.onBeforeRendering();

        // Assert
        assert.strictEqual(oDeregisterStub.callCount, 1, "deregister was called once.");
        assert.strictEqual(oDeregisterStub.firstCall.args[0], "1", "deregister has the correct handleResizeId");

        // Cleanup
        oDeregisterStub.restore();
    });

    QUnit.test("checks that register is called correctly.", function (assert) {
        // Arrange
        var oRegisterStub = sinon.stub(ResizeHandler, "register");
        sinon.stub(this.oSection, "_handleResize");

        // Act
        this.oEventDelegate.onAfterRendering();

        // Assert
        assert.strictEqual(oRegisterStub.callCount, 1, "register was called once.");
        assert.strictEqual(oRegisterStub.firstCall.args[0], this.oSection.oVBox, "register was called with the correct VBox");
        assert.strictEqual(typeof oRegisterStub.firstCall.args[1], "function", "register was called with a function as second parameter");

        // Cleanup
        oRegisterStub.restore();
    });

    QUnit.test("checks that toggleStyleClass is called correctly.", function (assert) {
        // Arrange
        sinon.stub(this.oSection, "getVisualizations").returns([]);

        // Act
        this.oEventDelegate.onAfterRendering();

        // Assert
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.callCount, 1, "toggleStyleClass was called once.");
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.firstCall.args[0], "sapUshellSectionNoVisualizations", "toggleStyleClass was called with the correct string parameter.");
        assert.strictEqual(this.oSection.oVBox.toggleStyleClass.firstCall.args[1], true, "toggleStyleClass was called with the correct second parameter.");
    });

    QUnit.module("The function _handleResize", {
        beforeEach: function () {
            this.oSetContainerQueryStub = sinon.stub();
            this.oGridStub = {
                setContainerQuery: this.oSetContainerQueryStub,
                addEventDelegate: sinon.stub()
            };
            this.oByIdStub = sinon.stub(Section.prototype, "byId");
            this.oByIdStub.withArgs("innerGrid").returns(this.oGridStub);

            this.oSection = new Section();

        },
        afterEach: function () {
            this.oByIdStub.restore();
            this.oSection.destroy();

        }
    });

    QUnit.test("checks if the grid container size listens to the parent container when the size of the grid container is smaller than 376.", function (assert) {
        // Arrange
        var oEvt = {
            size: {
                width: 375
            }
        };

        // Act
        this.oSection._handleResize(oEvt);

        // Assert
        assert.strictEqual(this.oByIdStub.withArgs("innerGrid").callCount, 2, "the innerGrid is available");
        assert.strictEqual(this.oSetContainerQueryStub.firstCall.args[0], false, "the grid container reacts to the parent container size");
        // Cleanup
    });

    QUnit.test("checks if the grid container size listens to the parent container when the size of the grid container is bigger than 375.", function (assert) {
        // Arrange
        var oEvt = {
            size: {
                width: 376
            }
        };

        // Act
        this.oSection._handleResize(oEvt);

        // Assert
        assert.strictEqual(this.oByIdStub.withArgs("innerGrid").callCount, 2, "the innerGrid is available");
        assert.strictEqual(this.oSetContainerQueryStub.firstCall.args[0], true, "the grid container does not react to the parent container size");
        // Cleanup
    });

    QUnit.module("The setShowSection function", {
        beforeEach: function () {
            this.oSection = new Section();
            this.bMockValue = true;

            this.oFireSectionVisibilityChangeStub = sandbox.stub(this.oSection, "fireSectionVisibilityChange");
        },
        afterEach: function () {
            sandbox.restore();
            this.oSection.destroy();
        }
    });

    QUnit.test("was called correctly", function (assert) {
        //Arrange
        //Act
        this.oSection.setShowSection(this.bMockValue);
        //Assert
        assert.deepEqual(this.oFireSectionVisibilityChangeStub.getCall(0).args, [{visible: this.bMockValue}], "correct value was passed to event handler");
    });
});