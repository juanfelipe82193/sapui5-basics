// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";
    return UIComponent.extend("sap.ushell.playground.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();
        },

        /**
         * Get the component defined in the metadata "componentUsages" property
         *
         * @param {string} [pagePackage] The page package name
         * @returns {Promise<sap.ui.core.Component>} Promise resolving to the component instance
         * @protected
         */
        createTransportComponent: function (pagePackage) {
            return this.createComponent({
                async: true,
                usage: "transportInformation",
                componentData: {
                    "package": pagePackage
                }
            });
        }
    });
}, true);