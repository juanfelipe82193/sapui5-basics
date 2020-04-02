// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/resources"
], function (resources) {
    "use strict";
    /**
     * AppType object.
     * Enumeration for application types. Used by AppConfiguration service in order to add activity of certain type.
     *
     * @private
     */
    return {
        OVP: "OVP",
        SEARCH: "Search",
        FACTSHEET: "FactSheet",
        COPILOT: "Co-Pilot",
        URL: "External Link",
        APP: "Application",

        getDisplayName: function (sAppType) {
            switch (sAppType) {
                case this.OVP:
                    return resources.i18n.getText("Apptype.OVP");
                case this.SEARCH:
                    return resources.i18n.getText("Apptype.SEARCH");
                case this.FACTSHEET:
                    return resources.i18n.getText("Apptype.FACTSHEET");
                case this.COPILOT:
                    return resources.i18n.getText("Apptype.COPILOT");
                case this.URL:
                    return resources.i18n.getText("Apptype.URL");
                default:
                    return resources.i18n.getText("Apptype.APP");
            }
        }
    };
});
