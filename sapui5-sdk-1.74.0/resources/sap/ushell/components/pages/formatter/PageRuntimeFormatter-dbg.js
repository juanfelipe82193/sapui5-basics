//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview PageRuntimeFormatter consists of formatter functions
 * which are use throughout the PagesRuntime.
 *
 * @version 1.74.0
 */

sap.ui.define([
    "sap/ui/Device"
], function (Device) {
    "use strict";
    var PageRuntimeFormatter = {};

    /**
     * Returns the section visibility depending on the used device and visualization count
     *
     * @param {object[]} visualizations An array of visualizations which are inside the section
     * @returns {boolean} The section visibility
     *
     * @since 1.73.0
     * @private
     */
    PageRuntimeFormatter._sectionVisibility = function (visualizations) {
        return !(visualizations.length === 0 && Device.system.phone);
    };

    return PageRuntimeFormatter;
});