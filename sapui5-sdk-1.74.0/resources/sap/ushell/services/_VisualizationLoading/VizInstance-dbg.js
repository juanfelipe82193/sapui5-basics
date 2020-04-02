// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control
sap.ui.define([
    "sap/m/library",
    "sap/ui/core/Control"
], function (
    mobileLibrary,
    Control
) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    /**
     * Constructor for a new
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that arranges Tile controls.
     * @extends sap.ui.core.Control
     * @constructor
     * @name sap.ushell.ui.
     */
    var oVisualization = Control.extend("sap.ushell.ui.launchpad.VizInstance", /** @lends  sap.ushell.ui.launchpad.VizInstance.prototype*/ {
        metadata: {
            library: "sap.ushell",
            properties: {
                visualizationId: { type: "string" },

                type: { type: "string" },

                vizType: { type: "string" },

                state: { type: "string", defaultValue: LoadState.Loading },

                previewMode: { type: "boolean", defaultValue: false },

                catalogTile: { type: "any" },

                title: { type: "string" },

                subtitle: { type: "string" },

                icon: { type: "string" },

                footer: { type: "string" },

                targetURL: { type: "string" },

                adapter: { type: "any" },

                keywords: { type: "string[]", defaultValue: [] },

                width: { type: "int", defaultValue: 1 },

                height: { type: "int", defaultValue: 1 }
            },
            aggregations: {
                innerControl: { type: "sap.ui.core.Control", multiple: false, hidden: true }
            },
            events: {
                press: {}
            }
        },
        renderer: {
            apiVersion: 2,
            render: function (rm, visInstance) {
                rm.openStart("div", visInstance);
                rm.openEnd(); // div - tag
                rm.renderControl(visInstance.getInnerControl());
                rm.close("div");
            }
        }
    });

    /**
     * Returns the layout data for the Gridcontainer/Section
     *
     * @returns {object} oLayout the layout data in "columns x rows" format. E.g.: "2x2"
     * @since 1.72.0
     */
    oVisualization.prototype.getLayout = function () {
        var iWidth = this.getWidth(),
            iHeight = this.getHeight();

        // Legacy tiles use a different size that needs to be converted to
        // a grid one.
        var iSizeModifier = (Object.getPrototypeOf(this).getMetadata().getName() === "sap.ushell.ui.launchpad.VizInstanceCard") ? 1 : 2;

        var oLayout = {
            columns: iWidth * iSizeModifier,
            rows: iHeight * iSizeModifier
        };

        return oLayout;
    };

    /**
     * A function which returns UI5 view / control of the visualization
     *
     * @param {object} vizData The data required to load the visualization
     *
     * @returns {Promise<sap.ui.core.Control>} the UI5 representation
     * @since 1.72.0
     */
    oVisualization.prototype.load = function (vizData) {
        // Check if instantiation already happened (to avoid triggering it twice)
        // or was already started
        if (!this.oInnerControl && this.oControlPromise) {
            return this.oControlPromise;
        }

        return new Promise(function (resolve, reject) {
            if (this.oInnerControl) {
                resolve(this.oInnerControl);
                return;
            }

            this._setVizViewControlPromise(vizData);

            this.oControlPromise.then(function (oView) {
                this.setAggregation("innerControl", oView, false);
                resolve(oView);
            }.bind(this)).catch(reject);
        }.bind(this));
    };

    oVisualization.prototype._setVizViewControlPromise = function () {
        // Interface
        this.oControlPromise = Promise.resolve({});
    };

    oVisualization.prototype._getInnerControlPromise = function () {
        return this.oControlPromise;
    };

    return oVisualization;
});
