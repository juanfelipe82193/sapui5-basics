// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.launchpad.Page.
sap.ui.define([
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text",
    "sap/ui/core/Control",
    "sap/ui/core/dnd/DragDropInfo",
    "sap/ui/core/library",
    "sap/ushell/resources",
    "sap/ushell/ui/launchpad/PageRenderer"
], function (
    Button,
    mLibrary,
    Text,
    Control,
    DragDropInfo,
    coreLibrary,
    resources
    // PageRenderer
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mLibrary.ButtonType;

    // shortcut for sap.ui.core.TextAlign
    var TextAlign = coreLibrary.TextAlign;

    /**
     * Constructor for a new Page.
     *
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @class
     * The Page represents a collection of sections.
     * @extends sap.ui.core.Control
     *
     * @author SAP SE
     * @version 1.74.0
     *
     * @private
     * @alias sap.ushell.ui.launchpad.Page
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var Page = Control.extend("sap.ushell.ui.launchpad.Page", /** @lends sap.ushell.ui.launchpad.Page.prototype */ {
        metadata: {
            library: "sap.ushell",
            properties: {

                /**
                 * Specifies whether the addSection button is visible.
                 */
                edit: { type: "boolean", group: "Misc", defaultValue: false },

                /**
                 * Specifies whether section reordering is enabled. Relevant only for desktop devices.
                 */
                enableSectionReordering: { type: "boolean", group: "Misc", defaultValue: false },

                /**
                 * This text is displayed when the control contains no sections.
                 */
                noSectionsText: { type: "string", group: "Misc", defaultValue: "" },

                /**
                 * Defines whether or not the title specified in the <code>title</code> property is displayed.
                 */
                showTitle: { type: "boolean", group: "Misc", defaultValue: false },

                /**
                 * Defines whether or not the text specified in the <code>noSectionsText</code> property is displayed.
                 */
                showNoSectionsText: { type: "boolean", group: "Misc", defaultValue: true },

                /**
                 * This title is displayed on top of the Page.
                 */
                title: { type: "string", group: "Misc", defaultValue: "" }
            },
            defaultAggregation: "sections",
            aggregations: {

                /**
                 * The sections displayed in the Page.
                 */
                "sections": { type: "sap.ushell.ui.launchpad.Section", multiple: true, dnd: true },

                /**
                 * Internal aggregation to show the addSection buttons if the edit property is enabled.
                 */
                "_addSectionButtons": { type: "sap.m.Button", multiple: true, visibility: "hidden" },

                /**
                 * Internal aggregation to show the noSectionText.
                 */
                "_noSectionText": { type: "sap.m.Text", multiple: false, visibility: "hidden" }
            },
            events: {

                /**
                 * Fires when the addSection Button is pressed.
                 */
                addSectionButtonPressed: {
                    parameters: {

                        /**
                         * The index the new section should be added.
                         */
                        index: { type: "int" }
                    }
                },

                /**
                 *  Fires when the sections are dropped on the page.
                 */
                sectionDrop: {
                    parameters: {

                        /**
                         * The section that was dragged.
                         */
                        draggedControl: { type: "sap.ushell.ui.launchpad.Section" },

                        /**
                         * The section where the dragged section was dropped.
                         */
                        droppedControl: { type: "sap.ushell.ui.launchpad.Section" },

                        /**
                         * A string defining from what direction the dragging happend.
                         */
                        dropPosition: { type: "string" }
                    }
                }
            }
        }
    });

    Page.prototype.init = function () {
        this.setAggregation("_noSectionText", new Text({
            text: resources.i18n.getText("Page.NoSectionText"),
            width: "100%",
            textAlign: TextAlign.Center
        }));

        this._oDragDropInfo = new DragDropInfo({
            sourceAggregation: "sections",
            targetAggregation: "sections",
            dropPosition: "Between",
            drop: function (oInfo) {
                this.fireSectionDrop(oInfo.getParameters());
            }.bind(this)
        });

        this.addEventDelegate({
            onsappageup: this._handleKeyboardPageNavigation.bind(this),
            onsappagedown: this._handleKeyboardPageNavigation.bind(this),
            onsapdown: this._handleKeyboardArrowNavigation.bind(this, false),
            onsapdownmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsapup: this._handleKeyboardArrowNavigation.bind(this, false),
            onsapupmodifiers: this._handleKeyboardArrowNavigation.bind(this, true),
            onsaphome: this._handleKeyboardHomeEndNavigation.bind(this, false),
            onsaphomemodifiers: this._handleKeyboardHomeEndNavigation.bind(this, false),
            onsapend: this._handleKeyboardHomeEndNavigation.bind(this, true),
            onsapendmodifiers: this._handleKeyboardHomeEndNavigation.bind(this, true)
        });
    };

    Page.prototype.exit = function () {
        this._oDragDropInfo.destroy();
    };

    Page.prototype.onBeforeRendering = function () {
        var iNrOfSections = this.getSections().length,
            aAddSectionButtons = this.getAggregation("_addSectionButtons") || [],
            oAddSectionButton;

        // must always have at least one button (e.g. on an empty page/no sections)
        // on non-empty pages, index 0 button is hidden, so first visible button is index 1 then
        for (var i = aAddSectionButtons.length; i < iNrOfSections + 1; i++) {
            oAddSectionButton = new Button({
                type: ButtonType.Transparent,
                icon: "sap-icon://add",
                text: resources.i18n.getText("Page.Button.AddSection"),
                press: this.fireAddSectionButtonPressed.bind(this, { index: i })
            });
            oAddSectionButton.addStyleClass("sapUshellPageAddSectionButton");
            this.addAggregation("_addSectionButtons", oAddSectionButton);
        }
    };

    Page.prototype.setEnableSectionReordering = function (value) {
        this.setProperty("enableSectionReordering", !!value);

        if (value) {
            this.addDragDropConfig(this._oDragDropInfo);
        } else {
            this.removeDragDropConfig(this._oDragDropInfo);
        }

        return this;
    };

    Page.prototype.setNoSectionsText = function (text) {
        this.setProperty("noSectionsText", text);

        var oNoSectionText = this.getAggregation("_noSectionText");
        oNoSectionText.setText(text || resources.i18n.getText("Page.NoSectionText"));

        return this;
    };

    /**
     * Handles the focus change of move of visualizations across sections.
     *
     * @param {object} oInfo An object that contains instructions on what to focus and move.
     *
     * @private
     */
    Page.prototype._focusOrMovetoNextVisualization = function (oInfo) {
        var aSections = this.getSections(),
            iSectionIndex = this.indexOfSection(oInfo.section),
            iVizIndex = oInfo.prefIndex,
            sDirection = oInfo.direction;

        while (true) {
            if (sDirection === "down" && iSectionIndex < aSections.length - 1) {
                iSectionIndex++;
            } else if (sDirection === "up" && iSectionIndex > 0) {
                iSectionIndex--;
            } else {
                return;
            }

            var oSection = aSections[iSectionIndex],
                aVisualizations = oSection.getVisualizations();

            if ((oInfo.visualization || aVisualizations.length) && (oSection.getShowSection() || oSection.getEdit())) {
                if (oInfo.prefIndex === undefined) {
                    iVizIndex = sDirection === "down" ? 0 : Math.max(aVisualizations.length - 1, 0);
                }

                if (oInfo.visualization) {
                    oSection.fireVisualizationDrop({
                        draggedControl: oInfo.visualization,
                        droppedControl: aVisualizations.length ? aVisualizations[iVizIndex] : oSection,
                        dropPosition: sDirection === "down" ? "Before" : "After"
                    });

                    if (sDirection === "up") {
                        iVizIndex = aVisualizations.length;
                    }
                }

                oInfo.event.preventDefault();
                break;
            }
        }

        window.setTimeout(function () {
            var oViz = this.getSections()[iSectionIndex].getVisualizations()[iVizIndex],
                oInnerControl = oViz.getInnerControl().getContent
                    ? oViz.getInnerControl().getContent()[0]
                    : oViz.getInnerControl();

            oInnerControl.focus();
        }.bind(this), 0);
    };

    /**
     * Handles the focus change of the page up & down keys.
     *
     * @param {jQuery.Event} oEvent The keyboard event.
     *
     * @private
     */
    Page.prototype._handleKeyboardPageNavigation = function (oEvent) {
        var aSections = this.getSections();

        for (var i = 0; i < aSections.length; i++) {
            var oSectionDomRef = this.getEdit()
                ? this.getDomRef().getElementsByClassName("sapUshellPageSection")[i]
                : aSections[i].getDomRef();

            if (oSectionDomRef.contains(window.document.activeElement)) {
                this._focusOrMovetoNextVisualization({
                    event: oEvent,
                    section: aSections[i],
                    direction: oEvent.type === "sappagedown" ? "down" : "up",
                    prefIndex: 0
                });
                return;
            }
        }
    };

    /**
     * Handles the reordering and focus change of the arrow keys.
     *
     * @param {boolean} bMove If a section should be moved.
     * @param {jQuery.Event} oEvent The keyboard event.
     *
     * @private
     */
    Page.prototype._handleKeyboardArrowNavigation = function (bMove, oEvent) {
        if ((bMove && !this.getEnableSectionReordering()) || (bMove && !oEvent.ctrlKey)) {
            return;
        }

        var aSectionDomRefs = this.getDomRef().getElementsByClassName("sapUshellPageSection");

        for (var i = 0; i < aSectionDomRefs.length; i++) {
            if (window.document.activeElement === aSectionDomRefs[i]) {
                if (oEvent.type === "sapup" && i > 0) {
                    aSectionDomRefs[i - 1].focus();
                } else if (oEvent.type === "sapdown" && (i + 1) < aSectionDomRefs.length) {
                    aSectionDomRefs[i + 1].focus();
                } else if (oEvent.type === "sapupmodifiers" && i > 0) {
                    this.fireSectionDrop({
                        draggedControl: this.getSections()[i],
                        droppedControl: this.getSections()[i - 1],
                        dropPosition: "Before"
                    });
                    oEvent.preventDefault();
                    aSectionDomRefs[i - 1].focus();
                } else if (oEvent.type === "sapdownmodifiers" && (i + 1) < aSectionDomRefs.length) {
                    this.fireSectionDrop({
                        draggedControl: this.getSections()[i],
                        droppedControl: this.getSections()[i + 1],
                        dropPosition: "After"
                    });
                    oEvent.preventDefault();
                    aSectionDomRefs[i + 1].focus();
                }
                return;
            }
        }
    };

    /**
     * Handles the home and end key focus change.
     *
     * @param {boolean} bLast If the last visualization should be focused.
     * @param {jQuery.Event} oEvent The keyboard event.
     *
     * @private
     */
    Page.prototype._handleKeyboardHomeEndNavigation = function (bLast, oEvent) {
        var aSections = this.getSections(),
            aVisualizations = [],
            aSectionWrappers = this.getDomRef().getElementsByClassName("sapUshellPageSection"),
            bEdit = this.getEdit(),
            oSection;

        for (var i = 0; i < aSections.length; i++) {
            if (oEvent.type === "saphomemodifiers" || oEvent.type === "sapendmodifiers") {
                oSection = aSections[i];
                if (oSection.getShowSection() || oSection.getEdit()) {
                    aVisualizations = aVisualizations.concat(oSection.getVisualizations());
                }
            } else if (bEdit && aSectionWrappers[i].contains(window.document.activeElement)) {
                aVisualizations = aSections[i].getVisualizations();
                break;
            }
        }

        if (aVisualizations.length) {
            var oViz = bLast ? aVisualizations[aVisualizations.length - 1] : aVisualizations[0],
                oInnerControl = oViz.getInnerControl().getContent
                    ? oViz.getInnerControl().getContent()[0]
                    : oViz.getInnerControl();

            oEvent.preventDefault();
            oInnerControl.focus();
        }
    };

    /**
     * Handles the borderReached event of a Section.
     *
     * @param {object} oInfo The borderReached event.
     *
     * @private
     */
    Page.prototype._handleSectionBorderReached = function (oInfo) {
        this._focusOrMovetoNextVisualization(oInfo.getParameters());
    };

    Page.prototype.addAggregation = function (sAggregationName, oObject) {
        Control.prototype.addAggregation.apply(this, arguments);

        if (sAggregationName === "sections") {
            oObject.attachEvent("borderReached", this._handleSectionBorderReached.bind(this));
        }

        return this;
    };

    Page.prototype.insertAggregation = function (sAggregationName, oObject/*, iIndex*/) {
        Control.prototype.insertAggregation.apply(this, arguments);

        if (sAggregationName === "sections") {
            oObject.attachEvent("borderReached", this._handleSectionBorderReached.bind(this));
        }

        return this;
    };

    return Page;
});
