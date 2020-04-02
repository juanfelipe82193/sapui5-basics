// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>visible</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.visible");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>visible</code> contract regarding the
   * CHIP's current visibility within the page.
   * @name chip.visible
   * @since 1.17.1
   */

  sap.ui2.srvc.Chip.addContract("visible", function (oChipInstance) {
    var bVisible = true,
      fnOnVisible;

    /**
     * Calls fnOnVisible with bVisible as parameter. Adds some some error handling ensuring that exceptions will
     * not affect the page builder.
     *
     * @private
     */
    function callOnVisible() {
      try {
        fnOnVisible(bVisible);
      } catch (e) {
        jQuery.sap.log.error(oChipInstance + ": call to visible handler failed: "
            + (e.message || e.toString()), null, "chip.visible");
      }
    }

    /**
     * Attaches the given event handler to the "visible" event which is fired whenever the CHIP's
     * visibility has been changed. The event handler takes a boolean as parameter, representing
     * the new visible state.
     * (Since 1.42) fnEventHandler is called once initially with the current visibility making it
     * unnecessary to check {#isVisible} when the CHIP is initialized. Attaching the same handler
     * multiple times will only result in one call to it.
     *
     * @name chip.visible.attachVisible
     * @function
     * @since 1.17.0
     * @param {function (boolean)} fnEventHandler
     *   event handler for visibility changes
     */
    this.attachVisible = function (fnEventHandler) {
      if (typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error("Not a function: " + fnEventHandler,
          "chip.visible");
      }

      // attaching the same handler multiple time should not end in multiple calls (see below)
      if (fnOnVisible === fnEventHandler) {
        return;
      }
      fnOnVisible = fnEventHandler;

      // call the handler directly to stay compatible with previous behavior in the FLP.
      // There the tiles where notified directly after instantiation (multiple tiles) so they
      // did not need to check via isVisible() if they are visible or not.
      callOnVisible();
    };

    /**
     * Returns the CHIP's visibility within the page builder's page. The visibility is
     * <code>true</code> initially.
     *
     * @name chip.visible.isVisible
     * @function
     * @since 1.17.0
     * @returns {boolean}
     *   the CHIP's visibility within the page builder's page.
     * @see contract.visible.setVisible
     */
    this.isVisible = function () {
      return bVisible;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>visible</code> contract. This contract interface allows the pagebuilder to
     * notify the CHIP when the CHIP's visibility has been changed.
     *
     * @name contract.visible
     * @since 1.17.0
     */
    return {
      /**
       * Notifies the CHIP about its new visibility. The CHIP is only informed, if the
       * visibility is different then before.
       *
       * @param {boolean} bNewVisible
       *   the CHIP visibility
       * @name contract.visible.setVisible
       * @function
       * @since 1.17.0
       * @see chip.visible.isVisible
       * @see chip.visible.attachVisible
       */
      setVisible: function (bNewVisible) {
        if (bVisible === bNewVisible) {
          // nothing changed so do nothing
          return;
        }

        bVisible = bNewVisible;
        if (fnOnVisible) {
          callOnVisible();
        }
      }
    };
  });
}());