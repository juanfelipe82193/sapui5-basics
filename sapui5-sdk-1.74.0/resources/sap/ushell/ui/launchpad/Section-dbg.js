//Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview Provides control sap.ushell.ui.launchpad.Section
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/f/GridContainerItemLayoutData",
    "sap/m/library",
    "sap/ui/core/XMLComposite",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ui/core/ResizeHandler"
], function (
    GridContainerItemLayoutData,
    library,
    XMLComposite,
    resources,
    utils,
    ResizeHandler
) {
    "use strict";

    var TileSizeBehavior = library.TileSizeBehavior;

    /**
     * Constructor for a new Section.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * The Section represents a structured collection of visualizations.
     * @extends sap.ui.core.XMLComposite
     *
     * @author SAP SE
     * @version 1.74.0
     *
     * @private
     * @alias sap.ushell.ui.launchpad.Section
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var Section = XMLComposite.extend("sap.ushell.ui.launchpad.Section", /** @lends sap.ushell.ui.launchpad.Section.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {

                /**
                 * Specifies if the section should display in the edit mode.
                 */
                editable: { type: "boolean", group: "Misc", defaultValue: false },

                /**
                 * Specifies if the 'Add Visualization' button should be shown during editing of the section. (See editable property)
                 * The 'Add Visualization' button triggers the addWigetButtonPressed event when it is pressed.
                 */
                enableAddButton: { type: "boolean", group: "Behavior", defaultValue: true },

                /**
                 * Specifies if the 'Delete Section' button should be shown during editing of the section. (See editable property)
                 * The 'Delete Section' button triggers the deleteButtonPressed event when it is pressed.
                 */
                enableDeleteButton: { type: "boolean", group: "Behavior", defaultValue: true },

                /**
                 * Specifies if the grid breakpoints are used.
                 * This is to limit the reordering during resizing, it might break certain layouts.
                 */
                enableGridBreakpoints: { type: "boolean", group: "Appearance", defaultValue: false },

                /**
                 * Specifies if the 'Reset Section' button should be shown during editing of the section. (See editable property)
                 * The 'Reset Section' button triggers the resetButtonPressed event when it is pressed.
                 */
                enableResetButton: { type: "boolean", group: "Behavior", defaultValue: true },

                /**
                 * Specifies if the 'Show / Hide Section' button should be shown during editing of the section. (See editable property)
                 */
                enableShowHideButton: { type: "boolean", group: "Behavior", defaultValue: true },

                /**
                 * Specifies whether visualization reordering is enabled. Relevant only for desktop devices.
                 */
                enableVisualizationReordering: { type: "boolean", group: "Behavior", defaultValue: false },

                /**
                 * This text is displayed when the control contains no visualizations.
                 */
                noVisualizationsText: { type: "string", group: "Appearance", defaultValue: resources.i18n.getText("Section.NoVisualizationsText") },

                /**
                 * Specifies the title of the section.
                 */
                title: { type: "string", group: "Appearance", defaultValue: "" },

                /**
                 * Defines whether or not the text specified in the <code>noVisualizationsText</code> property is displayed.
                 */
                showNoVisualizationsText: { type: "boolean", group: "Behavior", defaultValue: false },

                /**
                 * Specifies if the section should be visible during non editing of the section. (See editable property)
                 */
                showSection: { type: "boolean", group: "Misc", defaultValue: true },

                /**
                 * Specifies the sizeBehavior of the grid.
                 */
                sizeBehavior: { type: "sap.m.TileSizeBehavior", group: "Misc", defaultValue: TileSizeBehavior.Responsive }
            },
            defaultAggregation: "visualizations",
            aggregations: {

                /**
                 * Defines the visualizations contained within this section.
                 */
                visualizations: {
                    type: "sap.ui.core.Control",
                    multiple: true,
                    forwarding: {
                        idSuffix: "--innerGrid",
                        aggregation: "items"
                    },
                    dnd: true
                }
            },
            events: {

                /**
                 * Fires when the add visualization button is pressed.
                 */
                "add": {},

                /**
                 * Fires when the delete button is pressed
                 */
                "delete": {},

                /**
                 * Fires when the reset button is pressed.
                 */
                "reset": {},

                /**
                 * Fires when the title is changed.
                 */
                "titleChange": {},

                /**
                 * Fires when a control is dropped on the grid.
                 */
                "visualizationDrop": {
                    parameters: {

                        /**
                         * The control that was dragged.
                         */
                        draggedControl: { type: "sap.ui.core.Control" },

                        /**
                         * The control where the dragged control was dropped.
                         */
                        droppedControl: { type: "sap.ui.core.Control" },

                        /**
                         * A string defining from what direction the dragging happend.
                         */
                        dropPosition: { type: "string" }
                    }
                },

                /**
                 * Fires when the section hides or unhides changed.
                 */
                "sectionVisibilityChange": {
                    parameters: {

                        /**
                         * Determines whether the section is now visible or invisible.
                         */
                        visible: { type: "boolean" }
                    }
                },

                /**
                 * Fires if the border of the visualizations is reached
                 * so that an application can react on this.
                 */
                "borderReached": {
                    parameters: {

                        /**
                         * Event that leads to the focus change.
                         */
                        event: { type: "jQuery.Event" }
                    }
                }
            }
        },
        resourceModel: resources.i18nModel
    });

    Section.prototype.init = function () {
        this.oVBox = this.byId("content");

        this.byId("innerGrid").addEventDelegate({
            onBeforeRendering: function () {
                ResizeHandler.deregister(this._sHandleResizeId);
            }.bind(this),
            onAfterRendering: function () {
                this._sHandleResizeId = ResizeHandler.register(this.oVBox, this._handleResize.bind(this));
                this.oVBox.toggleStyleClass("sapUshellSectionNoVisualizations", !this.getVisualizations().length);
            }.bind(this)
        });

        this.addEventDelegate({
            onsapleft: this._handleKeyboardArrowNavigation.bind(this, false),
            onsapleftmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsapright: this._handleKeyboardArrowNavigation.bind(this, false),
            onsaprightmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsapup: this._handleKeyboardArrowNavigation.bind(this, false),
            onsapupmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsapdown: this._handleKeyboardArrowNavigation.bind(this, false),
            onsapdownmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsaphome: this._setFocusOnVisualizationWithIndex.bind(this, 0),
            onsapend: this._setFocusOnVisualizationWithIndex.bind(this, "last")
        });
    };

    /**
     * Sets the focus on a visualization at the given index.
     *
     * @param {string|integer} vIndex
     *      The index of the visualization the focus should be set to.
     *      This can also be "last".
     * @param {jQuery.Event} oEvent The keyboard event.
     *
     * @private
     */
    Section.prototype._setFocusOnVisualizationWithIndex = function (vIndex, oEvent) {
        oEvent.preventDefault();
        oEvent.stopPropagation();
        window.setTimeout(function () {
            var aVisualizations = this.getVisualizations();
            if (aVisualizations.length) {
                var oNextViz = aVisualizations[vIndex === "last" ? aVisualizations.length - 1 : vIndex],
                    oNextInnerControl = oNextViz.getInnerControl().getContent
                        ? oNextViz.getInnerControl().getContent()[0]
                        : oNextViz.getInnerControl();

                oNextInnerControl.focus();
            }
        }.bind(this), 0);
    };

    /**
     * Handles the reordering and focus change of the arrow keys.
     *
     * @param {boolean} bMove If a visualization should be moved.
     * @param {jQuery.Event} oEvent The keyboard event.
     *
     * @private
     */
    Section.prototype._handleKeyboardArrowNavigation = function (bMove, oEvent) {
        if ((bMove && !this.getEnableVisualizationReordering()) || (bMove && !oEvent.ctrlKey)) {
            return;
        }

        var aVisualizations = this.getVisualizations();

        for (var i = 0; i < aVisualizations.length; i++) {
            var oViz = aVisualizations[i],
                oInnerControl = oViz.getInnerControl().getContent
                    ? oViz.getInnerControl().getContent()[0]
                    : oViz.getInnerControl();

            if (window.document.activeElement === oInnerControl.getDomRef()) {
                if (oEvent.type === "sapleft" || oEvent.type === "sapup") {
                    if (i > 0) {
                        this._setFocusOnVisualizationWithIndex(i - 1, oEvent);
                    } else {
                        this.fireBorderReached({
                            event: oEvent,
                            section: this,
                            direction: "up"
                        });
                        oEvent.stopPropagation();
                    }
                } else if (oEvent.type === "sapright" || oEvent.type === "sapdown") {
                    if ((i + 1) < aVisualizations.length) {
                        this._setFocusOnVisualizationWithIndex(i + 1, oEvent);
                    } else {
                        this.fireBorderReached({
                            event: oEvent,
                            section: this,
                            direction: "down"
                        });
                        oEvent.stopPropagation();
                    }
                } else if (oEvent.type === "sapleftmodifiers" || oEvent.type === "sapupmodifiers") {
                    if (i > 0) {
                        this.fireVisualizationDrop({
                            draggedControl: this.getVisualizations()[i],
                            droppedControl: this.getVisualizations()[i - 1],
                            dropPosition: "Before"
                        });
                        this._setFocusOnVisualizationWithIndex(i - 1, oEvent);
                    } else {
                        this.fireBorderReached({
                            event: oEvent,
                            section: this,
                            direction: "up",
                            visualization: oViz
                        });
                        oEvent.stopPropagation();
                    }
                } else if (oEvent.type === "saprightmodifiers" || oEvent.type === "sapdownmodifiers") {
                    if ((i + 1) < aVisualizations.length) {
                        this.fireVisualizationDrop({
                            draggedControl: this.getVisualizations()[i],
                            droppedControl: this.getVisualizations()[i + 1],
                            dropPosition: "After"
                        });
                        this._setFocusOnVisualizationWithIndex(i + 1, oEvent);
                    } else {
                        this.fireBorderReached({
                            event: oEvent,
                            section: this,
                            direction: "down",
                            visualization: oViz
                        });
                        oEvent.stopPropagation();
                    }
                }

                return;
            }
        }
    };

    Section.prototype.setEditable = function (value) {
        this.setProperty("editable", !!value);
        this.oVBox.toggleStyleClass("sapUshellSectionEdit", !!value);
    };

    Section.prototype.setShowSection = function (value, oEvent) {
        this.setProperty("showSection", !!value);
        this.oVBox.toggleStyleClass("sapUshellSectionHidden", !value);
        this.fireSectionVisibilityChange({visible: !!value});
    };

    /**
     * Delegates event to reorder visualizations
     *
     * @param {object} oInfo Drag and drop event data
     * @private
     */
    Section.prototype._reorderVisualizations = function (oInfo) {
        this.fireVisualizationDrop(oInfo.getParameters());
    };

    Section.prototype.addAggregation = function (sAggregationName, oObject) {
        XMLComposite.prototype.addAggregation.apply(this, arguments);

        if (sAggregationName === "visualizations") {
            this._addVisualizationLayoutData(oObject);
        }

        return this;
    };

    Section.prototype.insertAggregation = function (sAggregationName, oObject/*, iIndex*/) {
        XMLComposite.prototype.insertAggregation.apply(this, arguments);

        if (sAggregationName === "visualizations") {
            this._addVisualizationLayoutData(oObject);
        }

        return this;
    };

    /**
     * Returns the LayoutData for the given item.
     * Used both for DropIndicatorSize and grid sizing.
     *
     * @param {sap.ui.core.Control} oVisualization The visualization to retrieve the LayoutData from.
     * @returns {sap.ui.core.LayoutData} The LayoutData object.
     * @private
     */
    Section.prototype._getVisualizationLayoutData = function (oVisualization) {
        if (oVisualization.getLayout) {
            return oVisualization.getLayout();
        }
        // fallback for controls dragged from the TileSelector (that are not "grid visualizations" yet);
        // when TileSelector items are of the same type, then only "oVisualization.getLayout()" should be used.
        return { rows: 2, columns: 2 };
    };

    /**
     * Adds GridContainerItemLayoutData to a visualization
     *
     * @param {sap.ui.core.Control} oVisualization A visualization which gets a layout
     * @private
     */
    Section.prototype._addVisualizationLayoutData = function (oVisualization) {
        if (!oVisualization.getLayoutData()) {
            var oLayoutData = this._getVisualizationLayoutData(oVisualization);
            oVisualization.setLayoutData(new GridContainerItemLayoutData(oLayoutData));
        }
    };

    /**
     * Handles the resize event to make the sizeBehaviour based on the container size.
     * This method must not be called manually.
     *
     * @param {sap.ui.base.Event} oEvt event object created by UI5
     * @since 1.73.0
     *
     * @private
     */
    Section.prototype._handleResize = function (oEvt) {
        var oInnerGrid = this.byId("innerGrid");
        if (oEvt.size.width < 376) {
            oInnerGrid.setContainerQuery(false);
        } else if (oEvt.size.width >= 376) {
            oInnerGrid.setContainerQuery(true);
        }
    };

    return Section;
});
