// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview MenuAdapter for the ABAP platform.
 */

sap.ui.define([
    "sap/ushell/Config"
], function (Config) {
    "use strict";

    /**
     * @typedef {object} MenuEntry A Menu Entry
     * @property {string} text The text of the menu entry
     * @property {string} intent The intent of the menu entry
     */

    /**
    * Constructs a new instance of the MenuAdapter for the ABAP
    * platform
    *
    * @constructor
    * @since 1.72.0
    *
    * @private
    */
    var MenuAdapter = function () {};

    /**
     * Returns whether the menu is enabled
     *
     * @returns {Promise<boolean>} True if the menu is enabled
     *
     * @since 1.72.0
     * @private
     */
    MenuAdapter.prototype.isMenuEnabled = function () {
        var bSpacesEnabled = Config.last("/core/spaces/enabled");
        var iAssignedSpacesCount = this._getAssignedSpaces().length;
        return Promise.resolve(bSpacesEnabled && iAssignedSpacesCount > 0);
    };

    /**
     * Gets the menu entries for the spaces assigned to the user
     *
     * @returns {Promise<MenuEntry[]>} The menu entries
     *
     * @since 1.72.0
     * @private
     */
    MenuAdapter.prototype.getMenuEntries = function () {
        var aMenuEntries = this._getAssignedSpaces().map(function (oSpace) {
            return {
                title: oSpace.title || oSpace.id,
                description: oSpace.description,
                icon: undefined,
                type: "intent",
                target: {
                    semanticObject: "Launchpad",
                    action: "openFLPPage",
                    parameters: [
                        {
                            name: "spaceId",
                            value: oSpace.id
                        },
                        {
                            name: "pageId",
                            value: oSpace.pages[0].id
                        }
                    ],
                    innerAppRoute: undefined
                },
                menuEntries: []
            };
        });

        return Promise.resolve(aMenuEntries);
    };

    /**
     * Gets the menu entries for the pages assigned to the user by querying the
     * content of the meta tag with the name' sap.ushell.assignedSpaces'.
     * Spaces without pages are not included in the result.
     *
     * @returns {object[]} The assigned spaces from the 'sap.ushell.assignedSpaces' meta tag
     *
     * @since 1.73.0
     * @private
     */
    MenuAdapter.prototype._getAssignedSpaces = function () {
        var oMetatag = document.querySelector("meta[name='sap.ushell.assignedSpaces']");
        if (!oMetatag) {
            return [];
        }

        return JSON.parse(oMetatag.getAttribute("content")).filter(function (oSpace) {
            return oSpace.pages.length;
        });
    };

    return MenuAdapter;
}, true);