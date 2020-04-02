// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>searchProvider</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.searchProvider");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  var oSearchHandle;
  if (typeof sap.ui2.shell === "object"
      && typeof sap.ui2.shell.getSearchHandle === "function") {

    oSearchHandle = sap.ui2.shell.getSearchHandle();
    if (typeof oSearchHandle === "object"
        && typeof oSearchHandle.addSearchProvider === "function") {

      /**
       * @namespace The namespace for the CHIP API's <code>searchProvider</code> contract, which
       * allows you to add a search provider to a surrounding shell.
       * @name chip.searchProvider
       * @since 1.2.0
       */

      sap.ui2.srvc.Chip.addContract("searchProvider", function (oChipInstance) {
        /**
         * Adds a search provider with the given URL (if this feature is available).
         *
         * @name chip.searchProvider.addSearchProvider
         * @function
         * @since 1.2.0
         * @param {string} sUrl
         *   the search provider's URL
         *
         * @see <code>sap.ui2.shell.getSearchHandle().addSearchProvider()<code>
         */
        this.addSearchProvider = function (sUrl) {
          oSearchHandle.addSearchProvider.apply(oSearchHandle, arguments);
        };
      });
    }
  }
}());
