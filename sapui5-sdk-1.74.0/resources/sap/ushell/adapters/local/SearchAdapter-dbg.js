// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Search adapter for the demo platform.
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery, sina) {
    "use strict";

    /**
     *
     * @param oSystem
     * @returns {sap.ushell.adapters.abap.SearchAdapter}
     */
    var SearchAdapter = function (oSystem, sParameter, oAdapterConfiguration) {

        this.isSearchAvailable = function () {
            var oDeferred = jQuery.Deferred();
            oDeferred.resolve(true);
            return oDeferred.promise();
        };

        //@deprecated
        this.getSina = function () {
            return {};
        };
    };


	return SearchAdapter;

}, /* bExport= */ true);
