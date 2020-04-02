// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/IconPool",
    "sap/m/StandardListItem",
    "sap/ui/core/CustomData",
    "sap/ushell/library"
], function (IconPool, StandardListItem, CustomData) {
        "use strict";

        /**
         * Constructor for a new OverflowListItem.
         *
         * @param {string} [sId] id for the new control, generated automatically if no id is given
         * @param {object} [mSettings] initial settings for the new control
         */
        var OverflowListItem = StandardListItem.extend("sap.ushell.ui.shell.OverflowListItem", /** @lends sap.ushell.ui.shell.OverflowListItem.prototype */ {
            metadata: {

                properties: {
                    floatingNumber: {
                        type: "int",
                        group: "Appearance",
                        defaultValue: null
                    },

                    floatingNumberMaxValue: {
                        type: "int",
                        group: "Appearance",
                        defaultValue: 99
                    }
                }
            },
            renderer: {}
        });

        OverflowListItem.prototype.getDisplayFloatingNumber = function () {
            var iNumber = this.getFloatingNumber(),
                iMaxValueNumber = this.getFloatingNumberMaxValue();
            var sDisplayNumber = iNumber + "";
            if (iNumber > iMaxValueNumber) {
                sDisplayNumber = iMaxValueNumber + "+";
            }
            return sDisplayNumber;
        };

        OverflowListItem.prototype._getImage = function () {
            var oImage = this._oImage;

            if (!oImage) {
                oImage = StandardListItem.prototype._getImage.call(this);
            }

            if (this.getFloatingNumber() > 0) {
                oImage.addStyleClass("sapUshellShellHeadItmCounter");
                oImage.addCustomData(new CustomData({
                    key: "counter-content",
                    value: this.getDisplayFloatingNumber(),
                    writeToDom: true
                }));
            } else {
                oImage.removeStyleClass("sapUshellShellHeadItmCounter");
            }

            this._oImage = oImage;
            return this._oImage;
        };

        sap.ui.unified.OverflowListItem = OverflowListItem;

        return OverflowListItem;

    }, true /* bExport */);