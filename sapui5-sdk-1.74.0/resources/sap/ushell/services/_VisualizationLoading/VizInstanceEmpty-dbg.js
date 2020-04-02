// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Provides control
sap.ui.define([
    "sap/ushell/services/_VisualizationLoading/VizInstance",
    "sap/m/GenericTile"
], function (
    VizInstance,
    GenericTile
) {
    "use strict";

    /**
     * Constructor for a new
     *
     * @param {string} [sId] The ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] The initial settings for the new control
     * @class A container that arranges Tile controls.
     * @extends sap.ushell.ui.launchpad.VizInstance
     * @constructor
     * @name sap.ushell.ui.launchpad.VizInstanceEmpty
     */
    var oVisualization = VizInstance.extend("sap.ushell.ui.launchpad.VizInstanceEmpty", /** @lends sap.ushell.ui.launchpad.VizInstanceEmpty.prototype*/ {
        metadata: {
            properties: {
                target: { type: "string" }
            }
        },
        renderer: VizInstance.getMetadata().getRenderer()
    });

    oVisualization.prototype.load = function () {
        var oGenericTile = new GenericTile({ state: this.getState() });
        this.setInnerControl(oGenericTile);
        return Promise.resolve(oGenericTile);
    };

    oVisualization.prototype._getInnerControlPromise = function () {
        return Promise.resolve({});
    };

    return oVisualization;
});
