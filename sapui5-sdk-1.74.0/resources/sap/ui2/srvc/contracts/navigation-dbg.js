// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>navigation</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.navigation");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  var oNavigationHandle;
  if (typeof sap.ui2.shell === "object"
      && typeof sap.ui2.shell.getNavigationHandle === "function") {

    oNavigationHandle = sap.ui2.shell.getNavigationHandle();
    if (typeof oNavigationHandle === "object"
        && typeof oNavigationHandle.navigateToUrl === "function") {

      /**
       * @namespace The namespace for the CHIP API's <code>navigation</code> contract, which allows
       * you to navigate to a launchpad URL in a surrounding shell.
       * @name chip.navigation
       * @since 1.2.0
       */

      sap.ui2.srvc.Chip.addContract("navigation", function (oChipInstance) {
        /**
         * Navigates to the given URL using the optional settings.
         *
         * @name chip.navigation.navigateToUrl
         * @function
         * @since 1.2.0
         * @param {string} sUrl
         *   the URL to navigate to
         * @param {object} [oSettings]
         *   the settings
         *
         * @see <code>sap.ui2.shell.getNavigationHandle().navigateToUrl()<code>
         */
        this.navigateToUrl = function (sUrl, oSettings) {
          oNavigationHandle.navigateToUrl.apply(oNavigationHandle, arguments);
        };
      });
    }
  }
}());
