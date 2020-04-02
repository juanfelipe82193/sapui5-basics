// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control sap.ushell.ui.shell.SplitContainer.
sap.ui.define([
    "sap/ui/core/Control",
    "sap/ui/core/library",
    "sap/base/Log",
    "sap/ushell/ui/shell/ContentRenderer",
    "sap/ushell/ui/shell/SplitContainerRenderer"
], function (
    Control,
    coreLibrary,
    Log,
    ContentRenderer
    // SplitContainerRenderer
) {
    "use strict";

    // shortcut for sap.ui.core.Orientation
    var Orientation = coreLibrary.Orientation;

    /**
     * Constructor for a new SplitContainer.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     * @class Provides a main content and a secondary content area
     * @extends sap.ui.core.Control
     * @author SAP SE
     * @version 1.74.0
     * @constructor
     * @private
     * @since 1.15.0
     * @experimental Since version 1.15.0.
     * API is not yet finished and might change completely
     * @alias sap.ushell.ui.shell.SplitContainer
     * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
     */
    var SplitContainer = Control.extend("sap.ushell.ui.shell.SplitContainer", /** @lends sap.ushell.ui.shell.SplitContainer.prototype */ {
        metadata: {
            library: "sap.ushell.ui.shell",
            properties: {
                // shows / hides the secondary area
                showSecondaryContent: { type: "boolean", group: "Appearance", defaultValue: false },

                // the width if the secondary content. The height is always 100%.
                secondaryContentSize: { type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "250px" },

                /**
                 * Do not use. Use secondaryContentSize instead.
                 * @deprecated Since version 1.22.
                 *
                 * Only available for backwards compatibility.
                 */
                secondaryContentWidth: { type: "sap.ui.core.CSSSize", group: "Appearance", defaultValue: "250px", deprecated: true },

                /**
                 * Whether to show the secondary content on the left ("Horizontal", default) or on the top ("Vertical").
                 * @since 1.22.0
                 */
                orientation: { type: "sap.ui.core.Orientation", group: "Appearance", defaultValue: Orientation.Horizontal }
            },
            defaultAggregation: "content",
            aggregations: {
                // the content to appear in the main area
                content: { type: "sap.ui.core.Control", multiple: true, singularName: "content" },

                // the secondary content to appear in the secondary area
                secondaryContent: { type: "sap.ui.core.Control", multiple: true, singularName: "secondaryContent" },

                // the sub header to appear in the main area
                subHeader: { type: "sap.ui.core.Control", multiple: true, singularName: "subHeader" }
            }
        }
    });

    (function () {
        ////////////////////////////////////////// Public Methods //////////////////////////////////////////

        SplitContainer.prototype.init = function () {
            this._paneRenderer = new ContentRenderer(this, this.getId() + "-panecntnt", "secondaryContent");
            this._subHeadersRenderer = new ContentRenderer(this, this.getId() + "-canvassubHeader", "subHeader");
            this._canvasRenderer = new ContentRenderer(this, this.getId() + "-canvasrootContent", "content");
        };

        SplitContainer.prototype.exit = function () {
            this._paneRenderer.destroy();
            delete this._paneRenderer;
            this._canvasRenderer.destroy();
            delete this._canvasRenderer;
            this._subHeadersRenderer.destroy();
            delete this._subHeadersRenderer;
        };

        ////////////////////////////////////////// onEvent Methods /////////////////////////////////////////

        SplitContainer.prototype.onAfterRendering = function () {
            var sToolAreaSize = this.getParent() ? this.getParent().getToolAreaSize() : "0";
            this.applySecondaryContentSize(sToolAreaSize);
        };

        ///////////////////////////////////////// Protected Methods ////////////////////////////////////////
        /**
         * Applies the current status to the content areas (CSS left and width properties).
         *
         * @param {string} sToolAreaSize the size of the current toolArea
         * @protected
         */
        SplitContainer.prototype.applySecondaryContentSize = function (sToolAreaSize) {
            // Only set if rendered...
            if (this.getDomRef()) {
                var sSizeValue = this.getSecondaryContentSize(),
                    bShow = this.getShowSecondaryContent(),
                    sRTL = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left",
                    oSecondaryContentContainer = this.getDomRef("pane"),
                    sDir,
                    sOtherDir;

                if (this.getOrientation() === Orientation.Vertical) {
                    // Vertical mode
                    sDir = "top";
                    sOtherDir = sRTL;
                    oSecondaryContentContainer.style.height = sSizeValue;
                    oSecondaryContentContainer.style.width = "";
                } else {
                    // Horizontal mode
                    sDir = sRTL;
                    sOtherDir = "top";
                    oSecondaryContentContainer.style.height = "";
                    oSecondaryContentContainer.style.width = sSizeValue;
                }

                oSecondaryContentContainer.style[sDir] = bShow ? sToolAreaSize : "-" + sSizeValue;
                oSecondaryContentContainer.style[sOtherDir] = "";
                this.$("pane").toggleClass("sapUshellSplitContSecondClosed", !bShow);

                sSizeValue = parseFloat(sSizeValue) + parseFloat(sToolAreaSize) + "rem";
                this.getDomRef("canvas").style[sDir] = bShow ? sSizeValue : sToolAreaSize;
            }
        };

        ////////////////////////////////////////// Private Methods /////////////////////////////////////////

        /**
         * Optimization method that prevents the normal render from rerendering the whole control.
         * See _ContentRenderer in file shared.js for details.
         *
         * @param {function} fMod Method that is called to perform the requested change
         * @param {sap.ui.core.Renderer} oDoIfRendered Renderer Instance
         * @returns {any} the return value from the first parameter
         * @private
         */
        SplitContainer.prototype._modifyAggregationOrProperty = function (fMod, oDoIfRendered) {
            var bRendered = !!this.getDomRef();
            var res = fMod.apply(this, [bRendered]);
            if (bRendered && oDoIfRendered) {
                oDoIfRendered.render();
            }
            return res;
        };

        //////////////////////////////////////// Overridden Methods ////////////////////////////////////////

        // Backwards compatibility with old property name

        SplitContainer.prototype.getSecondaryContentWidth = function () {
            Log.warning(
                "SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use " +
                "\"SecondaryContentSize\" instead."
            );
            return this.getSecondaryContentSize.apply(this, arguments);
        };

        SplitContainer.prototype.setSecondaryContentWidth = function () {
            Log.warning(
                "SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use " +
                "\"SecondaryContentSize\" instead."
            );
            return this.setSecondaryContentSize.apply(this, arguments);
        };

        /////////////////////////////////// Aggregation "content" //////////////////////////////////

        SplitContainer.prototype.insertContent = function (oContent, iIndex) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.insertAggregation("content", oContent, iIndex, bRendered);
            }, this._canvasRenderer);
        };

        SplitContainer.prototype.addContent = function (oContent) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.addAggregation("content", oContent, bRendered);
            }, this._canvasRenderer);
        };

        SplitContainer.prototype.removeContent = function (vIndex) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.removeAggregation("content", vIndex, bRendered);
            }, this._canvasRenderer);
        };

        SplitContainer.prototype.removeAllContent = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.removeAllAggregation("content", bRendered);
            }, this._canvasRenderer);
        };

        SplitContainer.prototype.destroyContent = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.destroyAggregation("content", bRendered);
            }, this._canvasRenderer);
        };

        ////////////////////////////// Aggregation "secondaryContent" //////////////////////////////

        SplitContainer.prototype.insertSecondaryContent = function (oContent, iIndex) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.insertAggregation("secondaryContent", oContent, iIndex, bRendered);
            }, this._paneRenderer);
        };

        SplitContainer.prototype.addSecondaryContent = function (oContent) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.addAggregation("secondaryContent", oContent, bRendered);
            }, this._paneRenderer);
        };

        SplitContainer.prototype.removeSecondaryContent = function (vIndex) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.removeAggregation("secondaryContent", vIndex, bRendered);
            }, this._paneRenderer);
        };

        SplitContainer.prototype.removeAllSecondaryContent = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.removeAllAggregation("secondaryContent", bRendered);
            }, this._paneRenderer);
        };

        SplitContainer.prototype.destroySecondaryContent = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.destroyAggregation("secondaryContent", bRendered);
            }, this._paneRenderer);
        };

        ////////////////////////////// Aggregation "subHeader" //////////////////////////////

        SplitContainer.prototype.addSubHeader = function (oContent) {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.addAggregation("subHeader", oContent, bRendered);
            }, this._subHeadersRenderer);
        };

        SplitContainer.prototype.removeSubHeader = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.removeAllAggregation("subHeader", bRendered);
            }, this._subHeadersRenderer);
        };

        SplitContainer.prototype.destroySubHeader = function () {
            return this._modifyAggregationOrProperty(function (bRendered) {
                return this.destroyAggregation("subHeader", bRendered);
            }, this._subHeadersRenderer);
        };

        // Do not re-render the Split Container after the secondary content size chane
        SplitContainer.prototype.setSecondaryContentSize = function (sContentSize) {
            this.setProperty("secondaryContentSize", sContentSize, true);
            this.onAfterRendering();
        };
    })();

    return SplitContainer;
});
